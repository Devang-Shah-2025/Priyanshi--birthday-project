'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../store/useStore'
import { easing } from 'maath'

// Individual gold particle
function GoldParticle({ position, speed, size }) {
  const ref = useRef()
  
  useFrame((state) => {
    if (!ref.current) return
    
    const time = state.clock.elapsedTime
    
    // Gentle floating motion
    ref.current.position.x = position[0] + Math.sin(time * speed + position[0]) * 0.5
    ref.current.position.y = position[1] + Math.sin(time * speed * 0.7 + position[1]) * 0.3
    ref.current.position.z = position[2] + Math.cos(time * speed * 0.5 + position[2]) * 0.5
    
    // Gentle twinkle
    ref.current.material.opacity = 0.4 + Math.sin(time * 2 + position[0]) * 0.3
  })
  
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial 
        color="#ffcc00" 
        transparent 
        opacity={0.6}
      />
    </mesh>
  )
}

export default function GoldDust() {
  const groupRef = useRef()
  const phase = useStore((state) => state.phase)
  
  // Only visible in Phase 5
  const isVisible = phase === 5
  
  // Generate random particle positions
  const particles = useMemo(() => {
    const items = []
    const count = 100
    
    for (let i = 0; i < count; i++) {
      items.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 20,
        ],
        speed: 0.3 + Math.random() * 0.5,
        size: 0.02 + Math.random() * 0.04,
      })
    }
    
    return items
  }, [])
  
  useFrame((state, delta) => {
    if (!groupRef.current) return
    
    // Smooth fade in/out
    const targetOpacity = isVisible ? 1 : 0
    easing.damp(groupRef.current, 'visible', targetOpacity, 0.5, delta)
    
    // Slow rotation of the entire dust field
    if (isVisible) {
      groupRef.current.rotation.y += delta * 0.02
    }
  })
  
  if (!isVisible) return null
  
  return (
    <group ref={groupRef}>
      {particles.map((particle, index) => (
        <GoldParticle
          key={index}
          position={particle.position}
          speed={particle.speed}
          size={particle.size}
        />
      ))}
      
      {/* Warm ambient glow */}
      <pointLight position={[0, 0, 0]} intensity={0.3} color="#ffcc00" />
      <pointLight position={[5, 3, 0]} intensity={0.2} color="#ff9900" />
      <pointLight position={[-5, -3, 0]} intensity={0.2} color="#ff6b6b" />
    </group>
  )
}
