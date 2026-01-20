'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Image, useTexture } from '@react-three/drei'
import { easing } from 'maath'
import * as THREE from 'three'
import useStore from '../store/useStore'

// Base size for scaling
const BASE_SIZE = 3.5

// Individual photo with dynamic aspect ratio and subtle cosmic frame
function Photo({ url, position, rotation, index }) {
  const ref = useRef()
  const glowRef = useRef()
  const phase = useStore((state) => state.phase)
  const [dimensions, setDimensions] = useState({ width: BASE_SIZE, height: BASE_SIZE })
  
  // Load texture and get its natural aspect ratio
  const texture = useTexture(url)
  
  useEffect(() => {
    if (texture && texture.image) {
      const aspect = texture.image.width / texture.image.height
      
      // Scale based on aspect ratio while keeping reasonable size
      let width, height
      if (aspect >= 1) {
        // Landscape or square
        width = BASE_SIZE
        height = BASE_SIZE / aspect
      } else {
        // Portrait
        height = BASE_SIZE
        width = BASE_SIZE * aspect
      }
      
      setDimensions({ width, height })
    }
  }, [texture])
  
  // Target scale - only visible in phase 4
  const targetScale = phase === 4 ? 1 : 0
  
  useFrame((state, delta) => {
    if (!ref.current) return
    
    const time = state.clock.elapsedTime
    
    // Smooth scale animation
    easing.damp3(
      ref.current.scale,
      [targetScale, targetScale, targetScale],
      0.5 + index * 0.1,
      delta
    )
    
    // Gentle floating animation
    if (phase === 4) {
      ref.current.position.y = position[1] + Math.sin(time * 0.4 + index * 1.2) * 0.08
      ref.current.rotation.z = Math.sin(time * 0.3 + index) * 0.01
    }
    
    // Animate the glow opacity
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.15 + Math.sin(time * 0.8 + index * 0.5) * 0.08
    }
  })
  
  const { width, height } = dimensions
  
  return (
    <group ref={ref} position={position} rotation={rotation} scale={0}>
      
      {/* Outer soft cosmic glow - like a nebula */}
      <mesh ref={glowRef} position={[0, 0, -0.08]}>
        <planeGeometry args={[width + 0.8, height + 0.8]} />
        <meshBasicMaterial 
          color="#6366f1" 
          opacity={0.15} 
          transparent 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Secondary warm glow */}
      <mesh position={[0, 0, -0.07]}>
        <planeGeometry args={[width + 0.5, height + 0.5]} />
        <meshBasicMaterial 
          color="#a855f7" 
          opacity={0.1} 
          transparent 
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Subtle starfield-matching dark background */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[width + 0.25, height + 0.25]} />
        <meshBasicMaterial color="#0a0a15" opacity={0.95} transparent />
      </mesh>
      
      {/* Thin elegant border - subtle white/blue like distant stars */}
      <mesh position={[0, 0, -0.04]}>
        <planeGeometry args={[width + 0.12, height + 0.12]} />
        <meshBasicMaterial color="#334155" opacity={0.6} transparent />
      </mesh>
      
      {/* Inner dark mat */}
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[width + 0.06, height + 0.06]} />
        <meshBasicMaterial color="#020617" opacity={0.95} transparent />
      </mesh>
      
      {/* The actual image */}
      <Image
        url={url}
        scale={[width, height, 1]}
        transparent
        opacity={1}
        position={[0, 0, 0]}
      />
      
      {/* Subtle corner stars/sparkles */}
      {[
        [-width/2 - 0.05, height/2 + 0.05],
        [width/2 + 0.05, height/2 + 0.05],
        [-width/2 - 0.05, -height/2 - 0.05],
        [width/2 + 0.05, -height/2 - 0.05]
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, -0.02]}>
          <circleGeometry args={[0.03, 8]} />
          <meshBasicMaterial 
            color="#ffffff" 
            opacity={0.4} 
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
  
  // Preload textures (will show placeholder if not found)
  const imageUrls = [
    '/photos/1.jpg',
    '/photos/2.jpg',
    '/photos/3.jpg',
    '/photos/4.jpg',
    '/photos/5.jpg',
  ]
  
  // Calculate positions for photos in a gentle arc
  const photoPositions = useMemo(() => {
    const positions = []
    const count = 5
    const radius = 7 // Comfortable viewing distance
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2 // Start from front
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = 0 // Keep them level for cleaner look
      
      // Rotation to face center
      const rotationY = -angle + Math.PI
      
      positions.push({
        position: [x, y, z],
        rotation: [0, rotationY, 0],
      })
    }
    
    return positions
  }, [])
  
  useFrame((state, delta) => {
    if (!groupRef.current) return
    
    // Slowly rotate the entire ring in Phase 4
    if (phase === 4) {
      groupRef.current.rotation.y += delta * 0.08 // Slow, dreamy rotation
    }
    
    // Scale down the group when leaving Phase 4
    const targetScale = phase === 4 ? 1 : 0
    easing.damp3(
      groupRef.current.scale,
      [targetScale, targetScale, targetScale],
      0.5,
      delta
    )
  })
  
  return (
    <group ref={groupRef}>
      {photoPositions.map((pos, index) => (
        <Photo
          key={index}
          url={imageUrls[index]}
          position={pos.position}
          rotation={pos.rotation}
          index={index}
        />
      ))}
      
      {/* Center ambient light for photos */}
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#ffffff" />
    </group>
  )
}
