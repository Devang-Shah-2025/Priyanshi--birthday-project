'use client'

import { useState, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Suspense } from 'react'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'

// Loading fallback for iPhone 16 Pro OLED
function Loader() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="text-white/50 text-lg animate-pulse font-light tracking-widest"
           style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Loading the stars...
      </div>
    </div>
  )
}

// Performance-aware post-processing
function PostProcessing() {
  const { gl } = useThree()
  const [isHighPerformance, setIsHighPerformance] = useState(true)
  
  useEffect(() => {
    // Check device pixel ratio and WebGL capabilities
    const dpr = gl.getPixelRatio()
    const isCapable = dpr >= 1.5 && gl.capabilities.maxTextureSize >= 4096
    setIsHighPerformance(isCapable)
  }, [gl])
  
  // Only render full effects on capable devices
  if (!isHighPerformance) {
    return (
      <EffectComposer disableNormalPass multisampling={0}>
        {/* Minimal bloom for low-end devices */}
        <Bloom
          luminanceThreshold={1.2}
          intensity={0.8}
          levels={5}
          mipmapBlur
        />
      </EffectComposer>
    )
  }
  
  return (
    <EffectComposer disableNormalPass multisampling={0}>
      {/* Premium Bloom - optimized for God Rays glow */}
      <Bloom
        luminanceThreshold={0.5}
        luminanceSmoothing={0.9}
        intensity={1.2}
        radius={0.7}
        levels={9}
        mipmapBlur
      />
      
      {/* Noise - subtle film grain texture */}
      <Noise opacity={0.015} />
      
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
    // Mobile touch: prevent scrolling interruptions on iPhone 16 Pro
    <div className="fixed inset-0 w-full h-full bg-black" style={{ touchAction: 'none' }}>
      <Suspense fallback={<Loader />}>
        <Canvas
          // Disable default tone mapping for flat, cinematic control
          flat
          // Performance: Let post-processing handle visuals
          gl={{
            antialias: false,
            stencil: false,
            depth: true,
            powerPreference: 'high-performance',
          }}
          // Cap at 2 to save battery/heat on iPhone 16 Pro
          dpr={[1, 2]}
          // Camera configuration
          camera={{
            position: [0, 0, 20],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}
        >
          {/* Scene content will be passed as children */}
          {/* WarmBackground component handles animated background color */}
          {children}
          
          {/* Cinematic post-processing effects */}
          <PostProcessing />
        </Canvas>
      </Suspense>
    </div>
  )
}
