// Pure fixed-step rules. No browser, wall clock, randomness, or rendering.
export const WIDTH = 1200, HEIGHT = 760, STEP = 1 / 60;
export const STAGES = ['The waking shoal', 'The broken current', 'The last lantern'];
export const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
export function createState() {
  return { mode: 'title', time: 0, remaining: 180, stage: 0, delivered: 0, total: 0,
    score: 0, combo: 1, lastDelivery: -99, health: 5, invulnerable: 0,
    player: { x: 600, y: 530, angle: -Math.PI / 2 }, sanctuary: { x: 600, y: 340 },
    cargo: [], relics: [], pulses: [], pulseClock: 2.8, serial: 0,
    notice: 'Recover the light. Bring it home.', noticeTime: 5, events: [] };
}
export function start(s) { Object.assign(s, createState(), { mode: 'play' }); populate(s); }
export function transition(s, action) {
  if (action === 'confirm' && ['title', 'won', 'lost'].includes(s.mode)) start(s);
  else if (action === 'pause' && s.mode === 'play') s.mode = 'paused';
  else if ((action === 'pause' || action === 'confirm') && s.mode === 'paused') s.mode = 'play';
}
function populate(s) {
  s.relics = Array.from({ length: 8 }, (_, i) => {
    const a = i * Math.PI / 4 + s.stage * .29;
    return { id: s.serial++, x: 600 + Math.cos(a) * (265 + i % 2 * 90),
      y: 385 + Math.sin(a) * (175 + i % 2 * 65), phase: i * 1.7 };
  });
}
function say(s, text, event) {
  s.notice = text; s.noticeTime = 3; if (event) s.events.push(event);
}
export function step(s, dt, input = {}) {
  s.events = [];
  if (s.mode !== 'play') return;
  s.time += dt; s.remaining -= dt; s.noticeTime = Math.max(0, s.noticeTime - dt);
  s.invulnerable = Math.max(0, s.invulnerable - dt);
  const p = s.player;
  const mx = input.x || 0, my = input.y || 0, norm = Math.max(1, Math.hypot(mx, my));
  const speed = 185 - s.cargo.length * 20;
  p.x = clamp(p.x + mx / norm * speed * dt, 40, WIDTH - 40);
  p.y = clamp(p.y + my / norm * speed * dt, 120, HEIGHT - 65);
  if (mx || my) p.angle = Math.atan2(my, mx);
  s.sanctuary.x = 600 + Math.sin(s.time * .16) * (110 + s.stage * 25);
  s.sanctuary.y = 330 + Math.cos(s.time * .21) * 50;
  for (const r of s.relics) {
    r.x += Math.cos(s.time * .6 + r.phase) * 8 * dt;
    r.y += Math.sin(s.time * .7 + r.phase) * 6 * dt;
  }
  if (input.tether && s.cargo.length < 3) {
    const aim = input.keyboardTether ? p : (input.aim ?? p);
    const candidates = s.relics.filter(r => distance(p, r) < 115 && (input.keyboardTether || distance(aim, r) < 85));
    candidates.sort((a, b) => distance(a, aim) - distance(b, aim));
    const r = candidates[0];
    if (r) {
      const d = distance(r, p);
      r.x += (p.x - r.x) / Math.max(d, 1) * 190 * dt;
      r.y += (p.y - r.y) / Math.max(d, 1) * 190 * dt;
      s.tether = { x: r.x, y: r.y };
      if (d < 26) {
        s.cargo.push(r); s.relics = s.relics.filter(v => v !== r);
        say(s, s.cargo.length === 3 ? 'Hold full · return to the sanctuary' : 'Relic secured · keep salvaging or return', 'collect');
      }
    } else s.tether = null;
  } else s.tether = null;
  const sheltered = distance(p, s.sanctuary) < 72;
  if (sheltered && s.cargo.length) {
    const n = s.cargo.length;
    s.combo = s.time - s.lastDelivery < 18 ? Math.min(4, s.combo + 1) : 1;
    s.lastDelivery = s.time;
    s.score += n * 100 * s.combo + (n - 1) * 75;
    s.delivered += n; s.total += n; s.cargo = []; s.health = Math.min(5, s.health + 1);
    say(s, `Light delivered · +${n} relic${n > 1 ? 's' : ''} · hull repaired`, 'deliver');
    if (s.delivered >= s.stage + 3) {
      s.stage++;
      if (s.stage === 3) {
        s.mode = 'won'; s.score += Math.ceil(s.remaining) * 10 + s.health * 100;
        say(s, 'The sea remembers its stars.', 'win'); return;
      }
      s.delivered = 0; s.remaining += 25; s.pulses = []; s.pulseClock = 1.4; populate(s);
      say(s, `Stage ${s.stage + 1} · ${STAGES[s.stage]}`, 'stage');
    } else if (s.relics.length < 3) populate(s);
  }
  s.pulseClock -= dt;
  if (s.pulseClock <= 0) {
    // Telegraph at the skiff's current location: commit, then sail out of the ring.
    s.pulses.push({ x: p.x, y: p.y, age: -1.6, radius: 0, hit: false });
    s.pulseClock = 5.6 - s.stage * .8;
    s.events.push('warning');
  }
  for (const pulse of s.pulses) {
    pulse.age += dt;
    pulse.radius = Math.max(0, pulse.age * (115 + s.stage * 22));
    if (pulse.age >= 0 && !pulse.hit && !sheltered && s.invulnerable === 0 && Math.abs(distance(p, pulse) - pulse.radius) < 18) {
      pulse.hit = true; s.health--; s.combo = 1; s.invulnerable = 1.8;
      // A hit releases cargo back into the sea; it can be recovered.
      for (const [i, r] of s.cargo.entries()) { r.x = p.x + 35 + i * 20; r.y = p.y + 30; s.relics.push(r); }
      s.cargo = []; say(s, 'Storm strike · cargo scattered · seek shelter', 'hit');
    }
  }
  s.pulses = s.pulses.filter(v => v.age < 6);
  if (s.health <= 0 || s.remaining <= 0) {
    s.mode = 'lost'; say(s, s.health <= 0 ? 'The storm claimed your skiff.' : 'The lantern faded before dawn.', 'loss');
  }
}
