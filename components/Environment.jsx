'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import useJourneyStore from '../store/useJourneyStore'

// Helper for smooth interpolation
function lerp(start, end, factor) {
  return start + (end - start) * factor
}

// The turbulent "noise" particles that transition from chaos to calm
function NoiseParticles() {
  const groupRef = useRef()
  const { phase, chaosLevel } = useJourneyStore()
  
  // Dynamic color based on phase
  // Phase 0: Red (chaos) → Phase 1+: Calm blue
  const particleColor = useMemo(() => {
    if (phase === 0) return "#ff5555"  // Red - turbulent
    return "#aaaaff"  // Calm blue - clarity
  }, [phase])
  
  // Dynamic speed based on phase
  // Phase 0: Fast (2) → Phase 1+: Slow (0.3)
  const particleSpeed = useMemo(() => {
    if (phase === 0) return 2      // Fast, chaotic
    if (phase === 1) return 0.3    // Slow, calming
    return 0.1                      // Very slow, peaceful
  }, [phase])
  
  // Dynamic noise based on phase
  const particleNoise = useMemo(() => {
    if (phase === 0) return 1      // High turbulence
    return 0.2                      // Low turbulence
  }, [phase])
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotation speed decreases as chaos reduces
      const rotationSpeed = phase === 0 ? 0.003 : 0.0005
      groupRef.current.rotation.y += rotationSpeed
      groupRef.current.rotation.x += rotationSpeed * 0.5
      
      // Scale down as we progress through phases
      const targetScale = phase === 0 ? 1 : phase === 1 ? 0.6 : 0.2
      groupRef.current.scale.setScalar(
        lerp(groupRef.current.scale.x, targetScale, delta * 2)
      )
    }
  })
  
  // Fade out completely in warmth phase
  if (phase === 2) return null
  
  return (
    <group ref={groupRef}>
      {/* Particles transition from chaotic red to calm blue */}
      <Sparkles
        count={100}
        scale={10}
        size={4}
        speed={particleSpeed}
        noise={particleNoise}
        color={particleColor}
        opacity={phase === 0 ? 0.25 : 0.4}
      />
    </group>
  )
}

// Mid-field floating dust particles
function DustParticles() {
  const dustRef = useRef()
  const { phase } = useJourneyStore()
  
  // Interpolate color based on phase
  const dustColor = useMemo(() => {
    if (phase === 2) return "#ffd700" // Golden in warmth phase
    if (phase === 1) return "#8888cc" // Lighter purple-blue in clarity
    return "#4a4a8a" // Deep purple in chaos
  }, [phase])
  
  useFrame((state, delta) => {
    if (dustRef.current) {
      // Gentle rotation
      dustRef.current.rotation.y += 0.0003
    }
  })
  
  return (
    <group ref={dustRef}>
      {/* Mid-field floating dust - calm, ethereal */}
      <Sparkles
        count={300}
        scale={20}
        size={2}
        speed={phase === 2 ? 0.2 : 0.4}
        opacity={phase === 2 ? 0.7 : 0.5}
        color={dustColor}
      />
    </group>
  )
}

// Golden warmth particles for Phase 2
function WarmthParticles() {
  const warmthRef = useRef()
  const { phase } = useJourneyStore()
  
  useFrame((state, delta) => {
    if (warmthRef.current) {
      warmthRef.current.rotation.y -= 0.0005
      
      // Grow into view
      const targetScale = phase === 2 ? 1 : 0
      warmthRef.current.scale.setScalar(
        lerp(warmthRef.current.scale.x, targetScale, delta * 1.5)
      )
    }
  })
  
  return (
    <group ref={warmthRef} scale={0}>
      {/* Warm golden particles */}
      <Sparkles
        count={200}
        scale={15}
        size={3}
        speed={0.2}
        opacity={0.8}
        color="#ffd700"
      />
      {/* Soft white highlights */}
      <Sparkles
        count={100}
        scale={25}
        size={2}
        speed={0.1}
        opacity={0.5}
        color="#ffffff"
      />
    </group>
  )
}

