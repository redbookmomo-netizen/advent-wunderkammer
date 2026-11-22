// Procedural High-DPI PBR Textures, Marquetry Panels, Enamel Clock Dial & Rose Window
// Zero external images required — rendered crisp on HTML5 Canvas for Three.js

import * as THREE from 'three';
import { ROMAN } from './adventData.js';

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

export function createCabinetTextures() {
  const walnut = buildWalnutPair();
  const brass = buildBrassTexture();
  const velvet = buildVelvetTexture();
  const clockDial = buildClockDialTexture();
  const moonDisc = buildMoonDiscTexture();
  const roseWindow = buildRoseWindowTexture();
  const snowSprite = buildSnowflakeTexture();
  const glowSprite = buildGlowTexture();
  const frostedWindow = buildFrostedGothicWindowTexture();
  const lightBeamMap = buildSoftBeamTexture();
  const belfryDoorLeft = buildBelfryDoorTexture('left');
  const belfryDoorRight = buildBelfryDoorTexture('right');

  return {
    walnutMap: walnut.map,
    walnutBump: walnut.bump,
    brassMap: brass,
    velvetMap: velvet,
    clockDialMap: clockDial,
    moonDiscMap: moonDisc,
    roseWindowMap: roseWindow,
    snowSprite,
    glowSprite,
    frostedWindowMap: frostedWindow,
    lightBeamMap,
    belfryDoorLeft,
    belfryDoorRight
  };
}

