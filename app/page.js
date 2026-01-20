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

// Dynamic import for the UI overlay
const JourneyOverlay = dynamic(() => import('../components/JourneyOverlay'), {
  ssr: false,
})

// Dynamic import for the audio player
const AudioPlayer = dynamic(() => import('../components/AudioPlayer'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* The 3D Canvas with cinematic settings */}
      <SceneContainer>
        {/* Camera movement controller */}
        <CameraController />
        
        {/* The dynamic particle environment */}
        <Environment />
      </SceneContainer>
      
      {/* The emotional journey overlay */}
      <JourneyOverlay />
      
      {/* Audio player - bottom right */}
      <AudioPlayer />
    </main>
  )
}
