'use client'

import { useRef } from 'react'
import { SpotLight, Environment } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import useStore from '../store/useStore'

export default function GodRays() {
  const spotLightRef = useRef()
  const phase = useStore((state) => state.phase)
  
  // Adjust light intensity based on phase
  const getIntensity = () => {
    if (phase === 5) return 15 // Warm glow for Safe Haven
    if (phase === 4) return 8 // Softer for gallery
    if (phase === 2) return 20 // Bright for birthday celebration
    return 12 // Default cinematic
  }
  
  // Adjust light color based on phase
  const getColor = () => {
    if (phase === 5) return '#ffaa88' // Warm orange for Safe Haven
    if (phase === 2) return '#fffaf0' // Warm white for birthday
    return '#ffffff' // Pure white default
  }
  
  useFrame((state) => {
    if (spotLightRef.current) {
      // Subtle light movement for organic feel
      const time = state.clock.elapsedTime
      spotLightRef.current.position.x = Math.sin(time * 0.2) * 2
      spotLightRef.current.position.z = Math.cos(time * 0.15) * 2
    }
  })
  
  return (
    <>
      {/* Main God Ray spotlight from above */}
      <SpotLight
        ref={spotLightRef}
        position={[0, 15, 0]}
        angle={0.3}
        penumbra={1}
        intensity={getIntensity()}
        color={getColor()}
        castShadow
        shadow-mapSize={[512, 512]}
        // Volumetric properties for God Rays effect
        volumetric
        distance={25}
        attenuation={8}
        anglePower={4}
      />
      
      {/* Secondary fill light for depth */}
      <SpotLight
        position={[5, 10, 5]}
        angle={0.4}
        penumbra={0.8}
        intensity={getIntensity() * 0.3}
        color={getColor()}
        distance={20}
        attenuation={10}
        anglePower={3}
      />
      
      {/* Ambient environment for realistic reflections on glass */}
      <Environment 
        preset="night" 
        background={false}
      />
      
      {/* Subtle ambient light to prevent total darkness */}
      <ambientLight intensity={0.1} color="#4466ff" />
    </>
  )
}
