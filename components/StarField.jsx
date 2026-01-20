'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Sparkles } from '@react-three/drei'

// Camera movement component - slowly drifts forward through space
function CameraRig() {
  const cameraRef = useRef()
  
  useFrame((state, delta) => {
    // Slowly move the camera forward (into the stars)
    state.camera.position.z -= delta * 2
    
    // Add subtle floating motion for an ethereal feel
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.5
    state.camera.position.y = Math.cos(state.clock.elapsedTime * 0.08) * 0.3
    
    // Reset camera position when it goes too far (infinite loop effect)
    if (state.camera.position.z < -200) {
      state.camera.position.z = 100
    }
  })
  
  return null
}

// The star field scene
function StarFieldScene() {
  return (
    <>
      {/* Deep space stars - void-like atmosphere */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      {/* Sparkles for that alive, magical feeling */}
      <Sparkles
        count={200}
        scale={100}
        size={2}
        speed={0.3}
        noise={1}
        color="#ffffff"
        opacity={0.6}
      />
      
      {/* Additional layer of subtle sparkles */}
      <Sparkles
        count={100}
        scale={150}
        size={3}
        speed={0.1}
        noise={0.5}
        color="#aaaaff"
        opacity={0.3}
      />
      
      {/* Ambient light for subtle illumination */}
      <ambientLight intensity={0.1} />
      
      {/* Camera movement controller */}
      <CameraRig />
    </>
  )
}

// Main StarField component with Canvas
export default function StarField() {
  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      <Canvas
        camera={{ 
          position: [0, 0, 50], 
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        style={{ background: '#000000' }}
      >
        <StarFieldScene />
      </Canvas>
    </div>
  )
}
