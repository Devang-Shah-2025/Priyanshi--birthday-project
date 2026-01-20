'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import { easing } from 'maath'
import useStore from '../store/useStore'

export default function GlassSoul() {
  const meshRef = useRef()
  const phase = useStore((state) => state.phase)
  
  // Target values based on phase
  const isChaoticPhase = phase === 0
  const isHiddenPhase = phase >= 4
  
  // Animation parameters
  const targetDistortion = isChaoticPhase ? 1.5 : 0.2
  const targetScale = isHiddenPhase ? 0 : 1
  const rotationSpeed = isChaoticPhase ? 2.0 : 0.3
  
  useFrame((state, delta) => {
    if (!meshRef.current) return
    
    const mesh = meshRef.current
    const time = state.clock.elapsedTime
    
    // Smooth scale transition (for Phase 4+ hide)
    easing.damp3(
      mesh.scale,
      [targetScale, targetScale, targetScale],
      0.5,
      delta
    )
    
    // Rotation based on phase
    if (isChaoticPhase) {
      // Phase 0: Fast erratic rotation
      mesh.rotation.x += delta * rotationSpeed * (1 + Math.sin(time * 3) * 0.5)
      mesh.rotation.y += delta * rotationSpeed * (1 + Math.cos(time * 2.5) * 0.5)
      mesh.rotation.z += delta * rotationSpeed * 0.3 * Math.sin(time * 4)
    } else {
      // Phase 1-3: Slow elegant rotation
      mesh.rotation.x += delta * rotationSpeed
      mesh.rotation.y += delta * rotationSpeed * 0.7
    }
    
    // Smooth distortion transition on material
    if (mesh.material) {
      easing.damp(mesh.material, 'distortion', targetDistortion, 0.8, delta)
    }
  })
  
  return (
    <mesh ref={meshRef}>
      {/* High detail sphere-like gem */}
      <icosahedronGeometry args={[1, 15]} />
      
      {/* Glass transmission material */}
      <MeshTransmissionMaterial
        backside={true}
        thickness={1.5}
        chromaticAberration={0.6}
        anisotropy={0.5}
        distortion={1}
        distortionScale={1}
        temporalDistortion={0.2}
        // Lower resolution for mobile optimization
        resolution={512}
        // Visual enhancements
        transmissionSampler
        color="#ffffff"
      />
    </mesh>
  )
}
