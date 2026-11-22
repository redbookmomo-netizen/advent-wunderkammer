// Dual Real-Time Living Artwork Optical & Particle Engine:
// 1) CabinetAmbientFX — animates the 1086x1448 main cabinet painting (window snow, hearth fire, clock second hand, fairy lights, cuckoo notes & firefly finder)
// 2) VitrineDioramaFX — animates each of the 24 high-res 768x1024 interior dioramas with bespoke scene-mapped physics & touch starlight

import { CABINET_WIDTH, CABINET_HEIGHT, FAIRY_LIGHT_SPOTS } from './adventData.js';

function drawFourPointStar(ctx, x, y, r, rot, color, alpha) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = Math.min(1, alpha);
  ctx.fillStyle = color;
  for (let k = 0; k < 2; k++) {
    ctx.beginPath();
    ctx.ellipse(0, 0, r, r * 0.14, (k * Math.PI) / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.24, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawRadialGlow(ctx, x, y, r, innerCol, outerCol, alpha = 1) {
  if (alpha <= 0.005 || r <= 0.5) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, alpha);
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, innerCol);
  g.addColorStop(1, outerCol);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ============================================================================
// 1. MAIN CABINET AMBIENT FX (1086 x 1448 Logical Space)
// ============================================================================
export class CabinetAmbientFX {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvas.width = CABINET_WIDTH;
    this.canvas.height = CABINET_HEIGHT;

    this.notePulse = 0;
    this.cuckooTimer = 0;
    this.finderRect = null;
    this.finderTimer = 0;

    // Window snowflakes (left leaded window x: 0..175, y: 0..975)
    this.windowSnow = Array.from({ length: 62 }, () => ({
      x: Math.random() * 172,
      y: Math.random() * 970,
      r: 1.4 + Math.random() * 3.1,
      vy: 28 + Math.random() * 46,
      seed: Math.random() * 20
    }));

    // Fireplace embers (right stone hearth x: 948..1084, y: 810..1065)
    this.hearthEmbers = Array.from({ length: 22 }, () => ({
      x: 958 + Math.random() * 118,
      y: 850 + Math.random() * 200,
      vy: 35 + Math.random() * 55,
      r: 1.5 + Math.random() * 2.6,
      phase: Math.random() * 10
    }));

    // Floating musical notes when cuckoo sings
    this.cuckooNotes = [];
  }

  pulseMusic() {
    this.notePulse = 1.0;
  }

  triggerCuckoo(duration = 4.2) {
    this.cuckooTimer = Math.max(this.cuckooTimer, duration);
    for (let i = 0; i < 6; i++) {
      this.cuckooNotes.push({
        x: 548 + (Math.random() - 0.5) * 34,
        y: 128,
        vx: (Math.random() - 0.5) * 32,
        vy: -36 - Math.random() * 26,
        life: 1.0,
        delay: i * 0.24,
        glyph: i % 2 === 0 ? '♪' : '♫'
      });
    }
  }

  highlightDoorRect(rect, duration = 4.2) {
    this.finderRect = rect;
    this.finderTimer = duration;
  }

  update(time, dt) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CABINET_WIDTH, CABINET_HEIGHT);

    this.notePulse = Math.max(0, this.notePulse - dt * 3.2);
    if (this.cuckooTimer > 0) this.cuckooTimer = Math.max(0, this.cuckooTimer - dt);
    if (this.finderTimer > 0) this.finderTimer = Math.max(0, this.finderTimer - dt);

    // 1. Left Parlor Window Falling Snow (clipped cleanly around cabinet left eave & column)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(182, 0);
    ctx.lineTo(182, 225);
    ctx.lineTo(106, 305);
    ctx.lineTo(132, 345);
    ctx.lineTo(175, 355);
    ctx.lineTo(175, 975);
    ctx.lineTo(0, 975);
    ctx.closePath();
    ctx.clip();

    for (const fl of this.windowSnow) {
      fl.y += fl.vy * dt;
      fl.x += Math.sin(time * 1.4 + fl.seed) * 14 * dt;
      if (fl.y > 978) {
        fl.y = -6;
        fl.x = Math.random() * 172;
      }
      if (fl.x > 176) fl.x = 2;
      if (fl.x < 0) fl.x = 172;

      ctx.fillStyle = `rgba(232, 244, 255, ${0.42 + (fl.r / 4.5) * 0.45})`;
      ctx.beginPath();
      ctx.arc(fl.x, fl.y, fl.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 2. Right Fireplace Flicker, Mantel Candles & Bell-Jar Breath (additive)
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const fireFlicker = 0.72 + Math.sin(time * 8.5) * 0.16 + Math.cos(time * 14.3) * 0.12;
    drawRadialGlow(ctx, 1022, 955, 165, 'rgba(255, 142, 42, 0.28)', 'rgba(255, 80, 10, 0)', fireFlicker);

    for (const em of this.hearthEmbers) {
      em.y -= em.vy * dt;
      em.x += Math.sin(time * 3.5 + em.phase) * 18 * dt;
      if (em.y < 815) {
        em.y = 1045;
        em.x = 960 + Math.random() * 115;
      }
      const alpha = Math.max(0, Math.min(1, (em.y - 815) / 180)) * 0.85;
      drawRadialGlow(ctx, em.x, em.y, em.r * 3.2, 'rgba(255, 220, 120, 0.95)', 'rgba(255, 95, 20, 0)', alpha);
    }

    // Mantelpiece candles (951, 492) & (979, 462) + Bell-Jar (965, 392)
    drawRadialGlow(ctx, 951, 492, 26, 'rgba(255, 220, 140, 0.55)', 'rgba(255, 140, 40, 0)', 0.8 + Math.sin(time * 9) * 0.2);
    drawRadialGlow(ctx, 979, 462, 28, 'rgba(255, 220, 140, 0.55)', 'rgba(255, 140, 40, 0)', 0.8 + Math.cos(time * 10.5) * 0.2);
    drawRadialGlow(ctx, 965, 392, 52, 'rgba(255, 215, 130, 0.36)', 'rgba(255, 160, 60, 0)', 0.65 + Math.sin(time * 2.4) * 0.28);

    // Left table Armillary candle (35, 888)
    drawRadialGlow(ctx, 35, 888, 28, 'rgba(255, 210, 125, 0.48)', 'rgba(255, 140, 40, 0)', 0.78 + Math.sin(time * 7.8) * 0.2);

    // 3. Twinkling Cabinet Fairy Bulbs + Central Mini Lantern (543, 952)
    FAIRY_LIGHT_SPOTS.forEach(([lx, ly, scale], idx) => {
      const wave = 0.55 + 0.45 * Math.sin(time * 2.8 + idx * 1.37);
      const r = (14 + this.notePulse * 6) * scale;
      const a = (0.28 + wave * 0.34 + this.notePulse * 0.22) * (idx === 0 ? 1.15 : 0.85);
      drawRadialGlow(ctx, lx, ly, r, 'rgba(255, 215, 125, 0.85)', 'rgba(255, 130, 30, 0)', a);
    });

    // 4. Sweeping Antique Gold Second Hand on Clock Dial (546, 246)
    const nowDate = new Date();
    const secs = nowDate.getSeconds() + nowDate.getMilliseconds() / 1000;
    const secAng = (secs / 60) * Math.PI * 2 - Math.PI / 2;

    ctx.globalCompositeOperation = 'source-over';
    ctx.save();
    ctx.translate(546, 246);
    ctx.rotate(secAng);
    ctx.strokeStyle = 'rgba(255, 228, 148, 0.92)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 3;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(58, 0);
    ctx.stroke();
    ctx.fillStyle = '#ffe599';
    ctx.beginPath();
    ctx.arc(0, 0, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Chime halo around clock & cuckoo when active
    if (this.cuckooTimer > 0) {
      ctx.globalCompositeOperation = 'lighter';
      const ringProg = (time * 1.6) % 1;
      ctx.strokeStyle = `rgba(255, 222, 140, ${(1 - ringProg) * 0.65})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(546, 246, 65 + ringProg * 42, 0, Math.PI * 2);
      ctx.stroke();
      drawRadialGlow(ctx, 548, 132, 54, 'rgba(255, 224, 140, 0.52)', 'rgba(255, 160, 50, 0)', 0.85);
    }

    // Floating musical notes from Cuckoo niche
    ctx.globalCompositeOperation = 'source-over';
    for (let i = this.cuckooNotes.length - 1; i >= 0; i--) {
      const n = this.cuckooNotes[i];
      if (n.delay > 0) {
        n.delay -= dt;
        continue;
      }
      n.x += n.vx * dt;
      n.y += n.vy * dt;
      n.life -= dt * 0.58;
      if (n.life <= 0) {
        this.cuckooNotes.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.min(1, n.life * 1.2);
      ctx.fillStyle = '#ffe59e';
      ctx.shadowColor = 'rgba(255, 180, 60, 0.9)';
      ctx.shadowBlur = 8;
      ctx.font = 'bold 22px Georgia, serif';
      ctx.fillText(n.glyph, n.x, n.y);
      ctx.restore();
    }

    // 5. Next-Door Firefly Finder Halo
    if (this.finderTimer > 0 && this.finderRect) {
      const [x1, y1, x2, y2] = this.finderRect;
      const cx = (x1 + x2) * 0.5;
      const cy = (y1 + y2) * 0.5;
      const rx = (x2 - x1) * 0.56;
      const ry = (y2 - y1) * 0.56;
      const fade = Math.min(1, this.finderTimer);

      ctx.globalCompositeOperation = 'lighter';
      drawRadialGlow(ctx, cx, cy, Math.max(rx, ry) * 1.45, 'rgba(255, 226, 140, 0.42)', 'rgba(255, 160, 40, 0)', fade);

      for (let f = 0; f < 4; f++) {
        const a = time * 3.4 + (f * Math.PI) / 2;
        const fx = cx + Math.cos(a) * rx;
        const fy = cy + Math.sin(a) * ry;
        drawFourPointStar(ctx, fx, fy, 14, time * 2, '#fff0b8', fade * 0.95);
      }
    }

    ctx.restore();
  }
}

// ============================================================================
// 2. CLOSE-UP VITRINE DIORAMA FX (768 x 1024 High-Res Artwork Space)
// ============================================================================
export class VitrineDioramaFX {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 768;
    this.height = 1024;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.fxType = 'crystal-rose';
    this.burst = 0;
    this.touchSparks = [];
    this.particles = [];
    this.comets = [];
    this._initParticles();
  }

  setScene(fxType) {
    this.fxType = fxType || 'crystal-rose';
    this.burst = 0.65;
    this.comets = [];
    this._initParticles();
  }

  triggerBurst() {
    this.burst = 1.0;
    if (this.fxType === 'comet-scope') {
      this.comets.push({ x: 0.88, y: 0.14, vx: -0.48, vy: 0.24, life: 1.0 });
    }
    for (let i = 0; i < 22; i++) {
      const ang = (i / 22) * Math.PI * 2 + Math.random() * 0.2;
      const spd = 60 + Math.random() * 150;
      this.touchSparks.push({
        x: this.width * 0.5,
        y: this.height * 0.48,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 25,
        r: 3 + Math.random() * 4,
        life: 1.0,
        color: i % 3 === 0 ? '#ffffff' : '#ffe299'
      });
    }
  }

  addTouchSpark(normX, normY) {
    const x = normX * this.width;
    const y = normY * this.height;
    for (let i = 0; i < 3; i++) {
      this.touchSparks.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 90,
        vy: (Math.random() - 0.5) * 90 - 30,
        r: 2.5 + Math.random() * 3.5,
        life: 0.95,
        color: Math.random() > 0.4 ? '#ffe49e' : '#b8eeff'
      });
    }
  }

  _initParticles() {
    this.particles = Array.from({ length: 68 }, (_, i) => ({
      u: Math.random(),
      v: Math.random(),
      r: 1.6 + Math.random() * 3.2,
      spd: 0.04 + Math.random() * 0.10,
      phase: Math.random() * Math.PI * 2 + i,
      a: Math.random() * Math.PI * 2
    }));
  }

  update(time, dt) {
    const ctx = this.ctx;
    const W = this.width;
    const H = this.height;
    ctx.clearRect(0, 0, W, H);

    if (this.burst > 0) {
      this.burst = Math.max(0, this.burst - dt * 0.52);
    }
    const boost = 1 + this.burst * 2.2;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    switch (this.fxType) {
      case 'crystal-rose': {
        // Twin lanterns + opalescent rose breath + diamond sparkles
        drawRadialGlow(ctx, W * 0.16, H * 0.34, 85, 'rgba(255,205,115,0.34)', 'rgba(255,140,40,0)', 0.8 + Math.sin(time * 7) * 0.2);
        drawRadialGlow(ctx, W * 0.84, H * 0.34, 85, 'rgba(255,205,115,0.34)', 'rgba(255,140,40,0)', 0.8 + Math.cos(time * 8) * 0.2);
        drawRadialGlow(ctx, W * 0.50, H * 0.48, 175, 'rgba(145,215,255,0.28)', 'rgba(220,140,255,0)', 0.65 + Math.sin(time * 2.6) * 0.25 + this.burst * 0.35);
        this._drawFloatingMotes(time, dt * boost, 0.24, 0.76, 0.22, 0.76, 'rgba(210,240,255,0.85)', true);
        break;
      }

      case 'orrery': {
        drawRadialGlow(ctx, W * 0.56, H * 0.44, 150, 'rgba(110,185,255,0.28)', 'rgba(255,190,80,0)', 0.75 + this.burst * 0.3);
        for (let i = 0; i < 6; i++) {
          const a = time * (0.9 + i * 0.22) * boost + i * 1.1;
          const rx = W * (0.14 + (i % 3) * 0.06);
          const ry = H * (0.06 + (i % 3) * 0.04);
          const px = W * 0.56 + Math.cos(a) * rx;
          const py = H * 0.45 + Math.sin(a) * ry;
          drawFourPointStar(ctx, px, py, 12 + (i % 2) * 5, a, '#ffe8a3', 0.85);
        }
        this._drawStarTwinkles(time, [[0.35,0.18],[0.50,0.16],[0.68,0.21],[0.44,0.27],[0.72,0.30]]);
        break;
      }

      case 'snow-owl': {
        drawRadialGlow(ctx, W * 0.26, H * 0.45, 78, 'rgba(255,198,105,0.38)', 'rgba(255,130,30,0)', 0.8 + Math.sin(time * 8.5) * 0.2);
        drawRadialGlow(ctx, W * 0.79, H * 0.45, 78, 'rgba(255,198,105,0.38)', 'rgba(255,130,30,0)', 0.8 + Math.cos(time * 9.2) * 0.2);
        // Amber owl eye glint
        const eyePulse = 0.45 + 0.55 * Math.pow(Math.sin(time * 2.2) * 0.5 + 0.5, 2) + this.burst * 0.4;
        drawRadialGlow(ctx, W * 0.50, H * 0.33, 28, 'rgba(255,215,110,0.55)', 'rgba(255,150,30,0)', eyePulse);
        this._drawSnowfall(time, dt * boost, 'rgba(235,245,255,0.82)');
        break;
      }

      case 'blue-butterflies': {
        drawRadialGlow(ctx, W * 0.50, H * 0.53, 155, 'rgba(70,195,255,0.34)', 'rgba(40,110,255,0)', 0.7 + Math.sin(time * 3) * 0.22 + this.burst * 0.35);
        // 3 Animated fluttering glowing blue morpho butterflies!
        for (let b = 0; b < 3; b++) {
          const tB = time * (0.85 + b * 0.18) * boost + b * 2.1;
          const bx = W * (0.50 + Math.cos(tB) * 0.24);
          const by = H * (0.42 + Math.sin(tB * 1.7) * 0.16);
          const wingSpan = 15 * (0.35 + 0.65 * Math.abs(Math.sin(time * 13 + b)));
          ctx.save();
          ctx.translate(bx, by);
          ctx.rotate(Math.sin(tB) * 0.35);
          ctx.fillStyle = 'rgba(110, 225, 255, 0.88)';
          ctx.beginPath();
          ctx.ellipse(-wingSpan * 0.55, 0, wingSpan, 9, -0.25, 0, Math.PI * 2);
          ctx.ellipse(wingSpan * 0.55, 0, wingSpan, 9, 0.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          drawRadialGlow(ctx, bx, by, 32, 'rgba(100,220,255,0.55)', 'rgba(50,130,255,0)', 0.85);
        }
        this._drawFloatingMotes(time, dt * boost, 0.18, 0.82, 0.25, 0.80, 'rgba(135,225,255,0.8)', false);
        break;
      }

      case 'moon-stag': {
        drawRadialGlow(ctx, W * 0.73, H * 0.16, 130, 'rgba(235,246,255,0.42)', 'rgba(160,205,255,0)', 0.85 + this.burst * 0.3);
        drawRadialGlow(ctx, W * 0.53, H * 0.38, 120, 'rgba(200,235,255,0.25)', 'rgba(140,190,255,0)', 0.6 + this.burst * 0.4);
        this._drawWaterRipples(time, 0.24, 0.78, 0.77, 0.90, 'rgba(195,232,255,0.42)');
        this._drawSnowfall(time, dt * boost, 'rgba(235,245,255,0.8)');
        break;
      }

      case 'botanical-book': {
        drawRadialGlow(ctx, W * 0.50, H * 0.56, 210, 'rgba(255,224,150,0.26)', 'rgba(255,170,60,0)', 0.75 + this.burst * 0.35);
        this._drawFloatingMotes(time, dt * boost, 0.16, 0.84, 0.28, 0.78, 'rgba(255,230,155,0.88)', true);
        break;
      }

      case 'nutcracker': {
        drawRadialGlow(ctx, W * 0.16, H * 0.36, 80, 'rgba(255,200,110,0.38)', 'rgba(255,130,30,0)', 0.8 + Math.sin(time * 9) * 0.2);
        drawRadialGlow(ctx, W * 0.84, H * 0.36, 80, 'rgba(255,200,110,0.38)', 'rgba(255,130,30,0)', 0.8 + Math.cos(time * 8.3) * 0.2);
        // Sweeping silver glint up the raised saber blade!
        const sweep = (time * 0.85 * boost) % 1;
        const sx = W * (0.25 + sweep * 0.14);
        const sy = H * (0.31 - sweep * 0.21);
        drawFourPointStar(ctx, sx, sy, 26, time * 2.5, '#ffffff', Math.sin(sweep * Math.PI) * 0.95);
        // Golden key glints
        drawFourPointStar(ctx, W * 0.72, H * 0.62, 18 + this.burst * 12, -time * 2, '#ffe599', 0.75 + Math.sin(time * 5) * 0.25);
        this._drawFloatingMotes(time, dt * boost, 0.2, 0.8, 0.15, 0.85, 'rgba(255,222,140,0.8)', false);
        break;
      }

      case 'ballerina': {
        // 12 flickering footlight candles along circular stage rim
        for (let c = 0; c < 12; c++) {
          const a = (c / 11) * Math.PI;
          const cx = W * (0.50 + Math.cos(a) * 0.31);
          const cy = H * (0.61 + Math.sin(a) * 0.055);
          const fl = 0.65 + 0.35 * Math.sin(time * 10 + c * 1.7);
          drawRadialGlow(ctx, cx, cy, 28, 'rgba(255,225,145,0.62)', 'rgba(255,145,40,0)', fl);
        }
        drawRadialGlow(ctx, W * 0.52, H * 0.44, 165, 'rgba(255,232,175,0.28)', 'rgba(255,180,90,0)', 0.75 + this.burst * 0.35);
        this._drawFloatingMotes(time, dt * boost, 0.26, 0.76, 0.24, 0.72, 'rgba(255,236,180,0.88)', true);
        break;
      }

      case 'workshop': {
        drawRadialGlow(ctx, W * 0.42, H * 0.26, 170, 'rgba(255,210,120,0.36)', 'rgba(255,150,40,0)', 0.85 + Math.sin(time * 6) * 0.12);
        this._drawFloatingMotes(time, dt * boost, 0.22, 0.82, 0.32, 0.76, 'rgba(255,215,120,0.9)', true);
        break;
      }

      case 'jewel-butterfly': {
        drawRadialGlow(ctx, W * 0.50, H * 0.45, 175, 'rgba(195,130,255,0.34)', 'rgba(90,150,255,0)', 0.72 + Math.sin(time * 3.2) * 0.24 + this.burst * 0.35);
        this._drawStarTwinkles(time * boost, [[0.38,0.38],[0.62,0.38],[0.43,0.48],[0.57,0.48],[0.50,0.43],[0.32,0.55],[0.68,0.55]], '#f2d4ff');
        this._drawFloatingMotes(time, dt * boost, 0.20, 0.80, 0.24, 0.74, 'rgba(225,185,255,0.85)', true);
        break;
      }

      case 'sky-balloon': {
        // Balloon burner warm pulse + twinkling hanging stars + drifting cloud mist
        drawRadialGlow(ctx, W * 0.48, H * 0.46, 68, 'rgba(255,195,95,0.52)', 'rgba(255,120,25,0)', 0.65 + Math.sin(time * 5.5) * 0.3 + this.burst * 0.35);
        this._drawStarTwinkles(time, [[0.23,0.52],[0.75,0.48],[0.82,0.38],[0.31,0.34]], '#ffeaa8');
        this._drawFloatingMotes(time, dt * boost, 0.12, 0.88, 0.18, 0.78, 'rgba(255,242,205,0.75)', false);
        break;
      }

      case 'carousel': {
        // Chasing marquee lights along canopy + Venetian canal water reflections!
        for (let i = 0; i < 10; i++) {
          const u = 0.36 + (i / 9) * 0.50;
          const v = 0.37 + Math.sin((i / 9) * Math.PI) * 0.02;
          const chase = 0.4 + 0.6 * Math.pow(Math.sin(time * 5 * boost - i * 0.7) * 0.5 + 0.5, 2);
          drawRadialGlow(ctx, W * u, H * v, 24, 'rgba(255,230,150,0.75)', 'rgba(255,160,50,0)', chase);
        }
        this._drawWaterRipples(time * boost, 0.08, 0.48, 0.65, 0.84, 'rgba(255,210,125,0.45)');
        break;
      }

      case 'amethyst': {
        drawRadialGlow(ctx, W * 0.46, H * 0.44, 180, 'rgba(185,105,255,0.30)', 'rgba(110,45,200,0)', 0.7 + Math.sin(time * 2.5) * 0.2 + this.burst * 0.35);
        this._drawStarTwinkles(time * boost, [
          [0.34,0.36],[0.45,0.31],[0.56,0.35],[0.39,0.46],[0.51,0.44],[0.61,0.47],[0.31,0.51],[0.47,0.54],[0.74,0.54]
        ], '#f6ddff');
        break;
      }

      case 'nautilus-clock': {
        // Iridescent spiral sweep around chambered nautilus
        const ang = time * 1.4 * boost;
        const gx = W * (0.47 + Math.cos(ang) * 0.16);
        const gy = H * (0.50 + Math.sin(ang) * 0.16);
        drawRadialGlow(ctx, gx, gy, 115, 'rgba(185,245,255,0.36)', 'rgba(255,185,220,0)', 0.85);
        this._drawStarTwinkles(time * boost, [[0.58,0.48],[0.46,0.34],[0.33,0.45],[0.56,0.74],[0.64,0.75]], '#fff4d2');
        break;
      }

      case 'ship-bottle': {
        drawRadialGlow(ctx, W * 0.50, H * 0.51, 185, 'rgba(130,225,255,0.24)', 'rgba(60,150,220,0)', 0.75 + this.burst * 0.3);
        this._drawWaterRipples(time * boost, 0.22, 0.78, 0.53, 0.64, 'rgba(205,248,255,0.52)');
        drawFourPointStar(ctx, W * 0.72, H * 0.75, 16, time * 1.8, '#ffe6a3', 0.8);
        break;
      }

      case 'comet-scope': {
        // Spawn periodic shooting stars across the night observatory arch
        if (Math.random() < 0.025 * boost && this.comets.length < 3) {
          this.comets.push({
            x: 0.82 + Math.random() * 0.10,
            y: 0.13 + Math.random() * 0.10,
            vx: -0.38 - Math.random() * 0.16,
            vy: 0.18 + Math.random() * 0.08,
            life: 1.0
          });
        }
        for (let i = this.comets.length - 1; i >= 0; i--) {
          const c = this.comets[i];
          c.x += c.vx * dt;
          c.y += c.vy * dt;
          c.life -= dt * 0.85;
          if (c.life <= 0 || c.x < 0.42) {
            this.comets.splice(i, 1);
            continue;
          }
          const grad = ctx.createLinearGradient(c.x * W, c.y * H, (c.x - c.vx * 0.28) * W, (c.y - c.vy * 0.28) * H);
          grad.addColorStop(0, `rgba(255,255,255,${c.life})`);
          grad.addColorStop(0.4, `rgba(145,215,255,${c.life * 0.65})`);
          grad.addColorStop(1, 'rgba(100,170,255,0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(c.x * W, c.y * H);
          ctx.lineTo((c.x - c.vx * 0.28) * W, (c.y - c.vy * 0.28) * H);
          ctx.stroke();
          drawFourPointStar(ctx, c.x * W, c.y * H, 18, time * 3, '#ffffff', c.life);
        }
        drawRadialGlow(ctx, W * 0.50, H * 0.65, 58, 'rgba(255,210,120,0.45)', 'rgba(255,140,30,0)', 0.8 + Math.sin(time * 9) * 0.2);
        this._drawStarTwinkles(time, [[0.58,0.18],[0.74,0.22],[0.65,0.29],[0.81,0.31]], '#d8f0ff');
        break;
      }

      case 'robin-post': {
        const swing = Math.sin(time * 2.4) * 0.02;
        drawRadialGlow(ctx, W * (0.70 + swing), H * 0.26, 125, 'rgba(255,212,125,0.46)', 'rgba(255,145,35,0)', 0.88);
        drawRadialGlow(ctx, W * 0.61, H * 0.50, 42, 'rgba(255,95,95,0.42)', 'rgba(255,180,80,0)', 0.7 + Math.sin(time * 5) * 0.3);
        this._drawFloatingMotes(time, dt * boost, 0.15, 0.85, 0.18, 0.82, 'rgba(255,228,165,0.82)', false);
        break;
      }

      case 'gingerbread-hearth': {
        // Roaring stove flames + gingerbread cottage glow + curling hot cocoa steam!
        const flk = 0.75 + Math.sin(time * 10) * 0.16 + Math.cos(time * 15) * 0.1 + this.burst * 0.35;
        drawRadialGlow(ctx, W * 0.39, H * 0.55, 135, 'rgba(255,155,45,0.48)', 'rgba(255,75,10,0)', flk);
        drawRadialGlow(ctx, W * 0.66, H * 0.64, 72, 'rgba(255,215,120,0.44)', 'rgba(255,150,40,0)', 0.85);
        // Rising hot cocoa steam wisps from mug (0.18, 0.64)
        ctx.globalCompositeOperation = 'source-over';
        for (let s = 0; s < 5; s++) {
          const prog = (time * 0.42 + s * 0.2) % 1;
          const sx = W * (0.18 + Math.sin(prog * 6 + s) * 0.028);
          const sy = H * (0.63 - prog * 0.18);
          drawRadialGlow(ctx, sx, sy, 16 + prog * 26, 'rgba(255,248,238,0.28)', 'rgba(255,248,238,0)', (1 - prog) * 0.85);
        }
        ctx.globalCompositeOperation = 'lighter';
        this._drawFloatingMotes(time, dt * boost, 0.28, 0.52, 0.42, 0.64, 'rgba(255,190,85,0.9)', false);
        break;
      }

      case 'snowflake-forge': {
        drawRadialGlow(ctx, W * 0.50, H * 0.49, 185, 'rgba(185,230,255,0.28)', 'rgba(255,205,120,0)', 0.75 + this.burst * 0.35);
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3 - Math.PI / 2;
          const sx = W * (0.50 + Math.cos(a) * 0.21);
          const sy = H * (0.49 + Math.sin(a) * 0.16);
          const tw = 0.45 + 0.55 * Math.pow(Math.sin(time * 3.5 * boost + i) * 0.5 + 0.5, 2);
          drawFourPointStar(ctx, sx, sy, 22, time + i, '#ffffff', tw);
        }
        this._drawFloatingMotes(time, dt * boost, 0.18, 0.82, 0.20, 0.80, 'rgba(225,245,255,0.85)', true);
        break;
      }

      case 'snowglobe': {
        // Contained spherical snowfall strictly inside the crystal globe!
        const cx = W * 0.50, cy = H * 0.46, rad = W * 0.34;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.clip();
        drawRadialGlow(ctx, cx, cy + 40, rad * 0.9, 'rgba(255,210,125,0.26)', 'rgba(120,180,255,0)', 0.8 + this.burst * 0.3);
        for (const p of this.particles) {
          p.v = (p.v + p.spd * dt * boost * 1.4) % 1;
          p.u = (p.u + Math.sin(time * 1.8 + p.phase) * 0.12 * dt * boost + 1) % 1;
          const px = cx - rad + p.u * rad * 2;
          const py = cy - rad + p.v * rad * 2;
          ctx.fillStyle = 'rgba(245, 250, 255, 0.86)';
          ctx.beginPath();
          ctx.arc(px, py, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        break;
      }

      case 'aurora-swan': {
        // Undulating emerald & violet polar aurora curtains + lake reflections
        for (let band = 0; band < 2; band++) {
          const col = band === 0 ? 'rgba(65, 240, 185, 0.22)' : 'rgba(175, 115, 255, 0.20)';
          ctx.fillStyle = col;
          ctx.beginPath();
          const baseY = H * (band === 0 ? 0.22 : 0.29);
          ctx.moveTo(W * 0.12, baseY);
          for (let x = W * 0.12; x <= W * 0.88; x += 24) {
            const wy = Math.sin(x * 0.015 + time * 1.6 * boost + band * 2) * 26;
            ctx.lineTo(x, baseY + wy);
          }
          ctx.lineTo(W * 0.88, H * 0.42);
          ctx.lineTo(W * 0.12, H * 0.42);
          ctx.closePath();
          ctx.fill();
        }
        this._drawWaterRipples(time * boost, 0.20, 0.80, 0.72, 0.92, 'rgba(95, 245, 200, 0.42)');
        break;
      }

      case 'clockwork-heart': {
        // Realistic double-pulse lub-dub crimson-gold heartbeat!
        const cycle = (time * (0.95 + this.burst * 0.6)) % 1;
        const lub = Math.exp(-Math.pow((cycle - 0.14) * 14, 2));
        const dub = Math.exp(-Math.pow((cycle - 0.34) * 16, 2)) * 0.78;
        const beat = lub + dub;
        drawRadialGlow(ctx, W * 0.50, H * 0.55, 145 + beat * 95, 'rgba(255, 75, 95, 0.52)', 'rgba(255, 165, 50, 0)', 0.45 + beat * 0.55);
        drawFourPointStar(ctx, W * 0.50, H * 0.55, 18 + beat * 24, time * 2, '#ffe6a3', 0.5 + beat * 0.5);
        this._drawFloatingMotes(time, dt * boost, 0.25, 0.75, 0.28, 0.82, 'rgba(255,195,120,0.85)', false);
        break;
      }

      case 'star-hourglass': {
        // Double-helix golden starlight stream swirling around the golden key!
        drawRadialGlow(ctx, W * 0.50, H * 0.44, 130, 'rgba(255,222,130,0.32)', 'rgba(255,160,40,0)', 0.8 + this.burst * 0.3);
        for (let i = 0; i < 48; i++) {
          const prog = ((i / 48) + time * 0.26 * boost) % 1;
          const strand = i % 2 === 0 ? 1 : -1;
          const env = Math.sin(prog * Math.PI);
          const x = W * (0.50 + strand * Math.sin(prog * Math.PI * 3.2 - time * 2.5) * 0.16 * env);
          const y = H * (0.20 + prog * 0.58);
          drawRadialGlow(ctx, x, y, 10, 'rgba(255,244,195,0.95)', 'rgba(255,175,55,0)', 0.85);
        }
        drawRadialGlow(ctx, W * 0.50, H * 0.77, 110, 'rgba(255,220,130,0.42)', 'rgba(255,150,35,0)', 0.85);
        break;
      }

      case 'cathedral-finale':
      default: {
        // Stained-glass rose window breath + twin belfry bell chime rings + 24K golden snow!
        drawRadialGlow(ctx, W * 0.50, H * 0.50, 165, 'rgba(255,215,125,0.36)', 'rgba(255,120,60,0)', 0.75 + Math.sin(time * 3) * 0.2 + this.burst * 0.3);
        drawRadialGlow(ctx, W * 0.50, H * 0.68, 120, 'rgba(255,225,140,0.42)', 'rgba(255,150,40,0)', 0.85);

        const ringP = (time * 1.3 * boost) % 1;
        for (const bx of [0.18, 0.82]) {
          ctx.strokeStyle = `rgba(255, 228, 148, ${(1 - ringP) * 0.65})`;
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.arc(W * bx, H * 0.50, 18 + ringP * 58, 0, Math.PI * 2);
          ctx.stroke();
        }
        this._drawSnowfall(time, dt * boost, 'rgba(255, 232, 165, 0.88)', true);
        break;
      }
    }

    // Interactive Finger Touch Sparkles
    for (let i = this.touchSparks.length - 1; i >= 0; i--) {
      const sp = this.touchSparks[i];
      sp.x += sp.vx * dt;
      sp.y += sp.vy * dt;
      sp.vy += 85 * dt;
      sp.life -= dt * 1.35;
      if (sp.life <= 0) {
        this.touchSparks.splice(i, 1);
        continue;
      }
      drawFourPointStar(ctx, sp.x, sp.y, sp.r * 3.2 * sp.life, time * 4 + i, sp.color, sp.life);
    }

    ctx.restore();
  }

  _drawSnowfall(time, dt, color, withStars = false) {
    const ctx = this.ctx, W = this.width, H = this.height;
    for (let i = 0; i < 52; i++) {
      const p = this.particles[i];
      p.v = (p.v + p.spd * dt * 1.1) % 1;
      p.u = (p.u + Math.sin(time * 1.3 + p.phase) * 0.08 * dt + 1) % 1;
      const x = p.u * W;
      const y = p.v * H;
      if (withStars && i % 5 === 0) {
        drawFourPointStar(ctx, x, y, p.r * 3.2, time * 1.5 + i, '#fff2c2', 0.78);
      } else {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  _drawFloatingMotes(time, dt, u1, u2, v1, v2, color, withCrossStars = false) {
    const ctx = this.ctx, W = this.width, H = this.height;
    for (let i = 0; i < 36; i++) {
      const p = this.particles[i];
      p.v = (p.v - p.spd * dt * 0.65 + 1) % 1;
      const u = u1 + ((p.u + Math.sin(time * 0.9 + p.phase) * 0.06 + 1) % 1) * (u2 - u1);
      const v = v1 + p.v * (v2 - v1);
      const tw = 0.35 + 0.65 * (Math.sin(time * 3.2 + p.phase) * 0.5 + 0.5);
      if (withCrossStars && i % 4 === 0) {
        drawFourPointStar(ctx, u * W, v * H, p.r * 3.6, time + i, '#ffffff', tw * 0.85);
      } else {
        drawRadialGlow(ctx, u * W, v * H, p.r * 3.2, color, 'rgba(255,255,255,0)', tw * 0.85);
      }
    }
  }

  _drawStarTwinkles(time, coords, color = '#ffffff') {
    const ctx = this.ctx, W = this.width, H = this.height;
    coords.forEach(([u, v], idx) => {
      const tw = Math.pow(Math.sin(time * 2.8 + idx * 1.6) * 0.5 + 0.5, 2);
      drawFourPointStar(ctx, u * W, v * H, 15 + tw * 12, time * 0.8 + idx, color, 0.3 + tw * 0.7);
    });
  }

  _drawWaterRipples(time, u1, u2, v1, v2, color) {
    const ctx = this.ctx, W = this.width, H = this.height;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    for (let i = 0; i < 14; i++) {
      const t = (i / 14 + time * 0.05) % 1;
      const y = (v1 + t * (v2 - v1)) * H;
      const cx = (u1 + ((Math.sin(i * 4.3) * 0.5 + 0.5)) * (u2 - u1)) * W;
      const halfLen = (12 + Math.sin(time * 3 + i) * 8) * (0.5 + t * 0.8);
      ctx.globalAlpha = Math.sin(t * Math.PI) * 0.75;
      ctx.beginPath();
      ctx.moveTo(cx - halfLen, y);
      ctx.lineTo(cx + halfLen, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}
