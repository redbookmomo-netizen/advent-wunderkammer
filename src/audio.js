// Physical-Modeling Web Audio Engine for "The Grand Advent Wunderkammer"
// Zero external audio files; iOS 17+/18+ Silent-Switch compatible; Stereo Convolution Reverb

import { MUSIC_REPERTOIRE } from './musicScores.js';

export class WunderkammerAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.dryBus = null;
    this.wetBus = null;
    this.noiseBuffer = null;
    this.muted = false;
    this.playing = false;
    this.unlocked = false;

    this.trackIndex = 0;
    this.beatCursor = 0;
    this.eventIndex = 0;
    this.lastTickTime = 0;
    this.schedulerTimer = null;
    this.pendulumTimer = null;
    this.onNoteCallback = null;
  }

  _createSilentWavUri() {
    return 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
  }

  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;

    try {
      this.ctx = new AC();
      const sr = this.ctx.sampleRate;

      // Master compressor + gain
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.knee.value = 18;
      comp.ratio.value = 3.5;

      this.master = this.ctx.createGain();
      this.master.gain.value = 0.85;
      comp.connect(this.master);
      this.master.connect(this.ctx.destination);

      this.dryBus = this.ctx.createGain();
      this.dryBus.gain.value = 0.76;
      this.dryBus.connect(comp);

      // Algorithmic walnut soundboard + gothic parlor stereo impulse response
      const conv = this.ctx.createConvolver();
      const irLen = Math.floor(sr * 2.1);
      const ir = this.ctx.createBuffer(2, irLen, sr);
      for (let ch = 0; ch < 2; ch++) {
        const d = ir.getChannelData(ch);
        for (let i = 0; i < irLen; i++) {
          const t = i / sr;
          const env = Math.exp(-t * 2.7) * 0.65 + Math.exp(-t * 8.5) * 0.35;
          d[i] = (Math.random() * 2 - 1) * env;
        }
      }
      conv.buffer = ir;

      this.wetBus = this.ctx.createGain();
      this.wetBus.gain.value = 0.34;
      this.wetBus.connect(conv);
      conv.connect(comp);

      // Shared 2-second pink noise buffer for fire crackle, steam, sand, parchment & breath chiff
      const nLen = sr * 2;
      this.noiseBuffer = this.ctx.createBuffer(1, nLen, sr);
      const nd = this.noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < nLen; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + w * 0.099046;
        b1 = 0.96300 * b1 + w * 0.296516;
        b2 = 0.57000 * b2 + w * 1.052691;
        nd[i] = (b0 + b1 + b2 + w * 0.1848) * 0.16;
      }

      this._startPendulumAndHearth();
    } catch (_) {
      this.ctx = null;
    }
  }

  unlock() {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    try {
      if (navigator.audioSession && navigator.audioSession.type !== 'playback') {
        navigator.audioSession.type = 'playback';
      }
    } catch (_) {}

    if (!this.iosSilentEl) {
      try {
        const el = document.createElement('audio');
        el.setAttribute('playsinline', '');
        el.setAttribute('webkit-playsinline', '');
        el.loop = true;
        el.volume = 0.01;
        el.src = this._createSilentWavUri();
        this.iosSilentEl = el;
      } catch (_) {}
    }
    if (this.iosSilentEl && this.iosSilentEl.paused) {
      this.iosSilentEl.play().catch(() => {});
    }

    if (this.ctx.state === 'suspended' || this.ctx.state === 'interrupted') {
      this.ctx.resume().catch(() => {});
    }
    this.unlocked = true;
  }

  setMuted(flag) {
    this.muted = !!flag;
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(this.muted ? 0.0001 : 0.85, this.ctx.currentTime, 0.05);
    }
    return this.muted;
  }

  getCurrentPiece() {
    return MUSIC_REPERTOIRE[this.trackIndex % MUSIC_REPERTOIRE.length];
  }

  setTrack(idx, autoPlay = true) {
    this.trackIndex = ((idx % MUSIC_REPERTOIRE.length) + MUSIC_REPERTOIRE.length) % MUSIC_REPERTOIRE.length;
    this.beatCursor = 0;
    this.eventIndex = 0;
    if (this.ctx) this.lastTickTime = this.ctx.currentTime;
    if (autoPlay && !this.playing) this.startMusic();
    return this.getCurrentPiece();
  }

  nextTrack() {
    return this.setTrack(this.trackIndex + 1, this.playing);
  }

  startMusic() {
    this.unlock();
    if (!this.ctx || this.playing) return;
    this.playing = true;
    this.lastTickTime = this.ctx.currentTime;
    if (!this.schedulerTimer) {
      this.schedulerTimer = setInterval(() => this._schedulerStep(), 35);
    }
  }

  pauseMusic() {
    this.playing = false;
  }

  toggleMusic() {
    if (this.playing) this.pauseMusic();
    else this.startMusic();
    return this.playing;
  }

  _schedulerStep() {
    if (!this.playing || !this.ctx || this.muted) {
      if (this.ctx) this.lastTickTime = this.ctx.currentTime;
      return;
    }
    const now = this.ctx.currentTime;
    const dt = Math.min(0.2, Math.max(0, now - this.lastTickTime));
    this.lastTickTime = now;

    const piece = this.getCurrentPiece();
    const beatsPerSec = piece.bpm / 60;
    this.beatCursor += dt * beatsPerSec;

    const lookaheadBeats = 0.14 * beatsPerSec;
    while (this.eventIndex < piece.events.length) {
      const ev = piece.events[this.eventIndex];
      if (ev.beat > this.beatCursor + lookaheadBeats) break;
      const delaySec = Math.max(0, (ev.beat - this.beatCursor) / beatsPerSec);
      this._voiceNote(ev.midi, now + delaySec, ev.dur / beatsPerSec, ev.vel, ev.voice, piece.organMix);
      if (this.onNoteCallback) {
        this.onNoteCallback(ev, this.trackIndex);
      }
      this.eventIndex++;
    }

    if (this.beatCursor >= piece.totalBeats + 0.8) {
      this.beatCursor = 0;
      this.eventIndex = 0;
    }
  }

  _voiceNote(midi, when, durSec, vel = 0.8, voice = 'tine', organMix = 0.22) {
    if (!this.ctx || this.muted) return;
    const freq = 440 * Math.pow(2, (midi - 69) / 12);
    const amp = (voice === 'tine' ? 0.14 : 0.085) * vel;

    // 1. Swiss steel comb fundamental + inharmonic bell partial
    const noteGain = this.ctx.createGain();
    const release = Math.max(0.75, Math.min(2.4, durSec * 1.45));
    noteGain.gain.setValueAtTime(0.0001, when);
    noteGain.gain.linearRampToValueAtTime(amp, when + 0.006);
    noteGain.gain.exponentialRampToValueAtTime(amp * 0.36, when + 0.18);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, when + release);

    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, when);
    osc1.connect(noteGain);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.002, when);
    const g2 = this.ctx.createGain();
    g2.gain.setValueAtTime(0.26, when);
    g2.gain.exponentialRampToValueAtTime(0.001, when + 0.35);
    osc2.connect(g2);
    g2.connect(noteGain);

    if (voice === 'tine' && freq < 2600) {
      const oscBell = this.ctx.createOscillator();
      oscBell.type = 'sine';
      oscBell.frequency.setValueAtTime(freq * 5.41, when);
      const gBell = this.ctx.createGain();
      gBell.gain.setValueAtTime(0.13, when);
      gBell.gain.exponentialRampToValueAtTime(0.0008, when + 0.09);
      oscBell.connect(gBell);
      gBell.connect(noteGain);
      oscBell.start(when);
      oscBell.stop(when + 0.11);
    }

    noteGain.connect(this.dryBus);
    noteGain.connect(this.wetBus);

    osc1.start(when);
    osc2.start(when);
    osc1.stop(when + release + 0.04);
    osc2.stop(when + 0.4);

    // 2. Warm wooden Gedackt 8' organ undertone on accompaniment / chorale
    if (organMix > 0.05 && voice === 'accomp' && durSec > 0.25) {
      const orgGain = this.ctx.createGain();
      const oAmp = amp * organMix * 0.72;
      orgGain.gain.setValueAtTime(0.0001, when);
      orgGain.gain.linearRampToValueAtTime(oAmp, when + 0.05);
      orgGain.gain.setValueAtTime(oAmp * 0.85, when + Math.max(0.06, durSec * 0.8));
      orgGain.gain.exponentialRampToValueAtTime(0.0001, when + durSec + 0.25);

      const orgOsc = this.ctx.createOscillator();
      orgOsc.type = 'triangle';
      orgOsc.frequency.setValueAtTime(freq, when);

      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(freq * 2.4, when);

      orgOsc.connect(lp);
      lp.connect(orgGain);
      orgGain.connect(this.wetBus);
      orgOsc.start(when);
      orgOsc.stop(when + durSec + 0.3);
    }
  }

  _startPendulumAndHearth() {
    if (this.pendulumTimer) clearInterval(this.pendulumTimer);
    let tickSide = 0;
    this.pendulumTimer = setInterval(() => {
      if (!this.ctx || !this.unlocked || this.muted || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;

      // Delicate Black Forest lyre pendulum escapement tick-tock
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(tickSide ? 1180 : 1420, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.018);

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.016, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);
      osc.connect(g);
      g.connect(this.dryBus);
      osc.start(now);
      osc.stop(now + 0.026);
      tickSide = 1 - tickSide;

      // Occasional warm pinewood hearth crackle
      if (Math.random() < 0.32 && this.noiseBuffer) {
        const src = this.ctx.createBufferSource();
        src.buffer = this.noiseBuffer;
        const bp = this.ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 1600 + Math.random() * 1800;
        bp.Q.value = 3.2;
        const cg = this.ctx.createGain();
        const t0 = now + Math.random() * 0.4;
        cg.gain.setValueAtTime(0.022, t0);
        cg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.035);
        src.connect(bp);
        bp.connect(cg);
        cg.connect(this.dryBus);
        src.start(t0, Math.random() * 1.4, 0.05);
      }
    }, 1000);
  }

  playSfx(type = 'crystal') {
    this.unlock();
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;

    switch (type) {
      case 'doorOpen': {
        // Brass latch click + warm walnut creak + shimmer triad
        this._clickTransient(now, 1950, 0.08);
        this._woodCreak(now + 0.03, 290, 210, 0.16);
        [72, 76, 79, 84].forEach((m, i) => {
          this._voiceNote(m, now + 0.06 + i * 0.055, 0.65, 0.55, 'tine', 0);
        });
        break;
      }
      case 'drawerOpen': {
        this._noiseWhoosh(now, 480, 0.22, 0.09);
        this._clickTransient(now + 0.02, 2400, 0.06);
        [67, 74, 79].forEach((m, i) => {
          this._voiceNote(m, now + 0.08 + i * 0.06, 0.6, 0.5, 'tine', 0);
        });
        break;
      }
      case 'doorClose': {
        this._clickTransient(now, 620, 0.09);
        break;
      }
      case 'locked': {
        this._clickTransient(now, 1500, 0.09);
        this._clickTransient(now + 0.08, 1250, 0.08);
        break;
      }
      case 'ratchet': {
        for (let i = 0; i < 6; i++) {
          this._clickTransient(now + i * 0.048, 1750 + i * 90, 0.085);
        }
        break;
      }
      case 'cuckoo':
      case 'finale': {
        // Authentic wooden pipe Cuckoo (F#5 -> D5) twice + cathedral bell cascade
        for (let c = 0; c < 2; c++) {
          const base = now + c * 0.62;
          this._woodPipe(base, 740, 0.18, 0.16);       // F#5 "Cuck-"
          this._woodPipe(base + 0.24, 587.3, 0.28, 0.16); // D5 "-oo!"
        }
        [72, 76, 79, 84, 88, 91].forEach((m, i) => {
          this._voiceNote(m, now + 0.15 + i * 0.08, 1.2, 0.72, 'tine', 0.25);
        });
        break;
      }
      case 'soldier': {
        // Crisp snare roll + brass bugle fifth
        for (let i = 0; i < 5; i++) {
          this._noiseWhoosh(now + i * 0.042, 1800, 0.038, 0.09);
        }
        this._voiceNote(67, now + 0.22, 0.25, 0.75, 'accomp', 0.5);
        this._voiceNote(74, now + 0.36, 0.55, 0.85, 'tine', 0.5);
        break;
      }
      case 'train': {
        // Twin-pipe Alpine steam whistle + chuff-chuff
        this._woodPipe(now, 880, 0.36, 0.12);
        this._woodPipe(now, 1108.7, 0.36, 0.10);
        for (let i = 0; i < 4; i++) {
          this._noiseWhoosh(now + 0.28 + i * 0.13, 620, 0.08, 0.09);
        }
        break;
      }
      case 'bird': {
        // Neuchâtel singing bird piston-whistle trill
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2100, now);
        for (let i = 0; i < 8; i++) {
          osc.frequency.linearRampToValueAtTime(i % 2 ? 2950 : 2250, now + 0.04 + i * 0.045);
        }
        osc.frequency.exponentialRampToValueAtTime(3400, now + 0.48);
        g.gain.setValueAtTime(0.001, now);
        g.gain.linearRampToValueAtTime(0.11, now + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);
        osc.connect(g);
        g.connect(this.wetBus);
        g.connect(this.dryBus);
        osc.start(now);
        osc.stop(now + 0.55);
        break;
      }
      case 'bubble':
      case 'hearth': {
        this._noiseWhoosh(now, 900, 0.35, 0.08);
        [76, 79, 83, 88].forEach((m, i) => {
          this._voiceNote(m, now + i * 0.07, 0.4, 0.5, 'tine', 0);
        });
        break;
      }
      case 'sand':
      case 'page':
      case 'curtain': {
        this._noiseWhoosh(now, 1450, 0.38, 0.10);
        this._voiceNote(81, now + 0.08, 0.6, 0.45, 'tine', 0);
        break;
      }
      case 'clockwork': {
        for (let i = 0; i < 8; i++) {
          this._clickTransient(now + i * 0.04, 2400 + (i % 2) * 350, 0.065);
        }
        break;
      }
      case 'organ': {
        [60, 64, 67, 72].forEach((m) => {
          this._voiceNote(m, now, 0.95, 0.72, 'accomp', 0.85);
        });
        break;
      }
      case 'pop':
      case 'stamp': {
        this._clickTransient(now, 920, 0.11);
        [74, 78, 81, 86].forEach((m, i) => {
          this._voiceNote(m, now + 0.04 + i * 0.045, 0.55, 0.65, 'tine', 0);
        });
        break;
      }
      case 'bell':
      case 'carousel':
      case 'celestial':
      case 'crystal':
      default: {
        [76, 80, 83, 88, 92].forEach((m, i) => {
          this._voiceNote(m, now + i * 0.055, 0.9, 0.62, 'tine', 0);
        });
        break;
      }
    }
  }

  _clickTransient(when, freq = 1800, amp = 0.08) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, when);
    osc.frequency.exponentialRampToValueAtTime(240, when + 0.022);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(amp, when);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.026);
    osc.connect(g);
    g.connect(this.dryBus);
    osc.start(when);
    osc.stop(when + 0.03);
  }

  _woodCreak(when, fStart, fEnd, dur) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(fStart, when);
    osc.frequency.linearRampToValueAtTime(fEnd, when + dur);
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 520;
    bp.Q.value = 4.5;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.001, when);
    g.gain.linearRampToValueAtTime(0.035, when + dur * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(bp);
    bp.connect(g);
    g.connect(this.dryBus);
    osc.start(when);
    osc.stop(when + dur + 0.02);
  }

  _woodPipe(when, freq, dur, amp = 0.14) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq * 0.985, when);
    osc.frequency.exponentialRampToValueAtTime(freq, when + 0.025);
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = freq * 2.1;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(amp, when + 0.022);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(lp);
    lp.connect(g);
    g.connect(this.dryBus);
    g.connect(this.wetBus);
    osc.start(when);
    osc.stop(when + dur + 0.03);

    // Subtle pipe air chiff
    this._noiseWhoosh(when, freq * 1.5, 0.035, amp * 0.35);
  }

  _noiseWhoosh(when, centerFreq, dur, amp = 0.08) {
    if (!this.ctx || !this.noiseBuffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(centerFreq, when);
    bp.Q.value = 1.6;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.001, when);
    g.gain.linearRampToValueAtTime(amp, when + dur * 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.dryBus);
    src.start(when, Math.random() * 0.8, dur + 0.04);
  }
}
