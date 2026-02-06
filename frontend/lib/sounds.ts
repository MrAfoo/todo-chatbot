/**
 * Sound effects system for cyberpunk theme
 * Uses Web Audio API to generate synthetic sounds
 */

class SoundSystem {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        // Load sound preference from localStorage
        this.enabled = localStorage.getItem("soundEnabled") === "true";
      } catch (e) {
        console.warn("Web Audio API not supported");
      }
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("soundEnabled", String(this.enabled));
    }
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume: number = 0.1) {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Task created sound - upward sweep
  taskCreated() {
    if (!this.enabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }

  // Task completed sound - success chime
  taskCompleted() {
    if (!this.enabled || !this.audioContext) return;
    
    // Three note success sound
    const notes = [523.25, 659.25, 783.99]; // C, E, G
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, "sine", 0.12), i * 80);
    });
  }

  // Task deleted sound - descending sweep
  taskDeleted() {
    if (!this.enabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  // Button click - short beep
  buttonClick() {
    this.playTone(800, 0.05, "square", 0.08);
  }

  // Hover sound - subtle blip
  buttonHover() {
    this.playTone(1200, 0.03, "sine", 0.05);
  }

  // Error sound - harsh buzz
  error() {
    if (!this.enabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(180, this.audioContext.currentTime + 0.05);
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }

  // Notification sound - attention grabber
  notification() {
    if (!this.enabled || !this.audioContext) return;
    
    [1000, 1200].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.08, "sine", 0.1), i * 100);
    });
  }

  // Theme toggle sound - power up/down
  themeToggle() {
    if (!this.enabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.12, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.25);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.25);
  }

  // Data processing sound - digital chatter
  processing() {
    if (!this.enabled || !this.audioContext) return;
    
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const freq = 800 + Math.random() * 400;
        this.playTone(freq, 0.03, "square", 0.06);
      }, i * 30);
    }
  }
}

// Singleton instance
let soundSystem: SoundSystem | null = null;

export function getSoundSystem(): SoundSystem {
  if (!soundSystem) {
    soundSystem = new SoundSystem();
  }
  return soundSystem;
}

export default SoundSystem;
