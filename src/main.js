// Main Interactive Entry for "The Grand Advent Wunderkammer · 黑森林 24 格机械降临节秘柜"
// Handles responsive camera choreography, touch/mouse raycasting, Advent modes, UI & audio sync

import * as THREE from 'three';
import { ADVENT_BY_DAY, ROMAN } from './adventData.js';
import { MUSIC_REPERTOIRE } from './musicScores.js';
import { WunderkammerAudio } from './audio.js';
import { ATMOSPHERES, buildWunderkammerScene } from './cabinet3d.js';

const STORAGE_KEY = 'wunderkammer_state_v1';

const ATMO_ICONS = ['🔥 炉火雪夜', '🌌 极光圣咏', '🌅 晨曦金雾'];

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_) {}
}

function isAdventDayUnlockedByCalendar(day) {
  const now = new Date();
  const month = now.getMonth(); // 0 = Jan, 11 = Dec
  const date = now.getDate();
  if (month === 11) {
    return date >= day;
  }
  // In January, keep December's Advent unlocked; before December, locked in strict mode
  return month === 0;
}

function initApp() {
  const canvas = document.getElementById('wunderkammer-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.16;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(ATMOSPHERES[0].bg);
  scene.fog = new THREE.FogExp2(ATMOSPHERES[0].fog, 0.028);

  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.15, 45);

  const world = buildWunderkammerScene(scene);
  const audio = new WunderkammerAudio();
  audio.onNoteCallback = () => world.pulseMusicNote();

  // Persistent state
  const saved = loadSavedState();
  let freePlayMode = saved?.freePlayMode ?? true; // Default true so anyone can play immediately!
  let atmoIndex = saved?.atmoIndex ?? 0;
  let openedDays = new Set(Array.isArray(saved?.openedDays) ? saved.openedDays : []);
  let focusDay = null;
  let belfryCameraFocus = false;
  let cascadeTimers = [];

  // Apply initial state
  world.setAtmosphere(atmoIndex);
  openedDays.forEach((d) => {
    if (world.compartments[d]) {
      world.compartments[d].isOpen = true;
      world.compartments[d].openProgress = 1;
    }
  });

  // ==================== UI ELEMENTS ====================
  const modeBtn = document.getElementById('mode-btn');
  const atmoBtn = document.getElementById('atmo-btn');
  const muteBtn = document.getElementById('mute-btn');
  const toastEl = document.getElementById('toast-banner');

  const bottomDock = document.getElementById('bottom-dock');
  const playBtn = document.getElementById('play-btn');
  const openSheetBtn = document.getElementById('open-sheet-btn');
  const nextTrackBtn = document.getElementById('next-track-btn');
  const currentTrackTitle = document.getElementById('current-track-title');
  const currentTrackIdx = document.getElementById('current-track-idx');

  const finderBtn = document.getElementById('finder-btn');
  const progressCountEl = document.getElementById('progress-count');
  const finaleBtn = document.getElementById('finale-btn');
  const allDoorsBtn = document.getElementById('all-doors-btn');

  const repertoireSheet = document.getElementById('repertoire-sheet');
  const closeSheetBtn = document.getElementById('close-sheet-btn');
  const trackListEl = document.getElementById('track-list');

  const inspectorEl = document.getElementById('curio-inspector');
  const curioBadge = document.getElementById('curio-badge');
  const curioTitle = document.getElementById('curio-title');
  const curioGerman = document.getElementById('curio-german');
  const curioSummary = document.getElementById('curio-summary');
  const loreParchment = document.getElementById('lore-parchment');
  const loreText = document.getElementById('lore-text');
  const curioActionBtn = document.getElementById('curio-action-btn');
  const loreToggleBtn = document.getElementById('lore-toggle-btn');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const prevDayBtn = document.getElementById('prev-day-btn');
  const nextDayBtn = document.getElementById('next-day-btn');
  const shutDoorBtn = document.getElementById('shut-door-btn');

  let toastTimer = null;
  function showToast(msg, ms = 2900) {
    toastEl.textContent = msg;
    toastEl.classList.add('visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('visible'), ms);
  }

  function persist() {
    saveState({
      freePlayMode,
      atmoIndex,
      openedDays: Array.from(openedDays)
    });
  }

  function syncHud() {
    modeBtn.textContent = freePlayMode ? '🗝️ 全开把玩' : '📅 降临日历锁';
    modeBtn.classList.toggle('active-gold', freePlayMode);
    atmoBtn.textContent = ATMO_ICONS[atmoIndex % ATMO_ICONS.length];
    muteBtn.textContent = audio.muted ? '🔇 静音' : '🔊 声效';

    const piece = audio.getCurrentPiece();
    playBtn.textContent = audio.playing ? '⏸ 奏鸣中' : '▶ 八音奏鸣';
    currentTrackTitle.textContent = piece.title;
    currentTrackIdx.textContent = `(${audio.trackIndex + 1}/${MUSIC_REPERTOIRE.length} · 选曲 ▾)`;

    const openTotal = openedDays.size;
    progressCountEl.textContent = `${openTotal}/24`;
    allDoorsBtn.textContent = openTotal >= 24 ? '🚪 全柜合拢' : '🚪 全柜盛开';

    // Sync repertoire list highlight
    const items = trackListEl.querySelectorAll('.track-item');
    items.forEach((btn, idx) => {
      btn.classList.toggle('current', idx === audio.trackIndex);
    });
  }

  // Populate 8-piece Repertoire List
  MUSIC_REPERTOIRE.forEach((piece, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'track-item';
    btn.innerHTML = `
      <div>
        <div><strong>${idx + 1}. ${piece.title}</strong></div>
        <small>${piece.subtitle}</small>
      </div>
      <small>${piece.composer}</small>
    `;
    btn.addEventListener('click', () => {
      audio.setTrack(idx, true);
      repertoireSheet.classList.remove('open');
      syncHud();
      showToast(`♪ 正在奏鸣：${piece.title}`);
    });
    trackListEl.appendChild(btn);
  });

  // ==================== CAMERA ORBIT & FOCUS CHOREOGRAPHY ====================
  let orbitYaw = 0;
  let orbitPitch = 0.02;
  let targetYaw = 0;
  let targetPitch = 0.02;
  let zoomFactor = 1.0;
  let targetZoomFactor = 1.0;

  const camPos = new THREE.Vector3(0, 0.55, 13.5);
  const camTarget = new THREE.Vector3(0, 0.52, 0);
  const desiredPos = new THREE.Vector3();
  const desiredTarget = new THREE.Vector3();

  function getOverviewDistance() {
    const aspect = Math.max(0.38, window.innerWidth / Math.max(1, window.innerHeight));
    return Math.max(12.8, 6.85 / aspect);
  }

  function computeCameraDesired() {
    const aspect = Math.max(0.38, window.innerWidth / Math.max(1, window.innerHeight));
    const isPortrait = aspect < 0.82;
    const loreOpen = loreParchment.classList.contains('open');

    if (focusDay && world.compartments[focusDay]) {
      const comp = world.compartments[focusDay];
      const isTall = comp.info.rowSpan === 2;
      const isDrawer = comp.info.hinge === 'drawer';

      if (isDrawer) {
        // Cozy 3/4 vitrine angle into the drop-front crimson velvet drawer stage!
        const d = isPortrait ? 2.18 : 1.90;
        const targetDrop = isPortrait ? (loreOpen ? -0.46 : -0.28) : -0.16;
        desiredTarget.set(comp.center.x, comp.center.y + targetDrop, 0.22);
        desiredPos.set(
          comp.center.x + Math.sin(targetYaw * 0.45) * 0.42,
          comp.center.y + 0.36 + targetPitch * 0.3,
          0.25 + d
        );
        world.focusCurioLight.position.set(comp.center.x + 0.15, comp.center.y + 0.45, 0.85);
        world.focusCurioLight.intensity = 2.55;
        return;
      }

      const baseDist = isPortrait
        ? (1.76 / Math.min(0.75, Math.max(0.44, aspect))) * (isTall ? 1.28 : 1.0)
        : isTall ? 2.85 : 2.15;

      const loreShift = loreOpen ? -0.22 : 0;
      const yOffset = (isPortrait ? (isTall ? -0.34 : -0.28) : (isTall ? -0.20 : -0.15)) + loreShift;
      const zFocus = -0.12;

      desiredTarget.set(comp.center.x, comp.center.y + yOffset, zFocus);
      desiredPos.set(
        comp.center.x + Math.sin(targetYaw * 0.45) * 0.55,
        comp.center.y + (isPortrait ? -0.14 : 0.04) + loreShift * 0.7 + targetPitch * 0.4,
        zFocus + baseDist
      );

      world.focusCurioLight.position.set(comp.center.x + 0.18, comp.center.y + 0.22, 0.65);
      world.focusCurioLight.intensity = 2.4;
      return;
    }

    if (belfryCameraFocus) {
      const d = isPortrait ? 5.2 : 4.2;
      desiredTarget.set(0, 2.75, -0.05);
      desiredPos.set(Math.sin(targetYaw * 0.4) * 0.6, 2.85, d);
      world.focusCurioLight.position.set(0, 3.1, 1.2);
      world.focusCurioLight.intensity = 2.4;
      return;
    }

    // Full Cabinet Hero Overview
    const dist = getOverviewDistance() * zoomFactor;
    desiredTarget.set(0, 0.52, -0.08);
    desiredPos.set(
      Math.sin(orbitYaw) * dist,
      0.52 + Math.sin(orbitPitch) * dist * 0.55,
      Math.cos(orbitYaw) * dist
    );
    world.focusCurioLight.intensity = 0.65;
  }

  // Snap camera immediately on startup
  computeCameraDesired();
  camPos.copy(desiredPos);
  camTarget.copy(desiredTarget);

  // ==================== COMPARTMENT & CURIO ACTIONS ====================
  function openInspectorForDay(day) {
    const info = ADVENT_BY_DAY[day];
    if (!info) return;
    focusDay = day;
    belfryCameraFocus = false;
    repertoireSheet.classList.remove('open');

    const padNum = String(day).padStart(2, '0');
    curioBadge.textContent = `No. ${padNum} · ${ROMAN[day]}`;
    curioTitle.textContent = info.title;
    curioGerman.textContent = info.german;
    curioSummary.textContent = info.summary;
    loreText.textContent = info.lore;
    curioActionBtn.textContent = info.actionLabel;

    loreParchment.classList.remove('open');
    loreToggleBtn.textContent = '📜 展开守柜人手记';

    bottomDock.classList.add('hidden');
    inspectorEl.classList.add('visible');
  }

  function zoomOutToCabinet() {
    focusDay = null;
    belfryCameraFocus = false;
    inspectorEl.classList.remove('visible');
    bottomDock.classList.remove('hidden');
  }

  function clearCascadeTimers() {
    cascadeTimers.forEach((t) => clearTimeout(t));
    cascadeTimers = [];
  }

  function trySelectDoor(day, { fromNav = false } = {}) {
    const comp = world.compartments[day];
    if (!comp) return;

    // Check strict Advent calendar lock if Free-Play is OFF
    if (!freePlayMode && !isAdventDayUnlockedByCalendar(day)) {
      audio.playSfx('locked');
      world.highlightDoor(day, 2.5);
      showToast(`🔒 第 ${day} 格将于 12 月 ${day} 日开启 · 点右上角「全开把玩」可提前把玩`);
      return;
    }

    if (!comp.isOpen) {
      comp.isOpen = true;
      openedDays.add(day);
      persist();
      syncHud();

      if (day === 24) {
        audio.playSfx('finale');
        world.triggerBelfryFinale(8.5);
        if (!audio.playing) {
          audio.startMusic();
          syncHud();
        }
      } else {
        audio.playSfx(comp.info.hinge === 'drawer' ? 'drawerOpen' : 'doorOpen');
      }
      comp.curio.triggerBurst();
      openInspectorForDay(day);
    } else if (focusDay === day && !fromNav) {
      // Already zoomed in on this door: trigger its curio toy!
      comp.curio.triggerBurst();
      audio.playSfx(comp.info.sfx);
    } else {
      openInspectorForDay(day);
      comp.curio.triggerBurst();
      audio.playSfx(comp.info.sfx);
    }
  }

  // ==================== BUTTON LISTENERS ====================
  modeBtn.addEventListener('click', () => {
    audio.unlock();
    freePlayMode = !freePlayMode;
    persist();
    syncHud();
    showToast(
      freePlayMode
        ? '🗝️ 已开启「守柜人全开把玩模式」：全部 24 扇机关门均可自由推开'
        : '📅 已切换至「真实降临节日历锁」：按 12 月 1–24 日逐夜解锁'
    );
  });

  atmoBtn.addEventListener('click', () => {
    audio.unlock();
    atmoIndex = (atmoIndex + 1) % ATMOSPHERES.length;
    const atmo = world.setAtmosphere(atmoIndex);
    persist();
    syncHud();
    showToast(`✨ 夜色氛围已切换至「${atmo.name}」`);
  });

  muteBtn.addEventListener('click', () => {
    audio.unlock();
    audio.setMuted(!audio.muted);
    syncHud();
  });

  playBtn.addEventListener('click', () => {
    const playing = audio.toggleMusic();
    syncHud();
    if (playing) {
      showToast(`♪ 八音机芯奏鸣：《${audio.getCurrentPiece().title}》`);
    }
  });

  openSheetBtn.addEventListener('click', () => {
    audio.unlock();
    repertoireSheet.classList.toggle('open');
  });

  closeSheetBtn.addEventListener('click', () => {
    repertoireSheet.classList.remove('open');
  });

  nextTrackBtn.addEventListener('click', () => {
    audio.unlock();
    const piece = audio.nextTrack();
    if (!audio.playing) audio.startMusic();
    syncHud();
    showToast(`♪ 切换曲目：《${piece.title}》`);
  });

  finderBtn.addEventListener('click', () => {
    audio.unlock();
    zoomOutToCabinet();
    let nextUnopened = null;
    for (let d = 1; d <= 24; d++) {
      if (!openedDays.has(d)) {
        nextUnopened = d;
        break;
      }
    }
    if (nextUnopened === null) {
      world.highlightDoor(24, 4.0);
      showToast('🌟 全部 24 格奇珍已尽数开启！可轻触第 24 号圣殿重温终章');
    } else {
      world.highlightDoor(nextUnopened, 4.5);
      audio.playSfx('crystal');
      showToast(`✨ 流萤已为你点亮第 ${nextUnopened} 号（${ROMAN[nextUnopened]}）暗门位置`);
    }
  });

  let belfryResetTimer = null;
  function activateGrandBelfry() {
    audio.unlock();
    zoomOutToCabinet();
    belfryCameraFocus = true;
    world.pullWeight(1);
    audio.playSfx('cuckoo');
    if (!audio.playing) {
      audio.startMusic();
      syncHud();
    }
    showToast('🔔 松果重锤上弦：顶阁布谷鸟与吹号天使正点报时！', 3800);
    if (belfryResetTimer) clearTimeout(belfryResetTimer);
    belfryResetTimer = setTimeout(() => {
      belfryCameraFocus = false;
    }, 5200);
  }

  finaleBtn.addEventListener('click', activateGrandBelfry);

  allDoorsBtn.addEventListener('click', () => {
    audio.unlock();
    clearCascadeTimers();
    zoomOutToCabinet();

    if (openedDays.size >= 24) {
      // Close all 24 doors neatly
      for (let d = 1; d <= 24; d++) {
        world.compartments[d].isOpen = false;
      }
      openedDays.clear();
      audio.playSfx('doorClose');
      persist();
      syncHud();
      showToast('🚪 已将 24 扇胡桃木暗门与丝绒抽屉轻声合拢');
    } else {
      // Cascading wave open 1 -> 24!
      freePlayMode = true;
      if (!audio.playing) audio.startMusic();
      for (let d = 1; d <= 24; d++) {
        const timer = setTimeout(() => {
          world.compartments[d].isOpen = true;
          world.compartments[d].curio.triggerBurst();
          openedDays.add(d);
          if (d % 5 === 1) audio.playSfx('crystal');
          if (d === 24) {
            world.triggerBelfryFinale(7.5);
            audio.playSfx('finale');
            persist();
            syncHud();
          } else {
            syncHud();
          }
        }, (d - 1) * 55);
        cascadeTimers.push(timer);
      }
      showToast('✨ 全柜盛开：24 座黑森林微缩机械奇观依次苏醒！', 3600);
    }
  });

  // Inspector controls
  zoomOutBtn.addEventListener('click', zoomOutToCabinet);

  curioActionBtn.addEventListener('click', () => {
    if (!focusDay) return;
    const comp = world.compartments[focusDay];
    if (comp) {
      comp.curio.triggerBurst();
      audio.playSfx(comp.info.sfx);
      if (focusDay === 24) world.triggerBelfryFinale(7.0);
    }
  });

  loreToggleBtn.addEventListener('click', () => {
    const isOpen = loreParchment.classList.toggle('open');
    loreToggleBtn.textContent = isOpen ? '📜 收起手记' : '📜 展开守柜人手记';
    audio.playSfx('page');
  });

  shutDoorBtn.addEventListener('click', () => {
    if (!focusDay) return;
    const comp = world.compartments[focusDay];
    if (comp) {
      comp.isOpen = false;
      openedDays.delete(focusDay);
      audio.playSfx('doorClose');
      persist();
      syncHud();
    }
    zoomOutToCabinet();
  });

  prevDayBtn.addEventListener('click', () => {
    const prev = focusDay ? ((focusDay - 2 + 24) % 24) + 1 : 1;
    trySelectDoor(prev, { fromNav: true });
  });

  nextDayBtn.addEventListener('click', () => {
    const next = focusDay ? (focusDay % 24) + 1 : 1;
    trySelectDoor(next, { fromNav: true });
  });

  // ==================== POINTER ORBIT, PINCH ZOOM & RAYCASTING ====================
  const raycaster = new THREE.Raycaster();
  const pointerNDC = new THREE.Vector2();
  const activePointers = new Map();
  let downPos = { x: 0, y: 0, time: 0 };
  let dragged = false;
  let lastPinchDist = 0;

  canvas.addEventListener('pointerdown', (e) => {
    audio.unlock();
    repertoireSheet.classList.remove('open');
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (activePointers.size === 1) {
      downPos = { x: e.clientX, y: e.clientY, time: performance.now() };
      dragged = false;
    } else if (activePointers.size === 2) {
      const pts = Array.from(activePointers.values());
      lastPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      dragged = true;
    }
  });

  window.addEventListener('pointermove', (e) => {
    if (!activePointers.has(e.pointerId)) return;
    const prev = activePointers.get(e.pointerId);
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointers.size === 2) {
      const pts = Array.from(activePointers.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (lastPinchDist > 0) {
        const delta = (lastPinchDist - dist) * 0.004;
        targetZoomFactor = THREE.MathUtils.clamp(targetZoomFactor + delta, 0.68, 1.25);
      }
      lastPinchDist = dist;
      dragged = true;
      return;
    }

    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 7) {
      dragged = true;
    }

    targetYaw = THREE.MathUtils.clamp(targetYaw - dx * 0.0042, -0.52, 0.52);
    targetPitch = THREE.MathUtils.clamp(targetPitch + dy * 0.0032, -0.22, 0.28);
  });

  window.addEventListener('pointerup', (e) => {
    const wasTracking = activePointers.has(e.pointerId);
    activePointers.delete(e.pointerId);
    if (activePointers.size < 2) lastPinchDist = 0;

    if (!wasTracking || dragged || performance.now() - downPos.time > 500) return;

    // Clean click/tap -> Raycast interactive 3D cabinet parts!
    const rect = canvas.getBoundingClientRect();
    pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointerNDC, camera);
    const hits = raycaster.intersectObjects(world.interactiveTargets, false);
    if (hits.length === 0) {
      // Tapping background outside cabinet while zoomed in gracefully returns to overview
      if (focusDay !== null || belfryCameraFocus) {
        zoomOutToCabinet();
      }
      return;
    }

    // Prefer visible door hit, or curio hit only if that compartment is already open!
    for (const hit of hits) {
      const ud = hit.object.userData;
      if (!ud) continue;

      if (ud.type === 'door') {
        trySelectDoor(ud.day);
        return;
      }
      if (ud.type === 'curio') {
        const comp = world.compartments[ud.day];
        if (comp && comp.openProgress > 0.5) {
          if (focusDay !== ud.day) {
            openInspectorForDay(ud.day);
          }
          comp.curio.triggerBurst();
          audio.playSfx(comp.info.sfx);
          return;
        }
      }
      if (ud.type === 'weight') {
        audio.playSfx('ratchet');
        setTimeout(() => activateGrandBelfry(), 220);
        return;
      }
      if (ud.type === 'finaleTrigger') {
        activateGrandBelfry();
        return;
      }
      if (ud.type === 'crank') {
        audio.playSfx('ratchet');
        const piece = audio.nextTrack();
        if (!audio.playing) audio.startMusic();
        syncHud();
        showToast(`⚙️ 摇动八音曲柄：切换至《${piece.title}》`);
        return;
      }
    }
  });

  canvas.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      targetZoomFactor = THREE.MathUtils.clamp(targetZoomFactor + e.deltaY * 0.0007, 0.68, 1.25);
    },
    { passive: false }
  );

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      repertoireSheet.classList.remove('open');
      zoomOutToCabinet();
    } else if (e.key === 'ArrowRight' && focusDay !== null) {
      trySelectDoor((focusDay % 24) + 1, { fromNav: true });
    } else if (e.key === 'ArrowLeft' && focusDay !== null) {
      trySelectDoor(((focusDay - 2 + 24) % 24) + 1, { fromNav: true });
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / Math.max(1, window.innerHeight);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  syncHud();

  // ==================== ANIMATION LOOP ====================
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, clock.getDelta());
    const elapsed = clock.elapsedTime;

    orbitYaw += (targetYaw - orbitYaw) * Math.min(1, dt * 7.5);
    orbitPitch += (targetPitch - orbitPitch) * Math.min(1, dt * 7.5);
    zoomFactor += (targetZoomFactor - zoomFactor) * Math.min(1, dt * 7.5);

    computeCameraDesired();
    const camLerp = Math.min(1, dt * 5.4);
    camPos.lerp(desiredPos, camLerp);
    camTarget.lerp(desiredTarget, camLerp);
    camera.position.copy(camPos);
    camera.lookAt(camTarget);

    world.update(elapsed, dt, audio.playing);
    renderer.render(scene, camera);
  }

  animate();

  // Expose programmatic API for automated visual verification & showcase
  window.__wunderkammer = {
    focusDay: (d) => trySelectDoor(d, { fromNav: true }),
    zoomOut: zoomOutToCabinet,
    openAllImmediate: () => {
      for (let d = 1; d <= 24; d++) {
        world.compartments[d].isOpen = true;
        world.compartments[d].openProgress = 1;
        openedDays.add(d);
      }
      world.triggerBelfryFinale(10);
      syncHud();
    },
    closeAllImmediate: () => {
      for (let d = 1; d <= 24; d++) {
        world.compartments[d].isOpen = false;
        world.compartments[d].openProgress = 0;
      }
      openedDays.clear();
      zoomOutToCabinet();
      syncHud();
    },
    setAtmosphere: (idx) => {
      atmoIndex = idx % ATMOSPHERES.length;
      world.setAtmosphere(atmoIndex);
      syncHud();
    }
  };
}

initApp();