function buildWalnutPair() {
  const w = 512, h = 512;
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');
  const bc = makeCanvas(w, h);
  const bctx = bc.getContext('2d');

  // Rich Black Forest aged walnut base
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#361f14');
  g.addColorStop(0.5, '#2b170e');
  g.addColorStop(1, '#3d2316');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, w, h);

  // Organic wood grain fibers + cathedral knots
  for (let y = 0; y < h; y += 2) {
    const wave = Math.sin(y * 0.032) * 14 + Math.cos(y * 0.011) * 22;
    const shade = Math.sin((y + wave) * 0.14) * 0.5 + 0.5;
    ctx.strokeStyle = shade > 0.5
      ? `rgba(78, 45, 26, ${0.14 + shade * 0.14})`
      : `rgba(18, 9, 5, ${0.18 + (1 - shade) * 0.16})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 16) {
      const dy = Math.sin(x * 0.025 + y * 0.015) * 4.5;
      if (x === 0) ctx.moveTo(x, y + dy);
      else ctx.lineTo(x, y + dy);
    }
    ctx.stroke();

    bctx.strokeStyle = shade > 0.5 ? 'rgba(165,165,165,0.22)' : 'rgba(90,90,90,0.22)';
    bctx.lineWidth = 1.4;
    bctx.beginPath();
    bctx.moveTo(0, y);
    bctx.lineTo(w, y);
    bctx.stroke();
  }

  // Subtle dark pores
  for (let i = 0; i < 900; i++) {
    const px = Math.random() * w;
    const py = Math.random() * h;
    ctx.fillStyle = 'rgba(14, 7, 4, 0.28)';
    ctx.fillRect(px, py, 1.5, 6 + Math.random() * 10);
  }

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;

  const bump = new THREE.CanvasTexture(bc);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;

  return { map, bump };
}

function buildBrassTexture() {
  const w = 256, h = 256;
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');

  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#e5c16c');
  g.addColorStop(0.45, '#cfa24b');
  g.addColorStop(1, '#eccb7c');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 420; i++) {
    const y = Math.random() * h;
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(255, 245, 210, 0.16)' : 'rgba(110, 76, 22, 0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y + (Math.random() - 0.5) * 3);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function buildVelvetTexture() {
  const w = 256, h = 256;
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');

  const rg = ctx.createRadialGradient(w * 0.5, h * 0.45, 16, w * 0.5, h * 0.5, w * 0.72);
  rg.addColorStop(0, '#7c1628');
  rg.addColorStop(0.6, '#520c19');
  rg.addColorStop(1, '#2b050d');
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, w, h);

  // Subtle diamond quilting lines
  ctx.strokeStyle = 'rgba(25, 3, 8, 0.35)';
  ctx.lineWidth = 1.5;
  const step = 64;
  for (let x = -w; x < w * 2; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + h, h);
    ctx.moveTo(x + h, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  // Velvet micro-nap shimmer
  for (let i = 0; i < 1800; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,190,200,0.04)' : 'rgba(0,0,0,0.08)';
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Bespoke inlaid marquetry & gilded cartouche plaque for each of the 24 doors/drawers
export function createDoorPanelTexture(dayInfo, leafSide = 'full') {
  const isTall = dayInfo.rowSpan === 2;
  const isDrawer = dayInfo.hinge === 'drawer';
  const w = 320;
  const h = isTall ? 640 : isDrawer ? 240 : 320;

  if (leafSide === 'left' || leafSide === 'right') {
    const halfW = w / 2;
    const full = createDoorPanelCanvasFull(dayInfo, w, h);
    const c = makeCanvas(halfW, h);
    const ctx = c.getContext('2d');
    ctx.drawImage(full, leafSide === 'left' ? 0 : halfW, 0, halfW, h, 0, 0, halfW, h);

    // Subtle gilded center meeting-stile trim
    ctx.strokeStyle = 'rgba(235, 198, 112, 0.58)';
    ctx.lineWidth = 2.2;
    const seamX = leafSide === 'left' ? halfW - 1.2 : 1.2;
    ctx.beginPath();
    ctx.moveTo(seamX, 14);
    ctx.lineTo(seamX, h - 14);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const fullCanvas = createDoorPanelCanvasFull(dayInfo, w, h);
  const tex = new THREE.CanvasTexture(fullCanvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createDoorPanelCanvasFull(dayInfo, w, h) {
  const isTall = dayInfo.rowSpan === 2;
  const isDrawer = dayInfo.hinge === 'drawer';
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');

  // Burl walnut background
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.45, w * 0.08, w * 0.5, h * 0.5, Math.max(w, h) * 0.72);
  bg.addColorStop(0, isTall ? '#5e231c' : '#4f2a19');
  bg.addColorStop(0.62, '#341a0f');
  bg.addColorStop(1, '#1e0e08');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Subtle wood swirls
  for (let i = 0; i < 48; i++) {
    const bx = Math.random() * w;
    const by = Math.random() * h;
    const br = 14 + Math.random() * 38;
    const sg = ctx.createRadialGradient(bx, by, 2, bx, by, br);
    sg.addColorStop(0, 'rgba(125, 70, 38, 0.16)');
    sg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  }

  // Recessed outer moulding shadow
  ctx.strokeStyle = 'rgba(10, 4, 2, 0.75)';
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, w - 14, h - 14);

  // Fine double brass marquetry inlay border
  const pad = 20;
  ctx.strokeStyle = '#dfb869';
  ctx.lineWidth = 2.6;
  ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);

  ctx.strokeStyle = 'rgba(223, 184, 105, 0.48)';
  ctx.lineWidth = 1.3;
  ctx.strokeRect(pad + 7, pad + 7, w - (pad + 7) * 2, h - (pad + 7) * 2);

  // Gothic arch tracery for top-row arch doors or #24 Sanctuary
  if (dayInfo.style === 'arch' || isTall) {
    ctx.save();
    ctx.strokeStyle = 'rgba(235, 198, 118, 0.72)';
    ctx.lineWidth = isTall ? 3.5 : 2.4;
    ctx.beginPath();
    const archBaseY = isTall ? h * 0.42 : h * 0.56;
    ctx.moveTo(pad + 10, h - pad - 10);
    ctx.lineTo(pad + 10, archBaseY);
    ctx.quadraticCurveTo(pad + 10, pad + 14, w * 0.5, pad + 12);
    ctx.quadraticCurveTo(w - pad - 10, pad + 14, w - pad - 10, archBaseY);
    ctx.lineTo(w - pad - 10, h - pad - 10);
    ctx.stroke();

    if (isTall) {
      // Radiant golden sunburst + rose window motif on #24 sanctuary doors
      const ry = h * 0.27;
      const rr = w * 0.24;
      for (let k = 0; k < 16; k++) {
        const a = (k * Math.PI * 2) / 16;
        ctx.strokeStyle = k % 2 === 0 ? 'rgba(245, 210, 128, 0.65)' : 'rgba(223, 184, 105, 0.35)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(w * 0.5 + Math.cos(a) * rr * 0.35, ry + Math.sin(a) * rr * 0.35);
        ctx.lineTo(w * 0.5 + Math.cos(a) * rr, ry + Math.sin(a) * rr);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(w * 0.5, ry, rr * 0.65, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Corner gold-leaf filigree flourishes
  const corners = [
    [pad + 14, pad + 14, 1, 1],
    [w - pad - 14, pad + 14, -1, 1],
    [pad + 14, h - pad - 14, 1, -1],
    [w - pad - 14, h - pad - 14, -1, -1]
  ];
  ctx.strokeStyle = 'rgba(232, 196, 115, 0.72)';
  ctx.lineWidth = 2;
  for (const [cx, cy, sx, sy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + sy * 22);
    ctx.quadraticCurveTo(cx, cy, cx + sx * 22, cy);
    ctx.stroke();
    ctx.fillStyle = '#e7c374';
    ctx.beginPath();
    ctx.arc(cx + sx * 5, cy + sy * 5, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Central Gilded Escutcheon Cartouche Plaque
  const cy = isTall ? h * 0.60 : h * 0.5;
  const rx = isDrawer ? w * 0.25 : w * 0.27;
  const ry = isDrawer ? h * 0.28 : isTall ? w * 0.22 : h * 0.23;

  // Plaque drop shadow
  ctx.fillStyle = 'rgba(10, 4, 2, 0.65)';
  ctx.beginPath();
  ctx.ellipse(w * 0.5, cy + 4, rx + 4, ry + 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Brushed brass medallion fill
  const pg = ctx.createLinearGradient(w * 0.5 - rx, cy - ry, w * 0.5 + rx, cy + ry);
  pg.addColorStop(0, '#f5dd98');
  pg.addColorStop(0.48, '#d4a64a');
  pg.addColorStop(1, '#9e7124');
  ctx.fillStyle = pg;
  ctx.beginPath();
  ctx.ellipse(w * 0.5, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();

  // Inner dark enamel ring for crisp high-legibility numeral contrast
  ctx.fillStyle = isTall ? '#4a1019' : '#23130b';
  ctx.beginPath();
  ctx.ellipse(w * 0.5, cy, rx - 6, ry - 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#f3d88c';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.ellipse(w * 0.5, cy, rx - 9, ry - 9, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Crisp gold serif Day Numeral + Roman subtitle
  ctx.fillStyle = '#fbe5a5';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const numFontSize = isTall ? Math.round(w * 0.16) : isDrawer ? Math.round(h * 0.28) : Math.round(w * 0.19);
  ctx.font = `700 ${numFontSize}px "Cormorant Garamond", "Baskerville", "Songti SC", Georgia, serif`;
  ctx.fillText(String(dayInfo.day), w * 0.5, cy - (isDrawer ? 1 : 5));

  if (!isDrawer) {
    ctx.fillStyle = 'rgba(238, 204, 128, 0.82)';
    ctx.font = `600 ${Math.round(numFontSize * 0.34)}px "Cormorant Garamond", Georgia, serif`;
    ctx.fillText(ROMAN[dayInfo.day], w * 0.5, cy + ry * 0.52);
  }

  return c;
}

function buildClockDialTexture() {
  const s = 512;
  const c = makeCanvas(s, s);
  const ctx = c.getContext('2d');
  const cx = s / 2, cy = s / 2, r = s * 0.46;

  // Kiln-fired cream enamel gradient
  const eg = ctx.createRadialGradient(cx - 25, cy - 30, 18, cx, cy, r);
  eg.addColorStop(0, '#fffaf0');
  eg.addColorStop(0.76, '#f2e5ca');
  eg.addColorStop(1, '#cfb991');
  ctx.fillStyle = eg;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Outer brass bezel & railroad minute track
  ctx.strokeStyle = '#b98b32';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 5, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#2b1b10';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 22, 0, Math.PI * 2);
  ctx.arc(cx, cy, r - 32, 0, Math.PI * 2);
  ctx.stroke();

  for (let m = 0; m < 60; m++) {
    const ang = (m * Math.PI * 2) / 60 - Math.PI / 2;
    const isHour = m % 5 === 0;
    ctx.strokeStyle = '#2b1b10';
    ctx.lineWidth = isHour ? 3.5 : 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ang) * (r - 32), cy + Math.sin(ang) * (r - 32));
    ctx.lineTo(cx + Math.cos(ang) * (r - 22), cy + Math.sin(ang) * (r - 22));
    ctx.stroke();
  }

  // Horological Roman numerals (with traditional IIII)
  const numerals = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  ctx.fillStyle = '#24150c';
  ctx.font = '700 34px "Cormorant Garamond", "Baskerville", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  numerals.forEach((num, idx) => {
    const ang = (idx * Math.PI * 2) / 12 - Math.PI / 2;
    const nr = r - 64;
    ctx.save();
    ctx.translate(cx + Math.cos(ang) * nr, cy + Math.sin(ang) * nr);
    ctx.rotate(ang + Math.PI / 2);
    ctx.fillText(num, 0, 0);
    ctx.restore();
  });

  // Inner gilt rosette & Black Forest horologist signature
  ctx.strokeStyle = 'rgba(185, 139, 50, 0.65)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.44, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#5a3d24';
  ctx.font = '600 15px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('JOHANNESSOHN & CIE', cx, cy - 38);
  ctx.font = 'italic 14px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('Schwarzwald · 1884', cx, cy + 44);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildMoonDiscTexture() {
  const s = 256;
  const c = makeCanvas(s, s);
  const ctx = c.getContext('2d');
  const cx = s / 2, cy = s / 2, r = s * 0.48;

  const lg = ctx.createRadialGradient(cx, cy, 8, cx, cy, r);
  lg.addColorStop(0, '#1c3c78');
  lg.addColorStop(0.7, '#0f224a');
  lg.addColorStop(1, '#081229');
  ctx.fillStyle = lg;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Gold stars
  ctx.fillStyle = '#f6dc92';
  for (let i = 0; i < 36; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = 18 + Math.random() * (r - 28);
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 1 + Math.random() * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Golden Full Moon & Silver Crescent opposite
  ctx.fillStyle = '#f5d273';
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.48, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#eef4ff';
  ctx.beginPath();
  ctx.arc(cx, cy + r * 0.48, 21, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f224a';
  ctx.beginPath();
  ctx.arc(cx + 8, cy + r * 0.48 - 4, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#dfb869';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildRoseWindowTexture() {
  const s = 512;
  const c = makeCanvas(s, s);
  const ctx = c.getContext('2d');
  const cx = s / 2, cy = s / 2, r = s * 0.47;

  ctx.fillStyle = '#0c0812';
  ctx.fillRect(0, 0, s, s);

  const colors = ['#d9384a', '#2c6be0', '#f0b23a', '#1fa37c', '#9d3be0', '#e85d35'];
  const petals = 12;
  for (let i = 0; i < petals; i++) {
    const a0 = (i * Math.PI * 2) / petals;
    const a1 = ((i + 1) * Math.PI * 2) / petals;
    const am = (a0 + a1) * 0.5;

    const g = ctx.createRadialGradient(cx, cy, r * 0.12, cx, cy, r);
    g.addColorStop(0, '#fff3c4');
    g.addColorStop(0.38, colors[i % colors.length]);
    g.addColorStop(0.82, colors[(i + 2) % colors.length]);
    g.addColorStop(1, '#160b18');

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r * 0.94, a0 + 0.03, a1 - 0.03);
    ctx.closePath();
    ctx.fill();

    // Outer lancet trefoil lobe
    ctx.fillStyle = colors[(i + 1) % colors.length];
    ctx.beginPath();
    ctx.arc(cx + Math.cos(am) * r * 0.72, cy + Math.sin(am) * r * 0.72, r * 0.16, 0, Math.PI * 2);
    ctx.fill();
  }

  // Dark lead came tracery
  ctx.strokeStyle = '#140e12';
  ctx.lineWidth = 6;
  for (let i = 0; i < petals; i++) {
    const a = (i * Math.PI * 2) / petals;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.stroke();
  }
  [0.24, 0.54, 0.88, 0.96].forEach((k) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r * k, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Glowing golden center star
  const cg = ctx.createRadialGradient(cx, cy, 2, cx, cy, r * 0.24);
  cg.addColorStop(0, '#ffffff');
  cg.addColorStop(0.55, '#ffd778');
  cg.addColorStop(1, '#c84b31');
  ctx.fillStyle = cg;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.22, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildFrostedGothicWindowTexture() {
  const w = 512, h = 768;
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');

  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#0b1936');
  g.addColorStop(0.55, '#16305c');
  g.addColorStop(1, '#264775');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Frost vignette around diamond leaded glass panes
  ctx.strokeStyle = 'rgba(180, 212, 245, 0.24)';
  ctx.lineWidth = 3;
  const step = 64;
  for (let x = -h; x < w + h; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + h * 0.65, h);
    ctx.moveTo(x + h * 0.65, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  // Frosted lower sill mist
  const fg = ctx.createLinearGradient(0, h * 0.65, 0, h);
  fg.addColorStop(0, 'rgba(195, 222, 250, 0)');
  fg.addColorStop(1, 'rgba(215, 235, 255, 0.42)');
  ctx.fillStyle = fg;
  ctx.fillRect(0, h * 0.65, w, h * 0.35);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildSnowflakeTexture() {
  const s = 64;
  const c = makeCanvas(s, s);
  const ctx = c.getContext('2d');
  const cx = s / 2, cy = s / 2;

  const g = ctx.createRadialGradient(cx, cy, 1, cx, cy, s * 0.48);
  g.addColorStop(0, 'rgba(255, 255, 255, 1)');
  g.addColorStop(0.45, 'rgba(232, 244, 255, 0.72)');
  g.addColorStop(1, 'rgba(210, 232, 255, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);

  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * 22, cy + Math.sin(a) * 22);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildGlowTexture() {
  const s = 128;
  const c = makeCanvas(s, s);
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 62);
  g.addColorStop(0, 'rgba(255, 246, 214, 1)');
  g.addColorStop(0.32, 'rgba(255, 205, 112, 0.62)');
  g.addColorStop(0.7, 'rgba(255, 152, 64, 0.18)');
  g.addColorStop(1, 'rgba(255, 130, 40, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildSoftBeamTexture() {
  const w = 256, h = 512;
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(w, h);
  const d = img.data;

  for (let y = 0; y < h; y++) {
    const v = y / (h - 1); // 0 top -> 1 bottom
    const vFade = Math.sin(Math.pow(v, 0.78) * Math.PI);
    const halfSpread = 0.24 + v * 0.24;
    for (let x = 0; x < w; x++) {
      const u = (x / (w - 1) - 0.5) / halfSpread;
      const hFade = Math.max(0, 1 - u * u);
      const alpha = Math.pow(hFade, 1.8) * Math.pow(Math.max(0, vFade), 1.35);
      const idx = (y * w + x) * 4;
      d[idx] = 255;
      d[idx + 1] = 255;
      d[idx + 2] = 255;
      d[idx + 3] = Math.round(alpha * 255);
    }
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildBelfryDoorTexture(side = 'left') {
  const w = 192, h = 240;
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#4f2918');
  bg.addColorStop(1, '#26120a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = '#e5be6d';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, w - 20, h - 20);

  // Gothic lancet arch grille tracery
  ctx.strokeStyle = 'rgba(242, 206, 122, 0.85)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(26, h - 24);
  ctx.lineTo(26, 92);
  ctx.quadraticCurveTo(26, 26, w * 0.5, 24);
  ctx.quadraticCurveTo(w - 26, 26, w - 26, 92);
  ctx.lineTo(w - 26, h - 24);
  ctx.closePath();
  ctx.stroke();

  // Golden sound-louvers + sunburst star
  ctx.strokeStyle = 'rgba(228, 188, 102, 0.55)';
  ctx.lineWidth = 2.2;
  for (let ly = 104; ly <= h - 38; ly += 16) {
    ctx.beginPath();
    ctx.moveTo(38, ly);
    ctx.lineTo(w - 38, ly);
    ctx.stroke();
  }

  ctx.fillStyle = '#f5d889';
  ctx.beginPath();
  ctx.arc(w * 0.5, 66, 12, 0, Math.PI * 2);
  ctx.fill();

  const seamX = side === 'left' ? w - 3 : 3;
  ctx.strokeStyle = '#f5d889';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(seamX, 8);
  ctx.lineTo(seamX, h - 8);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
