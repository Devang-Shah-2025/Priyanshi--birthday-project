'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import useJourneyStore from '../store/useJourneyStore'

// Lerp helper for smooth transitions
function lerp(start, end, factor) {
  return start + (end - start) * factor
}

export default function CameraController() {
  const { camera } = useThree()
  const timeRef = useRef(0)
  const { phase, chaosLevel } = useJourneyStore()
  
  // Target positions for each phase
  const phaseTargets = {
    0: { position: new THREE.Vector3(0, 0, 20), lookAt: new THREE.Vector3(0, 0, 0) },
    1: { position: new THREE.Vector3(0, 0, 8), lookAt: new THREE.Vector3(0, 0, 0) },
    2: { position: new THREE.Vector3(0, 0, 4), lookAt: new THREE.Vector3(0, 0, 0) },
  }
  
  useFrame((state, delta) => {
    timeRef.current += delta
    const time = timeRef.current
    
    const target = phaseTargets[phase] || phaseTargets[0]
    const lerpSpeed = phase === 0 ? 0.5 : 1.5 // Slower in chaos, faster toward clarity
    
    // Phase 0: Turbulent Void - chaotic camera movement
    if (phase === 0) {
      // Drift backward slowly
      const targetZ = 20 + Math.sin(time * 0.2) * 2
      camera.position.z = lerp(camera.position.z, targetZ, delta * lerpSpeed)
      
      // Chaotic rotation and shake based on chaos level
      const shake = chaosLevel * 0.3
      camera.position.x = lerp(
        camera.position.x, 
        Math.sin(time * 0.5) * shake + Math.sin(time * 2) * shake * 0.2, 
        delta * 2
      )
      camera.position.y = lerp(
        camera.position.y, 
        Math.cos(time * 0.3) * shake * 0.5 + Math.cos(time * 1.5) * shake * 0.1, 
        delta * 2
      )
      
      // Subtle rotation wobble
      camera.rotation.z = lerp(
        camera.rotation.z,
        Math.sin(time * 0.8) * 0.02 * chaosLevel,
        delta * 2
      )
    }
    
    // Phase 1: Clarity - smooth movement forward, stabilizing
    else if (phase === 1) {
      // Smoothly move toward the clarity position
      camera.position.x = lerp(camera.position.x, target.position.x, delta * lerpSpeed)
      camera.position.y = lerp(camera.position.y, target.position.y, delta * lerpSpeed)
      camera.position.z = lerp(camera.position.z, target.position.z, delta * lerpSpeed)
      
      // Stabilize rotation
      camera.rotation.z = lerp(camera.rotation.z, 0, delta * 2)
      
      // Gentle breathing motion
      const breathe = Math.sin(time * 0.5) * 0.1
      camera.position.y = lerp(camera.position.y, breathe, delta * 0.5)
    }
    
    // Phase 2: Warmth - continue forward into the light
    else if (phase === 2) {
      // Move closer, into the warmth
      camera.position.x = lerp(camera.position.x, target.position.x, delta * lerpSpeed)
      camera.position.y = lerp(camera.position.y, target.position.y, delta * lerpSpeed)
      camera.position.z = lerp(camera.position.z, target.position.z, delta * 0.8)
      
      // Perfectly stable
      camera.rotation.z = lerp(camera.rotation.z, 0, delta * 3)
      
      // Very gentle float
      const gentleFloat = Math.sin(time * 0.3) * 0.05
      camera.position.y = lerp(camera.position.y, gentleFloat, delta * 0.3)
    }
    
    // Always look at center
    camera.lookAt(0, 0, 0)
  })
  
  return null
}
