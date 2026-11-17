// Single-channel Arabic voice-over and gentle Web Audio UI sound effects
// Never auto-plays on load; respects mute and cleanup.

class AudioManager {
  private muted = false;
  private audioCtx: AudioContext | null = null;
  private speakingListeners = new Set<(speakingId: string | null) => void>();
  private currentSpeakingId: string | null = null;

  setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) {
      this.stopSpeech();
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  getCurrentSpeakingId(): string | null {
    return this.currentSpeakingId;
  }

  subscribeSpeaking(listener: (id: string | null) => void): () => void {
    this.speakingListeners.add(listener);
    return () => {
      this.speakingListeners.delete(listener);
    };
  }

  private notifySpeaking(id: string | null) {
    this.currentSpeakingId = id;
    this.speakingListeners.forEach((fn) => fn(id));
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctx) {
        this.audioCtx = new Ctx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  playTone(type: 'success' | 'step' | 'gentle') {
    if (this.muted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.29);
      } else if (type === 'step') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.13);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.17);
      }
    } catch {
      // Silently ignore audio errors in restricted browsers
    }
  }

  stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.notifySpeaking(null);
  }

  speakArabic(id: string, text: string): { supported: boolean } {
    if (this.muted) {
      return { supported: true };
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return { supported: false };
    }

    // If clicking the already active button, toggle stop
    if (this.currentSpeakingId === id) {
      this.stopSpeech();
      return { supported: true };
    }

    // Enforce single active audio clip at a time
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith('ar')) || null;

    if (arabicVoice) {
      utterance.voice = arabicVoice;
      utterance.lang = arabicVoice.lang;
    } else {
      utterance.lang = 'ar-SA';
    }
    utterance.rate = 0.92;
    utterance.pitch = 1.02;

    utterance.onstart = () => this.notifySpeaking(id);
    utterance.onend = () => {
      if (this.currentSpeakingId === id) {
        this.notifySpeaking(null);
      }
    };
    utterance.onerror = () => {
      if (this.currentSpeakingId === id) {
        this.notifySpeaking(null);
      }
    };

    this.notifySpeaking(id);
    window.speechSynthesis.speak(utterance);
    return { supported: true };
  }
}

export const audioManager = new AudioManager();
