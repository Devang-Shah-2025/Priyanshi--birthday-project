'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import useStore from '../store/useStore'
import { playAudioWithFade, stopAudioWithFade } from '../lib/audio'

// Golden confetti explosion for Phase 2
const triggerConfetti = () => {
  const colors = ['#ffd700', '#ffec8b', '#ffffff', '#ffa500', '#ffe4b5']
  
  // Center burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors
  })
  
  // Side bursts
  setTimeout(() => {
    confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 }, colors })
  }, 200)
  
  setTimeout(() => {
    confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 }, colors })
  }, 400)
  
  // Grand finale
  setTimeout(() => {
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors })
  }, 600)
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.8,
      staggerChildren: 0.2
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.6 }
  }
}

const textVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    filter: 'blur(10px)'
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: { 
      duration: 1.2, 
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    filter: 'blur(8px)',
    transition: { duration: 0.5 }
  }
}

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      delay: 0.8,
      duration: 0.6,
      ease: 'easeOut'
    }
  },
  hover: { 
    scale: 1.03,
    boxShadow: '0 0 40px rgba(255, 255, 255, 0.15)',
    transition: { duration: 0.3 }
  },
  tap: { scale: 0.98 }
}

// Reusable button component with Montserrat font
function PhaseButton({ onClick, children }) {
  return (
    <motion.button
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className="mt-14 px-10 py-4 
                 text-sm md:text-base font-medium tracking-[0.2em] uppercase
                 text-white/90
                 bg-white/5 backdrop-blur-md rounded-full
                 border border-white/20
                 hover:border-white/30
                 transition-colors duration-300
                 cursor-pointer"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {children}
    </motion.button>
  )
}

