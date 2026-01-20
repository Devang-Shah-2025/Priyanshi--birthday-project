'use client'

import dynamic from 'next/dynamic'

// Dynamic import SceneContainer to avoid SSR issues with Three.js
const SceneContainer = dynamic(() => import('../components/SceneContainer'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-white/50 text-lg animate-pulse font-light tracking-widest">
        Loading the stars...
      </div>
    </div>
  ),
})

// Dynamic import for the 3D environment
const Environment = dynamic(() => import('../components/Environment'), {
  ssr: false,
})

// Dynamic import for camera controller
const CameraController = dynamic(() => import('../components/CameraController'), {
  ssr: false,
})

// Dynamic import for the UI overlay (6-phase narrative)
const NarrativeOverlay = dynamic(() => import('../components/NarrativeOverlay'), {
  ssr: false,
})

// Dynamic import for the audio player
const AudioPlayer = dynamic(() => import('../components/AudioPlayer'), {
  ssr: false,
})

// Dynamic import for the Glass Soul (central visual)
const GlassSoul = dynamic(() => import('../components/GlassSoul'), {
  ssr: false,
})

// Dynamic import for the Sound Manager (Howler.js)
const SoundManager = dynamic(() => import('../components/SoundManager'), {
  ssr: false,
})

// Dynamic import for Photo Gallery (Phase 4)
const PhotoGallery = dynamic(() => import('../components/PhotoGallery'), {
  ssr: false,
})

// Dynamic import for Infinite Warp (Phase 4 stars)
const InfiniteWarp = dynamic(() => import('../components/InfiniteWarp'), {
  ssr: false,
})

// Dynamic import for Heart Object (Phase 5)
const HeartObject = dynamic(() => import('../components/HeartObject'), {
  ssr: false,
})

// Dynamic import for Gold Dust particles (Phase 5)
const GoldDust = dynamic(() => import('../components/GoldDust'), {
  ssr: false,
})

// Dynamic import for Warm Background (Phase 5 color transition)
const WarmBackground = dynamic(() => import('../components/WarmBackground'), {
  ssr: false,
})

// Dynamic import for God Rays (cinematic lighting)
const GodRays = dynamic(() => import('../components/GodRays'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Sound Manager - handles audio with Howler.js */}
      <SoundManager />
      
      {/* The 3D Canvas with cinematic settings */}
      <SceneContainer>
        {/* Animated background - transitions to warm maroon in Phase 5 */}
        <WarmBackground />
        
        {/* God Rays - cinematic volumetric lighting */}
        <GodRays />
        
        {/* Camera movement controller */}
        <CameraController />
        
        {/* The Glass Soul - central interactive gem (Phases 0-3) */}
        <GlassSoul />
        
        {/* The Heart Object - Phase 5 Safe Haven */}
        <HeartObject />
        
        {/* The dynamic particle environment */}
        <Environment />
        
        {/* Photo Gallery - Phase 4 */}
        <PhotoGallery />
        
        {/* Stars for Phase 4 gallery */}
        <InfiniteWarp />
        
        {/* Gold Dust particles - Phase 5 */}
        <GoldDust />
      </SceneContainer>
      
      {/* The 6-phase narrative overlay */}
      <NarrativeOverlay />
      
      {/* Audio player - bottom right */}
      <AudioPlayer />
    </main>
  )
}
