'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../store/useStore'

// Animated background that transitions to warm maroon in Phase 5
export default function WarmBackground() {
  const colorRef = useRef()
  const phase = useStore((state) => state.phase)
  
  // Target colors
  const blackColor = new THREE.Color('#000000')
  const warmColor = new THREE.Color('#2a0a0a') // Deep warm maroon
  
  useFrame((state, delta) => {
    if (!colorRef.current) return
    
    // Smoothly transition background color based on phase
    const targetColor = phase === 5 ? warmColor : blackColor
    
    colorRef.current.lerp(targetColor, delta * 0.5)
  })
  
  return (
    <color ref={colorRef} attach="background" args={['#000000']} />
  )
}
