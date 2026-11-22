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
