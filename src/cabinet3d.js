// Full 3D Scene, Black Forest Mechanical Cabinet, Belfry Automaton, Pinecone Weights & Atmosphere
// Built with Three.js — zero external assets

import * as THREE from 'three';
import { ADVENT_DAYS } from './adventData.js';
import { createCabinetTextures, createDoorPanelTexture } from './textures.js';
import { createCurioMaterials, buildCurioDiorama } from './curios3d.js';

export const ATMOSPHERES = [
  {
    id: 'hearth',
    name: '炉火雪夜',
    bg: 0x0b0910,
    fog: 0x0e0b14,
    ambientColor: 0x5c463c,
    ambientInt: 1.05,
    hearthColor: 0xff9442,
    hearthInt: 3.4,
    windowColor: 0x4c7fd9,
    windowInt: 1.9,
    keyColor: 0xffe4b8,
    keyInt: 2.1,
    rayColor: 0x7aaeff,
    rayOpacity: 0.11,
    skyTint: 0x162d59
  },
  {
    id: 'aurora',
    name: '极光圣咏',
    bg: 0x060f18,
    fog: 0x08131f,
    ambientColor: 0x3f5e66,
    ambientInt: 1.15,
    hearthColor: 0xffb36b,
    hearthInt: 2.2,
    windowColor: 0x3ce8b0,
    windowInt: 2.8,
    keyColor: 0xdff8ff,
    keyInt: 2.0,
    rayColor: 0x4ef2be,
    rayOpacity: 0.15,
    skyTint: 0x124a4f
  },
  {
    id: 'dawn',
    name: '晨曦金雾',
    bg: 0x160e12,
    fog: 0x1c1216,
    ambientColor: 0x7a5b52,
    ambientInt: 1.3,
    hearthColor: 0xffaa5c,
    hearthInt: 2.5,
    windowColor: 0xffb88c,
    windowInt: 2.6,
    keyColor: 0xfff0d4,
    keyInt: 2.5,
    rayColor: 0xffd296,
    rayOpacity: 0.16,
    skyTint: 0x5c3442
  }
];

