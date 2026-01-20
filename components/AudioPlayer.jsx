'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function AudioPlayer() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Try to autoplay when user first interacts with the page
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        setHasInteracted(true)
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false))
      }
    }

    document.addEventListener('click', handleFirstInteraction, { once: true })
    document.addEventListener('touchstart', handleFirstInteraction, { once: true })

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [hasInteracted])

  const togglePlay = (e) => {
    e.stopPropagation()
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.log('Playback failed:', err))
      }
    }
  }

  return (
    <motion.div 
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="/background.mp3"
        loop
        preload="auto"
      />

      {/* Glass card player */}
      <button
        onClick={togglePlay}
        className="flex items-center gap-3 px-4 py-3 
                   bg-white/5 backdrop-blur-md 
                   border border-white/10 rounded-full
                   hover:bg-white/10 hover:border-white/20
                   transition-all duration-300
                   shadow-[0_0_20px_rgba(255,255,255,0.05)]"
      >
        {/* Animated music icon */}
        <div className="relative w-5 h-5 flex items-center justify-center">
          {isPlaying ? (
            <div className="flex items-end gap-[2px] h-4">
              <motion.div
                className="w-1 bg-white/80 rounded-full"
                animate={{ height: ['40%', '100%', '60%', '100%', '40%'] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="w-1 bg-white/80 rounded-full"
                animate={{ height: ['100%', '40%', '100%', '60%', '100%'] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              />
              <motion.div
                className="w-1 bg-white/80 rounded-full"
                animate={{ height: ['60%', '100%', '40%', '100%', '60%'] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              />
            </div>
          ) : (
            <svg 
              className="w-5 h-5 text-white/60" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>

        <span className="text-sm text-white/60 font-light tracking-wide">
          {isPlaying ? 'Playing' : 'Play Music'}
        </span>
      </button>
    </motion.div>
  )
}
