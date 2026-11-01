// Draws the title as a glowing dot-matrix display, a nod to the 8×8 LED matrix
// on the STM32 business card. Plain canvas; no dependencies.
const GLYPHS = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  I: ['01110', '00100', '00100', '00100', '00100', '00100', '01110'],
  J: ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  ' ': ['00', '00', '00', '00', '00', '00', '00']
};
const PAD = 2, GAP = 1, LINE_GAP = 2, ROWS = 7;

function layout(lines) {
  const lineWidth = line => [...line].reduce((w, ch, i) => w + GLYPHS[ch][0].length + (i ? GAP : 0), 0);
  const widths = lines.map(lineWidth);
  const cols = Math.max(...widths) + PAD * 2;
  const rows = lines.length * ROWS + (lines.length - 1) * LINE_GAP + PAD * 2;
  const lit = new Uint8Array(cols * rows);
  lines.forEach((line, li) => {
    let x = PAD + Math.floor((cols - PAD * 2 - widths[li]) / 2);
    const top = PAD + li * (ROWS + LINE_GAP);
    for (const ch of line) {
      const glyph = GLYPHS[ch];
      glyph.forEach((row, ry) => {
        for (let rx = 0; rx < row.length; rx++) if (row[rx] === '1') lit[(top + ry) * cols + x + rx] = 1;
      });
      x += glyph[0].length + GAP;
    }
  });
  return {cols, rows, lit};
}

export function initLedTitle(canvas, text = 'JESSE SILVA') {
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const glow = document.createElement('canvas');
  const start = performance.now();
  let grid = null, pitch = 0, dpr = 1, lastWidth = 0, raf = 0, visible = true;

  function resize() {
    const w = canvas.clientWidth;
    if (!w || w === lastWidth) return;
    lastWidth = w;
    // Narrow screens stack the words so each dot stays large enough to read.
    grid = layout(w < 560 ? text.split(' ') : [text]);
    pitch = w / grid.cols;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const h = pitch * grid.rows;
    canvas.style.height = `${h}px`;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const size = Math.max(4, Math.ceil(pitch * 2.6 * dpr));
    glow.width = glow.height = size;
    const g = glow.getContext('2d');
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255,196,120,.5)');
    grad.addColorStop(1, 'rgba(255,150,60,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    draw(performance.now());
  }

  function draw(now) {
    if (!grid) return;
    const t = reduced ? Infinity : (now - start) / 1000;
    const booted = t * 40; // columns powered on so far: a left-to-right boot sweep
    const sweep = t === Infinity ? -99 : (t * 16) % (grid.cols + 40) - 20; // passing highlight
    const r = pitch * 0.32, gs = glow.width / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    for (let y = 0; y < grid.rows; y++) {
      for (let x = 0; x < grid.cols; x++) {
        const cx = (x + 0.5) * pitch, cy = (y + 0.5) * pitch;
        const on = grid.lit[y * grid.cols + x] && x < booted;
        if (on) {
          const glint = Math.max(0, 1 - Math.abs(x - sweep) / 5);
          ctx.globalAlpha = 0.8 + 0.2 * glint;
          ctx.drawImage(glow, cx - gs / 2, cy - gs / 2, gs, gs);
          ctx.globalAlpha = 1;
          ctx.fillStyle = glint > 0.1
            ? `rgb(255,${Math.round(208 + 38 * glint)},${Math.round(138 + 100 * glint)})`
            : '#ffd08a';
        } else {
          ctx.fillStyle = '#231f1e';
        }
        ctx.beginPath();
        ctx.arc(cx, cy, on ? r : r * 0.82, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function loop(now) {
    draw(now);
    raf = visible && !reduced ? requestAnimationFrame(loop) : 0;
  }

  new ResizeObserver(resize).observe(canvas);
  // Stop animating while the title is scrolled out of view.
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !raf && !reduced) raf = requestAnimationFrame(loop);
  }).observe(canvas);
  resize();
  if (!reduced) raf = requestAnimationFrame(loop);
}
