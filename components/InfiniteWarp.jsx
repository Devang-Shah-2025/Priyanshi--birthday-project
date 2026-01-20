'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import useStore from '../store/useStore'

export default function InfiniteWarp() {
  const starsRef = useRef()
  const phase = useStore((state) => state.phase)
  
  // Only render stars in phase 4 (gallery viewing)
  // Phase 5 uses GoldDust instead
  if (phase !== 4) return null
  
  return (
    <Stars
      ref={starsRef}
      radius={100}
      depth={50}
      count={3000}
      factor={4}
      saturation={0}
      fade
      speed={0.5}
    />
  )
}

// No more white fade - removed for "Safe Haven" ending
