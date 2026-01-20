import { create } from 'zustand'

// iPhone 16 Pro optimized store for phase management
// Phase 0-5: Different stages of the journey

const useStore = create((set) => ({
  // Current phase of the journey (0-5)
  phase: 0,
  
  // Set phase directly
  setPhase: (phase) => set({ phase: Math.max(0, Math.min(5, phase)) }),
  
  // Whether audio has been started by user interaction
  audioStarted: false,
  
  // Set audio started state
  setAudioStarted: (started) => set({ audioStarted: started }),
}))

export default useStore
