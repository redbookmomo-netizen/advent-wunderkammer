// Main Controller for "The Grand Advent Wunderkammer · 黑森林 24 格机械降临节秘柜"
// Real-Artwork Edition: 3D Perspective Hinged Carved Doors + Native Brass Switches + 24 Bespoke Living Dioramas

import { ADVENT_DAYS, ADVENT_BY_DAY, CABINET_WIDTH, CABINET_HEIGHT, ROMAN } from './adventData.js';
import { MUSIC_REPERTOIRE } from './musicScores.js';
import { WunderkammerAudio } from './audio.js';
import { CabinetAmbientFX, VitrineDioramaFX } from './dioramaFx.js';

const STORAGE_KEY = 'wunderkammer_real_art_v2';

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
  const month = now.getMonth(); // 11 = December
  const date = now.getDate();
  if (month === 11) return date >= day;
  return month === 0;
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function initWunderkammer() {
  const audio = new WunderkammerAudio();
  const ambientFx = new CabinetAmbientFX(document.getElementById('ambient-fx-canvas'));
  const vitrineFx = new VitrineDioramaFX(document.getElementById('vitrine-fx-canvas'));

  audio.onNoteCallback = () => ambientFx.pulseMusic();

  // Persistent state
  const saved = loadState();
  let realDateLock = saved?.realDateLock ?? false; // Default false = Keeper's Free-Play unlocked!
  let openedDays = new Set(Array.isArray(saved?.openedDays) ? saved.openedDays : []);
  let currentVitrineDay = null;
  let cascadeTimers = [];
  let pendingVitrineTimer = null;

  // DOM References
  const doorsLayer = document.getElementById('doors-layer');
  const doorElements = {};

  const hudDateBtn = document.getElementById('hud-date-btn');
  const hudResetViewBtn = document.getElementById('hud-reset-view-btn');
  const hudMuteBtn = document.getElementById('hud-mute-btn');
  const toastEl = document.getElementById('toast-banner');

  const roofSwitchDate = document.getElementById('roof-switch-date');
  const roofSwitchOpenAll = document.getElementById('roof-switch-openall');
  const trackDateEl = document.getElementById('track-date');
  const trackOpenAllEl = document.getElementById('track-openall');

  const cuckooSprite = document.getElementById('cuckoo-sprite');
  const clockHotspot = document.getElementById('clock-hotspot');
  const pineconeLeft = document.getElementById('pinecone-left');
  const pineconeRight = document.getElementById('pinecone-right');

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

  // Vitrine Modal DOM
  const vitrineOverlay = document.getElementById('vitrine-overlay');
  const vitrineArtFrame = document.getElementById('vitrine-art-frame');
  const vitrineImg = document.getElementById('vitrine-img');
  const vitrineBadge = document.getElementById('vitrine-badge');
  const vitrineTitle = document.getElementById('vitrine-title');
  const vitrineSubtitle = document.getElementById('vitrine-subtitle');
  const vitrineSummary = document.getElementById('vitrine-summary');
  const loreBox = document.getElementById('lore-box');
  const loreText = document.getElementById('lore-text');
  const vitrineActionBtn = document.getElementById('vitrine-action-btn');
  const vitrineLoreBtn = document.getElementById('vitrine-lore-btn');
  const vitrineCloseBtn = document.getElementById('vitrine-close-btn');
  const prevDayBtn = document.getElementById('prev-day-btn');
  const nextDayBtn = document.getElementById('next-day-btn');
  const shutDoorBtn = document.getElementById('shut-door-btn');

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
      openedDays: Array.from(openedDays)
    });
  }

  // ==================== BUILD ALL 24 3D CARVED DOORS ====================
  function computeRadiusStyle(info, leafPart = 'full') {
    const [x1, y1, x2, y2] = info.rect;
    const dw = x2 - x1;
    const dh = y2 - y1;
    if (info.shape === 'oval') {
      return '50%';
    }
    if (info.shape === 'arch') {
      const archV = Math.min(98, ((dw * 0.5) / dh) * 100).toFixed(2) + '%';
      if (leafPart === 'back-double-left') {
        return `2px 100% 2px 2px / 2px ${archV} 2px 2px`;
      }
      if (leafPart === 'back-double-right') {
        return `100% 2px 2px 2px / ${archV} 2px 2px 2px`;
      }
      return `50% 50% 3px 3px / ${archV} ${archV} 3px 3px`;
    }
    return '3px';
  }

  ADVENT_DAYS.forEach((info) => {
    const [x1, y1, x2, y2] = info.rect;
    const slot = document.createElement('div');
    slot.className = 'cabinet-door-slot';
    slot.dataset.day = String(info.day);
    slot.style.left = `${((x1 / CABINET_WIDTH) * 100).toFixed(3)}%`;
    slot.style.top = `${((y1 / CABINET_HEIGHT) * 100).toFixed(3)}%`;
    slot.style.width = `${(((x2 - x1) / CABINET_WIDTH) * 100).toFixed(3)}%`;
    slot.style.height = `${(((y2 - y1) / CABINET_HEIGHT) * 100).toFixed(3)}%`;

    // Recessed Niche Interior holding door-XX.webp
    const niche = document.createElement('div');
    niche.className = 'niche-interior';
    niche.style.borderRadius = computeRadiusStyle(info, 'full');
    const nicheImg = document.createElement('img');
    nicheImg.src = `assets/doors/door-${pad2(info.day)}.webp`;
    nicheImg.alt = info.title;
    nicheImg.loading = 'lazy';
    niche.appendChild(nicheImg);
    slot.appendChild(niche);

    // 3D Hinged Carved Door Leaf / Double Leaves
    if (info.hinge === 'double') {
      ['L', 'R'].forEach((side) => {
        const leaf = document.createElement('div');
        leaf.className = `door-leaf ${side === 'L' ? 'double-left' : 'double-right'}`;

        const front = document.createElement('div');
        front.className = 'leaf-front';
        const fImg = document.createElement('img');
        fImg.src = `assets/fronts/front-24${side}.webp`;
        fImg.alt = `${info.title} ${side}`;
        front.appendChild(fImg);

        const back = document.createElement('div');
        back.className = 'leaf-back';
        back.style.borderRadius = computeRadiusStyle(info, side === 'L' ? 'back-double-left' : 'back-double-right');
        back.textContent = side === 'L' ? 'XX' : 'IV';

        leaf.appendChild(front);
        leaf.appendChild(back);
        slot.appendChild(leaf);
      });
    } else {
      const leaf = document.createElement('div');
      leaf.className = `door-leaf single-leaf hinge-${info.hinge}`;

      const front = document.createElement('div');
      front.className = 'leaf-front';
      const fImg = document.createElement('img');
      fImg.src = `assets/fronts/front-${pad2(info.day)}.webp`;
      fImg.alt = `${info.day} 号浮雕门`;
      front.appendChild(fImg);

      const back = document.createElement('div');
      back.className = 'leaf-back';
      back.style.borderRadius = computeRadiusStyle(info, 'full');
      back.textContent = ROMAN[info.day];

      leaf.appendChild(front);
      leaf.appendChild(back);
      slot.appendChild(leaf);
    }

    if (openedDays.has(info.day)) {
      slot.classList.add('is-open');
    }

    doorsLayer.appendChild(slot);
    doorElements[info.day] = slot;
  });

  // ==================== REPERTOIRE POPUP ====================
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
    const allOpen = openedDays.size >= 24;

    // Sync both native painted roof brass switches & HUD buttons!
    trackDateEl.classList.toggle('active', realDateLock);
    trackOpenAllEl.classList.toggle('active', allOpen);

    hudDateBtn.textContent = realDateLock ? '📅 日历锁开启' : '🗝️ 自由把玩';
    hudDateBtn.classList.toggle('active-mode', !realDateLock);
    hudMuteBtn.textContent = audio.muted ? '🔇 静音' : '🔊 声效';

    const piece = audio.getCurrentPiece();
    playBtn.textContent = audio.playing ? '⏸ 奏鸣中' : '▶ 八音奏鸣';
    currentTrackTitle.textContent = piece.title;
    currentTrackIdx.textContent = `(${audio.trackIndex + 1}/${MUSIC_REPERTOIRE.length} · 选曲 ▾)`;

    progressCountEl.textContent = `${openedDays.size}/24`;
    allDoorsBtn.textContent = allOpen ? '🚪 全柜合拢' : '🚪 全柜盛开';

    trackListEl.querySelectorAll('.track-row').forEach((row, idx) => {
      row.classList.toggle('current', idx === audio.trackIndex);
    });
  }

  // ==================== DOOR & VITRINE INTERACTIONS ====================
  function preloadNeighborImages(day) {
    const prev = ((day - 2 + 24) % 24) + 1;
    const next = (day % 24) + 1;
    [prev, next].forEach((d) => {
      const im = new Image();
      im.src = `assets/doors/door-${pad2(d)}.webp`;
    });
  }

  function showVitrineModal(day) {
    const info = ADVENT_BY_DAY[day];
    if (!info) return;
    currentVitrineDay = day;
    repertoireSheet.classList.remove('open');

    vitrineImg.src = `assets/doors/door-${pad2(day)}.webp`;
    vitrineImg.alt = info.title;
    vitrineBadge.textContent = `No. ${pad2(day)} · ${ROMAN[day]}`;
    vitrineTitle.textContent = info.title;
    vitrineSubtitle.textContent = info.subtitle;
    vitrineSummary.textContent = info.summary;
    loreText.textContent = info.lore;
    vitrineActionBtn.textContent = info.actionLabel;

    loreBox.classList.remove('open');
    vitrineLoreBtn.textContent = '📜 守柜人手记';

    vitrineFx.setScene(info.fxType);
    vitrineOverlay.classList.add('open');
    preloadNeighborImages(day);
  }

  function closeVitrineModal() {
    currentVitrineDay = null;
    vitrineOverlay.classList.remove('open');
  }

  function clearCascades() {
    cascadeTimers.forEach((t) => clearTimeout(t));
    cascadeTimers = [];
    if (pendingVitrineTimer) {
      clearTimeout(pendingVitrineTimer);
      pendingVitrineTimer = null;
    }
  }

  function handleDoorTap(day, { immediateModal = false } = {}) {
    audio.unlock();
    const info = ADVENT_BY_DAY[day];
    const slot = doorElements[day];
    if (!info || !slot) return;

    if (realDateLock && !isUnlockedByCalendar(day)) {
      audio.playSfx('locked');
      ambientFx.highlightDoorRect(info.rect, 2.8);
      showToast(`🔒 第 ${day} 格将于 12 月 ${day} 日解锁 · 可拨动屋檐下「Keeper's Open-All」或点右上角切换`);
      return;
    }

    const wasOpen = openedDays.has(day);
    if (!wasOpen) {
      openedDays.add(day);
      slot.classList.add('is-open');
      persist();
      syncUI();

      if (day === 24) {
        audio.playSfx('finale');
        triggerCuckooBelfry(false);
        if (!audio.playing) {
          audio.startMusic();
          syncUI();
        }
      } else {
        audio.playSfx('doorOpen');
      }

      // Let the user watch the carved gilded door swing open on the cabinet first (~380ms), then blossom the Vitrine!
      if (pendingVitrineTimer) clearTimeout(pendingVitrineTimer);
      pendingVitrineTimer = setTimeout(() => {
        showVitrineModal(day);
      }, immediateModal ? 40 : 400);
    } else {
      audio.playSfx(info.sfx);
      showVitrineModal(day);
    }
  }

  // ==================== CUCKOO, CLOCK & PINECONE ACTIONS ====================
  let cuckooAnimTimer = null;
  function triggerCuckooBelfry(withToast = true) {
    audio.unlock();
    audio.playSfx('cuckoo');
    ambientFx.triggerCuckoo(4.5);
    cuckooSprite.classList.add('singing');
    if (cuckooAnimTimer) clearTimeout(cuckooAnimTimer);
    cuckooAnimTimer = setTimeout(() => cuckooSprite.classList.remove('singing'), 2400);

    if (!audio.playing) {
      audio.startMusic();
      syncUI();
    }
    if (withToast) {
      showToast('🔔 布谷——布谷！顶阁木雕报时鸟振翅奏鸣');
    }
  }

  function pullPinecone(el) {
    audio.unlock();
    audio.playSfx('ratchet');
    el.style.transform = 'translateY(14px)';
    setTimeout(() => {
      el.style.transform = '';
      triggerCuckooBelfry(true);
    }, 240);
  }

  // ==================== TOGGLE ALL DOORS & DATE LOCK ====================
  function toggleDateLockMode() {
    audio.unlock();
    realDateLock = !realDateLock;
    audio.playSfx('switchClick');
    persist();
    syncUI();
    showToast(
      realDateLock
        ? '📅 已拨开「Follow Real Date」：按 12 月 1–24 日真实日期逐夜解锁'
        : '🗝️ 已切换回「自由把玩模式」：全部 24 扇浮雕金门随时可推开'
    );
  }

  function toggleOpenAllDoors() {
    audio.unlock();
    clearCascades();
    closeVitrineModal();
    audio.playSfx('switchClick');

    if (openedDays.size >= 24) {
      for (let d = 1; d <= 24; d++) {
        doorElements[d].classList.remove('is-open');
      }
      openedDays.clear();
      audio.playSfx('doorClose');
      persist();
      syncUI();
      showToast('🚪 24 扇鎏金浮雕暗门已轻声合拢');
    } else {
      realDateLock = false;
      if (!audio.playing) audio.startMusic();

      for (let d = 1; d <= 24; d++) {
        const t = setTimeout(() => {
          doorElements[d].classList.add('is-open');
          openedDays.add(d);
          if (d % 6 === 1) audio.playSfx('crystal');
          if (d === 24) {
            triggerCuckooBelfry(false);
            persist();
          }
          syncUI();
        }, (d - 1) * 48);
        cascadeTimers.push(t);
      }
      showToast('✨ Keeper’s Open-All Mode：24 扇浮雕金门依次洞开！轻点任一内龛可放大把玩', 3600);
    }
  }

  // ==================== PAN & PINCH-ZOOM STAGE ====================
  const viewportWrap = document.getElementById('viewport-wrap');
  const panLayer = document.getElementById('cabinet-pan-layer');

  let scale = 1;
  let panX = 0;
  let panY = 0;
  const pointers = new Map();
  let downPt = { x: 0, y: 0, t: 0, target: null };
  let wasDragged = false;
  let lastPinch = 0;

  function applyStageTransform() {
    const maxPanX = Math.max(48, (window.innerWidth * (scale - 0.82)) * 0.55);
    const maxPanY = Math.max(24, (window.innerHeight * (scale - 0.92)) * 0.52);
    panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
    panY = Math.max(-maxPanY, Math.min(maxPanY, panY));
    panLayer.style.transform = `translate3d(${panX.toFixed(1)}px, ${panY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
    hudResetViewBtn.style.display = (scale > 1.06 || Math.hypot(panX, panY) > 28) ? 'inline-block' : 'none';
  }

  hudResetViewBtn.addEventListener('click', () => {
    scale = 1;
    panX = 0;
    panY = 0;
    applyStageTransform();
  });

  viewportWrap.addEventListener('pointerdown', (e) => {
    audio.unlock();
    repertoireSheet.classList.remove('open');
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      downPt = { x: e.clientX, y: e.clientY, t: performance.now(), target: e.target };
      wasDragged = false;
    } else if (pointers.size === 2) {
      const pts = Array.from(pointers.values());
      lastPinch = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      wasDragged = true;
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
        scale = Math.max(0.88, Math.min(3.0, scale * (dist / lastPinch)));
        applyStageTransform();
      }
      lastPinch = dist;
      wasDragged = true;
      return;
    }

    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    if (Math.hypot(e.clientX - downPt.x, e.clientY - downPt.y) > 8) {
      wasDragged = true;
    }
    if (wasDragged) {
      panX += dx;
      panY += dy;
      applyStageTransform();
    }
  });

  window.addEventListener('pointerup', (e) => {
    const tracked = pointers.has(e.pointerId);
    pointers.delete(e.pointerId);
    if (pointers.size < 2) lastPinch = 0;

    if (!tracked || wasDragged || performance.now() - downPt.t > 550) return;

    // Clean tap! Resolve interactive cabinet element
    const el = downPt.target;
    if (!el) return;

    const doorSlot = el.closest?.('.cabinet-door-slot');
    if (doorSlot) {
      const day = parseInt(doorSlot.dataset.day, 10);
      if (day >= 1 && day <= 24) handleDoorTap(day);
      return;
    }

    if (el.closest?.('#roof-switch-date')) {
      toggleDateLockMode();
      return;
    }
    if (el.closest?.('#roof-switch-openall')) {
      toggleOpenAllDoors();
      return;
    }
    if (el.closest?.('#cuckoo-sprite') || el.closest?.('#clock-hotspot')) {
      triggerCuckooBelfry(true);
      return;
    }
    if (el.closest?.('#pinecone-left')) {
      pullPinecone(pineconeLeft);
      return;
    }
    if (el.closest?.('#pinecone-right')) {
      pullPinecone(pineconeRight);
    }
  });

  viewportWrap.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      scale = Math.max(0.88, Math.min(3.0, scale * (1 - e.deltaY * 0.0012)));
      applyStageTransform();
    },
    { passive: false }
  );

  // ==================== HUD & VITRINE LISTENERS ====================
  hudDateBtn.addEventListener('click', toggleDateLockMode);
  allDoorsBtn.addEventListener('click', toggleOpenAllDoors);
  cuckooBtn.addEventListener('click', () => triggerCuckooBelfry(true));

  hudMuteBtn.addEventListener('click', () => {
    audio.unlock();
    audio.setMuted(!audio.muted);
    syncUI();
  });

  playBtn.addEventListener('click', () => {
    const playing = audio.toggleMusic();
    syncUI();
    if (playing) {
      showToast(`♪ 八音机芯奏鸣：《${audio.getCurrentPiece().title}》`);
    }
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

  finderBtn.addEventListener('click', () => {
    audio.unlock();
    closeVitrineModal();
    let targetDay = null;
    for (let d = 1; d <= 24; d++) {
      if (!openedDays.has(d)) {
        targetDay = d;
        break;
      }
    }
    if (!targetDay) {
      ambientFx.highlightDoorRect(ADVENT_BY_DAY[24].rect, 4.2);
      showToast('🌟 全部 24 扇奇珍门已尽数洞开！轻点任意内龛即可放大赏玩');
    } else {
      ambientFx.highlightDoorRect(ADVENT_BY_DAY[targetDay].rect, 4.5);
      audio.playSfx('crystal');
      showToast(`✨ 金色流萤已为你圈出第 ${targetDay} 号（${ADVENT_BY_DAY[targetDay].title}）位置`);
    }
  });

  // Vitrine Modal interactions
  vitrineCloseBtn.addEventListener('click', closeVitrineModal);
  vitrineOverlay.addEventListener('click', (e) => {
    if (e.target === vitrineOverlay) closeVitrineModal();
  });

  vitrineActionBtn.addEventListener('click', () => {
    if (!currentVitrineDay) return;
    const info = ADVENT_BY_DAY[currentVitrineDay];
    vitrineFx.triggerBurst();
    audio.playSfx(info.sfx);
  });

  vitrineLoreBtn.addEventListener('click', () => {
    const open = loreBox.classList.toggle('open');
    vitrineLoreBtn.textContent = open ? '📜 收起手记' : '📜 守柜人手记';
    audio.playSfx('page');
  });

  shutDoorBtn.addEventListener('click', () => {
    if (!currentVitrineDay) return;
    const d = currentVitrineDay;
    doorElements[d]?.classList.remove('is-open');
    openedDays.delete(d);
    audio.playSfx('doorClose');
    persist();
    syncUI();
    closeVitrineModal();
  });

  prevDayBtn.addEventListener('click', () => {
    if (!currentVitrineDay) return;
    const prev = ((currentVitrineDay - 2 + 24) % 24) + 1;
    handleDoorTap(prev, { immediateModal: true });
  });

  nextDayBtn.addEventListener('click', () => {
    if (!currentVitrineDay) return;
    const next = (currentVitrineDay % 24) + 1;
    handleDoorTap(next, { immediateModal: true });
  });

  // Touch sparkle trail & tap burst directly on the 768x1024 artwork!
  let vitrinePointerDown = false;
  let lastSparkAudioTime = 0;
  vitrineArtFrame.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;
    vitrinePointerDown = true;
    const r = vitrineArtFrame.getBoundingClientRect();
    vitrineFx.addTouchSpark((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    vitrineFx.triggerBurst();
    if (currentVitrineDay) {
      audio.playSfx(ADVENT_BY_DAY[currentVitrineDay].sfx);
    }
  });

  vitrineArtFrame.addEventListener('pointermove', (e) => {
    if (!vitrinePointerDown) return;
    const r = vitrineArtFrame.getBoundingClientRect();
    vitrineFx.addTouchSpark((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    const now = performance.now();
    if (now - lastSparkAudioTime > 260) {
      lastSparkAudioTime = now;
      audio.playSfx('crystal');
    }
  });

  window.addEventListener('pointerup', () => {
    vitrinePointerDown = false;
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      repertoireSheet.classList.remove('open');
      closeVitrineModal();
    } else if (e.key === 'ArrowRight' && currentVitrineDay) {
      handleDoorTap((currentVitrineDay % 24) + 1, { immediateModal: true });
    } else if (e.key === 'ArrowLeft' && currentVitrineDay) {
      handleDoorTap(((currentVitrineDay - 2 + 24) % 24) + 1, { immediateModal: true });
    }
  });

  syncUI();

  // ==================== 60/120FPS RENDER LOOP ====================
  let lastT = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000));
    lastT = now;
    const sec = now / 1000;

    ambientFx.update(sec, dt);
    if (currentVitrineDay !== null) {
      vitrineFx.update(sec, dt);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // Expose QA hooks
  window.__wunderkammer = {
    openDoor: (d) => handleDoorTap(d, { immediateModal: true }),
    closeVitrine: closeVitrineModal,
    openAllImmediate: () => {
      for (let d = 1; d <= 24; d++) {
        doorElements[d].classList.add('is-open');
        openedDays.add(d);
      }
      syncUI();
    },
    closeAllImmediate: () => {
      for (let d = 1; d <= 24; d++) {
        doorElements[d].classList.remove('is-open');
      }
      openedDays.clear();
      closeVitrineModal();
      syncUI();
    }
  };
}

initWunderkammer();
