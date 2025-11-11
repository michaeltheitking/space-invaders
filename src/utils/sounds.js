// Sound effect manager using Web Audio API
class SoundManager {
  constructor() {
    this.audioContext = null
    this.enabled = true
    this.volume = 0.5
    
    // Initialize audio context on first user interaction
    this.initAudioContext = () => {
      if (!this.audioContext) {
        try {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        } catch (error) {
          console.warn('Web Audio API not supported:', error)
        }
      }
    }
  }

  play(name) {
    if (!this.enabled) return
    
    this.initAudioContext()
    if (!this.audioContext) return

    try {
      switch (name) {
        case 'shoot':
          this.playBeep(800, 0.05)
          break
        case 'explosion':
          this.playExplosion(0.3)
          break
        case 'powerup':
          this.playPowerUp(0.3)
          break
        case 'gameover':
          this.playGameOver(0.5)
          break
      }
    } catch (error) {
      console.debug('Sound play error:', error)
    }
  }

  playBeep(frequency, duration) {
    if (!this.audioContext) return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.frequency.value = frequency
    oscillator.type = 'square'
    
    gainNode.gain.setValueAtTime(0.3 * this.volume, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  playExplosion(duration) {
    if (!this.audioContext) return
    
    // Create a more dramatic explosion sound with multiple layers
    const bufferSize = this.audioContext.sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)
    
    // Create a more complex explosion sound
    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize
      // Mix white noise with a low-frequency rumble
      const noise = (Math.random() * 2 - 1) * Math.pow(1 - t, 2)
      const rumble = Math.sin(2 * Math.PI * 60 * t) * Math.pow(1 - t, 1.5)
      data[i] = (noise * 0.7 + rumble * 0.3) * 0.8
    }
    
    const source = this.audioContext.createBufferSource()
    source.buffer = buffer
    const gainNode = this.audioContext.createGain()
    
    // Make explosion louder and more dramatic
    gainNode.gain.setValueAtTime(0.5 * this.volume, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)
    
    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    source.start(this.audioContext.currentTime)
    source.stop(this.audioContext.currentTime + duration)
  }

  playPowerUp(duration) {
    if (!this.audioContext) return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + duration)
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3 * this.volume, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  playGameOver(duration) {
    if (!this.audioContext) return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + duration)
    oscillator.type = 'sawtooth'
    
    gainNode.gain.setValueAtTime(0.3 * this.volume, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  setEnabled(enabled) {
    this.enabled = enabled
  }
}

// Create sound manager instance
export const soundManager = new SoundManager()
