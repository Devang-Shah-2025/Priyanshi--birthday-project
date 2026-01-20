import { create } from 'zustand'

// Global state store for managing the 3-phase journey
// Phase 0: The Turbulent Void (chaos, fighting to exist)
// Phase 1: The Clarity Event (truth revealed)
// Phase 2: The Warmth (birthday celebration)

const useJourneyStore = create((set, get) => ({
  // Current phase of the journey (0 = Start, 1 = Clarity, 2 = Birthday)
  phase: 0,
  
  // Sub-step within a phase (for text sequences)
  step: 0,
  
  // Whether the final "Yes" has been clicked
  hasAccepted: false,
  
  // Whether audio is playing
  isAudioPlaying: false,
  
  // Visual intensity multiplier (for dynamic effects)
  intensity: 1.0,
  
  // Chaos level (1.0 = full chaos, 0.0 = calm)
  chaosLevel: 1.0,
  
  // Warmth level (0.0 = cold, 1.0 = warm golden)
  warmthLevel: 0.0,
  
  // Actions
  nextPhase: () => set((state) => {
    const newPhase = Math.min(state.phase + 1, 2)
    return { 
      phase: newPhase,
      step: 0,
      // Reduce chaos as we progress
      chaosLevel: newPhase === 0 ? 1.0 : newPhase === 1 ? 0.3 : 0.0,
      // Increase warmth in final phase
      warmthLevel: newPhase === 2 ? 1.0 : 0.0,
    }
  }),
  
  nextStep: () => set((state) => ({ 
    step: state.step + 1 
  })),
  
  setPhase: (phase) => set({ 
    phase,
    chaosLevel: phase === 0 ? 1.0 : phase === 1 ? 0.3 : 0.0,
    warmthLevel: phase === 2 ? 1.0 : 0.0,
  }),
  
  setStep: (step) => set({ step }),
  
  accept: () => set({ hasAccepted: true }),
  
  setAudioPlaying: (isPlaying) => set({ isAudioPlaying: isPlaying }),
  
  setIntensity: (intensity) => set({ intensity }),
  
  setChaosLevel: (chaosLevel) => set({ chaosLevel }),
  
  setWarmthLevel: (warmthLevel) => set({ warmthLevel }),
  
  // Reset everything
  reset: () => set({ 
    phase: 0,
    step: 0,
    hasAccepted: false, 
    isAudioPlaying: false,
    intensity: 1.0,
    chaosLevel: 1.0,
    warmthLevel: 0.0,
  }),
}))

export default useJourneyStore
