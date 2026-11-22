// Main 3D Spatial Controller for "The Grand Advent Wunderkammer · 黑森林 24 格机械降临节秘柜"
// Zero popup cards: camera dollies close to the 3D cabinet & pulls the 3D curio box out into your hands to spin 360°!

import * as THREE from 'three';
import { ADVENT_BY_DAY, ROMAN } from './adventData.js';
import { MUSIC_REPERTOIRE } from './musicScores.js';
import { WunderkammerAudio } from './audio.js';
import { createSpatialWunderkammer } from './spatialScene.js';

const STORAGE_KEY = 'wunderkammer_3d_spatial_v3';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function saveState(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (_) {}
}

function isUnlockedByCalendar(day) {
  const now = new Date();
  const month = now.getMonth();
  const date = now.getDate();
  if (month === 11) return date >= day;
  return month === 0;
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function initSpatialApp() {
  const canvas = document.getElementById('spatial-canvas');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.14;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0604);
  scene.fog = new THREE.FogExp2(0x0d0705, 0.022);

  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / Math.max(1, window.innerHeight), 0.12, 42);

  const spatial = createSpatialWunderkammer(scene);
  const audio = new WunderkammerAudio();
  audio.onNoteCallback = () => spatial.pulseMusic();

  // Persistent State
  const saved = loadState();
  let realDateLock = saved?.realDateLock ?? false;
  let openedDays = new Set(Array.isArray(saved?.openedDays) ? saved.openedDays : []);
  let exploredDays = new Set(Array.isArray(saved?.exploredDays) ? saved.exploredDays : Array.from(openedDays));
  let focusDay = null;
  let focusWasAlreadyOpen = false;
  let cascadeTimers = [];

  openedDays.forEach((d) => {
    if (spatial.compartments[d]) {
      spatial.compartments[d].isOpen = true;
      spatial.compartments[d].openProgress = 1;
    }
  });

  // ==================== UI ELEMENTS ====================
  const hudDateBtn = document.getElementById('hud-date-btn');
  const hudMuteBtn = document.getElementById('hud-mute-btn');
  const toastEl = document.getElementById('toast-banner');

  const bottomDock = document.getElementById('bottom-dock');
  const playBtn = document.getElementById('play-btn');
  const openSheetBtn = document.getElementById('open-sheet-btn');
  const closeSheetBtn = document.getElementById('close-sheet-btn');
  const nextTrackBtn = document.getElementById('next-track-btn');
  const currentTrackTitle = document.getElementById('current-track-title');
  const currentTrackIdx = document.getElementById('current-track-idx');
  const repertoireSheet = document.getElementById('repertoire-sheet');
  const trackListEl = document.getElementById('track-list');

  const finderBtn = document.getElementById('finder-btn');
  const progressCountEl = document.getElementById('progress-count');
  const cuckooBtn = document.getElementById('cuckoo-btn');
  const allDoorsBtn = document.getElementById('all-doors-btn');

  const heldHud = document.getElementById('held-hud');
  const heldTitleEl = document.getElementById('held-title');
  const windCurioBtn = document.getElementById('wind-curio-btn');
  const flipCurioBtn = document.getElementById('flip-curio-btn');
  const putBackCloseBtn = document.getElementById('put-back-close-btn');
  const putBackOpenBtn = document.getElementById('put-back-open-btn');
  const prevCurioBtn = document.getElementById('prev-curio-btn');
  const nextCurioBtn = document.getElementById('next-curio-btn');

  let toastTimer = null;
  function showToast(msg, ms = 2800) {
    toastEl.textContent = msg;
    toastEl.classList.add('visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('visible'), ms);
  }

  function persist() {
    saveState({
      realDateLock,
      openedDays: Array.from(openedDays),
      exploredDays: Array.from(exploredDays)
    });
  }

  MUSIC_REPERTOIRE.forEach((piece, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'track-row';
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
      syncUI();
      showToast(`♪ 正在奏鸣：《${piece.title}》`);
    });
    trackListEl.appendChild(btn);
  });

  function syncUI() {
    const anyManyOpen = openedDays.size >= 12;
    spatial.setSwitchStates(realDateLock, openedDays.size >= 24);

    hudDateBtn.textContent = realDateLock ? '📅 日历锁开启' : '🗝️ 自由把玩';
    hudDateBtn.classList.toggle('active-mode', !realDateLock);
    hudMuteBtn.textContent = audio.muted ? '🔇 静音' : '🔊 声效';

    const piece = audio.getCurrentPiece();
    playBtn.textContent = audio.playing ? '⏸ 奏鸣中' : '▶ 八音奏鸣';
    currentTrackTitle.textContent = piece.title;
    currentTrackIdx.textContent = `(${audio.trackIndex + 1}/${MUSIC_REPERTOIRE.length} · 选曲 ▾)`;

    progressCountEl.textContent = `${exploredDays.size}/24`;
    allDoorsBtn.textContent = anyManyOpen ? '🚪 全柜合拢' : '🚪 全柜盛开';

    trackListEl.querySelectorAll('.track-row').forEach((row, idx) => {
      row.classList.toggle('current', idx === audio.trackIndex);
    });
  }

  // ==================== CAMERA & HELD-IN-HAND 3D CHOREOGRAPHY ====================
  // Start with a cinematic three-quarter 3D angle (-0.30 -> -0.14) so the 1m-deep walnut side wall,
  // overhanging snow-shingle chalet roof & 22cm plinth ledge show true 3D furniture volume immediately!
  let orbitYaw = -0.32;
  let orbitPitch = 0.075;
  let targetOrbitYaw = -0.14;
  let targetOrbitPitch = 0.038;
  let overviewZoom = 1.0;
  let targetOverviewZoom = 1.0;

  // Held 3D Curio rotation & zoom in player's hands
  let heldYaw = 0;
  let heldPitch = 0;
  let targetHeldYaw = 0;
  let targetHeldPitch = 0;
  let heldScaleAdj = 1.0;
  let targetHeldScaleAdj = 1.0;

  const camPos = new THREE.Vector3(0, 0.15, 13.5);
  const camTarget = new THREE.Vector3(0, 0.10, 0);
  const desiredCamPos = new THREE.Vector3();
  const desiredCamTarget = new THREE.Vector3();
  const heldWorldPos = new THREE.Vector3();

  function getOverviewDistance() {
    const aspect = Math.max(0.38, window.innerWidth / Math.max(1, window.innerHeight));
    return Math.max(11.4, 6.55 / aspect);
  }

  function updateCameraAndHandTargets() {
    const aspect = Math.max(0.38, window.innerWidth / Math.max(1, window.innerHeight));
    const isPortrait = aspect < 0.82;

    if (focusDay && spatial.compartments[focusDay]) {
      const comp = spatial.compartments[focusDay];
      const closeDist = isPortrait ? 4.35 : 3.45;
      const yShift = isPortrait ? -0.14 : -0.06;

      // Camera dollies close to that open compartment on the 3D cabinet!
      desiredCamTarget.set(comp.center.x * 0.90, comp.center.y + yShift, 0.12);
      desiredCamPos.set(
        comp.center.x * 0.88,
        comp.center.y + (isPortrait ? 0.02 : 0.05),
        closeDist
      );
      return isPortrait ? 0.66 * heldScaleAdj : 0.78 * heldScaleAdj;
    }

    // Overview 3D Cabinet Orbit & Dolly Zoom
    const dist = getOverviewDistance() * overviewZoom;
    desiredCamTarget.set(0, 0.06, -0.16);
    desiredCamPos.set(
      Math.sin(orbitYaw) * dist,
      0.06 + Math.sin(orbitPitch) * dist * 0.55,
      Math.cos(orbitYaw) * dist
    );
    return 0.7;
  }

  updateCameraAndHandTargets();
  camPos.copy(desiredCamPos);
  camTarget.copy(desiredCamTarget);

  // ==================== COMPARTMENT OPEN, CLOSE, PICK-UP & PUT-BACK ====================
  function closeSingleDoor(day, playSound = true) {
    const comp = spatial.compartments[day];
    if (!comp || !comp.isOpen) return;
    comp.isOpen = false;
    openedDays.delete(day);
    if (playSound) audio.playSfx('doorClose');
    persist();
    syncUI();
  }

  function inspectAndHoldCurio(day) {
    const info = ADVENT_BY_DAY[day];
    const comp = spatial.compartments[day];
    if (!info || !comp) return;

    if (realDateLock && !isUnlockedByCalendar(day)) {
      audio.playSfx('locked');
      spatial.highlightDoor(day, 2.8);
      showToast(`🔒 第 ${day} 格将于 12 月 ${day} 日开启 · 可拨动屋檐下「Keeper's Open-All」切换`);
      return;
    }

    repertoireSheet.classList.remove('open');

    // If switching directly from another held curio that wasn't previously open, tidy & shut the previous door!
    if (focusDay && focusDay !== day && !focusWasAlreadyOpen) {
      closeSingleDoor(focusDay, false);
    }

    focusWasAlreadyOpen = comp.isOpen;
    exploredDays.add(day);

    if (!comp.isOpen) {
      comp.isOpen = true;
      openedDays.add(day);
      persist();
      syncUI();
      if (day === 24) {
        audio.playSfx('finale');
        spatial.triggerCuckoo(5.0);
        if (!audio.playing) {
          audio.startMusic();
          syncUI();
        }
      } else {
        audio.playSfx('doorOpen');
      }
    } else {
      persist();
      syncUI();
      audio.playSfx(info.sfx);
    }

    focusDay = day;
    heldYaw = -0.12;
    heldPitch = 0.04;
    targetHeldYaw = -0.06;
    targetHeldPitch = 0.02;
    targetHeldScaleAdj = 1.0;

    spatial.pullOutCurio(day);

    heldTitleEl.textContent = `No. ${pad2(day)} · ${info.title}`;
    flipCurioBtn.textContent = '🔄 翻看背面';
    bottomDock.classList.add('hidden');
    heldHud.classList.add('visible');
  }

  function releaseHeldCurio(closeDoor = true) {
    if (!focusDay) return;
    const returningDay = focusDay;
    focusDay = null;

    if (closeDoor) {
      spatial.putBackCurio(true, (shutDay) => {
        openedDays.delete(shutDay);
        audio.playSfx('doorClose');
        persist();
        syncUI();
      });
    } else {
      openedDays.add(returningDay);
      spatial.putBackCurio(false, null);
      audio.playSfx('page');
      persist();
      syncUI();
      showToast(`📥 已放回第 ${returningDay} 号木龛（再次轻点敞开的木门即可合上）`, 2600);
    }

    heldHud.classList.remove('visible');
    bottomDock.classList.remove('hidden');
  }

  function clearCascades() {
    cascadeTimers.forEach((t) => clearTimeout(t));
    cascadeTimers = [];
  }

  function toggleDateLockMode() {
    audio.unlock();
    realDateLock = !realDateLock;
    audio.playSfx('switchClick');
    persist();
    syncUI();
    showToast(
      realDateLock
        ? '📅 已拨开「Follow Real Date」：按 12 月 1–24 日逐夜解锁'
        : '🗝️ 已切换至「自由把玩模式」：全部 24 格奇珍均可随时取出把玩'
    );
  }

  function toggleOpenAllDoors() {
    audio.unlock();
    clearCascades();
    if (focusDay) releaseHeldCurio(false);
    audio.playSfx('switchClick');

    if (openedDays.size >= 12) {
      for (let d = 1; d <= 24; d++) {
        spatial.compartments[d].isOpen = false;
      }
      openedDays.clear();
      audio.playSfx('doorClose');
      persist();
      syncUI();
      showToast('🚪 24 扇 3D 浮雕金门已全部轻声合拢');
    } else {
      realDateLock = false;
      if (!audio.playing) audio.startMusic();
      for (let d = 1; d <= 24; d++) {
        const t = setTimeout(() => {
          spatial.compartments[d].isOpen = true;
          openedDays.add(d);
          exploredDays.add(d);
          if (d % 6 === 1) audio.playSfx('crystal');
          if (d === 24) {
            spatial.triggerCuckoo(4.8);
            persist();
          }
          syncUI();
        }, (d - 1) * 45);
        cascadeTimers.push(t);
      }
      showToast('✨ 全柜盛开：点内龛可取出把玩，点敞开的门扇可单独关门', 3600);
    }
  }

  // ==================== HUD & HAND-PLAY BUTTONS ====================
  hudDateBtn.addEventListener('click', toggleDateLockMode);
  allDoorsBtn.addEventListener('click', toggleOpenAllDoors);

  hudMuteBtn.addEventListener('click', () => {
    audio.unlock();
    audio.setMuted(!audio.muted);
    syncUI();
  });

  playBtn.addEventListener('click', () => {
    const playing = audio.toggleMusic();
    syncUI();
    if (playing) showToast(`♪ 八音机芯奏鸣：《${audio.getCurrentPiece().title}》`);
  });

  openSheetBtn.addEventListener('click', () => {
    audio.unlock();
    repertoireSheet.classList.toggle('open');
  });
  closeSheetBtn.addEventListener('click', () => repertoireSheet.classList.remove('open'));

  nextTrackBtn.addEventListener('click', () => {
    audio.unlock();
    const piece = audio.nextTrack();
    if (!audio.playing) audio.startMusic();
    syncUI();
    showToast(`♪ 切换曲目：《${piece.title}》`);
  });

  cuckooBtn.addEventListener('click', () => {
    audio.unlock();
    spatial.pullPinecone(0);
    audio.playSfx('cuckoo');
    if (!audio.playing) {
      audio.startMusic();
      syncUI();
    }
    showToast('🔔 松果重锤上弦：顶阁木雕布谷鸟探身报时！');
  });

  finderBtn.addEventListener('click', () => {
    audio.unlock();
    if (focusDay) releaseHeldCurio(true);
    let nextUnexplored = null;
    for (let d = 1; d <= 24; d++) {
      if (!exploredDays.has(d)) {
        nextUnexplored = d;
        break;
      }
    }
    const target = nextUnexplored || 24;
    spatial.highlightDoor(target, 4.5);
    audio.playSfx('crystal');
    showToast(
      nextUnexplored
        ? `✨ 金色流萤已圈出第 ${target} 号（${ADVENT_BY_DAY[target].title}）位置`
        : '🌟 全部 24 件奇珍均已品鉴！轻点任意木门可随时取出把玩'
    );
  });

  // Held-in-Hand controls
  windCurioBtn.addEventListener('click', () => {
    if (!focusDay) return;
    spatial.windHeldCurio();
    audio.playSfx(ADVENT_BY_DAY[focusDay].sfx);
  });

  flipCurioBtn.addEventListener('click', () => {
    if (!focusDay) return;
    const norm = ((targetHeldYaw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const showingBack = norm > Math.PI * 0.5 && norm < Math.PI * 1.5;
    targetHeldYaw = showingBack ? 0 : Math.PI;
    targetHeldPitch = 0;
    flipCurioBtn.textContent = showingBack ? '🔄 翻看背面' : '🔄 翻回正面';
    audio.playSfx('page');
  });

  putBackCloseBtn.addEventListener('click', () => releaseHeldCurio(true));
  putBackOpenBtn.addEventListener('click', () => releaseHeldCurio(false));

  prevCurioBtn.addEventListener('click', () => {
    if (!focusDay) return;
    inspectAndHoldCurio(((focusDay - 2 + 24) % 24) + 1);
  });

  nextCurioBtn.addEventListener('click', () => {
    if (!focusDay) return;
    inspectAndHoldCurio((focusDay % 24) + 1);
  });

  // ==================== POINTER ORBIT, 360° HAND SPIN & 3D RAYCASTING ====================
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pointers = new Map();
  let downInfo = { x: 0, y: 0, t: 0 };
  let dragged = false;
  let lastPinch = 0;

  canvas.addEventListener('pointerdown', (e) => {
    audio.unlock();
    repertoireSheet.classList.remove('open');
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      downInfo = { x: e.clientX, y: e.clientY, t: performance.now() };
      dragged = false;
    } else if (pointers.size === 2) {
      const pts = Array.from(pointers.values());
      lastPinch = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      dragged = true;
    }
  });

  window.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    const prev = pointers.get(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2) {
      const pts = Array.from(pointers.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (lastPinch > 0) {
        const ratio = dist / lastPinch;
        if (focusDay) {
          targetHeldScaleAdj = THREE.MathUtils.clamp(targetHeldScaleAdj * ratio, 0.75, 1.55);
        } else {
          targetOverviewZoom = THREE.MathUtils.clamp(targetOverviewZoom / ratio, 0.44, 1.24);
        }
      }
      lastPinch = dist;
      dragged = true;
      return;
    }

    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    if (Math.hypot(e.clientX - downInfo.x, e.clientY - downInfo.y) > 7) {
      dragged = true;
    }

    if (focusDay) {
      // Freely rotate the held 3D curio reliquary 360° in your hands!
      targetHeldYaw += dx * 0.0085;
      targetHeldPitch = THREE.MathUtils.clamp(targetHeldPitch + dy * 0.006, -0.52, 0.52);

      const norm = ((targetHeldYaw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const showingBack = norm > Math.PI * 0.5 && norm < Math.PI * 1.5;
      flipCurioBtn.textContent = showingBack ? '🔄 翻回正面' : '🔄 翻看背面';
    } else {
      // Wide ±42° 3D spatial orbit around the 1m-deep Black Forest walnut cabinet!
      targetOrbitYaw = THREE.MathUtils.clamp(targetOrbitYaw - dx * 0.0046, -0.72, 0.72);
      targetOrbitPitch = THREE.MathUtils.clamp(targetOrbitPitch + dy * 0.0034, -0.22, 0.28);
    }
  });

  window.addEventListener('pointerup', (e) => {
    const tracked = pointers.has(e.pointerId);
    pointers.delete(e.pointerId);
    if (pointers.size < 2) lastPinch = 0;

    if (!tracked || dragged || performance.now() - downInfo.t > 520) return;

    const rect = canvas.getBoundingClientRect();
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(spatial.interactiveMeshes, false);

    if (hits.length === 0) {
      if (focusDay) releaseHeldCurio(true);
      return;
    }

    for (const hit of hits) {
      const ud = hit.object.userData;
      if (!ud) continue;

      // If currently holding a curio in hand, prioritize interacting with the held 3D object first!
      if (focusDay) {
        if (ud.type === 'windKey' || ud.type === 'heldCurioFront') {
          spatial.windHeldCurio(hit.uv || null);
          audio.playSfx(ADVENT_BY_DAY[focusDay].sfx);
          return;
        }
        if (ud.type === 'heldCurioBack') {
          targetHeldYaw = 0;
          targetHeldPitch = 0;
          flipCurioBtn.textContent = '🔄 翻看背面';
          audio.playSfx('page');
          return;
        }
      }

      if (ud.type === 'door') {
        if (focusDay === ud.day) {
          releaseHeldCurio(true);
        } else if (!focusDay && spatial.compartments[ud.day]?.isOpen) {
          // Tapping an open 3D wooden door panel swings it smoothly SHUT!
          closeSingleDoor(ud.day, true);
        } else {
          inspectAndHoldCurio(ud.day);
        }
        return;
      }

      if (ud.type === 'nicheCurio') {
        if (focusDay === ud.day) {
          releaseHeldCurio(true);
        } else {
          inspectAndHoldCurio(ud.day);
        }
        return;
      }

      if (ud.type === 'switchDate') {
        toggleDateLockMode();
        return;
      }
      if (ud.type === 'switchOpenAll') {
        toggleOpenAllDoors();
        return;
      }
      if (ud.type === 'pinecone') {
        audio.playSfx('ratchet');
        setTimeout(() => {
          spatial.pullPinecone(ud.idx);
          audio.playSfx('cuckoo');
          if (!audio.playing) {
            audio.startMusic();
            syncUI();
          }
          showToast('🔔 松果重锤上弦：顶阁木雕布谷鸟探身报时！');
        }, 200);
        return;
      }
      if (ud.type === 'cuckoo') {
        spatial.triggerCuckoo(4.5);
        audio.playSfx('cuckoo');
        if (!audio.playing) {
          audio.startMusic();
          syncUI();
        }
        showToast('🔔 布谷——布谷！顶阁报时鸟欢唱');
        return;
      }
    }

    // Tapped cabinet background while holding a curio -> put curio back & close its door!
    if (focusDay) {
      releaseHeldCurio(true);
    }
  });

  canvas.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      if (focusDay) {
        targetHeldScaleAdj = THREE.MathUtils.clamp(targetHeldScaleAdj - e.deltaY * 0.0008, 0.75, 1.55);
      } else {
        targetOverviewZoom = THREE.MathUtils.clamp(targetOverviewZoom + e.deltaY * 0.0008, 0.44, 1.24);
      }
    },
    { passive: false }
  );

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && focusDay) {
      releaseHeldCurio();
    } else if (e.key === 'ArrowRight' && focusDay) {
      inspectAndHoldCurio((focusDay % 24) + 1);
    } else if (e.key === 'ArrowLeft' && focusDay) {
      inspectAndHoldCurio(((focusDay - 2 + 24) % 24) + 1);
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / Math.max(1, window.innerHeight);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  syncUI();

  // ==================== ANIMATION LOOP ====================
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, clock.getDelta());
    const elapsed = clock.elapsedTime;

    orbitYaw += (targetOrbitYaw - orbitYaw) * Math.min(1, dt * 7.5);
    orbitPitch += (targetOrbitPitch - orbitPitch) * Math.min(1, dt * 7.5);
    overviewZoom += (targetOverviewZoom - overviewZoom) * Math.min(1, dt * 7.5);

    heldYaw += (targetHeldYaw - heldYaw) * Math.min(1, dt * 8.5);
    heldPitch += (targetHeldPitch - heldPitch) * Math.min(1, dt * 8.5);
    heldScaleAdj += (targetHeldScaleAdj - heldScaleAdj) * Math.min(1, dt * 8.5);

    const handScale = updateCameraAndHandTargets();

    const camLerp = Math.min(1, dt * 5.2);
    camPos.lerp(desiredCamPos, camLerp);
    camTarget.lerp(desiredCamTarget, camLerp);
    camera.position.copy(camPos);
    camera.lookAt(camTarget);

    // Keep the held 3D curio centered right in the sweet spot of the player's gaze for all 24 doors!
    heldWorldPos.lerpVectors(camPos, camTarget, 0.725);
    heldWorldPos.y += 0.13;

    // Subtle idle breathing float when holding a curio in your hands
    const idleYaw = heldYaw + (focusDay ? Math.sin(elapsed * 1.4) * 0.035 : 0);
    const idlePitch = heldPitch + (focusDay ? Math.cos(elapsed * 1.1) * 0.022 : 0);

    spatial.update(elapsed, dt, heldWorldPos, idleYaw, idlePitch, handScale);
    renderer.render(scene, camera);
  }

  animate();

  // Expose QA hooks
  window.__wunderkammer = {
    holdCurio: inspectAndHoldCurio,
    putBack: releaseHeldCurio,
    setOrbit: (yaw, pitch = 0.05) => {
      targetOrbitYaw = yaw;
      targetOrbitPitch = pitch;
    },
    setHeldAngles: (yaw, pitch = 0) => {
      targetHeldYaw = yaw;
      targetHeldPitch = pitch;
    },
    snap: () => {
      orbitYaw = targetOrbitYaw;
      orbitPitch = targetOrbitPitch;
      overviewZoom = targetOverviewZoom;
      heldYaw = targetHeldYaw;
      heldPitch = targetHeldPitch;
      heldScaleAdj = targetHeldScaleAdj;
      const hs = updateCameraAndHandTargets();
      camPos.copy(desiredCamPos);
      camTarget.copy(desiredCamTarget);
      camera.position.copy(camPos);
      camera.lookAt(camTarget);
      heldWorldPos.lerpVectors(camPos, camTarget, 0.725);
      heldWorldPos.y += 0.13;
      for (let i = 0; i < 20; i++) {
        spatial.update(clock.elapsedTime + i * 0.04, 0.04, heldWorldPos, heldYaw, heldPitch, hs);
      }
      renderer.render(scene, camera);
    },
    openAllImmediate: () => {
      for (let d = 1; d <= 24; d++) {
        spatial.compartments[d].isOpen = true;
        spatial.compartments[d].openProgress = 1;
        openedDays.add(d);
      }
      syncUI();
    }
  };
}

initSpatialApp();
