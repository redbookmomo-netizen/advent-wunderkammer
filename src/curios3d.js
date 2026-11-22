// 24 Bespoke 3D Mechanical Automata & Curio Dioramas for "The Grand Advent Wunderkammer"
// Every single compartment (Days 1–24) contains a distinct, animated 3D kinetic sculpture

import * as THREE from 'three';

export function createCurioMaterials(textures) {
  return {
    brass: new THREE.MeshStandardMaterial({
      map: textures.brassMap,
      color: 0xe6c16c,
      metalness: 0.86,
      roughness: 0.24
    }),
    goldBright: new THREE.MeshStandardMaterial({
      color: 0xffdf85,
      emissive: 0x4a3008,
      emissiveIntensity: 0.35,
      metalness: 0.92,
      roughness: 0.16
    }),
    silver: new THREE.MeshStandardMaterial({
      color: 0xeaf0f8,
      metalness: 0.9,
      roughness: 0.18
    }),
    copper: new THREE.MeshStandardMaterial({
      color: 0xd97d54,
      metalness: 0.84,
      roughness: 0.26
    }),
    porcelain: new THREE.MeshStandardMaterial({
      color: 0xfbf7f0,
      metalness: 0.05,
      roughness: 0.22
    }),
    crimson: new THREE.MeshStandardMaterial({
      color: 0xb81d33,
      metalness: 0.12,
      roughness: 0.36
    }),
    rubyGlow: new THREE.MeshStandardMaterial({
      color: 0xff3b56,
      emissive: 0xd91e3a,
      emissiveIntensity: 0.75,
      metalness: 0.15,
      roughness: 0.2
    }),
    amberGlow: new THREE.MeshStandardMaterial({
      color: 0xffd275,
      emissive: 0xff9d2e,
      emissiveIntensity: 0.9,
      metalness: 0.1,
      roughness: 0.2
    }),
    emeraldGlow: new THREE.MeshStandardMaterial({
      color: 0x45e6a8,
      emissive: 0x1fb885,
      emissiveIntensity: 0.75,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide
    }),
    violetGlow: new THREE.MeshStandardMaterial({
      color: 0xb07cff,
      emissive: 0x7c4dff,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.62,
      side: THREE.DoubleSide
    }),
    sapphire: new THREE.MeshStandardMaterial({
      color: 0x1d4ea8,
      emissive: 0x0a1e4a,
      emissiveIntensity: 0.35,
      metalness: 0.28,
      roughness: 0.24
    }),
    pine: new THREE.MeshStandardMaterial({
      color: 0x1b4d36,
      roughness: 0.65
    }),
    snow: new THREE.MeshStandardMaterial({
      color: 0xf4f8ff,
      roughness: 0.45
    }),
    walnutDark: new THREE.MeshStandardMaterial({
      map: textures.walnutMap,
      color: 0x4a2818,
      roughness: 0.48,
      metalness: 0.08
    }),
    castIron: new THREE.MeshStandardMaterial({
      color: 0x1c1e24,
      metalness: 0.65,
      roughness: 0.48
    }),
    gingerbread: new THREE.MeshStandardMaterial({
      color: 0x9c5628,
      roughness: 0.72
    }),
    chocolate: new THREE.MeshStandardMaterial({
      color: 0x3f1e12,
      roughness: 0.55
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xdff0ff,
      transparent: true,
      opacity: 0.34,
      roughness: 0.06,
      metalness: 0.05,
      reflectivity: 0.92,
      depthWrite: false
    }),
    roseWindow: new THREE.MeshBasicMaterial({
      map: textures.roseWindowMap
    }),
    glowSpriteMat: new THREE.SpriteMaterial({
      map: textures.glowSprite,
      color: 0xffdfa0,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  };
}

function makePedestal(mats, radius = 0.19, height = 0.045, y = -0.22) {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.12, height, 24), mats.brass);
  base.position.y = y;
  g.add(base);
  const topInlay = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.88, radius * 0.88, 0.012, 24), mats.walnutDark);
  topInlay.position.y = y + height * 0.52;
  g.add(topInlay);
  return g;
}

function makeMiniPine(mats, scale = 1) {
  const g = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const r = (0.075 - i * 0.018) * scale;
    const h = 0.09 * scale;
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r, h, 10), mats.pine);
    cone.position.y = (0.045 + i * 0.052) * scale;
    g.add(cone);
  }
  return g;
}

function makeGear(mats, radius = 0.08, teeth = 10, thickness = 0.014, mat = null) {
  const g = new THREE.Group();
  const m = mat || mats.brass;
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, thickness, 20), m);
  rim.rotation.x = Math.PI / 2;
  g.add(rim);
  for (let i = 0; i < teeth; i++) {
    const a = (i * Math.PI * 2) / teeth;
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(radius * 0.24, radius * 0.28, thickness * 0.92), m);
    tooth.position.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
    tooth.rotation.z = a;
    g.add(tooth);
  }
  return g;
}

