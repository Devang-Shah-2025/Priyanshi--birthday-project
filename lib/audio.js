import { Howl } from 'howler'

// Global audio instance - initialized lazily on first use (client-side only)
let backgroundMusic = null

// Initialize audio only in browser environment
function getAudio() {
  if (typeof window === 'undefined') return null
  
  if (!backgroundMusic) {
    backgroundMusic = new Howl({
      src: ['/music/song.mp3'],
      loop: true,
      volume: 0, // Start silent, we'll fade in
      html5: true, // Forces HTML5 Audio to bypass Web Audio API restrictions
      preload: true,
      onload: () => {
        console.log('✅ Audio loaded successfully')
      },
      onloaderror: (id, error) => {
        console.error('❌ Audio load error:', error)
      },
      onplayerror: (id, error) => {
        console.error('❌ Audio play error:', error)
        // Attempt to unlock and retry
        if (backgroundMusic) {
          backgroundMusic.once('unlock', () => {
            backgroundMusic.play()
          })
        }
      },
    })
  }
  
  return backgroundMusic
}

// Play audio with fade - call this directly from click handler
export function playAudioWithFade(duration = 3000) {
  const audio = getAudio()
  if (audio) {
    console.log('🎵 Starting audio playback...')
    audio.play()
    audio.fade(0, 1, duration)
    return true
  }
  return false
}

// Stop audio with fade
export function stopAudioWithFade(duration = 1500) {
  const audio = getAudio()
  if (audio && audio.playing()) {
    audio.fade(audio.volume(), 0, duration)
    setTimeout(() => {
      audio.stop()
    }, duration)
  }
}

// Export getter for direct access if needed
export { getAudio }
