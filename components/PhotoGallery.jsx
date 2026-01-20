'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Image, useTexture } from '@react-three/drei'
import { easing } from 'maath'
import * as THREE from 'three'
import useStore from '../store/useStore'

// iPhone 16 Pro optimized - compact for mobile viewport (6.3" screen)
const BASE_SIZE = 1.8

// Individual photo with elegant frame and depth-based scaling
function Photo({ url, position, rotation, index, isActive, depth }) {
  const ref = useRef()
  const glowRef = useRef()
  const phase = useStore((state) => state.phase)
  const [dimensions, setDimensions] = useState({ width: BASE_SIZE, height: BASE_SIZE })
  
  // Load texture and get its natural aspect ratio
  const texture = useTexture(url)
  
  useEffect(() => {
    if (texture && texture.image) {
      const aspect = texture.image.width / texture.image.height
      
      // Scale based on aspect ratio for mobile
      let width, height
      if (aspect >= 1) {
        // Landscape
        width = BASE_SIZE
        height = BASE_SIZE / aspect
      } else {
        // Portrait - constrain height
        height = BASE_SIZE * 1.15
        width = height * aspect
      }
      
      setDimensions({ width, height })
    }
  }, [texture])
  
  // Target scale - only visible in phase 4
  // Active (front) image is larger
  const targetScale = phase === 4 ? (isActive ? 1.15 : 0.85 + depth * 0.15) : 0
  
  useFrame((state, delta) => {
    if (!ref.current) return
    
    const time = state.clock.elapsedTime
    
    // Smooth scale animation
    easing.damp3(
      ref.current.scale,
      [targetScale, targetScale, targetScale],
      0.4,
      delta
    )
    
    // Gentle floating animation - more for active
    if (phase === 4) {
      const floatAmount = isActive ? 0.06 : 0.03
      ref.current.position.y = position[1] + Math.sin(time * 0.5 + index * 1.5) * floatAmount
    }
    
    // Animate glow - brighter when active
    if (glowRef.current) {
      const baseOpacity = isActive ? 0.35 : 0.1
      const pulseAmount = isActive ? 0.1 : 0.03
      glowRef.current.material.opacity = baseOpacity + Math.sin(time * 1.2 + index * 0.8) * pulseAmount
    }
  })
  
  const { width, height } = dimensions
  const glowColor = isActive ? '#a855f7' : '#6366f1'
  
  return (
    <group ref={ref} position={position} rotation={rotation} scale={0}>
      
      {/* Outer cosmic glow - stronger for active */}
      <mesh ref={glowRef} position={[0, 0, -0.1]}>
        <planeGeometry args={[width + 0.5, height + 0.5]} />
        <meshBasicMaterial 
          color={glowColor}
          opacity={0.2} 
          transparent 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Secondary warm glow */}
      <mesh position={[0, 0, -0.08]}>
        <planeGeometry args={[width + 0.3, height + 0.3]} />
        <meshBasicMaterial 
          color={isActive ? '#ec4899' : '#8b5cf6'}
          opacity={isActive ? 0.15 : 0.06}
          transparent 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Dark frame background */}
      <mesh position={[0, 0, -0.06]}>
        <planeGeometry args={[width + 0.14, height + 0.14]} />
        <meshBasicMaterial color="#0a0a18" opacity={0.98} transparent />
      </mesh>
      
      {/* Elegant gold/silver border based on active state */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[width + 0.08, height + 0.08]} />
        <meshBasicMaterial 
          color={isActive ? '#d4af37' : '#64748b'} 
          opacity={isActive ? 0.8 : 0.4} 
          transparent 
        />
      </mesh>
      
      {/* Inner mat */}
      <mesh position={[0, 0, -0.04]}>
        <planeGeometry args={[width + 0.03, height + 0.03]} />
        <meshBasicMaterial color="#030712" opacity={0.95} transparent />
      </mesh>
      
      {/* The actual image */}
      <Image
        url={url}
        scale={[width, height, 1]}
        transparent
        opacity={1}
        position={[0, 0, 0]}
      />
      
      {/* Corner sparkles - only for active image */}
      {isActive && [
        [-width/2 - 0.04, height/2 + 0.04],
        [width/2 + 0.04, height/2 + 0.04],
        [-width/2 - 0.04, -height/2 - 0.04],
        [width/2 + 0.04, -height/2 - 0.04]
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.01]}>
          <circleGeometry args={[0.025, 8]} />
          <meshBasicMaterial 
            color="#ffd700" 
            opacity={0.7} 
            transparent 
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
      
    </group>
  )
}