export function buildWunderkammerScene(scene) {
  const textures = createCabinetTextures();
  const curioMats = createCurioMaterials(textures);

  // Core architectural materials
  const walnutMat = new THREE.MeshStandardMaterial({
    map: textures.walnutMap,
    bumpMap: textures.walnutBump,
    bumpScale: 0.018,
    color: 0xffffff,
    roughness: 0.42,
    metalness: 0.08
  });

  const walnutTrimMat = new THREE.MeshStandardMaterial({
    map: textures.walnutMap,
    bumpMap: textures.walnutBump,
    bumpScale: 0.022,
    color: 0x8c583a,
    roughness: 0.36,
    metalness: 0.12
  });

  const brassMat = curioMats.brass;
  const goldMat = curioMats.goldBright;

  const velvetMat = new THREE.MeshStandardMaterial({
    map: textures.velvetMap,
    roughness: 0.86,
    metalness: 0.04
  });

  // ==================== LIGHTING ====================
  const ambientLight = new THREE.AmbientLight(0x5c463c, 1.05);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffe4b8, 2.1);
  keyLight.position.set(2.8, 4.6, 5.8);
  scene.add(keyLight);

  const hearthLight = new THREE.PointLight(0xff9442, 3.4, 14, 1.4);
  hearthLight.position.set(-3.4, -1.6, 3.6);
  scene.add(hearthLight);

  const windowLight = new THREE.DirectionalLight(0x4c7fd9, 1.9);
  windowLight.position.set(-1.8, 4.2, -3.5);
  scene.add(windowLight);

  // Focused spotlight/pointlight that glides to illuminate whichever curio is inspected!
  const focusCurioLight = new THREE.PointLight(0xffdf9e, 1.8, 3.2, 1.6);
  focusCurioLight.position.set(0, 0.3, 1.1);
  scene.add(focusCurioLight);

  // Warm sanctuary constant interior light for #24
  const sanctuaryLight = new THREE.PointLight(0xffbe66, 0.0, 2.6, 1.6);
  sanctuaryLight.position.set(0, 0.34, -0.15);
  scene.add(sanctuaryLight);

  // ==================== PARLOR WINDOW BACKDROP & SNOW ====================
  const backdropGroup = new THREE.Group();
  scene.add(backdropGroup);

  const windowPaneMat = new THREE.MeshBasicMaterial({
    map: textures.frostedWindowMap,
    color: 0xffffff
  });
  const bigWindow = new THREE.Mesh(new THREE.PlaneGeometry(22, 16), windowPaneMat);
  bigWindow.position.set(0, 0.6, -2.65);
  backdropGroup.add(bigWindow);

  // Dark wood parlor mullions & side wainscoting behind cabinet
  const mullionMat = new THREE.MeshStandardMaterial({ color: 0x150c08, roughness: 0.62 });
  for (let mx of [-6.8, -3.4, 0, 3.4, 6.8]) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.16, 16, 0.14), mullionMat);
    bar.position.set(mx, 0.6, -2.56);
    backdropGroup.add(bar);
  }
  for (let my of [-2.4, 1.2, 4.4]) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(22, 0.13, 0.14), mullionMat);
    bar.position.set(0, my, -2.56);
    backdropGroup.add(bar);
  }

  // Feathered Volumetric Tyndall Light Shafts (zero hard geometric edges)
  const rayMat = new THREE.MeshBasicMaterial({
    map: textures.lightBeamMap,
    color: 0x7aaeff,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const lightRays = [];
  [[-1.5, 1.4, -0.9, 3.1], [0.5, 1.6, 0.45, 2.7], [2.2, 1.0, 0.85, 2.4]].forEach(([rx, ry, rz, rw], idx) => {
    const beam = new THREE.Mesh(new THREE.PlaneGeometry(rw, 10.2), rayMat);
    beam.position.set(rx, ry, rz);
    beam.rotation.z = -0.34;
    scene.add(beam);
    lightRays.push({ mesh: beam, baseX: rx, phase: idx * 1.7 });
  });

  // 3D Snowfall outside + Golden Dust Motes inside
  const snowCount = 320;
  const snowPos = new Float32Array(snowCount * 3);
  const snowVel = [];
  for (let i = 0; i < snowCount; i++) {
    snowPos[i * 3] = (Math.random() - 0.5) * 11;
    snowPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
    snowPos[i * 3 + 2] = -2.35 + Math.random() * 1.4;
    snowVel.push({
      vy: 0.45 + Math.random() * 0.75,
      seed: Math.random() * 20
    });
  }
  const snowGeo = new THREE.BufferGeometry();
  snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));
  const snowMat = new THREE.PointsMaterial({
    map: textures.snowSprite,
    size: 0.11,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const snowPoints = new THREE.Points(snowGeo, snowMat);
  scene.add(snowPoints);

  const dustCount = 110;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 6.2;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 7.8;
    dustPos[i * 3 + 2] = 0.25 + Math.random() * 2.8;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    map: textures.glowSprite,
    color: 0xffdc96,
    size: 0.085,
    transparent: true,
    opacity: 0.58,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const dustPoints = new THREE.Points(dustGeo, dustMat);
  scene.add(dustPoints);

  // ==================== THE GRAND BLACK FOREST CABINET ====================
  const cabinetGroup = new THREE.Group();
  scene.add(cabinetGroup);

  const interactiveTargets = []; // All clickable meshes with userData

  // Grid metrics (5 columns x 5 rows; #24 spans 2 rows at center)
  const colCenters = [-1.44, -0.72, 0.0, 0.72, 1.44];
  const rowCenters = [1.42, 0.70, -0.02, -0.74, -1.40];
  const rowHeights = [0.70, 0.70, 0.70, 0.70, 0.56];
  const cellW = 0.70;
  const nicheDepth = 0.54;

  // 1. Backboard & Outer Carcass
  const backVelvet = new THREE.Mesh(new THREE.PlaneGeometry(3.66, 3.54), velvetMat);
  backVelvet.position.set(0, 0.04, -nicheDepth + 0.01);
  cabinetGroup.add(backVelvet);

  const backWood = new THREE.Mesh(new THREE.BoxGeometry(3.88, 3.68, 0.08), walnutMat);
  backWood.position.set(0, 0.04, -nicheDepth - 0.04);
  cabinetGroup.add(backWood);

  for (let sx of [-1.86, 1.86]) {
    const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.68, nicheDepth + 0.08), walnutMat);
    sideWall.position.set(sx, 0.04, -nicheDepth * 0.5);
    cabinetGroup.add(sideWall);
  }

  // Horizontal shelves (skipping center col=2 between row 1 & row 2 for double-height #24!)
  const shelfYs = [1.78, 1.06, 0.34, -0.38, -1.10, -1.69];
  shelfYs.forEach((sy, idx) => {
    if (idx === 2) {
      // Split around center column [-0.35, +0.35]
      const leftShelf = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.042, nicheDepth + 0.04), walnutTrimMat);
      leftShelf.position.set(-1.09, sy, -nicheDepth * 0.5 + 0.01);
      const rightShelf = leftShelf.clone();
      rightShelf.position.x = 1.09;
      cabinetGroup.add(leftShelf, rightShelf);
    } else {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(3.68, 0.045, nicheDepth + 0.05), walnutTrimMat);
      shelf.position.set(0, sy, -nicheDepth * 0.5 + 0.01);
      cabinetGroup.add(shelf);
    }
  });

  // Vertical interior dividers
  [-1.08, -0.36, 0.36, 1.08].forEach((vx) => {
    const div = new THREE.Mesh(new THREE.BoxGeometry(0.042, 3.48, nicheDepth + 0.04), walnutTrimMat);
    div.position.set(vx, 0.045, -nicheDepth * 0.5 + 0.01);
    cabinetGroup.add(div);
  });

  // Flanking Baroque Solomonic Spiral Columns
  for (let side of [-1, 1]) {
    const colX = side * 1.98;
    const colGroup = new THREE.Group();
    colGroup.position.set(colX, 0.04, 0.04);

    // Spiral rings along shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 3.56, 18), walnutTrimMat);
    colGroup.add(shaft);
    for (let k = 0; k < 14; k++) {
      const torus = new THREE.Mesh(new THREE.TorusGeometry(0.092, 0.022, 8, 18), walnutMat);
      torus.rotation.x = Math.PI / 2 + side * 0.22;
      torus.position.y = -1.58 + k * 0.245;
      colGroup.add(torus);
    }
    // Brass Corinthian capital & base
    for (let cy of [-1.74, 1.74]) {
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.115, 0.14, 16), brassMat);
      cap.position.y = cy;
      colGroup.add(cap);
    }
    cabinetGroup.add(colGroup);
  }

  // Moulded Upper Cornice & Lower Plinth
  const upperCornice = new THREE.Mesh(new THREE.BoxGeometry(4.36, 0.18, 0.78), walnutTrimMat);
  upperCornice.position.set(0, 1.90, -0.20);
  cabinetGroup.add(upperCornice);
  const corniceBrass = new THREE.Mesh(new THREE.BoxGeometry(4.42, 0.035, 0.82), brassMat);
  corniceBrass.position.set(0, 1.99, -0.20);
  cabinetGroup.add(corniceBrass);

  const lowerPlinth = new THREE.Mesh(new THREE.BoxGeometry(4.36, 0.22, 0.80), walnutTrimMat);
  lowerPlinth.position.set(0, -1.82, -0.20);
  cabinetGroup.add(lowerPlinth);
  const plinthBrass = new THREE.Mesh(new THREE.BoxGeometry(4.40, 0.032, 0.83), brassMat);
  plinthBrass.position.set(0, -1.70, -0.20);
  cabinetGroup.add(plinthBrass);

  // ==================== 2. UPPER CLOCK & AUTOMATON BELFRY ====================
  const belfryGroup = new THREE.Group();
  cabinetGroup.add(belfryGroup);

  const belfryBody = new THREE.Mesh(new THREE.BoxGeometry(2.96, 1.38, 0.62), walnutMat);
  belfryBody.position.set(0, 2.68, -0.24);
  belfryGroup.add(belfryBody);

  // Clock Dial (Center) + Working Brass Hands
  const dialBezel = new THREE.Mesh(new THREE.TorusGeometry(0.355, 0.028, 12, 36), brassMat);
  dialBezel.position.set(0, 2.38, 0.085);
  belfryGroup.add(dialBezel);

  const dialFace = new THREE.Mesh(
    new THREE.CircleGeometry(0.345, 36),
    new THREE.MeshStandardMaterial({ map: textures.clockDialMap, roughness: 0.25 })
  );
  dialFace.position.set(0, 2.38, 0.082);
  dialFace.userData = { type: 'finaleTrigger' };
  interactiveTargets.push(dialFace);
  belfryGroup.add(dialFace);

  const hourHand = new THREE.Group();
  hourHand.position.set(0, 2.38, 0.10);
  const hMesh = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.19, 0.008), walnutMat);
  hMesh.position.y = 0.075;
  hourHand.add(hMesh);

  const minHand = new THREE.Group();
  minHand.position.set(0, 2.38, 0.108);
  const mMesh = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.27, 0.008), walnutMat);
  mMesh.position.y = 0.115;
  minHand.add(mMesh);

  const secHand = new THREE.Group();
  secHand.position.set(0, 2.38, 0.114);
  const sMesh = new THREE.Mesh(new THREE.BoxGeometry(0.007, 0.29, 0.006), goldMat);
  sMesh.position.y = 0.11;
  secHand.add(sMesh);

  const centerPin = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 10), goldMat);
  centerPin.position.set(0, 2.38, 0.12);
  belfryGroup.add(hourHand, minHand, secHand, centerPin);

  // Flanking Lapis Moon Disc (left) & Gilded Sunburst Medallion (right)
  const moonDisc = new THREE.Mesh(
    new THREE.CircleGeometry(0.20, 28),
    new THREE.MeshStandardMaterial({ map: textures.moonDiscMap, roughness: 0.3 })
  );
  moonDisc.position.set(-0.92, 2.38, 0.082);
  belfryGroup.add(moonDisc);
  const moonRim = new THREE.Mesh(new THREE.TorusGeometry(0.20, 0.018, 10, 28), brassMat);
  moonRim.position.copy(moonDisc.position);
  belfryGroup.add(moonRim);

  const sunDisc = new THREE.Group();
  sunDisc.position.set(0.92, 2.38, 0.085);
  sunDisc.add(new THREE.Mesh(new THREE.TorusGeometry(0.20, 0.018, 10, 28), brassMat));
  sunDisc.add(new THREE.Mesh(new THREE.CircleGeometry(0.195, 28), velvetMat));
  const sunCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.075, 1), goldMat);
  sunDisc.add(sunCore);
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI * 2) / 12;
    const r = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.08, 6), goldMat);
    r.position.set(Math.cos(a) * 0.125, Math.sin(a) * 0.125, 0.01);
    r.rotation.z = a - Math.PI / 2;
    sunDisc.add(r);
  }
  belfryGroup.add(sunDisc);

  // Upper Cuckoo & Herald-Angel Belfry Stage (y = 3.06)
  const belfryNiche = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.52, 0.42), velvetMat);
  belfryNiche.position.set(0, 3.06, -0.12);
  belfryGroup.add(belfryNiche);

  const belfryGlow = new THREE.Sprite(curioMats.glowSpriteMat.clone());
  belfryGlow.scale.setScalar(0.85);
  belfryGlow.position.set(0, 3.06, -0.02);
  belfryGlow.material.opacity = 0;
  belfryGroup.add(belfryGlow);

  // Automaton Cuckoo + Herald Angels sliding/rotating out of belfry!
  const belfryAutomaton = new THREE.Group();
  belfryAutomaton.position.set(0, 2.94, -0.12);

  // Mechanical Cuckoo Bird
  const cuckooBird = new THREE.Group();
  cuckooBird.position.set(0, 0.12, 0.06);
  const cBody = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), curioMats.sapphire);
  cBody.scale.set(0.85, 0.85, 1.45);
  cuckooBird.add(cBody);
  const cWingL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.01, 0.06), goldMat);
  cWingL.position.set(-0.055, 0.02, 0);
  const cWingR = cWingL.clone();
  cWingR.position.x = 0.055;
  const cBeak = new THREE.Mesh(new THREE.ConeGeometry(0.015, 0.045, 6), goldMat);
  cBeak.rotation.x = Math.PI / 2;
  cBeak.position.set(0, 0.02, 0.095);
  cuckooBird.add(cWingL, cWingR, cBeak);
  belfryAutomaton.add(cuckooBird);

  // Flanking Herald Angels
  for (let s of [-0.22, 0.22]) {
    const angel = new THREE.Group();
    angel.position.set(s, 0.02, 0.04);
    const robe = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.16, 10), curioMats.porcelain);
    robe.position.y = 0.08;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 10), curioMats.porcelain);
    head.position.y = 0.18;
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.11, 8), goldMat);
    horn.rotation.x = -Math.PI / 2 + 0.25;
    horn.position.set(0, 0.17, 0.065);
    angel.add(robe, head, horn);
    belfryAutomaton.add(angel);
  }
  belfryGroup.add(belfryAutomaton);

  // Twin Carved Gilded Belfry Doors
  const bMatL = new THREE.MeshStandardMaterial({
    map: textures.belfryDoorLeft,
    roughness: 0.34,
    metalness: 0.22
  });
  const bMatR = new THREE.MeshStandardMaterial({
    map: textures.belfryDoorRight,
    roughness: 0.34,
    metalness: 0.22
  });

  const belfryDoorL = new THREE.Group();
  belfryDoorL.position.set(-0.42, 3.06, 0.085);
  const bLeafL = new THREE.Mesh(new THREE.BoxGeometry(0.415, 0.50, 0.035), [
    walnutTrimMat, walnutTrimMat, walnutTrimMat, walnutTrimMat, bMatL, velvetMat
  ]);
  bLeafL.position.x = 0.207;
  bLeafL.userData = { type: 'finaleTrigger' };
  interactiveTargets.push(bLeafL);
  belfryDoorL.add(bLeafL);

  const belfryDoorR = new THREE.Group();
  belfryDoorR.position.set(0.42, 3.06, 0.085);
  const bLeafR = new THREE.Mesh(new THREE.BoxGeometry(0.415, 0.50, 0.035), [
    walnutTrimMat, walnutTrimMat, walnutTrimMat, walnutTrimMat, bMatR, velvetMat
  ]);
  bLeafR.position.x = -0.207;
  bLeafR.userData = { type: 'finaleTrigger' };
  interactiveTargets.push(bLeafR);
  belfryDoorR.add(bLeafR);
  belfryGroup.add(belfryDoorL, belfryDoorR);

  // Steeply Pitched Black Forest Chalet Gable Roof + Snow Cap + Brass Finials
  for (let side of [-1, 1]) {
    const slope = new THREE.Group();
    slope.position.set(0, 3.94, -0.20);
    slope.rotation.z = side * -0.56;

    const plank = new THREE.Mesh(new THREE.BoxGeometry(2.14, 0.095, 0.88), walnutTrimMat);
    plank.position.x = side * 0.96;
    slope.add(plank);

    const giltTrim = new THREE.Mesh(new THREE.BoxGeometry(2.14, 0.024, 0.90), brassMat);
    giltTrim.position.set(side * 0.96, -0.048, 0);
    slope.add(giltTrim);

    const snowCap = new THREE.Mesh(new THREE.BoxGeometry(2.08, 0.048, 0.84), curioMats.snow);
    snowCap.position.set(side * 0.96, 0.065, 0);
    slope.add(snowCap);

    belfryGroup.add(slope);
  }

  // Counter-Clockwise Gable Triangular Tympanum Fill (seals roof peak cleanly!)
  const gableShape = new THREE.Shape();
  gableShape.moveTo(-1.62, 2.88);
  gableShape.lineTo(1.62, 2.88);
  gableShape.lineTo(0, 3.92);
  gableShape.closePath();
  const gableGeo = new THREE.ExtrudeGeometry(gableShape, { depth: 0.62, bevelEnabled: false });
  const gableMesh = new THREE.Mesh(gableGeo, walnutMat);
  gableMesh.position.set(0, 0, -0.55);
  belfryGroup.add(gableMesh);

  // Gilded Baroque Star Crest under the Gable Peak
  const gableCrest = new THREE.Group();
  gableCrest.position.set(0, 3.55, 0.085);
  gableCrest.add(new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.015, 8, 24), goldMat));
  gableCrest.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.065, 0), goldMat));
  belfryGroup.add(gableCrest);

  // Three Turned Brass Finial Spires
  [[0, 4.12], [-1.72, 3.02], [1.72, 3.02]].forEach(([fx, fy], idx) => {
    const spire = new THREE.Group();
    spire.position.set(fx, fy, -0.12);
    const orb = new THREE.Mesh(new THREE.SphereGeometry(idx === 0 ? 0.075 : 0.052, 12, 12), brassMat);
    const needle = new THREE.Mesh(new THREE.ConeGeometry(0.032, idx === 0 ? 0.28 : 0.19, 10), goldMat);
    needle.position.y = idx === 0 ? 0.16 : 0.11;
    spire.add(orb, needle);
    belfryGroup.add(spire);
  });

  // ==================== 3. LOWER LYRE PENDULUM, PINECONE WEIGHTS & CRANK ====================
  const pendulumPivot = new THREE.Group();
  pendulumPivot.position.set(0, -1.88, -0.16);
  const pRod = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.92, 8), brassMat);
  pRod.position.y = -0.46;
  const pBob = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.045, 24), goldMat);
  pBob.rotation.x = Math.PI / 2;
  pBob.position.y = -0.92;
  pendulumPivot.add(pRod, pBob);
  cabinetGroup.add(pendulumPivot);

  // Three Cast-Brass Black Forest Pinecone Weights (Interactive!)
  const weights = [];
  [[-0.78, 0.72], [-0.36, 0.98], [0.72, 0.84]].forEach(([wx, chainLen], idx) => {
    const wGroup = new THREE.Group();
    wGroup.position.set(wx, -1.90, -0.06);

    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, chainLen, 8), brassMat);
    chain.position.y = -chainLen * 0.5;
    wGroup.add(chain);

    const coneGroup = new THREE.Group();
    coneGroup.position.y = -chainLen - 0.12;
    for (let s = 0; s < 5; s++) {
      const r = 0.072 * Math.sin(((s + 1) / 6) * Math.PI);
      const scaleRing = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.82, r * 1.12, 0.055, 10), brassMat);
      scaleRing.position.y = 0.09 - s * 0.045;
      scaleRing.userData = { type: 'weight', weightIdx: idx };
      interactiveTargets.push(scaleRing);
      coneGroup.add(scaleRing);
    }
    wGroup.add(coneGroup);
    cabinetGroup.add(wGroup);
    weights.push({ group: wGroup, cone: coneGroup, baseY: -chainLen - 0.12, pullOffset: 0 });
  });

  // Right-Side Hand-Turned Brass Music Crank
  const crankPivot = new THREE.Group();
  crankPivot.position.set(1.94, -0.35, -0.12);
  const crankAxle = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.22, 12), brassMat);
  crankAxle.rotation.z = Math.PI / 2;
  crankAxle.position.x = 0.10;
  const crankArm = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.28, 0.04), goldMat);
  crankArm.position.set(0.21, 0.11, 0);
  const crankGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.024, 0.14, 12), curioMats.porcelain);
  crankGrip.rotation.z = Math.PI / 2;
  crankGrip.position.set(0.28, 0.22, 0);
  [crankAxle, crankArm, crankGrip].forEach((m) => {
    m.userData = { type: 'crank' };
    interactiveTargets.push(m);
  });
  crankPivot.add(crankAxle, crankArm, crankGrip);
  cabinetGroup.add(crankPivot);

  // ==================== 4. ALL 24 DOORS, VELVET DRAWERS & CURIOS ====================
  const compartments = {};

  for (const info of ADVENT_DAYS) {
    const cx = colCenters[info.col];
    const isTall = info.rowSpan === 2;
    const cy = isTall
      ? (rowCenters[info.row] + rowCenters[info.row + 1]) * 0.5
      : rowCenters[info.row];
    const h = isTall
      ? rowHeights[info.row] + rowHeights[info.row + 1] + 0.02
      : rowHeights[info.row];
    const w = cellW - 0.045;
    const doorThickness = 0.036;

    // Warm interior golden glow sprite inside niche
    const glow = new THREE.Sprite(curioMats.glowSpriteMat.clone());
    glow.scale.set(w * 1.35, h * 1.35, 1);
    glow.position.set(cx, cy, -0.26);
    glow.material.opacity = 0.04;
    cabinetGroup.add(glow);

    // Build bespoke 3D curio diorama
    const curio = buildCurioDiorama(info.day, curioMats, textures);
    // Invisible hit sphere inside niche so tapping the open curio triggers its toy burst!
    const curioHit = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.86, h * 0.86, 0.36),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    curioHit.userData = { type: 'curio', day: info.day };
    curio.group.add(curioHit);
    interactiveTargets.push(curioHit);

    const doorPivots = [];

    if (info.hinge === 'drawer') {
      // Pull-out Velvet Vitrine Drawer with Drop-Front Hinged Apron
      const drawerGroup = new THREE.Group();
      drawerGroup.position.set(cx, cy, 0);

      const frontDropPivot = new THREE.Group();
      frontDropPivot.position.set(0, -h * 0.5, 0.02);

      // Front marquetry panel ( crimson velvet on inner back face when folded down! )
      const panelTex = createDoorPanelTexture(info, 'full');
      const frontMat = new THREE.MeshStandardMaterial({
        map: panelTex,
        roughness: 0.34,
        metalness: 0.18
      });
      const frontFace = new THREE.Mesh(new THREE.BoxGeometry(w, h, doorThickness), [
        walnutTrimMat, walnutTrimMat, brassMat, walnutTrimMat, frontMat, velvetMat
      ]);
      frontFace.position.y = h * 0.5;
      frontFace.userData = { type: 'door', day: info.day };
      interactiveTargets.push(frontFace);
      frontDropPivot.add(frontFace);

      // Turned Brass Drawer Knob
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 10), goldMat);
      knob.position.set(0, h * 0.24, 0.032);
      knob.userData = { type: 'door', day: info.day };
      interactiveTargets.push(knob);
      frontDropPivot.add(knob);

      drawerGroup.add(frontDropPivot);

      // Velvet cushion inside drawer tray elevating the curio proudly into view
      const trayBottom = new THREE.Mesh(new THREE.BoxGeometry(w * 0.92, 0.10, 0.48), velvetMat);
      trayBottom.position.set(0, -h * 0.38, -0.24);
      drawerGroup.add(trayBottom);
      for (let side of [-1, 1]) {
        const sideRail = new THREE.Mesh(new THREE.BoxGeometry(0.022, h * 0.28, 0.48), walnutMat);
        sideRail.position.set(side * w * 0.45, -h * 0.30, -0.24);
        drawerGroup.add(sideRail);
      }

      // Mount curio onto crimson velvet cushion!
      curio.group.position.set(0, -0.02, -0.23);
      curio.group.scale.setScalar(0.95);
      drawerGroup.add(curio.group);

      cabinetGroup.add(drawerGroup);
      doorPivots.push({ pivot: drawerGroup, dropPivot: frontDropPivot, mode: 'drawer' });
    } else if (info.hinge === 'double') {
      // Symmetric Double-Leaf Sanctuary / Shrine Doors
      curio.group.position.set(cx, cy, -0.25);
      cabinetGroup.add(curio.group);

      const halfW = w * 0.5 - 0.004;
      ['left', 'right'].forEach((leafSide) => {
        const dir = leafSide === 'left' ? -1 : 1;
        const pivot = new THREE.Group();
        pivot.position.set(cx + dir * (w * 0.5), cy, 0.02);

        const leafTex = createDoorPanelTexture(info, leafSide);
        const frontMat = new THREE.MeshStandardMaterial({
          map: leafTex,
          roughness: 0.32,
          metalness: 0.22
        });
        const leafMesh = new THREE.Mesh(new THREE.BoxGeometry(halfW, h, doorThickness), [
          walnutTrimMat, walnutTrimMat, walnutTrimMat, walnutTrimMat, frontMat, velvetMat
        ]);
        leafMesh.position.x = -dir * (halfW * 0.5);
        leafMesh.userData = { type: 'door', day: info.day };
        interactiveTargets.push(leafMesh);
        pivot.add(leafMesh);

        // Brass knob placed cleanly below center numeral medallion
        const handle = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 10), goldMat);
        handle.position.set(-dir * (halfW - 0.042), isTall ? -0.36 : -h * 0.34, 0.030);
        handle.userData = { type: 'door', day: info.day };
        interactiveTargets.push(handle);
        pivot.add(handle);

        cabinetGroup.add(pivot);
        doorPivots.push({ pivot, mode: `double-${leafSide}` });
      });
    } else {
      // Single-Leaf Left or Right Casement Door with Brass Hinges
      curio.group.position.set(cx, cy, -0.25);
      cabinetGroup.add(curio.group);

      const dir = info.hinge === 'left' ? -1 : 1;
      const pivot = new THREE.Group();
      pivot.position.set(cx + dir * (w * 0.5), cy, 0.02);

      const panelTex = createDoorPanelTexture(info, 'full');
      const frontMat = new THREE.MeshStandardMaterial({
        map: panelTex,
        roughness: 0.34,
        metalness: 0.18
      });
      const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, doorThickness), [
        walnutTrimMat, walnutTrimMat, walnutTrimMat, walnutTrimMat, frontMat, velvetMat
      ]);
      doorMesh.position.x = -dir * (w * 0.5);
      doorMesh.userData = { type: 'door', day: info.day };
      interactiveTargets.push(doorMesh);
      pivot.add(doorMesh);

      // Brass knob on opposite side from hinge
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.023, 10, 10), goldMat);
      knob.position.set(-dir * (w - 0.065), 0, 0.032);
      knob.userData = { type: 'door', day: info.day };
      interactiveTargets.push(knob);
      pivot.add(knob);

      // Tiny brass barrel hinges on hinge edge
      for (let hy of [-h * 0.32, h * 0.32]) {
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.055, 8), brassMat);
        barrel.position.set(0, hy, 0.018);
        pivot.add(barrel);
      }

      cabinetGroup.add(pivot);
      doorPivots.push({ pivot, mode: info.hinge });
    }

    compartments[info.day] = {
      info,
      center: new THREE.Vector3(cx, cy, 0),
      width: w,
      height: h,
      isOpen: false,
      openProgress: 0,
      curio,
      glow,
      doorPivots
    };
  }

  // Firefly Finder Halo Sprite (highlights next unopened Advent door when requested)
  const finderHalo = new THREE.Sprite(curioMats.glowSpriteMat.clone());
  finderHalo.scale.setScalar(0.9);
  finderHalo.visible = false;
  cabinetGroup.add(finderHalo);
  let finderDay = null;
  let finderTimer = 0;

  // Belfry Finale State
  let belfryActiveTimer = 0;
  let belfryOpenProgress = 0;
  let notePulse = 0;

  // Atmosphere Transition State
  let targetAtmo = ATMOSPHERES[0];
  const tmpColor = new THREE.Color();

  function setAtmosphere(idx) {
    targetAtmo = ATMOSPHERES[((idx % ATMOSPHERES.length) + ATMOSPHERES.length) % ATMOSPHERES.length];
    return targetAtmo;
  }

  function triggerBelfryFinale(duration = 6.5) {
    belfryActiveTimer = Math.max(belfryActiveTimer, duration);
  }

  function pullWeight(weightIdx = 0) {
    const w = weights[weightIdx % weights.length];
    if (w) w.pullOffset = 0.28;
    triggerBelfryFinale(6.0);
  }

  function highlightDoor(day, duration = 4.2) {
    finderDay = day;
    finderTimer = duration;
  }

  function pulseMusicNote() {
    notePulse = 1.0;
  }

  function update(time, dt, isMusicPlaying) {
    // 1. Smoothly blend atmosphere colors & light intensities
    scene.background = scene.background || new THREE.Color(targetAtmo.bg);
    scene.background.lerp(tmpColor.setHex(targetAtmo.bg), dt * 2.5);
    if (scene.fog) {
      scene.fog.color.lerp(tmpColor.setHex(targetAtmo.fog), dt * 2.5);
    }
    ambientLight.color.lerp(tmpColor.setHex(targetAtmo.ambientColor), dt * 2.5);
    ambientLight.intensity += (targetAtmo.ambientInt - ambientLight.intensity) * dt * 2.5;

    hearthLight.color.lerp(tmpColor.setHex(targetAtmo.hearthColor), dt * 2.5);
    const flicker = Math.sin(time * 7.3) * 0.22 + Math.cos(time * 13.1) * 0.12;
    hearthLight.intensity = targetAtmo.hearthInt + flicker;

    windowLight.color.lerp(tmpColor.setHex(targetAtmo.windowColor), dt * 2.5);
    windowLight.intensity += (targetAtmo.windowInt - windowLight.intensity) * dt * 2.5;

    keyLight.color.lerp(tmpColor.setHex(targetAtmo.keyColor), dt * 2.5);
    keyLight.intensity += (targetAtmo.keyInt - keyLight.intensity) * dt * 2.5;

    rayMat.color.lerp(tmpColor.setHex(targetAtmo.rayColor), dt * 2.5);
    rayMat.opacity += (targetAtmo.rayOpacity - rayMat.opacity) * dt * 2.5;
    windowPaneMat.color.lerp(tmpColor.setHex(targetAtmo.skyTint), dt * 2.0);

    // Breathing Tyndall rays
    lightRays.forEach((r) => {
      r.mesh.position.x = r.baseX + Math.sin(time * 0.45 + r.phase) * 0.22;
      r.mesh.rotation.z = -0.36 + Math.sin(time * 0.35 + r.phase) * 0.03;
    });

    // 2. Update 3D Snowfall & Indoor Golden Dust
    const sp = snowGeo.attributes.position.array;
    for (let i = 0; i < snowCount; i++) {
      const v = snowVel[i];
      sp[i * 3] += Math.sin(time * 0.8 + v.seed) * dt * 0.35;
      sp[i * 3 + 1] -= v.vy * dt;
      if (sp[i * 3 + 1] < -6) {
        sp[i * 3 + 1] = 6;
        sp[i * 3] = (Math.random() - 0.5) * 11;
      }
    }
    snowGeo.attributes.position.needsUpdate = true;

    const dp = dustGeo.attributes.position.array;
    for (let i = 0; i < dustCount; i++) {
      dp[i * 3 + 1] += Math.sin(time * 0.6 + i) * dt * 0.08;
      dp[i * 3] += Math.cos(time * 0.45 + i * 1.3) * dt * 0.06;
    }
    dustGeo.attributes.position.needsUpdate = true;

    // 3. Real-Time Antique Clock Hands, Moon Disc, Lyre Pendulum, Weights & Crank
    const nowDate = new Date();
    const secs = nowDate.getSeconds() + nowDate.getMilliseconds() / 1000;
    const mins = nowDate.getMinutes() + secs / 60;
    const hrs = (nowDate.getHours() % 12) + mins / 60;
    secHand.rotation.z = -(secs / 60) * Math.PI * 2;
    minHand.rotation.z = -(mins / 60) * Math.PI * 2;
    hourHand.rotation.z = -(hrs / 12) * Math.PI * 2;

    moonDisc.rotation.z = time * 0.04;
    sunCore.rotation.z = -time * 0.25;
    pendulumPivot.rotation.z = Math.sin(time * Math.PI) * 0.14;

    weights.forEach((w, idx) => {
      w.pullOffset = Math.max(0, w.pullOffset - dt * 0.45);
      w.cone.position.y = w.baseY - w.pullOffset + Math.sin(time * 1.2 + idx) * 0.008;
    });

    notePulse = Math.max(0, notePulse - dt * 3.5);
    if (isMusicPlaying || belfryActiveTimer > 0) {
      crankPivot.rotation.x += dt * (2.6 + notePulse * 1.8);
    }

    // 4. Upper Cuckoo & Herald-Angel Belfry Stage Animation
    if (belfryActiveTimer > 0) {
      belfryActiveTimer = Math.max(0, belfryActiveTimer - dt);
    }
    const bTarget = belfryActiveTimer > 0 ? 1 : 0;
    belfryOpenProgress += (bTarget - belfryOpenProgress) * Math.min(1, dt * 5.2);

    belfryDoorL.rotation.y = -belfryOpenProgress * 2.05;
    belfryDoorR.rotation.y = belfryOpenProgress * 2.05;
    belfryAutomaton.position.z = -0.16 + belfryOpenProgress * 0.28;
    belfryGlow.material.opacity = belfryOpenProgress * 0.72;

    if (belfryOpenProgress > 0.05) {
      const flap = Math.sin(time * 14) * 0.55;
      cWingL.rotation.z = flap;
      cWingR.rotation.z = -flap;
      cuckooBird.rotation.x = Math.sin(time * 7) * 0.18;
    }

    // 5. Update all 24 Doors, Drawers & Curio Automata
    for (let d = 1; d <= 24; d++) {
      const comp = compartments[d];
      const target = comp.isOpen ? 1 : 0;
      comp.openProgress += (target - comp.openProgress) * Math.min(1, dt * 6.2);

      const p = comp.openProgress;
      for (const dpItem of comp.doorPivots) {
        if (dpItem.mode === 'drawer') {
          dpItem.pivot.position.z = p * 0.48;
          if (dpItem.dropPivot) {
            const drop = Math.max(0, (p - 0.18) / 0.82);
            dpItem.dropPivot.rotation.x = drop * 1.48; // Folds down ~85° like a vitrine stage!
          }
        } else if (dpItem.mode === 'double-left') {
          dpItem.pivot.rotation.y = -p * 1.72; // ~98.5° symmetric shrine shutter
        } else if (dpItem.mode === 'double-right') {
          dpItem.pivot.rotation.y = p * 1.72;
        } else if (dpItem.mode === 'left') {
          dpItem.pivot.rotation.y = -p * 2.25; // ~129° wide open past left spiral column
        } else if (dpItem.mode === 'right') {
          dpItem.pivot.rotation.y = p * 2.25;  // ~129° wide open past right spiral column
        }
      }

      comp.glow.material.opacity = 0.02 + p * (0.48 + notePulse * 0.12);
      if (p > 0.01) {
        comp.curio.update(time, dt, p);
      }
    }

    sanctuaryLight.intensity = compartments[24].openProgress * 2.4;

    // 6. Finder Firefly Halo
    if (finderTimer > 0 && finderDay && compartments[finderDay]) {
      finderTimer = Math.max(0, finderTimer - dt);
      finderHalo.visible = true;
      const c = compartments[finderDay].center;
      finderHalo.position.set(c.x, c.y, 0.22);
      const pulse = 0.75 + Math.sin(time * 8) * 0.22;
      finderHalo.scale.setScalar(pulse);
      finderHalo.material.opacity = Math.min(1, finderTimer) * 0.88;
    } else {
      finderHalo.visible = false;
    }
  }

  return {
    cabinetGroup,
    compartments,
    interactiveTargets,
    focusCurioLight,
    setAtmosphere,
    triggerBelfryFinale,
    pullWeight,
    highlightDoor,
    pulseMusicNote,
    update
  };
}
