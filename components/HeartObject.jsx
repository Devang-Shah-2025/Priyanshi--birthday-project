'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import { easing } from 'maath'
import * as THREE from 'three'
import useStore from '../store/useStore'

// Create a heart shape using Three.js Shape
function createHeartShape() {
  const shape = new THREE.Shape()
  
  // Heart shape path
  const x = 0, y = 0
  shape.moveTo(x, y + 0.5)
  shape.bezierCurveTo(x, y + 0.5, x - 0.5, y, x - 0.5, y)
  shape.bezierCurveTo(x - 0.5, y - 0.35, x, y - 0.6, x, y - 0.8)
  shape.bezierCurveTo(x, y - 0.6, x + 0.5, y - 0.35, x + 0.5, y)
  shape.bezierCurveTo(x + 0.5, y, x, y + 0.5, x, y + 0.5)
  
  return shape
}

export default function HeartObject() {
  const meshRef = useRef()
  const phase = useStore((state) => state.phase)
  
  // Only visible in Phase 5
  const isVisible = phase === 5
  
  useFrame((state, delta) => {
    if (!meshRef.current) return
    
    const time = state.clock.elapsedTime
    
    // Smooth scale transition
    const baseScale = isVisible ? 2.5 : 0
    
    // Gentle heartbeat pulse using sine wave
    const pulse = isVisible ? Math.sin(time * 1.5) * 0.08 : 0
    const targetScale = baseScale + pulse
    
    easing.damp3(
      meshRef.current.scale,
      [targetScale, targetScale, targetScale],
      0.8,
      delta
    )
    
    // Slow, gentle rotation
    if (isVisible) {
      meshRef.current.rotation.y += delta * 0.2
      meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.05
    }
  })
  
  // Extrude settings for 3D heart
  const extrudeSettings = {
    depth: 0.4,
    bevelEnabled: true,
    bevelSegments: 10,
    bevelSize: 0.1,
    bevelThickness: 0.1,
    curveSegments: 32,
  }
  
  return (
    <mesh ref={meshRef} scale={0} rotation={[Math.PI, 0, 0]} position={[0, 0.3, 0]}>
      <extrudeGeometry args={[createHeartShape(), extrudeSettings]} />
      <MeshTransmissionMaterial
        backside={true}
        thickness={1}
        chromaticAberration={0.3}
        anisotropy={0.2}
        distortion={0.1}
        distortionScale={0.3}
        temporalDistortion={0.1}
        resolution={512}
        color="#ff6b6b"
        transmissionSampler
      />
    </mesh>
  )
}
