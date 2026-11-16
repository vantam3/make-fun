export function axes(keys) {
  return { x: +(keys.has('KeyD') || keys.has('ArrowRight')) - +(keys.has('KeyA') || keys.has('ArrowLeft')),
    y: +(keys.has('KeyS') || keys.has('ArrowDown')) - +(keys.has('KeyW') || keys.has('ArrowUp')) };
}
export function createInput(canvas, onAction, onGesture, host = window) {
  const keys = new Set(); let down = false, aim = { x: 600, y: 400 };
  const codes = new Set(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','Enter','Escape','KeyP','KeyM']);
  host.addEventListener('keydown', e => {
    if (!codes.has(e.code) || e.target?.tagName === 'BUTTON' && ['Space','Enter'].includes(e.code)) return;
    e.preventDefault(); keys.add(e.code); onGesture();
    if (!e.repeat) {
      if (e.code === 'Enter') onAction('confirm');
      if (e.code === 'Escape' || e.code === 'KeyP') onAction('pause');
      if (e.code === 'KeyM') onAction('mute');
    }
  });
  host.addEventListener('keyup', e => keys.delete(e.code));
  host.addEventListener('blur', () => { keys.clear(); down = false; onAction('blur'); });
  canvas.addEventListener('pointermove', e => {
    const b = canvas.getBoundingClientRect(), scale = Math.min(b.width / 1200, b.height / 760);
    aim = { x: (e.clientX - b.left - (b.width - 1200 * scale) / 2) / scale,
      y: (e.clientY - b.top - (b.height - 760 * scale) / 2) / scale };
  });
  canvas.addEventListener('pointerdown', e => { if (e.button === 0) { down = true; onGesture(); } });
  host.addEventListener('pointerup', () => { down = false; });
  return { read: () => ({ ...axes(keys), aim, tether: down || keys.has('Space'), keyboardTether: keys.has('Space') }) };
}
