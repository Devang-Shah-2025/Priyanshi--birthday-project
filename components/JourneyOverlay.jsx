'use client'

import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import useJourneyStore from '../store/useJourneyStore'

// Golden confetti explosion
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

// Sophisticated animation variants
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
      ease: [0.25, 0.46, 0.45, 0.94] // Custom easing
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

export default function JourneyOverlay() {
  const { phase, hasAccepted, setPhase, accept } = useJourneyStore()

  const handleYesClick = () => {
    accept()
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

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
      <AnimatePresence mode="wait">
        
        {/* ═══════════════════════════════════════════════════════════════
            PHASE 0: THE TURBULENCE
            Dark, emotional acknowledgment of the past week
        ═══════════════════════════════════════════════════════════════ */}
        {phase === 0 && (
          <motion.div
            key="phase-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center max-w-2xl px-8 md:px-12 py-16 pointer-events-auto
                       glass rounded-3xl mx-4"
          >
            {/* Main emotional text */}
            <motion.p 
              variants={textVariants}
              className="text-2xl md:text-3xl lg:text-4xl text-white/80 leading-relaxed 
                         font-light tracking-wide"
            >
              The last week felt like screaming into a void.
            </motion.p>
            
            <motion.p 
              variants={textVariants}
              className="mt-6 text-xl md:text-2xl text-white/60 leading-relaxed 
                         font-light italic"
            >
              Fighting just to exist in your world.
            </motion.p>
            
            <motion.p 
              variants={textVariants}
              className="mt-4 text-lg md:text-xl text-white/50 leading-relaxed font-light"
            >
              The noise was deafening.
            </motion.p>
            
            {/* Glassmorphism button */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setPhase(1)}
              className="mt-14 px-10 py-4 
                         font-sans text-sm md:text-base font-medium tracking-[0.2em] uppercase
                         text-white/90
                         glass rounded-full
                         border border-white/20
                         hover:border-white/30
                         transition-colors duration-300
                         cursor-pointer"
            >
              Find Clarity
            </motion.button>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PHASE 1: THE CLARITY
            The truth revealed - she was never a choice
        ═══════════════════════════════════════════════════════════════ */}
        {phase === 1 && (
          <motion.div
            key="phase-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center max-w-3xl px-8 md:px-14 py-16 pointer-events-auto
                       glass rounded-3xl mx-4"
          >
            {/* The clarification */}
            <motion.p 
              variants={textVariants}
              className="text-xl md:text-2xl text-white/70 leading-relaxed font-light"
            >
              I need you to understand something.
            </motion.p>
            
            <motion.p 
              variants={textVariants}
              className="mt-8 text-2xl md:text-4xl lg:text-5xl text-white font-medium 
                         leading-tight tracking-wide"
            >
              You were never a choice against anyone else.
            </motion.p>
            
            <motion.p 
              variants={textVariants}
              className="mt-8 text-3xl md:text-5xl lg:text-6xl text-white font-semibold"
              style={{
                textShadow: '0 0 40px rgba(255, 255, 255, 0.3)'
              }}
            >
              There is no choice.
            </motion.p>
            
            <motion.p 
              variants={textVariants}
              className="mt-2 text-3xl md:text-5xl lg:text-6xl text-white font-semibold"
              style={{
                textShadow: '0 0 40px rgba(255, 255, 255, 0.3)'
              }}
            >
              There is only you.
            </motion.p>
            
            <motion.p
              variants={textVariants}
              className="mt-10 text-lg md:text-xl text-white/50 font-light italic"
            >
              My fear of losing you just got loud.
            </motion.p>
            
            {/* Continue button */}
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setPhase(2)}
              className="mt-14 px-10 py-4 
                         font-sans text-sm md:text-base font-medium tracking-[0.2em] uppercase
                         text-white/90
                         glass rounded-full
                         border border-white/20
                         hover:border-white/30
                         transition-colors duration-300
                         cursor-pointer"
            >
              Step Into the Light
            </motion.button>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            PHASE 2: THE WARMTH (BIRTHDAY)
            Celebration and reconciliation
        ═══════════════════════════════════════════════════════════════ */}
        {phase === 2 && !hasAccepted && (
          <motion.div
            key="phase-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onAnimationComplete={() => {
              // Fire confetti when phase 2 appears
              triggerConfetti()
            }}
            className="text-center max-w-3xl px-8 md:px-14 py-16 pointer-events-auto
                       glass-warm rounded-3xl mx-4"
          >
            {/* Birthday Header */}
            <motion.h1 
              variants={textVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white"
              style={{
                textShadow: '0 0 60px rgba(255, 215, 0, 0.4), 0 0 100px rgba(255, 215, 0, 0.2)'
              }}
            >
              Happy Birthday,
            </motion.h1>
            
            <motion.p 
              variants={textVariants}
              className="mt-2 text-4xl md:text-5xl lg:text-6xl font-medium"
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #ffec8b 50%, #ffd700 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Priyanshi.
            </motion.p>
            
            {/* The wish */}
            <motion.p
              variants={textVariants}
              className="mt-12 text-xl md:text-2xl text-white/80 leading-relaxed font-light 
                         max-w-xl mx-auto"
            >
              I don't want to fight for my place anymore.
            </motion.p>
            
            <motion.p
              variants={textVariants}
              className="mt-3 text-xl md:text-2xl text-white/80 leading-relaxed font-light"
            >
              I just want to be in it, <span className="italic text-yellow-200">peacefully</span>, with you.
            </motion.p>
            
            <motion.p
              variants={textVariants}
              className="mt-8 text-2xl md:text-3xl text-yellow-100/90 font-medium"
            >
              Let's restart.
            </motion.p>
            
            {/* Yes Button - Golden */}
            <motion.button
              variants={buttonVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 50px rgba(255, 215, 0, 0.5)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleYesClick}
              className="mt-12 px-14 py-5 
                         font-sans text-lg font-semibold tracking-[0.15em]
                         text-black
                         bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400
                         rounded-full
                         shadow-[0_0_40px_rgba(255,215,0,0.4)]
                         hover:shadow-[0_0_60px_rgba(255,215,0,0.6)]
                         transition-all duration-300
                         cursor-pointer"
            >
              Yes ✨
            </motion.button>
            
            {/* Footer - Headphones reminder */}
            <motion.p
              variants={textVariants}
              className="mt-10 text-sm text-white/40 font-sans tracking-wider"
            >
              🎧 Put on your headphones.
            </motion.p>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            FINAL: THE CELEBRATION
            After clicking Yes
        ═══════════════════════════════════════════════════════════════ */}
        {hasAccepted && (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center px-8"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.02, 1],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
            >
              <h1 
                className="text-6xl md:text-8xl lg:text-9xl font-semibold text-white"
                style={{
                  textShadow: '0 0 80px rgba(255, 215, 0, 0.6), 0 0 150px rgba(255, 215, 0, 0.3)'
                }}
              >
                Here's to us
              </h1>
              
              <motion.p 
                className="mt-10 text-2xl md:text-3xl font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                style={{
                  background: 'linear-gradient(135deg, #ffd700 0%, #ffffff 50%, #ffd700 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                No more noise. Just love.
              </motion.p>
              
              <motion.p 
                className="mt-6 text-xl text-white/60 font-light italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
              >
                — Forever yours
              </motion.p>
            </motion.div>
          </motion.div>
        )}
        
      </AnimatePresence>
    </div>
  )
}