// Warm PointLight for Phase 2 - triggers the Bloom effect beautifully
function WarmthLight() {
  const lightRef = useRef()
  const glowRef = useRef()
  const { phase } = useJourneyStore()
  
  useFrame((state, delta) => {
    if (lightRef.current) {
      // Smoothly increase intensity when entering phase 2
      const targetIntensity = phase === 2 ? 8 : 0
      lightRef.current.intensity = lerp(
        lightRef.current.intensity,
        targetIntensity,
        delta * 2
      )
      
      // Gentle pulsing in phase 2 for that warm, breathing glow
      if (phase === 2) {
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5
        lightRef.current.intensity = lerp(lightRef.current.intensity, 6 + pulse * 4, delta * 3)
      }
    }
    
    // Animate the glow sphere (visible light source)
    if (glowRef.current) {
      const targetScale = phase === 2 ? 1 : 0
      glowRef.current.scale.setScalar(
        lerp(glowRef.current.scale.x, targetScale, delta * 2)
      )
      
      // Gentle breathing effect
      if (phase === 2) {
        const breathe = Math.sin(state.clock.elapsedTime * 1.5) * 0.1 + 1
        glowRef.current.scale.setScalar(
          lerp(glowRef.current.scale.x, breathe, delta)
        )
      }
    }
  })
  
  return (
    <group>
      {/* The warm point light at position [0, 0, 5] - triggers Bloom effect */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 5]}
        intensity={0}
        color="#ffddaa"
        distance={30}
      />
      
      {/* Visible glow sphere for extra visual impact */}
      <mesh ref={glowRef} position={[0, 0, 5]} scale={0}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial 
          color="#ffddaa" 
          transparent 
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}

// Central ambient light that evolves with phases
function CentralLight() {
  const lightRef = useRef()
  const { phase } = useJourneyStore()
  
  useFrame((state, delta) => {
    if (lightRef.current) {
      // Intensity grows with phases
      const targetIntensity = phase === 0 ? 0.5 : phase === 1 ? 2 : 4
      lightRef.current.intensity = lerp(
        lightRef.current.intensity, 
        targetIntensity, 
        delta * 2
      )
      
      // Color shifts: purple → blue → gold
      const targetColor = phase === 2 
        ? new THREE.Color('#ffd700') 
        : phase === 1 
          ? new THREE.Color('#aaaaff')
          : new THREE.Color('#4a4a8a')
      
      lightRef.current.color.lerp(targetColor, delta * 2)
    }
  })
  
  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 0]}
      intensity={0.5}
      color="#4a4a8a"
      distance={50}
    />
  )
}

// The complete environment
export default function Environment() {
  const { phase } = useJourneyStore()
  
  // Fog color changes with phase (warmer in phase 2)
  const fogColor = phase === 2 ? '#0a0805' : '#020207'
  
  return (
    <group>
      {/* Fog - fades distant objects into darkness for depth */}
      <fog attach="fog" args={[fogColor, 10, 50]} />
      
      {/* Layer 1: Distant Stars - deep space backdrop */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        fade
        speed={phase === 2 ? 0.5 : 1}
      />
      
      {/* Layer 2: Mid-field floating dust */}
      <DustParticles />
      
      {/* Layer 3: Turbulent particles (red → blue transition) */}
      <NoiseParticles />
      
      {/* Layer 4: Golden warmth particles (Phase 2) */}
      <WarmthParticles />
      
      {/* Central evolving light */}
      <CentralLight />
      
      {/* Warm PointLight for Phase 2 - triggers beautiful Bloom */}
      <WarmthLight />
      
      {/* Ambient light for subtle illumination */}
      <ambientLight intensity={phase === 2 ? 0.3 : 0.1} />
    </group>
  )
}
