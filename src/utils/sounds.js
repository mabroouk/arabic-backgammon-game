// نظام الأصوات والتأثيرات الصوتية
export class SoundManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.enabled = true;
    this.volume = 0.7;
    this.initAudioContext();
  }

  async initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await this.generateSounds();
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  // توليد الأصوات باستخدام Web Audio API
  async generateSounds() {
    // صوت رمي النرد
    this.sounds.diceRoll = this.createDiceRollSound();
    
    // صوت سحب القطعة
    this.sounds.pieceDrag = this.createPieceDragSound();
    
    // صوت وضع القطعة
    this.sounds.piecePlace = this.createPiecePlaceSound();
    
    // صوت ضرب القطعة
    this.sounds.pieceHit = this.createPieceHitSound();
    
    // صوت بقبقة الشيشة
    this.sounds.shishaBubble = this.createShishaBubbleSound();
    
    // صوت كوب الشاي
    this.sounds.teaCup = this.createTeaCupSound();
    
    // صوت الفوز
    this.sounds.victory = this.createVictorySound();
  }

  createDiceRollSound() {
    return () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const noiseBuffer = this.createNoiseBuffer(0.1);
      const noiseSource = this.audioContext.createBufferSource();
      
      noiseSource.buffer = noiseBuffer;
      
      // تأثير الرمي مع الضوضاء
      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
      
      oscillator.connect(gainNode);
      noiseSource.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start();
      noiseSource.start();
      oscillator.stop(this.audioContext.currentTime + 0.2);
      noiseSource.stop(this.audioContext.currentTime + 0.2);
    };
  }

  createPieceDragSound() {
    return () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(120, this.audioContext.currentTime + 0.15);
      
      gainNode.gain.setValueAtTime(this.volume * 0.2, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.15);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.15);
    };
  }

  createPiecePlaceSound() {
    return () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(this.volume * 0.4, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.1);
    };
  }

  createPieceHitSound() {
    return () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(this.volume * 0.6, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.2);
    };
  }

  createShishaBubbleSound() {
    return () => {
      if (!this.audioContext) return;
      
      // صوت بقبقة الشيشة - عدة فقاعات متتالية
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          oscillator.frequency.setValueAtTime(200 + Math.random() * 100, this.audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
          
          gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
          
          oscillator.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          
          oscillator.start();
          oscillator.stop(this.audioContext.currentTime + 0.1);
        }, i * 50);
      }
    };
  }

  createTeaCupSound() {
    return () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      // صوت رنين كوب الشاي
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(this.volume * 0.2, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.3);
    };
  }

  createVictorySound() {
    return () => {
      if (!this.audioContext) return;
      
      // لحن فوز بسيط
      const notes = [523, 659, 784, 1047]; // C, E, G, C
      notes.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
          
          gainNode.gain.setValueAtTime(this.volume * 0.4, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
          
          oscillator.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          
          oscillator.start();
          oscillator.stop(this.audioContext.currentTime + 0.3);
        }, index * 200);
      });
    };
  }

  createNoiseBuffer(duration) {
    const sampleRate = this.audioContext.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    return buffer;
  }

  // تشغيل الأصوات
  playSound(soundName) {
    if (!this.enabled || !this.sounds[soundName]) return;
    
    try {
      this.sounds[soundName]();
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }

  // تفعيل/إلغاء الأصوات
  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // تغيير مستوى الصوت
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}

// إنشاء مدير الأصوات العام
export const soundManager = new SoundManager();
