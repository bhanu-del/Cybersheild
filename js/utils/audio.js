/**
 * CyberShield — Synthesized Audio Engine (Web Audio API)
 * 100% offline, zero external audio files, gentle non-intrusive sound design.
 */
(function(global) {
  'use strict';

  global.CyberShield = global.CyberShield || {};

  let audioCtx = null;
  let idleTimer = null;

  function scheduleIdleSuspend() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (audioCtx && audioCtx.state === 'running') {
        audioCtx.suspend().catch(() => {});
      }
    }, 2500);
  }

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  const Sound = {
    isSoundEnabled: function() {
      const state = global.CyberShield.State;
      if (!state) return true;
      const prefs = state.getData().preferences || {};
      return prefs.soundEnabled !== false; // Default enabled
    },

    /**
     * Play soft pleasant ascending chime for correct answers & achievements
     */
    playSuccess: function() {
      if (!this.isSoundEnabled()) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        
        // Tone 1: C5 (523.25 Hz)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now);
        gain1.gain.setValueAtTime(0.08, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.28);

        // Tone 2: E5 (659.25 Hz)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, now + 0.1);
        gain2.gain.setValueAtTime(0.08, now + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.1);
        osc2.stop(now + 0.45);
        scheduleIdleSuspend();
      } catch (e) {
        // AudioContext restricted or unavailable
      }
    },

    /**
     * Play soft gentle tone for caution / warning feedback
     */
    playWarning: function() {
      if (!this.isSoundEnabled()) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(329.63, now); // E4
        osc.frequency.linearRampToValueAtTime(261.63, now + 0.25); // C4
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
        scheduleIdleSuspend();
      } catch (e) {}
    },

    /**
     * Play subtle UI tap for buttons and selection
     */
    playTap: function() {
      if (!this.isSoundEnabled()) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
        scheduleIdleSuspend();
      } catch (e) {}
    },

    /**
     * Play urgent alert pulse for crisis simulations
     */
    playAlert: function() {
      if (!this.isSoundEnabled()) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.setValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.28);
        scheduleIdleSuspend();
      } catch (e) {}
    },

    /**
     * Play emergency alert siren
     */
    playSiren: function() {
      if (!this.isSoundEnabled()) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.25);
        osc.frequency.linearRampToValueAtTime(440, now + 0.5);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.55);
        scheduleIdleSuspend();
      } catch (e) {}
    },

    /**
     * Play major victory fanfare for containment completion
     */
    playSuccessMajor: function() {
      if (!this.isSoundEnabled()) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const noteTime = now + (idx * 0.1);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, noteTime);
          gain.gain.setValueAtTime(0.08, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(noteTime);
          osc.stop(noteTime + 0.35);
        });
        scheduleIdleSuspend();
      } catch (e) {}
    }
  };

  global.CyberShield.Sound = Sound;
})(window);
