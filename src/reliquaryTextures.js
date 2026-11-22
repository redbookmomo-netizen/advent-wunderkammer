// Procedural Textures & Live Composite Canvas for the 3D Pull-Out Curio Reliquaries:
// 1) LiveCurioStageCanvas — composites base door-XX.webp + live VitrineDioramaFX onto a 576x768 Three.js CanvasTexture
// 2) buildBackplateTexture — renders the riveted brass & parchment collector's lore inscription on the 180° back of the 3D box
// 3) buildCenterpieceParallaxTexture — soft vignette-feathered midground cutout for multi-plane 3D depth inside the glass box

import * as THREE from 'three';
import { ROMAN } from './adventData.js';
import { VitrineDioramaFX } from './dioramaFx.js';

export class LiveCurioComposite {
  constructor() {
    this.width = 576;
    this.height = 768;

    this.outCanvas = document.createElement('canvas');
    this.outCanvas.width = this.width;
    this.outCanvas.height = this.height;
    this.outCtx = this.outCanvas.getContext('2d');

    // Offscreen FX canvas (runs VitrineDioramaFX at 768x1024 and composites cleanly)
    this.fxCanvas = document.createElement('canvas');
    this.fx = new VitrineDioramaFX(this.fxCanvas);

    // Midground 3D pop-out parallax canvas (feathered center focal plane)
    this.midCanvas = document.createElement('canvas');
    this.midCanvas.width = 384;
    this.midCanvas.height = 512;
    this.midCtx = this.midCanvas.getContext('2d');

    this.texture = new THREE.CanvasTexture(this.outCanvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;

    this.midTexture = new THREE.CanvasTexture(this.midCanvas);
    this.midTexture.colorSpace = THREE.SRGBColorSpace;

    this.baseImage = null;
  }

  setCurio(info, loadedImg) {
    this.fx.setScene(info.fxType);
    this.baseImage = loadedImg || null;
    this._rebuildMidParallax();
    this.render(performance.now() / 1000, 0.016);
  }

  _rebuildMidParallax() {
    const W = this.midCanvas.width;
    const H = this.midCanvas.height;
    const ctx = this.midCtx;
    ctx.clearRect(0, 0, W, H);
    if (!this.baseImage || !this.baseImage.complete || !this.baseImage.naturalWidth) {
      this.midTexture.needsUpdate = true;
      return;
    }

    // Draw the central subject region and mask with a smooth elliptical feather
    // so floating it +4.5cm in front of the background creates luscious 3D peep-box depth!
    ctx.save();
    ctx.drawImage(this.baseImage, 0, 0, W, H);
    ctx.globalCompositeOperation = 'destination-in';
    const g = ctx.createRadialGradient(W * 0.5, H * 0.49, W * 0.12, W * 0.5, H * 0.49, W * 0.44);
    g.addColorStop(0, 'rgba(0,0,0,0.96)');
    g.addColorStop(0.62, 'rgba(0,0,0,0.68)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
    this.midTexture.needsUpdate = true;
  }

  setBaseImageWhenLoaded(img) {
    this.baseImage = img;
    this._rebuildMidParallax();
  }

  triggerBurst() {
    this.fx.triggerBurst();
  }

  addSpark(u, v) {
    this.fx.addTouchSpark(u, v);
  }

  render(time, dt) {
    const W = this.width;
    const H = this.height;
    const ctx = this.outCtx;

    if (this.baseImage && this.baseImage.complete && this.baseImage.naturalWidth) {
      ctx.drawImage(this.baseImage, 0, 0, W, H);
    } else {
      ctx.fillStyle = '#1a0c07';
      ctx.fillRect(0, 0, W, H);
    }

    this.fx.update(time, dt);
    ctx.drawImage(this.fxCanvas, 0, 0, W, H);
    this.texture.needsUpdate = true;
  }
}

// Wrap CJK + Latin text cleanly onto canvas lines
function wrapParagraph(ctx, text, maxWidth) {
  const lines = [];
  let line = '';
  for (const ch of text) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line.length > 0) {
      lines.push(line);
      line = ch;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function buildEngravedBackplateTexture(info) {
  const W = 576;
  const H = 768;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');

  // 1. Hand-rubbed Black Forest Burl Walnut outer back panel
  const wg = ctx.createRadialGradient(W * 0.5, H * 0.5, 40, W * 0.5, H * 0.5, H * 0.65);
  wg.addColorStop(0, '#462414');
  wg.addColorStop(0.7, '#29130a');
  wg.addColorStop(1, '#180a05');
  ctx.fillStyle = wg;
  ctx.fillRect(0, 0, W, H);

  // Subtle wood grain lines
  ctx.strokeStyle = 'rgba(255, 195, 130, 0.04)';
  ctx.lineWidth = 2;
  for (let y = 8; y < H; y += 9) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y + Math.sin(y * 0.05) * 4);
    ctx.stroke();
  }

  // Outer inlaid brass pinstripe
  ctx.strokeStyle = '#dfb765';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(22, 22, W - 44, H - 44);

  // 2. Riveted Cream-Parchment & Gilded Brass Collector's Plaque
  const px = 44, py = 48, pw = W - 88, ph = H - 96;
  const pg = ctx.createLinearGradient(px, py, px + pw, py + ph);
  pg.addColorStop(0, '#f7eed9');
  pg.addColorStop(0.55, '#efe0c0');
  pg.addColorStop(1, '#dec89e');
  ctx.fillStyle = pg;
  ctx.beginPath();
  ctx.roundRect(px, py, pw, ph, 18);
  ctx.fill();

  // Inner antique parchment vignette & double gold border
  ctx.strokeStyle = '#9e7430';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(px + 10, py + 10, pw - 20, ph - 20, 12);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(158, 116, 48, 0.45)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(px + 17, py + 17, pw - 34, ph - 34, 9);
  ctx.stroke();

  // Four sculpted brass corner rivets
  for (const [rx, ry] of [
    [px + 28, py + 28],
    [px + pw - 28, py + 28],
    [px + 28, py + ph - 28],
    [px + pw - 28, py + ph - 28]
  ]) {
    const rg = ctx.createRadialGradient(rx - 3, ry - 3, 1, rx, ry, 9);
    rg.addColorStop(0, '#fff2bc');
    rg.addColorStop(0.6, '#c89638');
    rg.addColorStop(1, '#6e4b14');
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(rx, ry, 8.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Top Horological Medallion Crest
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7c1d2c';
  ctx.font = '700 18px "Cormorant Garamond", Georgia, serif';
  const padDay = String(info.day).padStart(2, '0');
  ctx.fillText(`— NO. ${padDay} · ${ROMAN[info.day]} —`, W * 0.5, py + 62);

  ctx.fillStyle = '#26160c';
  ctx.font = '700 31px "Songti SC", "STSong", "Noto Serif SC", Georgia, serif';
  ctx.fillText(info.title, W * 0.5, py + 108);

  ctx.fillStyle = '#6b4f38';
  ctx.font = 'italic 18px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(info.subtitle, W * 0.5, py + 140);

  // Ornamental divider
  ctx.strokeStyle = '#b4883e';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(W * 0.24, py + 166);
  ctx.lineTo(W * 0.76, py + 166);
  ctx.stroke();
  ctx.fillStyle = '#b4883e';
  ctx.beginPath();
  ctx.arc(W * 0.5, py + 166, 4, 0, Math.PI * 2);
  ctx.fill();

  // 4.《黑森林守柜人冬夜博物手记》Body Copy
  ctx.fillStyle = '#7c1d2c';
  ctx.font = '600 19px "Songti SC", "Noto Serif SC", serif';
  ctx.fillText('《黑森林守柜人冬夜博物手记》', W * 0.5, py + 206);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#2d1c11';
  ctx.font = '400 22px "Songti SC", "STSong", "Noto Serif SC", serif';
  const bodyLines = wrapParagraph(ctx, '　　' + info.lore, pw - 86);
  let cursorY = py + 254;
  for (const ln of bodyLines) {
    ctx.fillText(ln, px + 43, cursorY);
    cursorY += 37;
  }

  // Bottom horologist seal
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(107, 79, 56, 0.82)';
  ctx.font = 'italic 16px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('Johannessohn & Cie · Schwarzwald Wunderkammer · 1884', W * 0.5, py + ph - 38);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 4. Rich Procedural Black Forest Coffered Walnut & Brass Side-Cabinet Wall Texture (512 x 1024)
// Gives the 1-meter-deep 3D cabinet trunk unmistakable carved furniture volume when rotated!
export function buildCabinetSideWoodTexture() {
  const W = 512;
  const H = 1024;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');

  // Rich warm Black Forest walnut base
  const bg = ctx.createLinearGradient(0, 0, W, 0);
  bg.addColorStop(0, '#5a3018');
  bg.addColorStop(0.18, '#472310');
  bg.addColorStop(0.5, '#3b1c0c');
  bg.addColorStop(0.85, '#2b1307');
  bg.addColorStop(1, '#1f0d05');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Vertical burl wood grain streaks
  for (let x = 4; x < W; x += 6) {
    ctx.strokeStyle = x % 12 === 0 ? 'rgba(255, 182, 108, 0.065)' : 'rgba(18, 6, 2, 0.16)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    for (let y = 0; y <= H; y += 64) {
      ctx.lineTo(x + Math.sin(y * 0.018 + x * 0.07) * 5, y);
    }
    ctx.stroke();
  }

  // Outer carved stiles & brass border trim
  ctx.strokeStyle = '#c89846';
  ctx.lineWidth = 5;
  ctx.strokeRect(18, 18, W - 36, H - 36);
  ctx.strokeStyle = 'rgba(255, 224, 150, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, W - 52, H - 52);

  // Three recessed Baroque coffered panels with beveled brass frames & corner rosettes
  const panels = [
    [48, 52, W - 96, 265],
    [48, 352, W - 96, 320],
    [48, 706, W - 96, 266]
  ];

  for (const [px, py, pw, ph] of panels) {
    // Deep recessed walnut shadow bevel
    const pg = ctx.createRadialGradient(px + pw * 0.5, py + ph * 0.5, 20, px + pw * 0.5, py + ph * 0.5, pw * 0.72);
    pg.addColorStop(0, '#582e16');
    pg.addColorStop(0.7, '#35190a');
    pg.addColorStop(1, '#1d0b04');
    ctx.fillStyle = pg;
    ctx.fillRect(px, py, pw, ph);

    // Outer & inner gilded molding bevels
    ctx.strokeStyle = '#dda955';
    ctx.lineWidth = 4;
    ctx.strokeRect(px, py, pw, ph);

    ctx.strokeStyle = '#8d5d22';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(px + 14, py + 14, pw - 28, ph - 28);

    ctx.strokeStyle = 'rgba(255, 226, 158, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(px + 20, py + 20, pw - 40, ph - 40);

    // Corner gilded bosses
    for (const [cx, cy] of [
      [px + 14, py + 14],
      [px + pw - 14, py + 14],
      [px + 14, py + ph - 14],
      [px + pw - 14, py + ph - 14]
    ]) {
      ctx.fillStyle = '#f2cb78';
      ctx.beginPath();
      ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Center Panel Ornate Brass Diamond Escutcheon
  const mx = W * 0.5;
  const my = 512;
  ctx.fillStyle = '#d7a44e';
  ctx.beginPath();
  ctx.moveTo(mx, my - 46);
  ctx.lineTo(mx + 38, my);
  ctx.lineTo(mx, my + 46);
  ctx.lineTo(mx - 38, my);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#fff0b8';
  ctx.lineWidth = 2;
  ctx.stroke();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 5. Frosted Alpine Cedar-Shingle & Snow-Drift Chalet Roof Texture (512 x 512)
export function buildSnowRoofTexture() {
  const W = 512;
  const H = 512;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');

  // Dark weathered alpine cedar shingles + frosted snow blanket near front eave
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#3a2214');
  g.addColorStop(0.55, '#4b2d1b');
  g.addColorStop(0.82, '#8b888c');
  g.addColorStop(0.94, '#dce6f2');
  g.addColorStop(1, '#f4f8ff');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Shingle rows
  for (let y = 24; y < H * 0.86; y += 34) {
    ctx.strokeStyle = 'rgba(18, 8, 3, 0.48)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();

    const shift = (y / 34) % 2 === 0 ? 0 : 24;
    for (let x = shift; x < W; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, y - 34);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Frost dusting along shingle lips
    ctx.strokeStyle = 'rgba(225, 238, 255, 0.24)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y - 2);
    ctx.lineTo(W, y - 2);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