export default function PhotoGallery() {
  const groupRef = useRef()
  const phase = useStore((state) => state.phase)
  const [activeIndex, setActiveIndex] = useState(0)
  const rotationRef = useRef(0)
  
  // Image URLs
  const imageUrls = [
    '/photos/1.jpg',
    '/photos/2.jpg',
    '/photos/3.jpg',
    '/photos/4.jpg',
    '/photos/5.jpg',
  ]
  
  const count = 5
  // Compact radius for iPhone 16 Pro - ensures all images visible in frame
  const radius = 3.2
  
  // Calculate photo positions in an elegant arc/carousel
  const photoData = useMemo(() => {
    const data = []
    
    for (let i = 0; i < count; i++) {
      // Even distribution around the circle
      const baseAngle = (i / count) * Math.PI * 2
      
      const x = Math.sin(baseAngle) * radius
      const z = -Math.cos(baseAngle) * radius
      const y = 0
      
      // Each photo faces outward from center
      const rotationY = baseAngle
      
      data.push({
        position: [x, y, z],
        rotation: [0, rotationY, 0],
        baseAngle: baseAngle,
      })
    }
    
    return data
  }, [])
  
  useFrame((state, delta) => {
    if (!groupRef.current) return
    
    if (phase === 4) {
      // Smooth continuous rotation
      rotationRef.current += delta * 0.15
      groupRef.current.rotation.y = rotationRef.current
      
      // Determine which image is facing the camera (at position closest to +Z after rotation)
      const totalRotation = rotationRef.current % (Math.PI * 2)
      // The image at front is the one whose baseAngle + groupRotation ≈ 0 (mod 2π)
      const frontIndex = Math.round((-totalRotation / (Math.PI * 2)) * count + count) % count
      setActiveIndex(frontIndex)
    }
    
    // Scale entire gallery
    const targetScale = phase === 4 ? 1 : 0
    easing.damp3(
      groupRef.current.scale,
      [targetScale, targetScale, targetScale],
      0.6,
      delta
    )
  })
  
  // Calculate depth for each photo (0 = front/closest, 1 = back/farthest)
  const getDepth = (index) => {
    const diff = Math.abs(index - activeIndex)
    const wrappedDiff = Math.min(diff, count - diff)
    return wrappedDiff / (count / 2)
  }
  
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {photoData.map((data, index) => (
        <Photo
          key={index}
          url={imageUrls[index]}
          position={data.position}
          rotation={data.rotation}
          index={index}
          isActive={index === activeIndex}
          depth={getDepth(index)}
        />
      ))}
      
      {/* Ambient center light */}
      <pointLight position={[0, 1, 0]} intensity={0.4} color="#ffffff" distance={8} />
      
      {/* Front spotlight - illuminates the active image */}
      <spotLight 
        position={[0, 2, 6]} 
        angle={0.5} 
        penumbra={0.8} 
        intensity={1} 
        color="#fff5f5"
        castShadow={false}
      />
      
      {/* Subtle rim lights for depth */}
      <pointLight position={[4, 0, 0]} intensity={0.15} color="#6366f1" distance={10} />
      <pointLight position={[-4, 0, 0]} intensity={0.15} color="#ec4899" distance={10} />
    </group>
  )
}
