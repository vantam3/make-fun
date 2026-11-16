// Original synthesized bell, pluck and storm tones, created only after a gesture.
export function createAudio() {
  let context, muted = false;
  function unlock() { try { context ??= new AudioContext(); if (context.state === 'suspended') context.resume().catch(() => {}); } catch {} }
  function play(name) {
    if (!context || muted) return;
    const notes = { collect: [660,990], deliver: [440,660,880], stage: [330,440,660,880], win: [440,554,660,880,1108], hit: [110,72], loss: [220,165,110], warning: [180] }[name] || [];
    notes.forEach((freq, i) => {
      const o = context.createOscillator(), g = context.createGain(), t = context.currentTime + i * .09;
      o.type = name === 'hit' ? 'sawtooth' : 'sine'; o.frequency.setValueAtTime(freq,t);
      g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.065,t+.012); g.gain.exponentialRampToValueAtTime(.001,t+.4);
      o.connect(g); g.connect(context.destination); o.start(t); o.stop(t+.42);
    });
  }
  return { unlock, play, toggle() { muted = !muted; return muted; } };
}
