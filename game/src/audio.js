// Synthesised WebAudio sounds — no audio files, no network.
// Sizzle (filtered noise), chop (thock), ding (serve), buzz (wrong), pop (pick).
export function createAudio() {
  let ctx = null;
  let muted = false;
  let sizzleNodes = null;

  function ensure() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        ctx = null;
      }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, gain, when) {
    const ac = ensure();
    if (!ac || muted) return;
    const t0 = ac.currentTime + (when || 0);
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain || 0.12, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(g).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  function noiseBurst(dur, filterFreq, gain) {
    const ac = ensure();
    if (!ac || muted) return;
    const len = Math.floor(ac.sampleRate * dur);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ac.createBufferSource();
    src.buffer = buf;
    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq;
    const g = ac.createGain();
    g.gain.value = gain;
    src.connect(filter).connect(g).connect(ac.destination);
    src.start();
  }

  return {
    unlock() { ensure(); },
    setMuted(m) { muted = m; this.stopSizzle(); },
    isMuted() { return muted; },
    pop() { tone(520, 0.08, 'triangle', 0.1); },
    chop() { noiseBurst(0.09, 900, 0.25); tone(180, 0.07, 'square', 0.06); },
    ding() { tone(880, 0.25, 'sine', 0.14); tone(1318, 0.35, 'sine', 0.1, 0.08); },
    levelup() { tone(523, 0.12, 'triangle', 0.12); tone(659, 0.12, 'triangle', 0.12, 0.09); tone(784, 0.28, 'triangle', 0.13, 0.18); },
    buzz() { tone(140, 0.22, 'sawtooth', 0.08); },
    plate() { tone(660, 0.1, 'triangle', 0.1); tone(990, 0.12, 'triangle', 0.08, 0.05); },
    startSizzle() {
      const ac = ensure();
      if (!ac || muted || sizzleNodes) return;
      const len = ac.sampleRate;
      const buf = ac.createBuffer(1, len, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
      const src = ac.createBufferSource();
      src.buffer = buf; src.loop = true;
      const filter = ac.createBiquadFilter();
      filter.type = 'highpass'; filter.frequency.value = 3000;
      const g = ac.createGain(); g.gain.value = 0.05;
      src.connect(filter).connect(g).connect(ac.destination);
      src.start();
      sizzleNodes = { src, g };
    },
    stopSizzle() {
      if (!sizzleNodes) return;
      try { sizzleNodes.src.stop(); } catch { /* already stopped */ }
      sizzleNodes = null;
    },
  };
}
