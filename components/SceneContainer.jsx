'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'

// Loading fallback
function Loader() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-white/50 text-lg animate-pulse font-light tracking-widest">
        Loading the stars...
      </div>
    </div>
  )
}

// Cinematic post-processing effects
function PostProcessing() {
  return (
    <EffectComposer multisampling={0}>
      {/* Bloom - makes lights glow beautifully */}
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={1.5}
        mipmapBlur
      />
      
      {/* Noise - subtle film grain texture */}
      <Noise opacity={0.02} />
      
      {/* Vignette - darkens corners, focuses eye on center */}
      <Vignette
        eskil={false}
        offset={0.1}
        darkness={1.1}
      />
    </EffectComposer>
  )
}

export default function SceneContainer({ children }) {
  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      <Suspense fallback={<Loader />}>
        <Canvas
          // Disable default tone mapping for flat, cinematic control
          flat
          // Enable shadows for depth
          shadows
          // Camera configuration
          camera={{
            position: [0, 0, 20],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}
          // Disable automatic color management for manual control
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.NoToneMapping,
          }}
          // Ensure proper DPI scaling
          dpr={[1, 2]}
          style={{ background: '#000000' }}
        >
          {/* Deep dark blue/black void background */}
          <color attach="background" args={['#020207']} />
          
          {/* Scene content will be passed as children */}
          {children}
          
          {/* Cinematic post-processing effects */}
          <PostProcessing />
        </Canvas>
      </Suspense>
    </div>
  )
}
