'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Howl } from 'howler'
import useStore from '../store/useStore'

// Global sound instance to persist across re-renders
let globalSound = null

export default function SoundManager() {
  const soundRef = useRef(null)
  const setAudioStarted = useStore((state) => state.setAudioStarted)
  
  // Initialize Howl on mount (but DO NOT play)
  useEffect(() => {
    // Only create if not already created
    if (!globalSound) {
      globalSound = new Howl({
        src: ['/music/song.mp3'],
        html5: true, // Better for mobile, streaming large files
        loop: true,
        volume: 0, // Start at 0, we'll fade in
        preload: true,
        onload: () => {
          console.log('Audio loaded successfully')
        },
        onloaderror: (id, error) => {
          console.error('Audio load error:', error)
        },
        onplayerror: (id, error) => {
          console.error('Audio play error:', error)
          // Try to unlock and play again
          globalSound.once('unlock', () => {
            globalSound.play()
          })
        },
      })
    }
    
    soundRef.current = globalSound
    
    // Cleanup on unmount
    return () => {
      // Don't unload global sound to persist across navigation
    }
  }, [])
  
  // Expose playAudio function globally via window for Phase 0 button
  useEffect(() => {
    const playAudio = () => {
      if (soundRef.current && !soundRef.current.playing()) {
        soundRef.current.play()
        // Fade volume from 0 to 1 over 3 seconds (3000ms)
        soundRef.current.fade(0, 1, 3000)
        setAudioStarted(true)
        console.log('Audio started with fade in')
      }
    }
    
    const pauseAudio = () => {
      if (soundRef.current && soundRef.current.playing()) {
        soundRef.current.fade(1, 0, 1000)
        setTimeout(() => {
          soundRef.current.pause()
        }, 1000)
      }
    }
    
    const stopAudio = () => {
      if (soundRef.current) {
        soundRef.current.stop()
        setAudioStarted(false)
      }
    }
    
    // Attach to window for global access
    window.playAudio = playAudio
    window.pauseAudio = pauseAudio
    window.stopAudio = stopAudio
    
    return () => {
      delete window.playAudio
      delete window.pauseAudio
      delete window.stopAudio
    }
  }, [setAudioStarted])
  
  // This component renders nothing, it's just for audio management
  return null
}

// Export a hook for components that need audio control
export function useAudio() {
  const playAudio = useCallback(() => {
    if (typeof window !== 'undefined' && window.playAudio) {
      window.playAudio()
    }
  }, [])
  
  const pauseAudio = useCallback(() => {
    if (typeof window !== 'undefined' && window.pauseAudio) {
      window.pauseAudio()
    }
  }, [])
  
  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && window.stopAudio) {
      window.stopAudio()
    }
  }, [])
  
  return { playAudio, pauseAudio, stopAudio }
}