export function buildCurioDiorama(day, mats, textures) {
  const root = new THREE.Group();
  let burst = 0; // 0..1 decaying excitement state when tapped
  let flipTarget = 0;
  let flipAngle = 0;

  const triggerBurst = () => {
    burst = 1.0;
    flipTarget += Math.PI;
  };

  let animateFn = () => {};

  switch (day) {
    // 1. Bell-Jar Frost Rose
    case 1: {
      root.add(makePedestal(mats, 0.19, 0.05, -0.21));
      const roseGroup = new THREE.Group();
      roseGroup.position.y = -0.18;
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.012, 0.22, 8), mats.brass);
      stem.position.y = 0.11;
      roseGroup.add(stem);

      // Holly leaves
      for (let s of [-1, 1]) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.036, 8, 6), mats.pine);
        leaf.scale.set(1.4, 0.25, 0.65);
        leaf.position.set(s * 0.035, 0.10, 0);
        leaf.rotation.z = s * 0.45;
        roseGroup.add(leaf);
      }

      // Cupped crystal rose head
      const blossom = new THREE.Group();
      blossom.position.y = 0.23;
      const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.042, 1), mats.rubyGlow);
      blossom.add(core);
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI * 2) / 8;
        const petal = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 8), mats.crimson);
        petal.scale.set(0.85, 1.15, 0.32);
        petal.position.set(Math.cos(a) * 0.038, 0.006, Math.sin(a) * 0.038);
        petal.rotation.y = -a + Math.PI / 2;
        petal.rotation.x = 0.38;
        blossom.add(petal);
      }
      roseGroup.add(blossom);
      root.add(roseGroup);

      // Blown glass cloche bell-jar
      const jarCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.145, 0.24, 20, 1, true), mats.glass);
      jarCyl.position.y = -0.06;
      root.add(jarCyl);
      const jarDome = new THREE.Mesh(new THREE.SphereGeometry(0.145, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), mats.glass);
      jarDome.position.y = 0.06;
      root.add(jarDome);
      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), mats.brass);
      finial.position.y = 0.215;
      root.add(finial);

      // Orbiting firefly motes
      const motes = [];
      for (let i = 0; i < 5; i++) {
        const sp = new THREE.Sprite(mats.glowSpriteMat.clone());
        sp.scale.setScalar(0.065);
        root.add(sp);
        motes.push(sp);
      }

      animateFn = (t, sp) => {
        roseGroup.rotation.y += 0.012 * sp;
        core.material.emissiveIntensity = 0.7 + Math.sin(t * 3.5) * 0.25 + burst * 1.1;
        motes.forEach((m, idx) => {
          const a = t * (1.4 + burst * 3) + idx * 1.25;
          m.position.set(Math.cos(a) * 0.095, -0.05 + Math.sin(t * 2.2 + idx) * 0.09, Math.sin(a) * 0.095);
        });
      };
      break;
    }

    // 2. Nutcracker Hussar Automaton
    case 2: {
      root.add(makePedestal(mats, 0.18, 0.045, -0.22));
      const soldier = new THREE.Group();
      soldier.position.y = -0.19;

      for (let s of [-0.038, 0.038]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.02, 0.11, 10), mats.castIron);
        leg.position.set(s, 0.055, 0);
        soldier.add(leg);
      }
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.052, 0.15, 12), mats.crimson);
      torso.position.y = 0.18;
      soldier.add(torso);
      // Gold buttons
      for (let b = 0; b < 3; b++) {
        const btn = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 8), mats.goldBright);
        btn.position.set(0, 0.14 + b * 0.036, 0.058);
        soldier.add(btn);
      }
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.048, 14, 12), mats.porcelain);
      head.position.y = 0.295;
      soldier.add(head);
      const beard = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.07, 8), mats.snow);
      beard.rotation.x = Math.PI;
      beard.position.set(0, 0.255, 0.038);
      soldier.add(beard);
      const shako = new THREE.Mesh(new THREE.CylinderGeometry(0.054, 0.048, 0.10, 14), mats.castIron);
      shako.position.y = 0.37;
      soldier.add(shako);
      const badge = new THREE.Mesh(new THREE.OctahedronGeometry(0.018), mats.goldBright);
      badge.position.set(0, 0.37, 0.052);
      soldier.add(badge);

      // Articulated saber arm
      const swordArm = new THREE.Group();
      swordArm.position.set(0.076, 0.235, 0);
      const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.016, 0.10, 8), mats.crimson);
      sleeve.position.y = -0.04;
      swordArm.add(sleeve);
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.18, 0.016), mats.silver);
      blade.position.set(0, 0.05, 0.04);
      blade.rotation.x = 0.35;
      swordArm.add(blade);
      soldier.add(swordArm);

      // Back clockwork key
      const key = new THREE.Group();
      key.position.set(0, 0.18, -0.065);
      const keyStem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.05, 8), mats.brass);
      keyStem.rotation.x = Math.PI / 2;
      key.add(keyStem);
      const keyBow = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.007, 8, 16), mats.brass);
      keyBow.position.z = -0.025;
      key.add(keyBow);
      soldier.add(key);

      root.add(soldier);
      animateFn = (t, sp) => {
        soldier.rotation.y = Math.sin(t * 1.4) * 0.28;
        key.rotation.z += 0.05 * sp;
        swordArm.rotation.x = -0.45 - Math.abs(Math.sin(t * (2.2 + burst * 6))) * (0.55 + burst * 0.9);
      };
      break;
    }

    // 3. Lapis Armillary Sphere
    case 3: {
      root.add(makePedestal(mats, 0.17, 0.045, -0.22));
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.026, 0.09, 10), mats.brass);
      stem.position.y = -0.16;
      root.add(stem);

      const sphereRoot = new THREE.Group();
      sphereRoot.position.y = 0.02;
      const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.165, 0.011, 10, 32), mats.brass);
      const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.010, 10, 28), mats.goldBright);
      const ring3 = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.009, 10, 24), mats.copper);
      const earth = new THREE.Mesh(new THREE.SphereGeometry(0.052, 16, 14), mats.sapphire);
      const moonPivot = new THREE.Group();
      const moon = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 10), mats.porcelain);
      moon.position.x = 0.082;
      moonPivot.add(moon);

      sphereRoot.add(ring1, ring2, ring3, earth, moonPivot);
      root.add(sphereRoot);

      animateFn = (t, sp) => {
        ring1.rotation.y += 0.014 * sp;
        ring2.rotation.x += 0.021 * sp;
        ring2.rotation.y += 0.009 * sp;
        ring3.rotation.z += 0.026 * sp;
        moonPivot.rotation.y += 0.035 * sp;
      };
      break;
    }

    // 4. Venetian Six-Horse Carousel
    case 4: {
      root.add(makePedestal(mats, 0.21, 0.04, -0.22));
      const carousel = new THREE.Group();
      carousel.position.y = -0.02;

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.34, 12), mats.goldBright);
      carousel.add(pole);

      const canopy = new THREE.Mesh(new THREE.ConeGeometry(0.20, 0.12, 12), mats.crimson);
      canopy.position.y = 0.18;
      carousel.add(canopy);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.195, 0.014, 8, 24), mats.goldBright);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.125;
      carousel.add(rim);

      const horses = [];
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI * 2) / 6;
        const hGroup = new THREE.Group();
        const r = 0.135;
        hGroup.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
        hGroup.rotation.y = -a;

        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.28, 6), mats.brass);
        hGroup.add(rod);

        const body = new THREE.Group();
        const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.038, 6, 8), mats.porcelain);
        torso.rotation.x = Math.PI / 2;
        body.add(torso);
        const neck = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.045, 8), mats.porcelain);
        neck.position.set(0, 0.028, 0.024);
        neck.rotation.x = 0.35;
        body.add(neck);
        const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.014, 0.024), i % 2 ? mats.crimson : mats.sapphire);
        saddle.position.y = 0.016;
        body.add(saddle);

        hGroup.add(body);
        carousel.add(hGroup);
        horses.push({ body, phase: i * 1.05 });
      }
      root.add(carousel);

      animateFn = (t, sp) => {
        carousel.rotation.y += 0.024 * sp;
        horses.forEach((h) => {
          h.body.position.y = -0.03 + Math.sin(t * 3.6 + h.phase) * 0.032;
        });
      };
      break;
    }

    // 5. Cast-Iron Hearth & Gingerbread Chalet
    case 5: {
      root.add(makePedestal(mats, 0.21, 0.04, -0.22));
      // Gingerbread house
      const house = new THREE.Group();
      house.position.set(-0.065, -0.13, 0);
      const walls = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.11, 0.11), mats.gingerbread);
      house.add(walls);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(0.115, 0.10, 4), mats.snow);
      roof.rotation.y = Math.PI / 4;
      roof.position.y = 0.10;
      house.add(roof);
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.042, 0.01), mats.amberGlow);
      win.position.set(0, 0, 0.056);
      house.add(win);
      root.add(house);

      // Cast-iron stove + glowing fire
      const stove = new THREE.Group();
      stove.position.set(0.085, -0.13, 0.01);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.058, 0.13, 12), mats.castIron);
      stove.add(body);
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.16, 8), mats.castIron);
      pipe.position.set(0, 0.13, -0.015);
      stove.add(pipe);
      const ember = new THREE.Mesh(new THREE.SphereGeometry(0.034, 10, 10), mats.amberGlow);
      ember.position.set(0, -0.01, 0.035);
      stove.add(ember);
      root.add(stove);

      const puffs = [];
      for (let i = 0; i < 4; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), mats.snow);
        root.add(p);
        puffs.push({ mesh: p, offset: i * 0.25 });
      }

      animateFn = (t) => {
        ember.scale.setScalar(0.88 + Math.sin(t * 9) * 0.15 + burst * 0.35);
        puffs.forEach((p) => {
          const cycle = (t * (0.45 + burst * 0.8) + p.offset) % 1;
          p.mesh.position.set(0.085 + Math.sin(cycle * 6) * 0.02, 0.08 + cycle * 0.16, -0.005);
          p.mesh.scale.setScalar(0.5 + cycle * 0.9);
        });
      };
      break;
    }

    // 6. Alpine Steam Express Train
    case 6: {
      const snowBase = new THREE.Mesh(new THREE.CylinderGeometry(0.215, 0.225, 0.045, 24), mats.snow);
      snowBase.position.y = -0.21;
      root.add(snowBase);
      const rails = new THREE.Mesh(new THREE.TorusGeometry(0.165, 0.008, 8, 32), mats.silver);
      rails.rotation.x = Math.PI / 2;
      rails.position.y = -0.185;
      root.add(rails);

      const peak = new THREE.Mesh(new THREE.ConeGeometry(0.095, 0.22, 9), mats.snow);
      peak.position.y = -0.08;
      root.add(peak);
      const pine = makeMiniPine(mats, 0.85);
      pine.position.set(0.04, -0.18, 0.03);
      root.add(pine);

      const trainPivot = new THREE.Group();
      trainPivot.position.y = -0.165;
      // Locomotive + 2 crimson cars along circular arc
      [0, -0.44, -0.84].forEach((ang, idx) => {
        const car = new THREE.Group();
        const r = 0.165;
        car.position.set(Math.cos(ang) * r, 0.02, Math.sin(ang) * r);
        car.rotation.y = -ang;
        if (idx === 0) {
          const boiler = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.068, 10), mats.castIron);
          boiler.rotation.x = Math.PI / 2;
          car.add(boiler);
          const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.007, 0.038, 8), mats.goldBright);
          stack.position.set(0, 0.028, 0.02);
          car.add(stack);
          const headlamp = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 8), mats.amberGlow);
          headlamp.position.set(0, 0.005, 0.036);
          car.add(headlamp);
        } else {
          const coach = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.038, 0.056), mats.crimson);
          car.add(coach);
          const roof = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.008, 0.06), mats.goldBright);
          roof.position.y = 0.022;
          car.add(roof);
        }
        trainPivot.add(car);
      });
      root.add(trainPivot);

      animateFn = (t, sp) => {
        trainPivot.rotation.y -= 0.032 * sp;
      };
      break;
    }

    // 7. Porcelain Ballerina on Mirror Ice
    case 7: {
      const pond = new THREE.Mesh(new THREE.CylinderGeometry(0.195, 0.205, 0.035, 24), mats.silver);
      pond.position.y = -0.22;
      root.add(pond);

      const skaterOrbit = new THREE.Group();
      skaterOrbit.position.y = -0.20;

      const dancer = new THREE.Group();
      dancer.position.x = 0.065;
      const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.006, 0.12, 8), mats.porcelain);
      legs.position.y = 0.06;
      dancer.add(legs);
      const tutu = new THREE.Mesh(new THREE.ConeGeometry(0.078, 0.036, 16), mats.porcelain);
      tutu.position.y = 0.12;
      dancer.add(tutu);
      const bodice = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.015, 0.08, 10), mats.porcelain);
      bodice.position.y = 0.165;
      dancer.add(bodice);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 10), mats.porcelain);
      head.position.y = 0.228;
      dancer.add(head);
      const tiara = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.004, 6, 14), mats.goldBright);
      tiara.rotation.x = 1.2;
      tiara.position.y = 0.248;
      dancer.add(tiara);
      const arms = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.006, 6, 16, Math.PI * 1.2), mats.porcelain);
      arms.position.y = 0.21;
      arms.rotation.z = -0.45;
      dancer.add(arms);

      skaterOrbit.add(dancer);
      root.add(skaterOrbit);

      animateFn = (t, sp) => {
        skaterOrbit.rotation.y += 0.022 * sp;
        dancer.rotation.y += 0.085 * sp;
      };
      break;
    }

    // 8. Solstice Mulled-Wine Alembic
    case 8: {
      root.add(makePedestal(mats, 0.19, 0.04, -0.22));
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.065, 10), mats.amberGlow);
      flame.position.set(-0.04, -0.15, 0);
      root.add(flame);

      const wine = new THREE.Mesh(new THREE.SphereGeometry(0.072, 16, 12), mats.rubyGlow);
      wine.position.set(-0.04, -0.03, 0);
      root.add(wine);
      const flask = new THREE.Mesh(new THREE.SphereGeometry(0.084, 18, 14), mats.glass);
      flask.position.set(-0.04, -0.03, 0);
      root.add(flask);
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.11, 12), mats.glass);
      neck.position.set(-0.04, 0.09, 0);
      root.add(neck);

      // Helical copper coil + receiving chalice
      const coilGroup = new THREE.Group();
      coilGroup.position.set(0.075, 0.02, 0);
      for (let i = 0; i < 4; i++) {
        const loop = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.007, 8, 18), mats.copper);
        loop.rotation.x = 1.35;
        loop.position.y = 0.06 - i * 0.032;
        coilGroup.add(loop);
      }
      root.add(coilGroup);

      const goblet = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.022, 0.075, 12), mats.brass);
      goblet.position.set(0.075, -0.16, 0);
      root.add(goblet);

      const bubbles = [];
      for (let i = 0; i < 5; i++) {
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 8), mats.goldBright);
        root.add(b);
        bubbles.push({ mesh: b, phase: i * 0.2 });
      }

      animateFn = (t) => {
        flame.scale.y = 0.85 + Math.sin(t * 11) * 0.2 + burst * 0.5;
        bubbles.forEach((b, idx) => {
          const p = (t * (0.65 + burst * 1.2) + b.phase) % 1;
          b.mesh.position.set(-0.04 + Math.sin(p * 8 + idx) * 0.025, -0.07 + p * 0.19, 0.02);
        });
      };
      break;
    }

    // 9. (Drawer) Gothic Hexagonal Vitrail Lantern
    case 9: {
      const lantern = new THREE.Group();
      lantern.position.y = -0.02;
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.03, 6), mats.castIron);
      base.position.y = -0.11;
      lantern.add(base);

      const panelMats = [mats.rubyGlow, mats.amberGlow, mats.sapphire, mats.emeraldGlow, mats.rubyGlow, mats.amberGlow];
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI * 2) / 6;
        const pane = new THREE.Mesh(new THREE.PlaneGeometry(0.088, 0.16), panelMats[i]);
        pane.position.set(Math.cos(a) * 0.084, -0.015, Math.sin(a) * 0.084);
        pane.rotation.y = -a + Math.PI / 2;
        lantern.add(pane);

        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.17, 6), mats.castIron);
        strut.position.set(Math.cos(a + Math.PI / 6) * 0.096, -0.015, Math.sin(a + Math.PI / 6) * 0.096);
        lantern.add(strut);
      }

      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.115, 0.085, 6), mats.brass);
      cap.position.y = 0.105;
      lantern.add(cap);
      root.add(lantern);

      animateFn = (t, sp) => {
        lantern.rotation.y += 0.018 * sp;
      };
      break;
    }

    // 10. Golden Cage Clockwork Nightingale
    case 10: {
      root.add(makePedestal(mats, 0.17, 0.045, -0.22));
      const cage = new THREE.Group();
      for (let i = 0; i < 6; i++) {
        const arch = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.005, 6, 24, Math.PI), mats.goldBright);
        arch.rotation.y = (i * Math.PI) / 6;
        arch.position.y = -0.03;
        cage.add(arch);
      }
      const cageRing = new THREE.Mesh(new THREE.TorusGeometry(0.145, 0.008, 8, 24), mats.brass);
      cageRing.rotation.x = Math.PI / 2;
      cageRing.position.y = -0.03;
      cage.add(cageRing);
      root.add(cage);

      const bird = new THREE.Group();
      bird.position.set(0, -0.02, 0);
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 10), mats.sapphire);
      body.scale.set(0.85, 0.85, 1.35);
      bird.add(body);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 10), mats.goldBright);
      head.position.set(0, 0.026, 0.042);
      bird.add(head);
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.008, 0.028, 6), mats.goldBright);
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, 0.025, 0.072);
      bird.add(beak);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.006, 0.075), mats.goldBright);
      tail.position.set(0, 0.01, -0.068);
      tail.rotation.x = 0.25;
      bird.add(tail);

      const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.006, 0.042), mats.goldBright);
      wingL.position.set(-0.038, 0.012, 0);
      const wingR = wingL.clone();
      wingR.position.x = 0.038;
      bird.add(wingL, wingR);
      root.add(bird);

      animateFn = (t, sp) => {
        bird.rotation.y = Math.sin(t * 2.1) * 0.55;
        const flap = Math.sin(t * (7 + burst * 16)) * (0.28 + burst * 0.55);
        wingL.rotation.z = flap;
        wingR.rotation.z = -flap;
      };
      break;
    }

    // 11. Brass Star-Gazer Telescope
    case 11: {
      const starPlate = new THREE.Mesh(new THREE.CircleGeometry(0.21, 24), mats.sapphire);
      starPlate.position.set(0, 0.02, -0.14);
      root.add(starPlate);
      // Orion constellation stars
      [[-0.04, 0.04], [0, 0.03], [0.04, 0.02], [-0.07, 0.11], [0.06, 0.10], [-0.05, -0.05], [0.07, -0.06]].forEach(([sx, sy]) => {
        const st = new THREE.Mesh(new THREE.OctahedronGeometry(0.012), mats.goldBright);
        st.position.set(sx, sy + 0.02, -0.13);
        root.add(st);
      });

      for (let i = 0; i < 3; i++) {
        const a = (i * Math.PI * 2) / 3 + 0.4;
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.006, 0.22, 8), mats.walnutDark);
        leg.position.set(Math.cos(a) * 0.055, -0.13, Math.sin(a) * 0.055 + 0.02);
        leg.rotation.z = -Math.cos(a) * 0.28;
        leg.rotation.x = Math.sin(a) * 0.28;
        root.add(leg);
      }

      const scope = new THREE.Group();
      scope.position.set(0, -0.02, 0.02);
      const tube1 = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.024, 0.24, 14), mats.brass);
      tube1.rotation.z = Math.PI / 2;
      scope.add(tube1);
      const lens = new THREE.Mesh(new THREE.SphereGeometry(0.031, 12, 10), mats.emeraldGlow);
      lens.position.x = -0.12;
      scope.add(lens);
      root.add(scope);

      animateFn = (t) => {
        scope.rotation.z = 0.38 + Math.sin(t * 1.4) * (0.18 + burst * 0.25);
        scope.rotation.y = -0.4 + Math.cos(t * 0.9) * 0.35;
      };
      break;
    }

    // 12. Gilded Seraphim Wheel
    case 12: {
      const outer = new THREE.Group();
      const inner = new THREE.Group();
      outer.add(new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.012, 10, 28), mats.goldBright));
      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI * 2) / 12;
        const ray = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.065, 6), mats.goldBright);
        ray.position.set(Math.cos(a) * 0.14, Math.sin(a) * 0.14, 0);
        ray.rotation.z = a + Math.PI / 2;
        outer.add(ray);
      }
      inner.add(new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.010, 8, 22), mats.brass));
      const ruby = new THREE.Mesh(new THREE.OctahedronGeometry(0.042, 1), mats.rubyGlow);
      inner.add(ruby);

      root.add(outer, inner);
      animateFn = (t, sp) => {
        outer.rotation.z += 0.016 * sp;
        inner.rotation.z -= 0.028 * sp;
        ruby.rotation.y += 0.03 * sp;
      };
      break;
    }

    // 13. Black Forest Gold-Leaf Snowglobe
    case 13: {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.165, 0.085, 22), mats.walnutDark);
      base.position.y = -0.19;
      root.add(base);
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.132, 0.012, 8, 24), mats.brass);
      collar.rotation.x = Math.PI / 2;
      collar.position.y = -0.145;
      root.add(collar);

      // Tiny village inside globe
      const chapel = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.075, 0.065), mats.porcelain);
      chapel.position.set(-0.02, -0.09, 0);
      root.add(chapel);
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.048, 0.11, 6), mats.crimson);
      spire.position.set(-0.02, 0.0, 0);
      root.add(spire);
      const tree = makeMiniPine(mats, 0.9);
      tree.position.set(0.055, -0.13, 0.02);
      root.add(tree);

      const flakes = [];
      for (let i = 0; i < 22; i++) {
        const fl = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.008),
          i % 2 === 0 ? mats.goldBright : mats.snow
        );
        root.add(fl);
        flakes.push({ mesh: fl, a: Math.random() * 6.28, r: 0.02 + Math.random() * 0.10, y: Math.random() });
      }

      const globe = new THREE.Mesh(new THREE.SphereGeometry(0.165, 24, 18), mats.glass);
      globe.position.y = -0.015;
      root.add(globe);

      animateFn = (t, sp) => {
        flakes.forEach((f, idx) => {
          f.a += (0.02 + burst * 0.12) * (idx % 2 ? 1 : -1);
          f.y = (f.y - 0.005 * sp + 1) % 1;
          const rad = f.r * Math.sin(f.y * Math.PI);
          f.mesh.position.set(
            Math.cos(f.a) * rad,
            -0.12 + f.y * 0.21,
            Math.sin(f.a) * rad
          );
        });
      };
      break;
    }

    // 14. Horologist's Gold-Sand Hourglass
    case 14: {
      const hg = new THREE.Group();
      for (let y of [-0.165, 0.165]) {
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.022, 18), mats.brass);
        cap.position.y = y;
        hg.add(cap);
      }
      for (let i = 0; i < 3; i++) {
        const a = (i * Math.PI * 2) / 3;
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.33, 8), mats.brass);
        post.position.set(Math.cos(a) * 0.098, 0, Math.sin(a) * 0.098);
        hg.add(post);
      }
      const topBulb = new THREE.Mesh(new THREE.ConeGeometry(0.088, 0.15, 16), mats.glass);
      topBulb.rotation.x = Math.PI;
      topBulb.position.y = 0.08;
      const botBulb = new THREE.Mesh(new THREE.ConeGeometry(0.088, 0.15, 16), mats.glass);
      botBulb.position.y = -0.08;
      hg.add(topBulb, botBulb);

      const sandPile = new THREE.Mesh(new THREE.ConeGeometry(0.068, 0.075, 14), mats.amberGlow);
      sandPile.position.y = -0.115;
      const sandStream = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.15, 6), mats.goldBright);
      sandStream.position.y = -0.04;
      hg.add(sandPile, sandStream);

      root.add(hg);
      animateFn = (t) => {
        flipAngle += (flipTarget - flipAngle) * 0.09;
        hg.rotation.z = flipAngle;
        hg.rotation.y = Math.sin(t * 0.9) * 0.25;
      };
      break;
    }

    // 15. (Drawer) Magician's Velvet Top-Hat & White Porcelain Rabbit
    case 15: {
      const hatGroup = new THREE.Group();
      hatGroup.position.y = -0.06;
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.145, 0.014, 22), mats.castIron);
      brim.position.y = 0.055;
      hatGroup.add(brim);
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.082, 0.13, 20), mats.castIron);
      crown.position.y = -0.01;
      hatGroup.add(crown);
      const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.093, 0.024, 20), mats.crimson);
      ribbon.position.y = 0.038;
      hatGroup.add(ribbon);

      // Popping white porcelain bunny!
      const bunny = new THREE.Group();
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.046, 14, 12), mats.porcelain);
      bunny.add(head);
      for (let s of [-0.022, 0.022]) {
        const ear = new THREE.Mesh(new THREE.CapsuleGeometry(0.011, 0.062, 6, 8), mats.porcelain);
        ear.position.set(s, 0.062, 0);
        ear.rotation.z = -s * 3.5;
        bunny.add(ear);
      }
      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 8), mats.rubyGlow);
      nose.position.set(0, 0.004, 0.044);
      bunny.add(nose);
      hatGroup.add(bunny);

      // Magic wand
      const wand = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.22, 8), mats.goldBright);
      wand.position.set(0.08, 0.07, 0.05);
      wand.rotation.z = 0.95;
      hatGroup.add(wand);
      root.add(hatGroup);

      animateFn = (t, _sp, openProgress) => {
        // Tuck rabbit inside hat when drawer closes so zero clipping!
        const pop = Math.max(0, openProgress) * (0.085 + Math.abs(Math.sin(t * 2.6)) * 0.03 + burst * 0.06);
        bunny.position.y = 0.02 + pop;
        bunny.rotation.y = Math.sin(t * 2.2) * 0.35;
      };
      break;
    }

    // 16. Miniature Rosewood Organetto (7 Silver Pipes + Pinned Drum)
    case 16: {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.18), mats.walnutDark);
      box.position.y = -0.15;
      root.add(box);

      for (let i = 0; i < 7; i++) {
        const h = 0.13 + (3 - Math.abs(i - 3)) * 0.048;
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, h, 12), mats.silver);
        pipe.position.set((i - 3) * 0.036, -0.08 + h * 0.5, -0.045);
        root.add(pipe);
      }

      const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.18, 16), mats.goldBright);
      drum.rotation.z = Math.PI / 2;
      drum.position.set(0, -0.055, 0.038);
      root.add(drum);

      const crank = new THREE.Group();
      crank.position.set(0.155, -0.14, 0);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.08, 0.012), mats.brass);
      arm.position.y = 0.035;
      crank.add(arm);
      root.add(crank);

      animateFn = (_t, sp) => {
        drum.rotation.x += 0.03 * sp;
        crank.rotation.x += 0.08 * sp;
      };
      break;
    }

    // 17. Skeleton Tourbillon Pocket Watch
    case 17: {
      const watch = new THREE.Group();
      watch.add(new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.022, 12, 32), mats.goldBright));
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.035, 12), mats.brass);
      crown.position.y = 0.205;
      watch.add(crown);
      const bow = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.007, 8, 18), mats.brass);
      bow.position.y = 0.235;
      watch.add(bow);

      const g1 = makeGear(mats, 0.082, 12, 0.016, mats.brass);
      g1.position.set(-0.045, 0.035, 0);
      const g2 = makeGear(mats, 0.062, 9, 0.016, mats.copper);
      g2.position.set(0.058, -0.035, 0.012);
      const balance = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.008, 8, 20), mats.goldBright);
      balance.position.set(-0.03, -0.065, 0.022);
      const ruby = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 10), mats.rubyGlow);
      ruby.position.z = 0.025;

      watch.add(g1, g2, balance, ruby);
      root.add(watch);

      animateFn = (t, sp) => {
        g1.rotation.z += 0.022 * sp;
        g2.rotation.z -= 0.034 * sp;
        balance.rotation.z = Math.sin(t * (12 + burst * 18)) * 0.95;
        watch.rotation.y = Math.sin(t * 0.8) * 0.22;
      };
      break;
    }

    // 18. (Drawer) Crimson Wax-Seal & Swan Quill
    case 18: {
      const desk = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.03, 0.20), mats.walnutDark);
      desk.position.y = -0.10;
      desk.rotation.x = 0.14;
      root.add(desk);

      const env = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.012, 0.12), mats.porcelain);
      env.position.set(-0.02, -0.08, 0.01);
      env.rotation.x = 0.14;
      env.rotation.y = -0.12;
      root.add(env);

      const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.014, 16), mats.rubyGlow);
      seal.position.set(-0.02, -0.068, 0.015);
      seal.rotation.x = 0.14;
      root.add(seal);

      const quill = new THREE.Group();
      quill.position.set(0.03, -0.05, 0.01);
      const shaft = new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.22, 8), mats.porcelain);
      shaft.position.set(0.03, 0.09, 0);
      shaft.rotation.z = -0.45;
      quill.add(shaft);
      root.add(quill);

      animateFn = (t) => {
        quill.position.x = 0.01 + Math.sin(t * (3.5 + burst * 8)) * 0.045;
        quill.position.z = Math.cos(t * 5.2) * 0.025;
        quill.rotation.z = Math.sin(t * 4.5) * 0.16;
      };
      break;
    }

    // 19. Silver Stag of the Polar Aurora
    case 19: {
      const ridge = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.21, 0.06, 16), mats.snow);
      ridge.position.y = -0.20;
      root.add(ridge);

      const p1 = makeMiniPine(mats, 0.95);
      p1.position.set(-0.11, -0.17, -0.05);
      const p2 = makeMiniPine(mats, 0.8);
      p2.position.set(0.11, -0.17, -0.04);
      root.add(p1, p2);

      // Sculpted silver stag
      const stag = new THREE.Group();
      stag.position.set(0, -0.11, 0.02);
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.075, 8, 10), mats.silver);
      body.rotation.z = Math.PI / 2 - 0.22;
      stag.add(body);
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.024, 0.085, 8), mats.silver);
      neck.position.set(0.045, 0.055, 0);
      neck.rotation.z = -0.25;
      stag.add(neck);
      const head = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.055, 8), mats.silver);
      head.position.set(0.072, 0.095, 0);
      head.rotation.z = -Math.PI / 2 - 0.15;
      stag.add(head);
      // Glowing gold antlers
      for (let z of [-0.018, 0.018]) {
        const antler = new THREE.Mesh(new THREE.TorusGeometry(0.036, 0.005, 6, 12, Math.PI * 0.9), mats.goldBright);
        antler.position.set(0.055, 0.135, z);
        stag.add(antler);
      }
      root.add(stag);

      // Aurora ribbons
      const r1 = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.12, 12, 2), mats.emeraldGlow);
      r1.position.set(0, 0.12, -0.08);
      const r2 = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.10, 12, 2), mats.violetGlow);
      r2.position.set(0, 0.15, -0.11);
      root.add(r1, r2);

      animateFn = (t) => {
        stag.position.y = -0.11 + Math.abs(Math.sin(t * (2.0 + burst * 4))) * 0.028;
        r1.rotation.z = Math.sin(t * 1.5) * 0.14;
        r2.rotation.z = -Math.cos(t * 1.2) * 0.16;
      };
      break;
    }

    // 20. Toy Paper Proscenium Theater
    case 20: {
      const arch = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.32, 0.03), mats.goldBright);
      arch.position.set(0, -0.04, 0.08);
      // Cutout center illusion via deep sapphire stage behind
      const backdrop = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.24, 0.14), mats.sapphire);
      backdrop.position.set(0, -0.04, 0.01);
      root.add(arch, backdrop);

      const curtL = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.24, 0.025), mats.crimson);
      const curtR = curtL.clone();
      curtL.position.set(-0.095, -0.04, 0.092);
      curtR.position.set(0.095, -0.04, 0.092);
      root.add(curtL, curtR);

      const dancers = new THREE.Group();
      dancers.position.set(0, -0.10, 0.04);
      const d1 = new THREE.Mesh(new THREE.ConeGeometry(0.034, 0.11, 10), mats.porcelain);
      d1.position.x = -0.032;
      const d2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.022, 0.11, 10), mats.crimson);
      d2.position.x = 0.032;
      dancers.add(d1, d2);
      root.add(dancers);

      animateFn = (t, sp) => {
        dancers.rotation.y += 0.035 * sp;
        const part = 0.095 + (Math.sin(t * 1.5) * 0.5 + 0.5) * 0.03 + burst * 0.035;
        curtL.position.x = -part;
        curtR.position.x = part;
      };
      break;
    }

    // 21. (Drawer) Bûche de Noël & Steaming Silver Samovar
    case 21: {
      const platter = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.13, 0.018, 22), mats.porcelain);
      platter.position.set(-0.04, -0.10, 0.01);
      root.add(platter);

      const yuleLog = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.15, 16), mats.chocolate);
      yuleLog.rotation.z = Math.PI / 2;
      yuleLog.position.set(-0.04, -0.055, 0.01);
      root.add(yuleLog);
      const icing = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.014, 0.052), mats.snow);
      icing.position.set(-0.04, -0.015, 0.01);
      root.add(icing);

      const teapot = new THREE.Mesh(new THREE.SphereGeometry(0.056, 16, 14), mats.silver);
      teapot.position.set(0.10, -0.055, -0.01);
      root.add(teapot);
      const lid = new THREE.Mesh(new THREE.ConeGeometry(0.034, 0.035, 12), mats.goldBright);
      lid.position.set(0.10, 0.008, -0.01);
      root.add(lid);

      const steam = new THREE.Sprite(mats.glowSpriteMat.clone());
      steam.scale.setScalar(0.09);
      root.add(steam);

      animateFn = (t) => {
        const c = (t * 0.7) % 1;
        steam.position.set(0.10 + Math.sin(t * 3) * 0.015, 0.02 + c * 0.11, -0.01);
        steam.material.opacity = (1 - c) * (0.55 + burst * 0.4);
      };
      break;
    }

    // 22. (Drawer) Miniature Illuminated Book of Hours
    case 22: {
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.025, 0.16), mats.brass);
      stand.position.y = -0.09;
      stand.rotation.x = 0.28;
      root.add(stand);

      const book = new THREE.Group();
      book.position.set(0, -0.068, 0.01);
      book.rotation.x = 0.28;

      const pageL = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.016, 0.145), mats.porcelain);
      pageL.position.x = -0.054;
      pageL.rotation.z = -0.12;
      const pageR = pageL.clone();
      pageR.position.x = 0.054;
      pageR.rotation.z = 0.12;
      book.add(pageL, pageR);

      // Animated flipping illuminated leaf!
      const flipPivot = new THREE.Group();
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.004, 0.14), mats.amberGlow);
      leaf.position.x = 0.05;
      flipPivot.add(leaf);
      book.add(flipPivot);
      root.add(book);

      animateFn = (t) => {
        const wave = Math.sin(t * (1.8 + burst * 5)) * 0.5 + 0.5;
        flipPivot.rotation.z = 0.15 + wave * (Math.PI - 0.3);
      };
      break;
    }

    // 23. Herrnhuter 26-Point Moravian Star Lantern
    case 23: {
      const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.16, 6), mats.brass);
      chain.position.y = 0.16;
      root.add(chain);

      const star = new THREE.Group();
      star.position.y = 0.01;
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.068, 12, 12), mats.amberGlow);
      star.add(core);

      // 18 orthogonal/diagonal + 8 corner spikes = 26 spikes!
      const dirs = [
        [1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1],
        [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
        [1,1,1],[-1,1,1],[1,-1,1],[-1,-1,1],[1,1,-1],[-1,1,-1],[1,-1,-1],[-1,-1,-1]
      ];
      dirs.forEach((d, idx) => {
        const v = new THREE.Vector3(d[0], d[1], d[2]).normalize();
        const spike = new THREE.Mesh(
          new THREE.ConeGeometry(0.024, 0.125, 4),
          idx % 3 === 0 ? mats.rubyGlow : mats.amberGlow
        );
        spike.position.copy(v).multiplyScalar(0.098);
        spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v);
        star.add(spike);
      });
      root.add(star);

      animateFn = (t, sp) => {
        star.rotation.y += 0.016 * sp;
        star.rotation.x = Math.sin(t * 1.1) * 0.15;
        star.scale.setScalar(1 + burst * 0.14 + Math.sin(t * 3.2) * 0.03);
      };
      break;
    }

    // 24. (Double-Height Sanctuary) Grand Midnight Rose-Window & Organ Carousel
    case 24:
    default: {
      // Backlit Stained-Glass Rose Window high in the vaulted apse
      const roseWin = new THREE.Mesh(new THREE.CircleGeometry(0.22, 32), mats.roseWindow);
      roseWin.position.set(0, 0.34, -0.15);
      root.add(roseWin);
      const roseRim = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.016, 10, 32), mats.goldBright);
      roseRim.position.copy(roseWin.position);
      roseRim.position.z += 0.008;
      root.add(roseRim);

      // 13 Graduated Golden Cathedral Organ Pipes
      for (let i = 0; i < 13; i++) {
        const dist = Math.abs(i - 6);
        const h = 0.56 - dist * 0.055;
        const x = (i - 6) * 0.042;
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, h, 10), mats.goldBright);
        pipe.position.set(x, -0.22 + h * 0.5, -0.12 + dist * 0.008);
        root.add(pipe);
      }

      // Two-Tier Mother-of-Pearl & Gold Sanctuary Carousel
      const altarBase = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.26, 0.07, 28), mats.brass);
      altarBase.position.y = -0.52;
      root.add(altarBase);

      const carousel = new THREE.Group();
      carousel.position.y = -0.48;
      const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.20, 0.025, 24), mats.porcelain);
      carousel.add(tier1);
      const centralSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.026, 0.42, 12), mats.goldBright);
      centralSpire.position.y = 0.21;
      carousel.add(centralSpire);

      // 6 Revolving Sanctuary Angels + Votive Candles
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI * 2) / 6;
        const r = 0.145;
        const fig = new THREE.Group();
        fig.position.set(Math.cos(a) * r, 0.02, Math.sin(a) * r);
        fig.rotation.y = -a;
        const robe = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.11, 10), i % 2 ? mats.porcelain : mats.crimson);
        robe.position.y = 0.055;
        fig.add(robe);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 10), mats.porcelain);
        head.position.y = 0.122;
        fig.add(head);
        const halo = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.004, 6, 14), mats.goldBright);
        halo.rotation.x = 1.25;
        halo.position.y = 0.142;
        fig.add(halo);
        carousel.add(fig);
      }

      const tier2 = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.125, 0.02, 20), mats.goldBright);
      tier2.position.y = 0.26;
      carousel.add(tier2);

      // Star of Bethlehem crowning the carousel
      const starTop = new THREE.Mesh(new THREE.OctahedronGeometry(0.055, 0), mats.amberGlow);
      starTop.position.y = 0.44;
      carousel.add(starTop);
      root.add(carousel);

      // Foreground Votive Candles with glowing flames
      const flames = [];
      for (let c = 0; c < 7; c++) {
        const a = -Math.PI * 0.78 + (c / 6) * Math.PI * 0.56 + Math.PI / 2;
        const cx = (c - 3) * 0.072;
        const cz = 0.14 - Math.abs(c - 3) * 0.018;
        const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.013, 0.065, 8), mats.crimson);
        wax.position.set(cx, -0.46, cz);
        root.add(wax);
        const fl = new THREE.Sprite(mats.glowSpriteMat.clone());
        fl.scale.setScalar(0.075);
        fl.position.set(cx, -0.41, cz);
        root.add(fl);
        flames.push({ sprite: fl, phase: a * 3 + c });
      }

      animateFn = (t, sp) => {
        carousel.rotation.y += 0.018 * sp;
        roseWin.rotation.z -= 0.003 * sp;
        starTop.rotation.y -= 0.04 * sp;
        flames.forEach((f) => {
          const flk = 0.068 + Math.sin(t * 9 + f.phase) * 0.014 + burst * 0.025;
          f.sprite.scale.setScalar(flk);
        });
      };
      break;
    }
  }

  return {
    group: root,
    triggerBurst,
    update(time, dt, openProgress = 0) {
      if (burst > 0) {
        burst = Math.max(0, burst - dt * 0.65);
      }
      const speedMult = (0.25 + openProgress * 0.75) * (1 + burst * 2.6);
      animateFn(time, speedMult, openProgress);
    }
  };
}
