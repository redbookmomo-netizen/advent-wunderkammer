// Three.js 3D Spatial Wunderkammer Engine:
// - Deep 3D Parlor Alcove (Z = -2.2m) with real 3D window snow, hearth firelight & floor
// - Volumetric 3D Black Forest Walnut Cabinet with displacement relief, 24 deep 0.48m shadowboxes & thick 3D hinged doors
// - "靠近 + 拿出来玩" HeldReliquary3D: physically flies out of any open niche into your hands to freely rotate 360°, wind its 3D golden key, and flip 180° to read the engraved backplate lore!

import * as THREE from 'three';
import { ADVENT_DAYS, ADVENT_BY_DAY, CABINET_WIDTH, CABINET_HEIGHT, FAIRY_LIGHT_SPOTS } from './adventData.js';
import {
  LiveCurioComposite,
  buildEngravedBackplateTexture,
  buildCabinetSideWoodTexture,
  buildSnowRoofTexture
} from './reliquaryTextures.js';

export const WORLD_CAB_W = 6.0;
export const WORLD_CAB_H = 8.0; // 6 : 8 = 1086 : 1448 = 3 : 4

export function pxToWorldX(px) {
  return (px / CABINET_WIDTH - 0.5) * WORLD_CAB_W;
}

export function pxToWorldY(py) {
  return (0.5 - py / CABINET_HEIGHT) * WORLD_CAB_H;
}

function makeGlowSpriteTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 62);
  g.addColorStop(0, 'rgba(255, 248, 215, 1)');
  g.addColorStop(0.32, 'rgba(255, 202, 108, 0.65)');
  g.addColorStop(0.7, 'rgba(255, 140, 45, 0.18)');
  g.addColorStop(1, 'rgba(255, 110, 20, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeSnowTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 1, 32, 32, 30);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.5, 'rgba(225,240,255,0.65)');
  g.addColorStop(1, 'rgba(200,225,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSpatialWunderkammer(scene) {
  const ASSET_VER = '?v=4';
  const texLoader = new THREE.TextureLoader();
  const loadSRGB = (url) => {
    const t = texLoader.load(url + ASSET_VER);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };

  const glowTex = makeGlowSpriteTexture();
  const snowTex = makeSnowTexture();

  const parlorTex = loadSRGB('assets/parlor-bg.webp');
  const facadeTex = loadSRGB('assets/cabinet-facade.webp');
  const tierGableTex = loadSRGB('assets/tier-gable.webp');
  const tierColsTex = loadSRGB('assets/tier-columns.webp');
  const tierPlinthTex = loadSRGB('assets/tier-plinth.webp');
  const bumpTex = texLoader.load('assets/cabinet-bump.jpg' + ASSET_VER);
  const pineconeLTex = loadSRGB('assets/fronts/pinecone-L.webp');
  const pineconeRTex = loadSRGB('assets/fronts/pinecone-R.webp');
  const cuckooTex = loadSRGB('assets/fronts/cuckoo.webp');

  const sideWoodTex = buildCabinetSideWoodTexture();
  const snowRoofTex = buildSnowRoofTexture();

  // Shared Materials
  const darkWalnutMat = new THREE.MeshStandardMaterial({
    color: 0x3b1e0f,
    roughness: 0.44,
    metalness: 0.14
  });

  const richWalnutLedgeMat = new THREE.MeshStandardMaterial({
    color: 0x5c3118,
    emissive: 0x1b0b03,
    emissiveIntensity: 0.22,
    roughness: 0.30,
    metalness: 0.22
  });

  const sideCabinetMat = new THREE.MeshStandardMaterial({
    map: sideWoodTex,
    bumpMap: sideWoodTex,
    bumpScale: 0.028,
    emissive: 0x261206,
    emissiveIntensity: 0.28,
    roughness: 0.36,
    metalness: 0.24
  });

  const snowRoofMat = new THREE.MeshStandardMaterial({
    map: snowRoofTex,
    bumpMap: snowRoofTex,
    bumpScale: 0.03,
    roughness: 0.55,
    metalness: 0.08
  });

  const deepNicheMat = new THREE.MeshStandardMaterial({
    color: 0x1a0b05,
    roughness: 0.72,
    metalness: 0.05,
    side: THREE.DoubleSide
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xe4bd68,
    roughness: 0.24,
    metalness: 0.86
  });

  const goldBrightMat = new THREE.MeshStandardMaterial({
    color: 0xffe296,
    emissive: 0x4a2c06,
    emissiveIntensity: 0.28,
    roughness: 0.18,
    metalness: 0.92
  });

  // ==================== 1. LIGHTING ====================
  const ambientLight = new THREE.AmbientLight(0x836858, 1.52);
  scene.add(ambientLight);

  const frontKeyLight = new THREE.DirectionalLight(0xfff0d6, 1.85);
  frontKeyLight.position.set(1.4, 3.4, 7.8);
  scene.add(frontKeyLight);

  // Cool blue winter window rim light illuminating the 1m-deep left walnut side wall & snow roof
  const windowMoonLight = new THREE.PointLight(0x8cc2ff, 4.4, 18, 1.25);
  windowMoonLight.position.set(-4.4, 1.6, 1.6);
  scene.add(windowMoonLight);

  // Warm flickering stone fireplace light illuminating the 1m-deep right walnut side wall & plinth
  const hearthFireLight = new THREE.PointLight(0xff963c, 5.4, 18, 1.28);
  hearthFireLight.position.set(4.3, -0.8, 1.8);
  scene.add(hearthFireLight);

  // Dedicated warm examination light on held 3D curio
  const heldInspectLight = new THREE.PointLight(0xfff2d4, 0, 5.5, 1.4);
  scene.add(heldInspectLight);

  // ==================== 2. DEEP 3D PARLOR ALCOVE (Z = -2.05m) ====================
  const parlorGroup = new THREE.Group();
  scene.add(parlorGroup);

  // Curved panoramic alcove backdrop safely behind the 1.02m-deep 3D cabinet!
  const parlorW = 8.4;
  const parlorH = 11.2;
  const parlorGeo = new THREE.PlaneGeometry(parlorW, parlorH, 32, 16);
  const pPos = parlorGeo.attributes.position;
  const pColors = new Float32Array(pPos.count * 3);
  const baseTint = new THREE.Color(0xf2e8de);
  for (let i = 0; i < pPos.count; i++) {
    const x = pPos.getX(i);
    const y = pPos.getY(i);
    const nx = Math.abs(x) / (parlorW * 0.5);
    const ny = Math.abs(y) / (parlorH * 0.5);
    pPos.setZ(i, Math.pow(nx, 2) * 0.56);
    const edgeFadeX = 1 - THREE.MathUtils.smoothstep(nx, 0.84, 1.0);
    const edgeFadeY = 1 - THREE.MathUtils.smoothstep(ny, 0.88, 1.0);
    const fade = edgeFadeX * edgeFadeY;
    pColors[i * 3] = 0.043 + (baseTint.r - 0.043) * fade;
    pColors[i * 3 + 1] = 0.024 + (baseTint.g - 0.024) * fade;
    pColors[i * 3 + 2] = 0.016 + (baseTint.b - 0.016) * fade;
  }
  parlorGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
  parlorGeo.computeVertexNormals();
  const parlorMesh = new THREE.Mesh(
    parlorGeo,
    new THREE.MeshBasicMaterial({
      map: parlorTex,
      vertexColors: true,
      fog: false
    })
  );
  parlorMesh.position.set(0, 0.04, -2.05);
  parlorGroup.add(parlorMesh);

  // 3D Parlor Oak & Rug Floor Plane extending forward under the cabinet
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 6.5),
    new THREE.MeshStandardMaterial({
      color: 0x26120c,
      roughness: 0.62,
      metalness: 0.08
    })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, -3.82, -0.2);
  parlorGroup.add(floorMesh);

  // 3D Falling Window Snowflakes (left side X: -5.2 .. -1.8, Z: -1.9 .. -0.8)
  const snowCount = 160;
  const snowArr = new Float32Array(snowCount * 3);
  const snowSeeds = [];
  for (let i = 0; i < snowCount; i++) {
    snowArr[i * 3] = -5.2 + Math.random() * 3.3;
    snowArr[i * 3 + 1] = -2.5 + Math.random() * 7.2;
    snowArr[i * 3 + 2] = -1.95 + Math.random() * 1.1;
    snowSeeds.push(0.5 + Math.random() * 0.9);
  }
  const snowGeo = new THREE.BufferGeometry();
  snowGeo.setAttribute('position', new THREE.BufferAttribute(snowArr, 3));
  const snowPoints = new THREE.Points(
    snowGeo,
    new THREE.PointsMaterial({
      map: snowTex,
      size: 0.09,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  scene.add(snowPoints);

  // 3D Floating Fireplace Embers (right side X: +2.3 .. +4.8, Z: -1.8 .. -0.9)
  const emberCount = 55;
  const emberArr = new Float32Array(emberCount * 3);
  for (let i = 0; i < emberCount; i++) {
    emberArr[i * 3] = 2.4 + Math.random() * 2.2;
    emberArr[i * 3 + 1] = -2.8 + Math.random() * 2.6;
    emberArr[i * 3 + 2] = -1.85 + Math.random() * 0.8;
  }
  const emberGeo = new THREE.BufferGeometry();
  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberArr, 3));
  const emberPoints = new THREE.Points(
    emberGeo,
    new THREE.PointsMaterial({
      map: glowTex,
      color: 0xff9d3b,
      size: 0.13,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  scene.add(emberPoints);

  // 3D Floating Golden Dust Motes IN FRONT OF the Cabinet (Z: +0.2 .. +2.8) for rich spatial air!
  const dustCount = 95;
  const dustArr = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustArr[i * 3] = (Math.random() - 0.5) * 6.5;
    dustArr[i * 3 + 1] = (Math.random() - 0.5) * 7.6;
    dustArr[i * 3 + 2] = 0.25 + Math.random() * 2.6;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustArr, 3));
  const dustPoints = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      map: glowTex,
      color: 0xffe2a0,
      size: 0.075,
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  scene.add(dustPoints);

  // ==================== 3. VOLUMETRIC 3D BLACK FOREST FURNITURE ARCHITECTURE ====================
  const cabinetGroup = new THREE.Group();
  scene.add(cabinetGroup);

  const interactiveMeshes = [];

  // Helper: build laminated multi-slice 3D carved wood volume from an RGBA cutout texture!
  // Gives real solid carved timber side thickness & eliminates any flat 2D sheet feeling!
  function buildLaminatedWoodTier(tex, w, h, centerY, frontZ, thickness, slices = 5) {
    const grp = new THREE.Group();
    const geo = new THREE.PlaneGeometry(w, h);

    // Front high-detail relief face
    const frontMat = new THREE.MeshStandardMaterial({
      map: tex,
      bumpMap: tex,
      bumpScale: 0.032,
      transparent: true,
      alphaTest: 0.22,
      roughness: 0.34,
      metalness: 0.24
    });
    const frontFace = new THREE.Mesh(geo, frontMat);
    frontFace.position.set(0, centerY, frontZ);
    grp.add(frontFace);

    // Solid carved walnut edge-extrusion slices receding behind frontZ
    const sliceMat = new THREE.MeshStandardMaterial({
      map: tex,
      color: 0x5c3219,
      emissive: 0x1d0c04,
      emissiveIntensity: 0.20,
      transparent: true,
      alphaTest: 0.26,
      roughness: 0.42,
      metalness: 0.26,
      side: THREE.DoubleSide
    });
    for (let i = 1; i <= slices; i++) {
      const m = new THREE.Mesh(geo, sliceMat);
      m.position.set(0, centerY, frontZ - (thickness * i) / slices);
      grp.add(m);
    }
    cabinetGroup.add(grp);
    return grp;
  }

  // 3A. Recessed Central 24-Door Bay Facade (Z = 0.00m, razor-clean alphaTest: 0.22!)
  const facadeGeo = new THREE.PlaneGeometry(WORLD_CAB_W, WORLD_CAB_H, 54, 72);
  const facadeMat = new THREE.MeshStandardMaterial({
    map: facadeTex,
    bumpMap: bumpTex,
    bumpScale: 0.052,
    displacementMap: bumpTex,
    displacementScale: 0.036,
    displacementBias: -0.018,
    transparent: true,
    alphaTest: 0.22,
    roughness: 0.38,
    metalness: 0.18
  });
  const facadeMesh = new THREE.Mesh(facadeGeo, facadeMat);
  facadeMesh.position.z = 0;
  cabinetGroup.add(facadeMesh);

  // 3B. Deep 1.02m Coffered Walnut & Brass Cabinet Trunk (Z: +0.02m -> -1.00m!)
  const trunkDepth = 1.02;
  const trunkMidZ = -0.49; // spans [-1.00 .. +0.02]
  const trunkXLeft = pxToWorldX(202);  // -1.90m
  const trunkXRight = pxToWorldX(884); // +1.87m
  const trunkTopY = pxToWorldY(314);   // +2.26m
  const trunkBotY = pxToWorldY(1192);  // -2.59m
  const trunkH = trunkTopY - trunkBotY;
  const trunkMidY = (trunkTopY + trunkBotY) * 0.5;

  for (const [sx, sign] of [[trunkXLeft, -1], [trunkXRight, 1]]) {
    // Coffered walnut-and-brass 3D side panel wall
    const wallMats = [
      sideCabinetMat,
      sideCabinetMat,
      richWalnutLedgeMat,
      darkWalnutMat,
      richWalnutLedgeMat,
      darkWalnutMat
    ];
    const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.09, trunkH, trunkDepth), wallMats);
    sideWall.position.set(sx, trunkMidY, trunkMidZ);
    cabinetGroup.add(sideWall);

    // Protruding 3D Brass Cornice Molding Bars along top & middle of each 1m-deep side wall
    for (const moldY of [trunkTopY - 0.12, trunkMidY + 0.82, trunkMidY - 0.82]) {
      const sideMold = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.055, trunkDepth * 0.94), brassMat);
      sideMold.position.set(sx + sign * 0.05, moldY, trunkMidZ);
      cabinetGroup.add(sideMold);
    }

    // Ornate 3D Sculpted Brass Lion-Ring Side Carrying Handle!
    const handleRosette = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.10, 0.04, 18), brassMat);
    handleRosette.rotation.z = Math.PI / 2;
    handleRosette.position.set(sx + sign * 0.055, trunkMidY + 0.06, trunkMidZ + 0.04);
    const handleRing = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.024, 10, 24), goldBrightMat);
    handleRing.rotation.y = Math.PI / 2;
    handleRing.position.set(sx + sign * 0.075, trunkMidY - 0.06, trunkMidZ + 0.04);
    cabinetGroup.add(handleRosette, handleRing);
  }

  // Solid Rear Cabinet Backboard at Z = -1.00m
  const backBoard = new THREE.Mesh(
    new THREE.BoxGeometry(trunkXRight - trunkXLeft + 0.08, trunkH + 0.1, 0.06),
    darkWalnutMat
  );
  backBoard.position.set(0, trunkMidY, -1.00);
  cabinetGroup.add(backBoard);

  // 3C. 1.00m-Deep Triangular Walnut Attic Gable Hull + 3D Octagonal Castle Turrets + 1.12m Overhanging Snow Roof!
  const atticShape = new THREE.Shape();
  atticShape.moveTo(trunkXLeft + 0.02, trunkTopY - 0.05);
  atticShape.lineTo(trunkXRight - 0.02, trunkTopY - 0.05);
  atticShape.lineTo(pxToWorldX(542), pxToWorldY(56));
  atticShape.closePath();
  const atticGeo = new THREE.ExtrudeGeometry(atticShape, { depth: 1.00, bevelEnabled: false });
  atticGeo.translate(0, 0, -1.00);
  const atticHull = new THREE.Mesh(atticGeo, sideCabinetMat);
  cabinetGroup.add(atticHull);

  // Two Real 3D Octagonal Rooftop Turret Towers & Snow Spire Cones tucked cleanly behind left (px=344) & right (px=716) spires!
  for (const tPx of [344, 716]) {
    const tx = pxToWorldX(tPx);
    const towerBaseY = pxToWorldY(138);
    const towerDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.46, 8), sideCabinetMat);
    towerDrum.position.set(tx, towerBaseY - 0.02, -0.15);
    const spireCone = new THREE.Mesh(new THREE.ConeGeometry(0.155, 0.48, 8), snowRoofMat);
    spireCone.position.set(tx, towerBaseY + 0.44, -0.15);
    const finialPin = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 10), goldBrightMat);
    finialPin.position.set(tx, towerBaseY + 0.69, -0.15);
    cabinetGroup.add(towerDrum, spireCone, finialPin);
  }

  // Thick 1.12m-Deep Pitched Chalet Snow-Shingle Roof Slabs (Z: +0.09m -> -1.03m!) & Exposed Wooden Eave Rafters!
  const roofDepth = 1.12;
  const roofMidZ = -0.47; // [+0.09 .. -1.03]
  const apexX = pxToWorldX(542);
  const apexY = pxToWorldY(44);
  [
    { tipX: pxToWorldX(106), tipY: pxToWorldY(302) },
    { tipX: pxToWorldX(984), tipY: pxToWorldY(300) }
  ].forEach(({ tipX, tipY }) => {
    const dx = tipX - apexX;
    const dy = tipY - apexY;
    const len = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    const roofMats = [
      richWalnutLedgeMat,
      richWalnutLedgeMat,
      snowRoofMat,       // Top snow-shingle surface!
      richWalnutLedgeMat, // Warm walnut underside soffit!
      richWalnutLedgeMat,
      darkWalnutMat
    ];
    const slab = new THREE.Mesh(new THREE.BoxGeometry(len, 0.11, roofDepth), roofMats);
    slab.position.set((apexX + tipX) * 0.5, (apexY + tipY) * 0.5 - 0.03, roofMidZ);
    slab.rotation.z = angle;
    cabinetGroup.add(slab);

    // 3 Exposed 3D Carved Walnut Purlin Rafters running the full 1.14m depth under each overhanging eave!
    for (const frac of [0.42, 0.68, 0.90]) {
      const rx = apexX + dx * frac;
      const ry = apexY + dy * frac - 0.10;
      const purlin = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.085, roofDepth + 0.04), richWalnutLedgeMat);
      purlin.position.set(rx, ry, roofMidZ + 0.01);
      purlin.rotation.z = angle;
      cabinetGroup.add(purlin);
    }
  });

  // 3D Snow Ridge Cap Beam along the roof apex
  const ridgeCap = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, roofDepth, 8), snowRoofMat);
  ridgeCap.rotation.x = Math.PI / 2;
  ridgeCap.position.set(apexX, apexY - 0.02, roofMidZ);
  cabinetGroup.add(ridgeCap);

  // 3D. Forward-Stepped Tier 1: Laminated Upper Gable, Stags, Clock Bezel & Wunderkammer Scroll Plaque (Z = +0.11m!)
  const gableH = (456 / CABINET_HEIGHT) * WORLD_CAB_H;
  const gableCy = pxToWorldY(456 * 0.5);
  buildLaminatedWoodTier(tierGableTex, WORLD_CAB_W, gableH, gableCy, 0.11, 0.095, 5);

  // 3D Turned Brass Clock Bezel Ring & Recessed Scroll Backing (strictly behind +0.11m!)
  const clockCx = pxToWorldX(546);
  const clockCy = pxToWorldY(246);
  const clockBezelRing = new THREE.Mesh(new THREE.TorusGeometry(0.425, 0.022, 12, 36), brassMat);
  clockBezelRing.position.set(clockCx, clockCy, 0.120);
  cabinetGroup.add(clockBezelRing);

  const plaqueBack = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.42, 0.07), richWalnutLedgeMat);
  plaqueBack.position.set(pxToWorldX(542), pxToWorldY(390), 0.045); // [+0.01 .. +0.08] < +0.11!
  cabinetGroup.add(plaqueBack);

  // 3E. Forward-Stepped Tier 2: Laminated Baroque Spiral Columns & Frosted Corner Pine Trees (Z = +0.115m!)
  const colsH = ((1212 - 300) / CABINET_HEIGHT) * WORLD_CAB_H;
  const colsCy = pxToWorldY((300 + 1212) * 0.5);
  buildLaminatedWoodTier(tierColsTex, WORLD_CAB_W, colsH, colsCy, 0.115, 0.095, 4);

  // Real 3D Turned Cylindrical Walnut Pillars tucked cleanly behind the carved spiral column relief!
  for (const colPx of [216, 868]) {
    const colX = pxToWorldX(colPx);
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.105, 4.50, 16), richWalnutLedgeMat);
    pillar.position.set(colX, -0.14, -0.025); // front at +0.08 < +0.115 so carved spiral vines shine cleanly!
    cabinetGroup.add(pillar);
  }

  // 3F. Forward-Stepped Tier 3: 1.20m-Deep Stepped Baroque Mahogany Plinth Chest & 22cm Top Shelf Ledge (Z = +0.19m!)
  const plinthFrontZ = 0.185;
  const plinthBackZ = -1.015;
  const plinthDepth = plinthFrontZ - plinthBackZ; // 1.20m!
  const plinthMidZ = (plinthFrontZ + plinthBackZ) * 0.5;
  const ledgeTopY = pxToWorldY(1192); // -2.59m

  // Gleaming 22cm-forward 3D Beveled Walnut Top Shelf Ledge + Brass Edge Molding!
  const plinthShelf = new THREE.Mesh(new THREE.BoxGeometry(4.28, 0.085, plinthDepth), richWalnutLedgeMat);
  plinthShelf.position.set(0, ledgeTopY - 0.02, plinthMidZ);
  cabinetGroup.add(plinthShelf);

  const shelfBrassTrim = new THREE.Mesh(new THREE.BoxGeometry(4.32, 0.032, plinthDepth + 0.02), brassMat);
  shelfBrassTrim.position.set(0, ledgeTopY + 0.015, plinthMidZ);
  cabinetGroup.add(shelfBrassTrim);

  // Solid 1.16m-deep Paneled Walnut Plinth Chest Body
  const plinthChest = new THREE.Mesh(
    new THREE.BoxGeometry(4.14, 0.78, plinthDepth - 0.05),
    [sideCabinetMat, sideCabinetMat, richWalnutLedgeMat, darkWalnutMat, richWalnutLedgeMat, darkWalnutMat]
  );
  plinthChest.position.set(0, ledgeTopY - 0.44, plinthMidZ - 0.01);
  cabinetGroup.add(plinthChest);

  // Four Sculpted 3D Golden Corner Foot Blocks recessed behind the carved lion-paw front feet!
  for (const fx of [-1.92, 1.90]) {
    for (const fz of [-0.08, -0.88]) {
      const footBlock = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 0.32, 12), brassMat);
      footBlock.position.set(fx, ledgeTopY - 0.90, fz);
      const footClaw = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), goldBrightMat);
      footClaw.scale.set(1.1, 0.62, 1.2);
      footClaw.position.set(fx, ledgeTopY - 1.04, fz + 0.03);
      cabinetGroup.add(footBlock, footClaw);
    }
  }

  // Laminated Front Carved Apron, Pine Garlands & Red Velvet Compass Bow at Z = +0.195m!
  const plinthTierH = ((1448 - 1180) / CABINET_HEIGHT) * WORLD_CAB_H;
  const plinthTierCy = pxToWorldY((1180 + 1448) * 0.5);
  buildLaminatedWoodTier(tierPlinthTex, WORLD_CAB_W, plinthTierH, plinthTierCy, 0.195, 0.08, 4);

  // 3G. Volumetric Crossed-Plane 3D Hanging Pinecones on 3D Brass Chains (Z = +0.23m in front of columns!)
  const pinecones = [];
  [
    { tex: pineconeLTex, box: [112, 340, 180, 818], idx: 0 },
    { tex: pineconeRTex, box: [896, 338, 966, 820], idx: 1 }
  ].forEach(({ tex, box, idx }) => {
    const [x1, y1, x2, y2] = box;
    const w = ((x2 - x1) / CABINET_WIDTH) * WORLD_CAB_W;
    const h = ((y2 - y1) / CABINET_HEIGHT) * WORLD_CAB_H;
    const cx = pxToWorldX((x1 + x2) * 0.5);
    const topY = pxToWorldY(y1);

    const pivot = new THREE.Group();
    pivot.position.set(cx, topY, 0.23);

    const pcMat = new THREE.MeshStandardMaterial({
      map: tex,
      bumpMap: tex,
      bumpScale: 0.025,
      transparent: true,
      alphaTest: 0.16,
      roughness: 0.34,
      metalness: 0.28,
      side: THREE.DoubleSide
    });
    const planeGeo = new THREE.PlaneGeometry(w, h);
    const meshA = new THREE.Mesh(planeGeo, pcMat);
    meshA.position.y = -h * 0.5;
    meshA.userData = { type: 'pinecone', idx };
    interactiveMeshes.push(meshA);

    // Second crossed 75° plane + 3D brass chain rod so pinecone is rounded in 3D from side angles!
    const meshB = new THREE.Mesh(planeGeo, pcMat);
    meshB.position.y = -h * 0.5;
    meshB.rotation.y = Math.PI * 0.42;
    meshB.userData = { type: 'pinecone', idx };
    interactiveMeshes.push(meshB);

    const chainRod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, h * 0.56, 8), goldBrightMat);
    chainRod.position.y = -h * 0.28;

    pivot.add(meshA, meshB, chainRod);
    cabinetGroup.add(pivot);
    pinecones.push({ pivot, baseTopY: topY, pullOffset: 0 });
  });

  // 3H. Pop-Out 3D Cuckoo Bird (Z = +0.135m -> +0.30m!) + Sweeping Gold Clock Hand + 3D Sliding Roof Switches!
  const cuckooGroup = new THREE.Group();
  const cuckooCx = pxToWorldX((521 + 576) * 0.5);
  const cuckooCy = pxToWorldY((99 + 163) * 0.5);
  cuckooGroup.position.set(cuckooCx, cuckooCy, 0.135);
  const cuckooPerch = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.025, 0.16), richWalnutLedgeMat);
  cuckooPerch.position.set(0, -0.14, -0.04);
  const cuckooMesh = new THREE.Mesh(
    new THREE.PlaneGeometry((55 / CABINET_WIDTH) * WORLD_CAB_W, (64 / CABINET_HEIGHT) * WORLD_CAB_H),
    new THREE.MeshStandardMaterial({ map: cuckooTex, transparent: true, alphaTest: 0.15, roughness: 0.35, side: THREE.DoubleSide })
  );
  cuckooMesh.userData = { type: 'cuckoo' };
  interactiveMeshes.push(cuckooMesh);
  cuckooGroup.add(cuckooPerch, cuckooMesh);
  cabinetGroup.add(cuckooGroup);

  // Clock Dial Hotspot & 3D Sweeping Gold Second Hand at Z = +0.148m
  const clockHit = new THREE.Mesh(
    new THREE.CircleGeometry(0.42, 24),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  clockHit.position.set(clockCx, clockCy, 0.145);
  clockHit.userData = { type: 'cuckoo' };
  interactiveMeshes.push(clockHit);
  cabinetGroup.add(clockHit);

  const secHandPivot = new THREE.Group();
  secHandPivot.position.set(clockCx, clockCy, 0.148);
  const secNeedle = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.36, 0.010), goldBrightMat);
  secNeedle.position.y = 0.11;
  const secPin = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 12), goldBrightMat);
  secHandPivot.add(secNeedle, secPin);
  cabinetGroup.add(secHandPivot);

  // Two 3D Sliding Brass Toggle Switches mounted proud on the Gable Eave!
  function buildRoofSwitch3D(rectPx, slotPx, actionType) {
    const [x1, y1, x2, y2] = rectPx;
    const hit = new THREE.Mesh(
      new THREE.PlaneGeometry(((x2 - x1) / CABINET_WIDTH) * WORLD_CAB_W, ((y2 - y1) / CABINET_HEIGHT) * WORLD_CAB_H),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hit.position.set(pxToWorldX((x1 + x2) * 0.5), pxToWorldY((y1 + y2) * 0.5), 0.145);
    hit.userData = { type: actionType };
    interactiveMeshes.push(hit);
    cabinetGroup.add(hit);

    const [sx1, sy1, sx2, sy2] = slotPx;
    const sw = ((sx2 - sx1) / CABINET_WIDTH) * WORLD_CAB_W;
    const sh = ((sy2 - sy1) / CABINET_HEIGHT) * WORLD_CAB_H;
    const scx = pxToWorldX((sx1 + sx2) * 0.5);
    const scy = pxToWorldY((sy1 + sy2) * 0.5);

    const trackMesh = new THREE.Mesh(
      new THREE.BoxGeometry(sw * 0.88, sh * 0.85, 0.016),
      new THREE.MeshStandardMaterial({ color: 0x221008, roughness: 0.6 })
    );
    trackMesh.position.set(scx, scy, 0.098);
    cabinetGroup.add(trackMesh);

    const knob = new THREE.Mesh(new THREE.CapsuleGeometry(sh * 0.42, sw * 0.20, 8, 12), goldBrightMat);
    knob.rotation.z = Math.PI / 2;
    knob.position.set(scx - sw * 0.20, scy, 0.130);
    knob.userData = { type: actionType };
    interactiveMeshes.push(knob);
    cabinetGroup.add(knob);

    return { knob, trackMesh, scx, travel: sw * 0.22, active: false };
  }

  const switchDate3D = buildRoofSwitch3D([714, 214, 922, 266], [864, 229, 907, 250], 'switchDate');
  const switchOpenAll3D = buildRoofSwitch3D([726, 276, 920, 328], [864, 291, 907, 312], 'switchOpenAll');

  // 3I. Twinkling 3D Fairy Light Sprites across the Cabinet
  const fairySprites = FAIRY_LIGHT_SPOTS.map(([fx, fy, sc], idx) => {
    const sp = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex,
        color: 0xffd685,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    const baseScale = 0.16 * sc;
    sp.scale.setScalar(baseScale);
    const fz = (fx < 252 || fx > 842) ? 0.14 : 0.048;
    sp.position.set(pxToWorldX(fx), pxToWorldY(fy), fz);
    cabinetGroup.add(sp);
    return { sprite: sp, baseScale, phase: idx * 1.37 };
  });

  // ==================== 4. 24 DEEP 3D RECESSED SHADOWBOXES & THICK 3D HINGED DOORS ====================
  const compartments = {};
  const nicheDepth = 0.48;
  const doorThick = 0.034;
  const loadedDoorImages = {};

  for (const info of ADVENT_DAYS) {
    const [x1, y1, x2, y2] = info.rect;
    const w = ((x2 - x1) / CABINET_WIDTH) * WORLD_CAB_W;
    const h = ((y2 - y1) / CABINET_HEIGHT) * WORLD_CAB_H;
    const cx = pxToWorldX((x1 + x2) * 0.5);
    const cy = pxToWorldY((y1 + y2) * 0.5);
    const pad = String(info.day).padStart(2, '0');

    // 4-walled recessed 3D shadowbox cavity strictly behind facade displacement (-0.028 -> -nicheDepth)
    const cavityGroup = new THREE.Group();
    cavityGroup.position.set(cx, cy, -0.028);

    const topWall = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.04, nicheDepth), deepNicheMat);
    topWall.rotation.x = Math.PI / 2;
    topWall.position.set(0, h * 0.5, -nicheDepth * 0.5);

    const botWall = topWall.clone();
    botWall.position.y = -h * 0.5;

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(nicheDepth, h + 0.04), deepNicheMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-w * 0.5, 0, -nicheDepth * 0.5);

    const rightWall = leftWall.clone();
    rightWall.position.x = w * 0.5;

    cavityGroup.add(topWall, botWall, leftWall, rightWall);

    // Preload HTML Image for both Three.js niche preview & LiveCurioComposite!
    const imgUrl = `assets/doors/door-${pad}.webp`;
    const htmlImg = new Image();
    htmlImg.decoding = 'async';
    htmlImg.src = imgUrl;
    loadedDoorImages[info.day] = htmlImg;

    const innerTex = loadSRGB(imgUrl);

    // Mini 3D Curio Block resting deep inside the niche (slides invisible when flying out as HeldReliquary!)
    const inNicheCurio = new THREE.Group();
    inNicheCurio.position.set(0, 0, -0.27);

    const nicheArtMat = new THREE.MeshStandardMaterial({
      map: innerTex,
      roughness: 0.42,
      metalness: 0.08,
      emissive: 0xffb85c,
      emissiveIntensity: 0.14
    });
    const nicheArtBox = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.94, h * 0.94, 0.08),
      [brassMat, brassMat, brassMat, brassMat, nicheArtMat, darkWalnutMat]
    );
    nicheArtBox.userData = { type: 'nicheCurio', day: info.day };
    interactiveMeshes.push(nicheArtBox);
    inNicheCurio.add(nicheArtBox);
    cavityGroup.add(inNicheCurio);

    // Warm interior golden glow sprite inside niche
    const nicheGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex,
        color: 0xffcf7d,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    nicheGlow.scale.set(w * 1.45, h * 1.45, 1);
    nicheGlow.position.set(0, 0, -0.19);
    cavityGroup.add(nicheGlow);

    cabinetGroup.add(cavityGroup);

    // Build Thick Pixel-Exact 3D Hinged Carved & Gilded Door(s) at Z = +0.014
    const doorPivots = [];

    const makeLeaf = (frontUrl, leafW, leafH, dirSign) => {
      const pivot = new THREE.Group();
      pivot.position.set(cx + dirSign * (w * 0.5), cy, 0.014);

      const frontTex = loadSRGB(frontUrl);
      const planeGeo = new THREE.PlaneGeometry(leafW, leafH);
      const offsetX = -dirSign * (leafW * 0.5);

      // 1. Exterior Carved Baroque Relief Face (+Z)
      const frontPlane = new THREE.Mesh(
        planeGeo,
        new THREE.MeshStandardMaterial({
          map: frontTex,
          bumpMap: frontTex,
          bumpScale: 0.022,
          transparent: true,
          alphaTest: 0.14,
          roughness: 0.34,
          metalness: 0.24
        })
      );
      frontPlane.position.set(offsetX, 0, doorThick * 0.5);
      frontPlane.userData = { type: 'door', day: info.day };
      interactiveMeshes.push(frontPlane);
      pivot.add(frontPlane);

      // 2. Pixel-Exact Solid Walnut & Brass 3D Thickness Core Slices
      const coreMat = new THREE.MeshStandardMaterial({
        map: frontTex,
        color: 0x7c4822,
        emissive: 0x241105,
        emissiveIntensity: 0.22,
        transparent: true,
        alphaTest: 0.16,
        roughness: 0.38,
        metalness: 0.36,
        side: THREE.DoubleSide
      });
      for (const zFrac of [-0.18, 0.18]) {
        const coreSlice = new THREE.Mesh(planeGeo, coreMat);
        coreSlice.position.set(offsetX, 0, doorThick * zFrac);
        pivot.add(coreSlice);
      }

      // 3. Interior Burnished Antique-Brass Filigree Lining (-Z, visible when swung open!)
      const innerGeo = planeGeo.clone();
      const iUv = innerGeo.attributes.uv;
      for (let i = 0; i < iUv.count; i++) {
        iUv.setX(i, 1 - iUv.getX(i));
      }
      const innerDoorPlane = new THREE.Mesh(
        innerGeo,
        new THREE.MeshStandardMaterial({
          map: frontTex,
          bumpMap: frontTex,
          bumpScale: 0.018,
          color: 0xe6b86a,
          emissive: 0x4d2c0b,
          emissiveIntensity: 0.36,
          transparent: true,
          alphaTest: 0.14,
          roughness: 0.28,
          metalness: 0.64
        })
      );
      innerDoorPlane.position.set(offsetX, 0, -doorThick * 0.5);
      innerDoorPlane.rotation.y = Math.PI;
      innerDoorPlane.userData = { type: 'door', day: info.day };
      interactiveMeshes.push(innerDoorPlane);
      pivot.add(innerDoorPlane);

      cabinetGroup.add(pivot);
      return pivot;
    };

    if (info.hinge === 'double') {
      const pL = makeLeaf('assets/fronts/front-24L.webp', w * 0.5, h, -1);
      const pR = makeLeaf('assets/fronts/front-24R.webp', w * 0.5, h, 1);
      doorPivots.push({ pivot: pL, dir: -1 }, { pivot: pR, dir: 1 });
    } else {
      const dir = info.hinge === 'left' ? -1 : 1;
      const p = makeLeaf(`assets/fronts/front-${pad}.webp`, w, h, dir);
      doorPivots.push({ pivot: p, dir });
    }

    compartments[info.day] = {
      info,
      center: new THREE.Vector3(cx, cy, 0),
      width: w,
      height: h,
      isOpen: false,
      openProgress: 0,
      doorPivots,
      inNicheCurio,
      nicheGlow,
      htmlImg
    };
  }

  // ==================== 5. HELD-IN-HAND 3D CURIO RELIQUARY ("拿出来玩"!) ====================
  // A rich, multi-plane 3D Brass & Mahogany Shadowbox Reliquary with refractive crystal glass,
  // turnable 3D golden wind-up key, 3D bursting starlight motes, and engraved 180° backplate lore!
  const reliquaryComposite = new LiveCurioComposite();
  const heldGroup = new THREE.Group();
  heldGroup.visible = false;
  scene.add(heldGroup);

  const relW = 1.26;
  const relH = 1.68; // 3 : 4
  const relDepth = 0.18;

  const relTiltGroup = new THREE.Group();
  heldGroup.add(relTiltGroup);

  // 5A. Outer Mahogany Shadowbox Walls (open front so camera peers into real 3D cavity!)
  const wallT = 0.045;
  const topBar = new THREE.Mesh(new THREE.BoxGeometry(relW + wallT * 2, wallT, relDepth), darkWalnutMat);
  topBar.position.y = relH * 0.5 + wallT * 0.5;
  const botBar = topBar.clone();
  botBar.position.y = -(relH * 0.5 + wallT * 0.5);

  const leftBar = new THREE.Mesh(new THREE.BoxGeometry(wallT, relH, relDepth), darkWalnutMat);
  leftBar.position.x = -(relW * 0.5 + wallT * 0.5);
  const rightBar = leftBar.clone();
  rightBar.position.x = relW * 0.5 + wallT * 0.5;

  const backSlab = new THREE.Mesh(new THREE.BoxGeometry(relW + wallT * 2, relH + wallT * 2, 0.025), darkWalnutMat);
  backSlab.position.z = -relDepth * 0.5;
  relTiltGroup.add(topBar, botBar, leftBar, rightBar, backSlab);

  // Front Sculpted Gilded Brass Bezel Moldings + 4 Corner Rosette Bosses
  const bezelZ = relDepth * 0.5 + 0.008;
  const bzTop = new THREE.Mesh(new THREE.BoxGeometry(relW + wallT * 2.2, 0.048, 0.026), brassMat);
  bzTop.position.set(0, relH * 0.5 + wallT * 0.5, bezelZ);
  const bzBot = bzTop.clone();
  bzBot.position.y = -(relH * 0.5 + wallT * 0.5);
  const bzLeft = new THREE.Mesh(new THREE.BoxGeometry(0.048, relH + wallT * 2.2, 0.026), brassMat);
  bzLeft.position.set(-(relW * 0.5 + wallT * 0.5), 0, bezelZ);
  const bzRight = bzLeft.clone();
  bzRight.position.x = relW * 0.5 + wallT * 0.5;
  relTiltGroup.add(bzTop, bzBot, bzLeft, bzRight);

  for (const [bx, by] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
    const boss = new THREE.Mesh(new THREE.OctahedronGeometry(0.042, 1), goldBrightMat);
    boss.position.set(bx * (relW * 0.5 + wallT * 0.5), by * (relH * 0.5 + wallT * 0.5), bezelZ + 0.015);
    relTiltGroup.add(boss);
  }

  // 5B. Deep Interior Plane 1 (z = -0.068): Live 60fps Animated Curio Artwork!
  const liveArtPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(relW, relH),
    new THREE.MeshBasicMaterial({ map: reliquaryComposite.texture })
  );
  liveArtPlane.position.z = -0.068;
  liveArtPlane.userData = { type: 'heldCurioFront' };
  interactiveMeshes.push(liveArtPlane);
  relTiltGroup.add(liveArtPlane);

  // 5C. Midground 3D Parallax Focal Layer (z = +0.012 — 8cm in front of background for deep peep-box parallax!)
  const midParallaxPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(relW * 0.88, relH * 0.88),
    new THREE.MeshBasicMaterial({
      map: reliquaryComposite.midTexture,
      transparent: true,
      depthWrite: false
    })
  );
  midParallaxPlane.position.z = 0.012;
  relTiltGroup.add(midParallaxPlane);

  // 5D. 3D Floating Starlight Particles INSIDE & AROUND the Held Curio!
  const curioSparkCount = 38;
  const curioSparkArr = new Float32Array(curioSparkCount * 3);
  const curioSparkVel = [];
  for (let i = 0; i < curioSparkCount; i++) {
    curioSparkArr[i * 3] = (Math.random() - 0.5) * relW * 0.88;
    curioSparkArr[i * 3 + 1] = (Math.random() - 0.5) * relH * 0.88;
    curioSparkArr[i * 3 + 2] = -0.04 + Math.random() * 0.14;
    curioSparkVel.push({ phase: Math.random() * 10, spd: 0.25 + Math.random() * 0.45 });
  }
  const curioSparkGeo = new THREE.BufferGeometry();
  curioSparkGeo.setAttribute('position', new THREE.BufferAttribute(curioSparkArr, 3));
  const curioSparkPoints = new THREE.Points(
    curioSparkGeo,
    new THREE.PointsMaterial({
      map: glowTex,
      color: 0xffe8a3,
      size: 0.095,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  relTiltGroup.add(curioSparkPoints);

  // 5E. Refractive Beveled Crystal Glass Front Pane (catches real moving fireplace & window highlights!)
  const crystalPane = new THREE.Mesh(
    new THREE.PlaneGeometry(relW, relH),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.14,
      roughness: 0.05,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      reflectivity: 0.95,
      depthWrite: false
    })
  );
  crystalPane.position.z = relDepth * 0.5 + 0.002;
  relTiltGroup.add(crystalPane);

  // 5F. Turnable 3D Golden Wind-Up Key on Right Side Rail!
  const windKeyPivot = new THREE.Group();
  windKeyPivot.position.set(relW * 0.5 + wallT + 0.02, -0.18, 0);
  const keyShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.16, 12), goldBrightMat);
  keyShaft.rotation.z = Math.PI / 2;
  keyShaft.position.x = 0.07;
  const keyLoop1 = new THREE.Mesh(new THREE.TorusGeometry(0.068, 0.016, 10, 20), goldBrightMat);
  keyLoop1.position.set(0.18, 0.042, 0);
  const keyLoop2 = keyLoop1.clone();
  keyLoop2.position.set(0.18, -0.042, 0);
  const keyCollar = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 12), brassMat);
  keyCollar.position.x = 0.12;
  [keyShaft, keyLoop1, keyLoop2, keyCollar].forEach((m) => {
    m.userData = { type: 'windKey' };
    interactiveMeshes.push(m);
  });
  windKeyPivot.add(keyShaft, keyCollar, keyLoop1, keyLoop2);
  relTiltGroup.add(windKeyPivot);

  // 5G. 180° Back Face: Riveted Brass & Parchment Collector's Lore Plaque!
  const backplateMat = new THREE.MeshStandardMaterial({
    roughness: 0.44,
    metalness: 0.12
  });
  const backplateMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(relW + wallT * 1.6, relH + wallT * 1.6),
    backplateMat
  );
  backplateMesh.rotation.y = Math.PI;
  backplateMesh.position.z = -relDepth * 0.5 - 0.015;
  backplateMesh.userData = { type: 'heldCurioBack' };
  interactiveMeshes.push(backplateMesh);
  relTiltGroup.add(backplateMesh);

  const backplateCache = {};

  // ==================== 6. FINDER FIREFLY HALO ====================
  const finderHalo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTex,
      color: 0xffe699,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  cabinetGroup.add(finderHalo);
  let finderDay = null;
  let finderTimer = 0;

  // Held State & Animation Variables
  let heldDay = null;
  let returningFromDay = null;
  let closeReturnDoor = false;
  let onReturnDoorClosed = null;
  let flightProgress = 0; // 0 = inside niche, 1 = floating in player's hands!
  let keySpinVel = 1.2;
  let cuckooActiveTimer = 0;
  let notePulse = 0;

  const tmpStartPos = new THREE.Vector3();
  const heldRestWorldPos = new THREE.Vector3(0, 0, 1.35);

  function mountCurioIntoReliquary(day) {
    const comp = compartments[day];
    if (!comp) return;
    const info = comp.info;

    const loadIntoComposite = () => {
      reliquaryComposite.setCurio(info, comp.htmlImg);
    };
    if (comp.htmlImg.complete && comp.htmlImg.naturalWidth) {
      loadIntoComposite();
    } else {
      reliquaryComposite.setCurio(info, null);
      comp.htmlImg.onload = () => reliquaryComposite.setBaseImageWhenLoaded(comp.htmlImg);
    }

    if (!backplateCache[day]) {
      backplateCache[day] = buildEngravedBackplateTexture(info);
    }
    backplateMat.map = backplateCache[day];
    backplateMat.needsUpdate = true;
  }

  function pullOutCurio(day) {
    if (heldDay && heldDay !== day && compartments[heldDay]) {
      compartments[heldDay].inNicheCurio.visible = true;
    }
    if (returningFromDay && compartments[returningFromDay]) {
      compartments[returningFromDay].inNicheCurio.visible = true;
    }
    heldDay = day;
    returningFromDay = null;
    closeReturnDoor = false;
    onReturnDoorClosed = null;
    mountCurioIntoReliquary(day);

    const comp = compartments[day];
    comp.inNicheCurio.visible = false;
    heldGroup.visible = true;
    flightProgress = 0.02;
    keySpinVel = 7.5;
  }

  function putBackCurio(closeDoorAfter = true, onDoorShut = null) {
    if (!heldDay) return;
    returningFromDay = heldDay;
    closeReturnDoor = !!closeDoorAfter;
    onReturnDoorClosed = onDoorShut;
    heldDay = null;
  }

  function windHeldCurio(uv = null) {
    keySpinVel = 14.0;
    reliquaryComposite.triggerBurst();
    if (uv) {
      reliquaryComposite.addSpark(uv.x, 1 - uv.y);
    }
  }

  function triggerCuckoo(dur = 4.2) {
    cuckooActiveTimer = Math.max(cuckooActiveTimer, dur);
  }

  function pullPinecone(idx = 0) {
    const p = pinecones[idx % pinecones.length];
    if (p) p.pullOffset = 0.24;
    triggerCuckoo(4.5);
  }

  function highlightDoor(day, dur = 4.2) {
    finderDay = day;
    finderTimer = dur;
  }

  function pulseMusic() {
    notePulse = 1.0;
  }

  function setSwitchStates(dateLockOn, openAllOn) {
    switchDate3D.active = !!dateLockOn;
    switchOpenAll3D.active = !!openAllOn;
  }

  function update(time, dt, heldTargetWorldPos, heldYaw, heldPitch, heldZoom) {
    notePulse = Math.max(0, notePulse - dt * 3.2);
    if (cuckooActiveTimer > 0) cuckooActiveTimer = Math.max(0, cuckooActiveTimer - dt);

    // 1. Flickering Fireplace & Window Atmosphere
    hearthFireLight.intensity = 5.2 + Math.sin(time * 8.5) * 0.7 + Math.cos(time * 14.2) * 0.4;

    const sArr = snowGeo.attributes.position.array;
    for (let i = 0; i < snowCount; i++) {
      sArr[i * 3 + 1] -= snowSeeds[i] * dt * 0.9;
      sArr[i * 3] += Math.sin(time * 1.2 + i) * dt * 0.22;
      if (sArr[i * 3 + 1] < -2.6) sArr[i * 3 + 1] = 4.5;
    }
    snowGeo.attributes.position.needsUpdate = true;

    const eArr = emberGeo.attributes.position.array;
    for (let i = 0; i < emberCount; i++) {
      eArr[i * 3 + 1] += dt * (0.45 + (i % 5) * 0.12);
      eArr[i * 3] += Math.sin(time * 3 + i) * dt * 0.16;
      if (eArr[i * 3 + 1] > 0.2) {
        eArr[i * 3 + 1] = -2.8;
        eArr[i * 3] = 2.5 + Math.random() * 2.0;
      }
    }
    emberGeo.attributes.position.needsUpdate = true;

    const dArr = dustGeo.attributes.position.array;
    for (let i = 0; i < dustCount; i++) {
      dArr[i * 3 + 1] += Math.sin(time * 0.65 + i) * dt * 0.08;
      dArr[i * 3] += Math.cos(time * 0.5 + i * 1.3) * dt * 0.06;
    }
    dustGeo.attributes.position.needsUpdate = true;

    // 2. Clock Sweeping Gold Second Hand, Cuckoo Pop-Out, Pinecones & Roof Switches
    const nowDate = new Date();
    const secs = nowDate.getSeconds() + nowDate.getMilliseconds() / 1000;
    secHandPivot.rotation.z = -(secs / 60) * Math.PI * 2;

    const cuckooOut = cuckooActiveTimer > 0 ? 1 : 0;
    cuckooGroup.position.z += ((0.135 + cuckooOut * 0.17) - cuckooGroup.position.z) * Math.min(1, dt * 8);
    cuckooGroup.rotation.x = cuckooOut ? Math.sin(time * 14) * 0.18 : 0;

    pinecones.forEach((pc, idx) => {
      pc.pullOffset = Math.max(0, pc.pullOffset - dt * 0.55);
      pc.pivot.position.y = pc.baseTopY - pc.pullOffset;
      pc.pivot.rotation.z = Math.sin(time * 1.35 + idx * 2.1) * 0.022;
    });

    [switchDate3D, switchOpenAll3D].forEach((sw) => {
      const targetX = sw.scx + (sw.active ? sw.travel : -sw.travel);
      sw.knob.position.x += (targetX - sw.knob.position.x) * Math.min(1, dt * 12);
    });

    fairySprites.forEach((f) => {
      const wave = 0.5 + 0.5 * Math.sin(time * 2.8 + f.phase);
      f.sprite.material.opacity = 0.25 + wave * 0.38 + notePulse * 0.25;
      f.sprite.scale.setScalar(f.baseScale * (0.9 + wave * 0.22 + notePulse * 0.18));
    });

    // 3. Update All 24 3D Hinged Carved Doors & Recessed Niches
    for (let d = 1; d <= 24; d++) {
      const comp = compartments[d];
      const target = comp.isOpen ? 1 : 0;
      comp.openProgress += (target - comp.openProgress) * Math.min(1, dt * 6.8);

      const p = comp.openProgress;
      const openAngle = d === 24 ? 2.06 : 1.76;
      for (const dp of comp.doorPivots) {
        dp.pivot.rotation.y = dp.dir * p * openAngle;
      }
      comp.nicheGlow.material.opacity = p * (0.34 + notePulse * 0.12);
    }

    // 4. Finder Firefly Halo
    if (finderTimer > 0 && finderDay && compartments[finderDay]) {
      finderTimer = Math.max(0, finderTimer - dt);
      finderHalo.visible = true;
      const c = compartments[finderDay];
      finderHalo.position.set(c.center.x, c.center.y, 0.24);
      finderHalo.scale.setScalar(Math.max(c.width, c.height) * (1.25 + Math.sin(time * 8) * 0.2));
      finderHalo.material.opacity = Math.min(1, finderTimer) * 0.85;
    } else {
      finderHalo.visible = false;
    }

    // 5. Update Held-in-Hand 3D Curio Reliquary Flight & Physics!
    const activeDay = heldDay || returningFromDay;
    if (activeDay && compartments[activeDay]) {
      const comp = compartments[activeDay];
      if (heldDay) {
        flightProgress = Math.min(1, flightProgress + dt * 2.8);
      } else {
        flightProgress = Math.max(0, flightProgress - dt * 3.8);
        // As soon as the curio tucks neatly past the threshold, swing the 3D wooden door shut behind it!
        if (closeReturnDoor && flightProgress <= 0.38) {
          closeReturnDoor = false;
          comp.isOpen = false;
          if (onReturnDoorClosed) {
            const cb = onReturnDoorClosed;
            onReturnDoorClosed = null;
            cb(activeDay);
          }
        }
        if (flightProgress <= 0.005) {
          comp.inNicheCurio.visible = true;
          returningFromDay = null;
          heldGroup.visible = false;
          heldInspectLight.intensity = 0;
        }
      }

      if (heldGroup.visible) {
        // Smooth cubic ease out from inside the 3D wooden niche (-0.30m) out to player's hands!
        const ease = 1 - Math.pow(1 - flightProgress, 3);
        tmpStartPos.set(comp.center.x, comp.center.y, -0.28);
        heldRestWorldPos.copy(heldTargetWorldPos);

        heldGroup.position.lerpVectors(tmpStartPos, heldRestWorldPos, ease);

        const nicheFitScale = Math.min(comp.width / relW, comp.height / relH) * 0.92;
        const handScale = heldZoom;
        const curScale = nicheFitScale + (handScale - nicheFitScale) * ease;
        heldGroup.scale.setScalar(curScale);

        relTiltGroup.rotation.y = heldYaw * ease;
        relTiltGroup.rotation.x = heldPitch * ease;

        // Spin golden wind-up key & update 60fps live canvas + 3D sparkles!
        keySpinVel = Math.max(0.8, keySpinVel - dt * 6.5);
        windKeyPivot.rotation.x += keySpinVel * dt;

        reliquaryComposite.render(time, dt);

        const cs = curioSparkGeo.attributes.position.array;
        for (let i = 0; i < curioSparkCount; i++) {
          const sv = curioSparkVel[i];
          cs[i * 3 + 1] += sv.spd * dt * (0.4 + keySpinVel * 0.12);
          cs[i * 3] += Math.sin(time * 2.2 + sv.phase) * dt * 0.15;
          if (cs[i * 3 + 1] > relH * 0.46) {
            cs[i * 3 + 1] = -relH * 0.46;
            cs[i * 3] = (Math.random() - 0.5) * relW * 0.85;
          }
        }
        curioSparkGeo.attributes.position.needsUpdate = true;

        heldInspectLight.position.set(
          heldGroup.position.x + 0.4,
          heldGroup.position.y + 0.5,
          heldGroup.position.z + 1.4
        );
        heldInspectLight.intensity = ease * 2.2;
      }
    }
  }

  return {
    cabinetGroup,
    compartments,
    interactiveMeshes,
    heldGroup,
    pullOutCurio,
    putBackCurio,
    windHeldCurio,
    triggerCuckoo,
    pullPinecone,
    highlightDoor,
    pulseMusic,
    setSwitchStates,
    update
  };
}
