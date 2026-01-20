'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import useJourneyStore from '../store/useJourneyStore'
import useStore from '../store/useStore'

// Lerp helper for smooth transitions
function lerp(start, end, factor) {
  return start + (end - start) * factor
}

export default function CameraController() {
  const { camera } = useThree()
  const timeRef = useRef(0)
  const { chaosLevel } = useJourneyStore()
  const phase = useStore((state) => state.phase)
  
  // Target positions for each phase - optimized for iPhone 16 Pro
  const phaseTargets = {
    0: { position: new THREE.Vector3(0, 0, 15), lookAt: new THREE.Vector3(0, 0, 0) },
    1: { position: new THREE.Vector3(0, 0, 8), lookAt: new THREE.Vector3(0, 0, 0) },
    2: { position: new THREE.Vector3(0, 0, 5), lookAt: new THREE.Vector3(0, 0, 0) },
    3: { position: new THREE.Vector3(0, 0, 6), lookAt: new THREE.Vector3(0, 0, 0) },
    4: { position: new THREE.Vector3(0, 0, 8), lookAt: new THREE.Vector3(0, 0, 0) }, // Gallery viewing distance
    5: { position: new THREE.Vector3(0, 0, 6), lookAt: new THREE.Vector3(0, 0, 0) }, // Safe Haven
  }
  
  useFrame((state, delta) => {
    timeRef.current += delta
    const time = timeRef.current
    
    const target = phaseTargets[phase] || phaseTargets[0]
    const lerpSpeed = phase === 0 ? 0.5 : 1.5 // Slower in chaos, faster toward clarity
    
    // Phase 0: Turbulent Void - chaotic camera movement
    if (phase === 0) {
      // Drift backward slowly
      const targetZ = 15 + Math.sin(time * 0.2) * 1.5
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
    
    // Phase 3: Promise - calm and centered
    else if (phase === 3) {
      camera.position.x = lerp(camera.position.x, target.position.x, delta * lerpSpeed)
      camera.position.y = lerp(camera.position.y, target.position.y, delta * lerpSpeed)
      camera.position.z = lerp(camera.position.z, target.position.z, delta * lerpSpeed)
      camera.rotation.z = lerp(camera.rotation.z, 0, delta * 3)
    }
    
    // Phase 4: Gallery - optimal viewing for photo carousel
    else if (phase === 4) {
      camera.position.x = lerp(camera.position.x, target.position.x, delta * 1.2)
      camera.position.y = lerp(camera.position.y, target.position.y, delta * 1.2)
      camera.position.z = lerp(camera.position.z, target.position.z, delta * 1.2)
      camera.rotation.z = lerp(camera.rotation.z, 0, delta * 3)
      
      // Very subtle breathing
      const breathe = Math.sin(time * 0.4) * 0.03
      camera.position.y = lerp(camera.position.y, breathe, delta * 0.3)
    }
    
    // Phase 5: Safe Haven - warm and intimate
    else if (phase === 5) {
      camera.position.x = lerp(camera.position.x, target.position.x, delta * 1.0)
      camera.position.y = lerp(camera.position.y, target.position.y, delta * 1.0)
      camera.position.z = lerp(camera.position.z, target.position.z, delta * 1.0)
      camera.rotation.z = lerp(camera.rotation.z, 0, delta * 3)
      
      // Gentle breathing for peaceful ending
      const gentleFloat = Math.sin(time * 0.25) * 0.04
      camera.position.y = lerp(camera.position.y, gentleFloat, delta * 0.2)
    }
    
    // Always look at center
    camera.lookAt(0, 0, 0)
  })
  
  return null
}