export default function NarrativeOverlay() {
  const phase = useStore((state) => state.phase)
  const setPhase = useStore((state) => state.setPhase)

  // Trigger confetti when entering Phase 2
  useEffect(() => {
    if (phase === 2) {
      triggerConfetti()
      // Continuous celebration
      const interval = setInterval(() => {
        confetti({
          particleCount: 25,
          spread: 50,
          colors: ['#ffd700', '#ffec8b', '#ffffff'],
          origin: { x: Math.random(), y: Math.random() * 0.4 }
        })
      }, 400)
      
      setTimeout(() => clearInterval(interval), 6000)
    }
  }, [phase])

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none"
         style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      <AnimatePresence mode="wait">
        
        {/* ═══════════════════════════════════════════════════════════════
            PHASE 0: THE STATIC
            The noise, the chaos, fighting to exist
        ═══════════════════════════════════════════════════════════════ */}
        {phase === 0 && (
          <motion.div
            key="phase-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center max-w-2xl px-8 md:px-12 py-16 pointer-events-auto
                       bg-black/30 backdrop-blur-md rounded-3xl mx-4 border border-white/10"
          >
            <motion.p 
              variants={textVariants}
              className="text-2xl md:text-3xl lg:text-4xl text-white/80 leading-relaxed 
                         font-light tracking-wide"
            >
              The noise has been deafening.
            </motion.p>
            
            <motion.p 
              variants={textVariants}
              className="mt-6 text-xl md:text-2xl text-white/60 leading-relaxed 
                         font-light italic"
            >
              Fighting to exist in your world.
            </motion.p>
            
            <PhaseButton 
              onClick={() => {
                // Direct audio trigger from click - satisfies browser autoplay policy
                playAudioWithFade(3000)
                setPhase(1)
              }}
            >
              Find Clarity
            </PhaseButton>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PHASE 1: THE TRUTH
            Silence isn't absence - you are the only reality
        ═══════════════════════════════════════════════════════════════ */}
        {phase === 1 && (
          <motion.div
            key="phase-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center max-w-3xl px-8 md:px-14 py-16 pointer-events-auto
                       bg-black/30 backdrop-blur-md rounded-3xl mx-4 border border-white/10"
          >
            <motion.p 
              variants={textVariants}
              className="text-xl md:text-2xl text-white/70 leading-relaxed font-light"
            >
              But silence isn't absence.
            </motion.p>
            
            <motion.p 
              variants={textVariants}
              className="mt-8 text-2xl md:text-4xl lg:text-5xl text-white font-medium 
                         leading-tight tracking-wide"
            >
              You were never a choice.
            </motion.p>
            
            <motion.p 
              variants={textVariants}
              className="mt-6 text-3xl md:text-5xl lg:text-6xl text-white font-semibold"
              style={{
                textShadow: '0 0 40px rgba(255, 255, 255, 0.3)'
              }}
            >
              You are the only reality.
            </motion.p>
            
            <PhaseButton onClick={() => setPhase(2)}>
              Let the light in
            </PhaseButton>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PHASE 2: THE BLOOM (BIRTHDAY)
            Confetti celebration - Happy Birthday
        ═══════════════════════════════════════════════════════════════ */}
        {phase === 2 && (
          <motion.div
            key="phase-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center max-w-3xl px-8 md:px-14 py-16 pointer-events-auto
                       bg-black/30 backdrop-blur-md rounded-3xl mx-4 border border-white/10"
          >
            <motion.h1 
              variants={textVariants}
              className="text-4xl md:text-6xl lg:text-7xl text-white font-bold 
                         leading-tight tracking-wide"
              style={{
                textShadow: '0 0 60px rgba(255, 215, 0, 0.5)'
              }}
            >
              Happy Birthday,
            </motion.h1>
            
            <motion.h1 
              variants={textVariants}
              className="mt-2 text-5xl md:text-7xl lg:text-8xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #ffd700, #ffec8b, #ffffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 80px rgba(255, 215, 0, 0.4)'
              }}
            >
              Priyanshi.
            </motion.h1>
            
            <PhaseButton onClick={() => setPhase(3)}>
              Make a wish
            </PhaseButton>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PHASE 3: THE PROMISE
            No more fighting - consistent, loud in love, quiet in fear
        ═══════════════════════════════════════════════════════════════ */}
        {phase === 3 && (
          <motion.div
            key="phase-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center max-w-3xl px-8 md:px-14 py-16 pointer-events-auto
                       bg-black/30 backdrop-blur-md rounded-3xl mx-4 border border-white/10"
          >
            <motion.p 
              variants={textVariants}
              className="text-xl md:text-2xl text-white/70 leading-relaxed font-light"
            >
              No more fighting for my place.
            </motion.p>
            
            <motion.p 
              variants={textVariants}
              className="mt-8 text-2xl md:text-3xl lg:text-4xl text-white/90 leading-relaxed 
                         font-light tracking-wide"
            >
              I promise to just be here.
            </motion.p>
            
            <motion.p 
              variants={textVariants}
              className="mt-6 text-2xl md:text-3xl lg:text-4xl text-white font-medium"
              style={{
                textShadow: '0 0 30px rgba(255, 255, 255, 0.2)'
              }}
            >
              Consistent.
            </motion.p>
            
            <motion.p 
              variants={textVariants}
              className="mt-4 text-xl md:text-2xl text-white/70 leading-relaxed font-light italic"
            >
              Loud in my love, quiet in my fear.
            </motion.p>
            
            <PhaseButton onClick={() => setPhase(4)}>
              See us
            </PhaseButton>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PHASE 4: THE GALLERY
            Every moment matters - photos displayed
        ═══════════════════════════════════════════════════════════════ */}
        {phase === 4 && (
          <motion.div
            key="phase-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-8 left-0 right-0 text-center pointer-events-auto px-4"
          >
            <motion.p 
              variants={textVariants}
              className="text-xl md:text-2xl text-white/60 leading-relaxed font-light italic"
            >
              Every moment matters.
            </motion.p>
            
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setPhase(5)}
              className="mt-6 px-10 py-4 
                         text-sm md:text-base font-medium tracking-[0.2em] uppercase
                         text-white/90
                         bg-white/5 backdrop-blur-md rounded-full
                         border border-white/20
                         hover:border-white/30
                         transition-colors duration-300
                         cursor-pointer"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Forever?
            </motion.button>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PHASE 5: THE SAFE HAVEN
            Warm, lovely infinite loop with pulsing heart
        ═══════════════════════════════════════════════════════════════ */}
        {phase === 5 && (
          <motion.div
            key="phase-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center pointer-events-auto flex flex-col items-center justify-center"
          >
            <motion.p 
              variants={textVariants}
              className="text-2xl md:text-3xl lg:text-4xl text-white/70 leading-relaxed font-light"
            >
              I am here.
            </motion.p>
            
            <motion.h1 
              variants={textVariants}
              className="mt-4 text-4xl md:text-6xl lg:text-7xl text-white font-semibold"
              style={{
                textShadow: '0 0 60px rgba(255, 107, 107, 0.5)'
              }}
            >
              I am staying.
            </motion.h1>
            
            <motion.p 
              variants={textVariants}
              className="mt-8 text-xl md:text-2xl text-white/50 font-light italic"
            >
              Always.
            </motion.p>
            
            {/* Replay button */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => {
                // Fade out music and reset
                stopAudioWithFade(1500)
                setTimeout(() => {
                  setPhase(0)
                }, 1500)
              }}
              className="mt-16 px-8 py-3 
                         text-xs md:text-sm font-medium tracking-[0.15em] uppercase
                         text-white/60
                         bg-white/5 backdrop-blur-md rounded-full
                         border border-white/10
                         hover:border-white/20 hover:text-white/80
                         transition-all duration-300
                         cursor-pointer"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              ↻ Experience Again
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
