import { Storage } from '../utils/Storage.js';
import { UpgradeManager } from '../utils/UpgradeManager.js';

export const STAGE_META = [
  // WORLD 1 (STAGE 1 - 5)
  {
    world: 1,
    stage: 1,
    title: 'STAGE 01',
    name: 'PROTOCOL AWAKENING',
    icon: '🛰️',
    color: '#00f0ff',
    threat: 'ANCAMAN: RENDAH ★☆☆☆☆',
    threatColor: '#10b981',
    desc: 'Uji coba reaktivasi sistem pertahanan darurat. Hadapi skuadron drone intai awal yang mendekati orbit.',
    target: '10 Unit Drone Intai',
    reward: '+1000 Pts & +2 Tech Cores'
  },
  {
    world: 1,
    stage: 2,
    title: 'STAGE 02',
    name: 'RAPID INTERCEPTION',
    icon: '⚡',
    color: '#38bdf8',
    threat: 'ANCAMAN: SEDANG ★★☆☆☆',
    threatColor: '#38bdf8',
    desc: 'Musuh meluncurkan drone pencegat berkecepatan tinggi. Manuver lincah dan reflek cepat sangat dibutuhkan.',
    target: '14 Unit Fast Interceptor',
    reward: '+1000 Pts & +2 Tech Cores'
  },
  {
    world: 1,
    stage: 3,
    title: 'STAGE 03',
    name: 'HEAVY ASSAULT',
    icon: '🛡️',
    color: '#a855f7',
    threat: 'ANCAMAN: TINGGI ★★★☆☆',
    threatColor: '#a855f7',
    desc: 'Gelombang drone lapis baja berat dengan ketahanan tinggi. Gunakan tembakan fokus dan skill untuk menembusnya.',
    target: '18 Unit Heavy Armored',
    reward: '+1000 Pts & +2 Tech Cores'
  },
  {
    world: 1,
    stage: 4,
    title: 'STAGE 04',
    name: 'CYBER ONSLAUGHT',
    icon: '⚔️',
    color: '#f59e0b',
    threat: 'ANCAMAN: INTENS ★★★★☆',
    threatColor: '#f59e0b',
    desc: 'Gempuran armada tempur gabungan elit tanpa jeda. Semua jenis varian drone menyerbu secara simultan.',
    target: '22 Unit Armada Elit',
    reward: '+1000 Pts & +2 Tech Cores'
  },
  {
    world: 1,
    stage: 5,
    title: 'STAGE 05',
    name: 'TITAN NEXUS',
    icon: '👑',
    color: '#f43f5e',
    threat: 'ANCAMAN: BOSS TITAN ★★★★★',
    threatColor: '#f43f5e',
    desc: 'Mothership TITAN NEXUS telah tiba! Bersenjata meriam ganda, misil pelacak, dan perisai energi raksasa.',
    target: '12 Minion + BOSS TITAN NEXUS',
    reward: 'AKSES WORLD 2 & +5 Tech Cores'
  },
  // WORLD 2 (STAGE 6 - 10)
  {
    world: 2,
    stage: 6,
    title: 'STAGE 06',
    name: 'QUANTUM HORIZON',
    icon: '🌀',
    color: '#c084fc',
    threat: 'ANCAMAN: ANOMALI ★★★☆☆',
    threatColor: '#c084fc',
    desc: 'Memasuki zona singularitas luar. Phantom Drone memiliki kemampuan kamuflase kuantum dan distorsi spasial.',
    target: '16 Unit Phantom Drone',
    reward: '+1500 Pts & +3 Tech Cores'
  },
  {
    world: 2,
    stage: 7,
    title: 'STAGE 07',
    name: 'PERIMETER BREACH',
    icon: '🎯',
    color: '#eab308',
    threat: 'ANCAMAN: SNIPER ELIT ★★★★☆',
    threatColor: '#eab308',
    desc: 'Sektor sempit dijaga oleh Sniper Drone presisi tinggi. Hindari lintasan bidikan laser mematikan.',
    target: '20 Unit Sniper Drone',
    reward: '+1500 Pts & +3 Tech Cores'
  },
  {
    world: 2,
    stage: 8,
    title: 'STAGE 08',
    name: 'VOLATILE SWARM',
    icon: '💥',
    color: '#10b981',
    threat: 'ANCAMAN: SWARM EXPLOSIVE ★★★★☆',
    threatColor: '#10b981',
    desc: 'Splitter Drone membelah menjadi unit pelacak saat hancur. Waspadai reaksi ledakan berantai di sekeliling.',
    target: '24 Unit Splitter Drone',
    reward: '+1500 Pts & +3 Tech Cores'
  },
  {
    world: 2,
    stage: 9,
    title: 'STAGE 09',
    name: 'APEX CONVERGENCE',
    icon: '☣️',
    color: '#f97316',
    threat: 'ANCAMAN: DEADLY ★★★★★',
    threatColor: '#f97316',
    desc: 'Pertahanan terakhir sebelum inti singularitas. Seluruh varian armada World 2 bersatu mengepung kapal Anda.',
    target: '28 Unit Pasukan Gabungan',
    reward: '+1500 Pts & +3 Tech Cores'
  },
  {
    world: 2,
    stage: 10,
    title: 'STAGE 10',
    name: 'CHRONO MIRAGE',
    icon: '🌌',
    color: '#a855f7',
    threat: 'ANCAMAN: OVERLORD SINGULARITAS ★★★★★★',
    threatColor: '#a855f7',
    desc: 'THE CHRONO SINGULARITY: Boss CHRONO MIRAGE membelah menjadi 3 kapal ilusi dan melakukan Quantum Shuffle acak!',
    target: '15 Minion + BOSS CHRONO MIRAGE',
    reward: 'ZONE XETA UNLOCKED & +4 Cores'
  },
  // WORLD 3 / ZONE XETA (STAGE 11 - 15)
  {
    world: 3,
    stage: 11,
    title: 'STAGE 11',
    name: 'VERDANT THRESHOLD',
    icon: '🌱',
    color: '#10b981',
    threat: 'ANCAMAN: BIO-ANOMALY ★★★☆☆',
    threatColor: '#10b981',
    desc: 'Atmosfer kabut klorofil Zone Xeta. Spore Crawler melayang dengan gerakan bergelombang dan meledak menjadi spora mikro.',
    target: '18 Unit Spore Crawler',
    reward: '+2000 Pts & +3 Tech Cores'
  },
  {
    world: 3,
    stage: 12,
    title: 'STAGE 12',
    name: 'THORNWOOD CANOPY',
    icon: '🌿',
    color: '#22c55e',
    threat: 'ANCAMAN: BRAMBLE HAZARD ★★★★☆',
    threatColor: '#22c55e',
    desc: 'Hutan kanopi lebat kosmik. Bramble Weaver bersenjatakan duri tajam meluncurkan proyektil jarum bio-thorn mematikan.',
    target: '22 Unit Bramble Weaver',
    reward: '+2200 Pts & +3 Tech Cores'
  },
  {
    world: 3,
    stage: 13,
    title: 'STAGE 13',
    name: 'BIO-MANTIS NEST',
    icon: '🦗',
    color: '#84cc16',
    threat: 'ANCAMAN: APEX PREDATOR ★★★★☆',
    threatColor: '#84cc16',
    desc: 'Sarang predator lincah. Bio-Mantis bermanuver zig-zag dengan akselerasi tinggi dan tebasan sabit daun klorofil.',
    target: '26 Unit Bio-Mantis',
    reward: '+2500 Pts & +4 Tech Cores'
  },
  {
    world: 3,
    stage: 14,
    title: 'STAGE 14',
    name: 'OVERGROWTH SEEDPOD',
    icon: '🌳',
    color: '#14b8a6',
    threat: 'ANCAMAN: COLOSSUS SWARM ★★★★★',
    threatColor: '#14b8a6',
    desc: 'Pertahanan inti hutan purba. Verdant Colossus berkulit kayu purba melepaskan gelombang spora melingkar berkala.',
    target: '30 Unit Verdant Colossus',
    reward: '+2800 Pts & +4 Tech Cores'
  },
  {
    world: 3,
    stage: 15,
    title: 'STAGE 15',
    name: 'YGGDRASIL PRIMORDIAL',
    icon: '🌺',
    color: '#10b981',
    threat: 'ANCAMAN: ANCIENT FLORAL TITAN ★★★★★★',
    threatColor: '#10b981',
    desc: 'BOSS ZONE XETA: Pohon bio-mekanikal purba YGGDRASIL PRIMORDIAL! Memanggil Florian Petal Shield, Root Vine Lash, dan Solar Blossom!',
    target: '18 Minion + BOSS YGGDRASIL PRIMORDIAL',
    reward: 'CONQUER ZONE XETA & +8 Tech Cores'
  }
];

/**
 * Command Center Stage Selection Scene.
 * Professional master-detail tactical briefing interface eliminating text overflow and clutter.
 */
export class StageSelectScene {
  constructor() {
    this.unlockedStage = 1;
    this.lastPlayedStage = 1;
    this.currentWorld = 1; // 1 or 2
    this.selectedStage = 1;
    this.pulse = 0;
    this.message = '';
    this.messageTimer = 0;
    this.bgStars = [];
  }

  enter(params = {}) {
    this.pulse = 0;
    this.message = '';
    this.messageTimer = 0;
    this.unlockedStage = Math.max(1, Math.min(15, Storage.get('unlocked_stage', 1)));
    this.lastPlayedStage = Math.max(1, Math.min(this.unlockedStage, Storage.get('last_played_stage', 1)));

    // Auto-select World and Stage based on parameters or last played stage
    if (params && params.world) {
      this.currentWorld = params.world;
    } else if (this.lastPlayedStage >= 11) {
      this.currentWorld = 3;
    } else if (this.lastPlayedStage >= 6) {
      this.currentWorld = 2;
    } else {
      this.currentWorld = 1;
    }

    if (this.currentWorld === 3) {
      this.selectedStage = this.lastPlayedStage >= 11 ? this.lastPlayedStage : 11;
    } else if (this.currentWorld === 2) {
      this.selectedStage = (this.lastPlayedStage >= 6 && this.lastPlayedStage <= 10) ? this.lastPlayedStage : 6;
    } else {
      this.selectedStage = this.lastPlayedStage <= 5 ? this.lastPlayedStage : 1;
    }

    if (this.bgStars.length === 0) {
      for (let i = 0; i < 70; i++) {
        this.bgStars.push({
          x: Math.random() * this.engine.width,
          y: Math.random() * this.engine.height,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 20 + 10,
          brightness: Math.random() * 0.7 + 0.3
        });
      }
    }
  }

  showMessage(msg) {
    this.message = msg;
    this.messageTimer = 2.4;
  }

  setWorld(worldNumber) {
    if (this.currentWorld === worldNumber) return;
    if (worldNumber === 2 && this.unlockedStage < 6) {
      this.showMessage('Kalahkan BOSS TITAN NEXUS (Stage 5) untuk membuka World 2!');
      if (this.engine.sound) this.engine.sound.playClick();
      return;
    }
    if (worldNumber === 3 && this.unlockedStage < 11 && !Storage.get('zone_xeta_unlocked', false)) {
      this.showMessage('Kalahkan BOSS CHRONO MIRAGE (Stage 10) untuk membuka Zone Xeta!');
      if (this.engine.sound) this.engine.sound.playClick();
      return;
    }

    if (this.engine.sound) this.engine.sound.playClick();
    this.currentWorld = worldNumber;
    // Set selected stage to first stage of that world or last played if in that world
    if (this.currentWorld === 1) {
      this.selectedStage = this.lastPlayedStage <= 5 ? this.lastPlayedStage : 1;
    } else if (this.currentWorld === 2) {
      this.selectedStage = (this.lastPlayedStage >= 6 && this.lastPlayedStage <= 10) ? this.lastPlayedStage : 6;
    } else {
      this.selectedStage = this.lastPlayedStage >= 11 ? this.lastPlayedStage : 11;
    }
  }

  selectStage(stageNumber) {
    if (this.selectedStage === stageNumber) return;
    this.selectedStage = stageNumber;
    if (this.engine.sound) this.engine.sound.playClick();
  }

  launchStage(stageNumber) {
    if (stageNumber > this.unlockedStage) {
      this.showMessage(`STAGE ${stageNumber} MASIH TERKUNCI!`);
      if (this.engine.sound) this.engine.sound.playClick();
      return;
    }
    if (this.engine.sound) this.engine.sound.playClick();
    Storage.set('last_played_stage', stageNumber);
    this.sceneManager.set('game', { startStage: stageNumber });
  }

  update(dt) {
    this.pulse += dt * 3.5;

    if (this.messageTimer > 0) {
      this.messageTimer -= dt;
      if (this.messageTimer <= 0) this.message = '';
    }

    for (const star of this.bgStars) {
      star.y += star.speed * dt;
      if (star.y > this.engine.height) {
        star.y = 0;
        star.x = Math.random() * this.engine.width;
      }
    }

    const input = this.engine.input;
    const mx = input.mouse.x;
    const my = input.mouse.y;
    const clicked = input.justClicked();
    const w = this.engine.width;

    // Hotkey ESC -> Back to Menu
    if (input.justPressed('Escape')) {
      if (this.engine.sound) this.engine.sound.playClick();
      this.sceneManager.set('menu');
      return;
    }

    // World Navigation Hotkeys
    if (input.justPressed('ArrowLeft') || input.justPressed('KeyA')) {
      this.setWorld(Math.max(1, this.currentWorld - 1));
    }
    if (input.justPressed('ArrowRight') || input.justPressed('KeyD')) {
      this.setWorld(Math.min(3, this.currentWorld + 1));
    }

    // Stage Navigation Hotkeys Up / Down
    const stages = STAGE_META.filter((m) => m.world === this.currentWorld);
    const minStage = stages[0].stage;
    const maxStage = stages[stages.length - 1].stage;

    if (input.justPressed('ArrowUp') || input.justPressed('KeyW')) {
      if (this.selectedStage > minStage) {
        this.selectStage(this.selectedStage - 1);
      }
    }
    if (input.justPressed('ArrowDown') || input.justPressed('KeyS')) {
      if (this.selectedStage < maxStage) {
        this.selectStage(this.selectedStage + 1);
      }
    }

    // Launch with Space or Enter
    if (input.justPressed('Space') || input.justPressed('Enter')) {
      this.launchStage(this.selectedStage);
      return;
    }

    // Back button (top left)
    if (clicked && mx >= 18 && mx <= 110 && my >= 16 && my <= 52) {
      if (this.engine.sound) this.engine.sound.playClick();
      this.sceneManager.set('menu');
      return;
    }

    // World Tabs Click (3 tabs)
    const tabW1 = { x: 120, y: 16, w: 165, h: 36 };
    const tabW2 = { x: 295, y: 16, w: 165, h: 36 };
    const tabW3 = { x: 470, y: 16, w: 195, h: 36 };

    if (clicked) {
      if (mx >= tabW1.x && mx <= tabW1.x + tabW1.w && my >= tabW1.y && my <= tabW1.y + tabW1.h) {
        this.setWorld(1);
        return;
      }
      if (mx >= tabW2.x && mx <= tabW2.x + tabW2.w && my >= tabW2.y && my <= tabW2.y + tabW2.h) {
        this.setWorld(2);
        return;
      }
      if (mx >= tabW3.x && mx <= tabW3.x + tabW3.w && my >= tabW3.y && my <= tabW3.y + tabW3.h) {
        this.setWorld(3);
        return;
      }
    }

    // Left Panel Stage Rows Click
    const listX = 24;
    const listY = 114;
    const rowW = 285;
    const rowH = 74;
    const gap = 9;

    stages.forEach((meta, idx) => {
      const ry = listY + idx * (rowH + gap);
      if (clicked && mx >= listX && mx <= listX + rowW && my >= ry && my <= ry + rowH) {
        if (this.selectedStage === meta.stage && meta.stage <= this.unlockedStage) {
          // Double click / second click starts stage immediately
          this.launchStage(meta.stage);
        } else {
          this.selectStage(meta.stage);
        }
      }
    });

    // Right Dossier Launch Button Click
    const launchBtn = { x: 344, y: 472, w: 412, h: 50 };
    if (clicked && mx >= launchBtn.x && mx <= launchBtn.x + launchBtn.w && my >= launchBtn.y && my <= launchBtn.y + launchBtn.h) {
      this.launchStage(this.selectedStage);
    }
  }

  render(ctx) {
    const w = this.engine.width;
    const h = this.engine.height;

    // 1. Atmospheric Backdrop
    if (this.currentWorld === 1) {
      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, w, h);
    } else if (this.currentWorld === 2) {
      ctx.fillStyle = '#0a0614';
      ctx.fillRect(0, 0, w, h);

      // Cosmic nebula gradient overlay for World 2
      const grad = ctx.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, 450);
      grad.addColorStop(0, 'rgba(168, 85, 247, 0.14)');
      grad.addColorStop(1, 'rgba(10, 6, 20, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else {
      // World 3: ZONE XETA (Verdant Nature theme)
      ctx.fillStyle = '#03140b';
      ctx.fillRect(0, 0, w, h);

      // Lush emerald nature nebula overlay
      const grad = ctx.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, 450);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.18)');
      grad.addColorStop(1, 'rgba(3, 20, 11, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // Starfield / Spore particles
    for (const star of this.bgStars) {
      ctx.fillStyle = this.currentWorld === 3 ? '#a7f3d0' : (this.currentWorld === 2 ? '#e9d5ff' : '#ffffff');
      ctx.globalAlpha = star.brightness;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1.0;

    // 2. Top Navigation Bar
    this.renderHeader(ctx, w);

    // 3. Main Workspace: Left List & Right Dossier
    this.renderLeftStageList(ctx);
    this.renderRightDossier(ctx);

    // 4. Footer Help bar
    this.renderFooter(ctx, w);

    // 5. Notification Message Overlay
    if (this.message) {
      ctx.save();
      ctx.textAlign = 'center';
      const boxW = 540;
      const boxH = 40;
      const bx = (w - boxW) / 2;
      const by = 130;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
      ctx.strokeStyle = '#ffe600';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#ffe600';
      ctx.shadowBlur = 15;
      ctx.fillRect(bx, by, boxW, boxH);
      ctx.strokeRect(bx, by, boxW, boxH);

      ctx.font = '800 13px "Orbitron", sans-serif';
      ctx.fillStyle = '#ffe600';
      ctx.fillText(`⚠️ ${this.message}`, w / 2, by + 25);
      ctx.restore();
    }
  }

  renderHeader(ctx, w) {
    ctx.save();
    const input = this.engine.input;
    const mx = input.mouse.x;
    const my = input.mouse.y;

    // Back Button (Left)
    const btnBack = { x: 18, y: 16, w: 92, h: 36 };
    const hovBack = mx >= btnBack.x && mx <= btnBack.x + btnBack.w && my >= btnBack.y && my <= btnBack.y + btnBack.h;

    ctx.fillStyle = hovBack ? 'rgba(0, 240, 255, 0.25)' : 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = hovBack ? '#00f0ff' : 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = hovBack ? 2 : 1;
    ctx.shadowColor = hovBack ? '#00f0ff' : 'transparent';
    ctx.shadowBlur = hovBack ? 10 : 0;
    ctx.fillRect(btnBack.x, btnBack.y, btnBack.w, btnBack.h);
    ctx.strokeRect(btnBack.x, btnBack.y, btnBack.w, btnBack.h);

    ctx.font = '700 12px "Orbitron", sans-serif';
    ctx.fillStyle = hovBack ? '#ffffff' : '#cbd5e1';
    ctx.textAlign = 'center';
    ctx.fillText('← MENU', btnBack.x + btnBack.w / 2, btnBack.y + 23);

    // World Switcher Tabs (Center - 3 Tabs)
    const tabW1 = { x: 120, y: 16, w: 165, h: 36 };
    const tabW2 = { x: 295, y: 16, w: 165, h: 36 };
    const tabW3 = { x: 470, y: 16, w: 195, h: 36 };

    const isW1 = this.currentWorld === 1;
    const isW2 = this.currentWorld === 2;
    const isW3 = this.currentWorld === 3;
    const isW2Unlocked = this.unlockedStage >= 6;
    const isW3Unlocked = this.unlockedStage >= 11 || Storage.get('zone_xeta_unlocked', false);

    const hovW1 = mx >= tabW1.x && mx <= tabW1.x + tabW1.w && my >= tabW1.y && my <= tabW1.y + tabW1.h;
    const hovW2 = mx >= tabW2.x && mx <= tabW2.x + tabW2.w && my >= tabW2.y && my <= tabW2.y + tabW2.h;
    const hovW3 = mx >= tabW3.x && mx <= tabW3.x + tabW3.w && my >= tabW3.y && my <= tabW3.y + tabW3.h;

    // Tab 1: WORLD 1
    ctx.fillStyle = isW1 ? 'rgba(0, 240, 255, 0.28)' : (hovW1 ? 'rgba(30, 41, 59, 0.8)' : 'rgba(15, 23, 42, 0.65)');
    ctx.strokeStyle = isW1 ? '#00f0ff' : 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = isW1 ? 2 : 1;
    ctx.shadowColor = isW1 ? '#00f0ff' : 'transparent';
    ctx.shadowBlur = isW1 ? 12 : 0;
    ctx.fillRect(tabW1.x, tabW1.y, tabW1.w, tabW1.h);
    ctx.strokeRect(tabW1.x, tabW1.y, tabW1.w, tabW1.h);

    ctx.font = '800 11.5px "Orbitron", sans-serif';
    ctx.fillStyle = isW1 ? '#ffffff' : '#94a3b8';
    ctx.fillText('🌐 WORLD 01', tabW1.x + tabW1.w / 2, tabW1.y + 23);

    // Tab 2: WORLD 2
    ctx.fillStyle = isW2 ? 'rgba(168, 85, 247, 0.32)' : (hovW2 ? 'rgba(30, 41, 59, 0.8)' : 'rgba(15, 23, 42, 0.65)');
    ctx.strokeStyle = isW2 ? '#c084fc' : isW2Unlocked ? 'rgba(168, 85, 247, 0.4)' : 'rgba(71, 85, 105, 0.3)';
    ctx.lineWidth = isW2 ? 2 : 1;
    ctx.shadowColor = isW2 ? '#c084fc' : 'transparent';
    ctx.shadowBlur = isW2 ? 12 : 0;
    ctx.fillRect(tabW2.x, tabW2.y, tabW2.w, tabW2.h);
    ctx.strokeRect(tabW2.x, tabW2.y, tabW2.w, tabW2.h);

    ctx.font = '800 11.5px "Orbitron", sans-serif';
    ctx.fillStyle = isW2 ? '#ffffff' : isW2Unlocked ? '#c084fc' : '#64748b';
    ctx.fillText(isW2Unlocked ? '🌌 WORLD 02' : '🔒 WORLD 02', tabW2.x + tabW2.w / 2, tabW2.y + 23);

    // Tab 3: ZONE XETA
    ctx.fillStyle = isW3 ? 'rgba(16, 185, 129, 0.34)' : (hovW3 ? 'rgba(30, 41, 59, 0.8)' : 'rgba(15, 23, 42, 0.65)');
    ctx.strokeStyle = isW3 ? '#10b981' : isW3Unlocked ? 'rgba(16, 185, 129, 0.4)' : 'rgba(71, 85, 105, 0.3)';
    ctx.lineWidth = isW3 ? 2 : 1;
    ctx.shadowColor = isW3 ? '#10b981' : 'transparent';
    ctx.shadowBlur = isW3 ? 12 : 0;
    ctx.fillRect(tabW3.x, tabW3.y, tabW3.w, tabW3.h);
    ctx.strokeRect(tabW3.x, tabW3.y, tabW3.w, tabW3.h);

    ctx.font = '800 11.5px "Orbitron", sans-serif';
    ctx.fillStyle = isW3 ? '#ffffff' : isW3Unlocked ? '#34d399' : '#64748b';
    ctx.fillText(isW3Unlocked ? '🌿 ZONE XETA' : '🔒 ZONE XETA', tabW3.x + tabW3.w / 2, tabW3.y + 23);

    // Tech Cores Badge (Right)
    const points = UpgradeManager.getTechPoints();
    ctx.fillStyle = 'rgba(255, 230, 0, 0.12)';
    ctx.strokeStyle = '#ffe600';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.fillRect(w - 125, 16, 107, 36);
    ctx.strokeRect(w - 125, 16, 107, 36);

    ctx.font = '800 11px "Orbitron", sans-serif';
    ctx.fillStyle = '#ffe600';
    ctx.fillText(`⚡ ${points} CORES`, w - 71, 39);

    ctx.restore();
  }

  renderLeftStageList(ctx) {
    ctx.save();
    const listX = 24;
    const listY = 66;
    const listW = 285;
    const listH = 472;

    // Outer Container Frame
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1;
    ctx.fillRect(listX, listY, listW, listH);
    ctx.strokeRect(listX, listY, listW, listH);
    this.drawCyberCorners(ctx, listX, listY, listW, listH, 10, '#00f0ff');

    // List Header
    ctx.font = '800 12px "Orbitron", sans-serif';
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 6;
    ctx.textAlign = 'left';
    ctx.fillText('📡 DAFTAR SEKTOR MISI', listX + 16, listY + 26);

    ctx.shadowBlur = 0;
    ctx.font = '500 11px "Outfit", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Pilih sektor untuk melihat briefing', listX + 16, listY + 42);

    // 5 Stage Rows
    const stages = STAGE_META.filter((m) => m.world === this.currentWorld);
    const startY = listY + 54;
    const rowH = 74;
    const gap = 8;

    const input = this.engine.input;
    const mx = input.mouse.x;
    const my = input.mouse.y;

    stages.forEach((meta, idx) => {
      const ry = startY + idx * (rowH + gap);
      const isSelected = this.selectedStage === meta.stage;
      const isUnlocked = meta.stage <= this.unlockedStage;
      const isCleared = meta.stage < this.unlockedStage;
      const isHovered = mx >= listX + 10 && mx <= listX + listW - 10 && my >= ry && my <= ry + rowH;

      ctx.save();
      // Row Background
      if (isSelected) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.16)';
        ctx.strokeStyle = meta.color;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = meta.color;
        ctx.shadowBlur = 10;
      } else if (isHovered) {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = isUnlocked ? 'rgba(15, 23, 42, 0.70)' : 'rgba(10, 15, 26, 0.5)';
        ctx.strokeStyle = isUnlocked ? 'rgba(51, 65, 85, 0.45)' : 'rgba(30, 41, 59, 0.3)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
      }

      ctx.fillRect(listX + 10, ry, listW - 20, rowH);
      ctx.strokeRect(listX + 10, ry, listW - 20, rowH);

      // Selected Neon Bar Indicator on Left Edge
      if (isSelected) {
        ctx.fillStyle = meta.color;
        ctx.fillRect(listX + 10, ry, 4, rowH);
      }

      // Stage Number Badge
      ctx.shadowBlur = 0;
      ctx.font = '900 15px "Orbitron", sans-serif';
      ctx.fillStyle = isUnlocked ? meta.color : '#475569';
      ctx.textAlign = 'left';
      const numStr = meta.stage < 10 ? `0${meta.stage}` : `${meta.stage}`;
      ctx.fillText(numStr, listX + 22, ry + 28);

      // Stage Title
      ctx.font = '800 12px "Orbitron", sans-serif';
      ctx.fillStyle = isUnlocked ? '#ffffff' : '#64748b';
      ctx.fillText(meta.name, listX + 54, ry + 28);

      // Subtitle / Target Hint
      ctx.font = '500 11px "Outfit", sans-serif';
      ctx.fillStyle = isUnlocked ? '#94a3b8' : '#475569';
      ctx.fillText(meta.target, listX + 22, ry + 52);

      // Status Badge (Right Edge)
      ctx.textAlign = 'right';
      if (isCleared) {
        ctx.font = '800 10px "Orbitron", sans-serif';
        ctx.fillStyle = '#10b981';
        ctx.fillText('✔ SELESAI', listX + listW - 20, ry + 26);
      } else if (isUnlocked) {
        ctx.font = '800 10px "Orbitron", sans-serif';
        ctx.fillStyle = '#00f0ff';
        ctx.fillText('⚡ AKTIF', listX + listW - 20, ry + 26);
      } else {
        ctx.font = '700 10px "Orbitron", sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('🔒 KUNCI', listX + listW - 20, ry + 26);
      }

      ctx.restore();
    });

    ctx.restore();
  }

  renderRightDossier(ctx) {
    ctx.save();
    const dX = 324;
    const dY = 66;
    const dW = 452;
    const dH = 472;

    const meta = STAGE_META.find((m) => m.stage === this.selectedStage) || STAGE_META[0];
    const isUnlocked = meta.stage <= this.unlockedStage;

    // Dossier Card Frame
    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.strokeStyle = isUnlocked ? meta.color : 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = isUnlocked ? meta.color : 'transparent';
    ctx.shadowBlur = isUnlocked ? 14 : 0;
    ctx.fillRect(dX, dY, dW, dH);
    ctx.strokeRect(dX, dY, dW, dH);
    this.drawCyberCorners(ctx, dX, dY, dW, dH, 12, isUnlocked ? meta.color : 'rgba(71, 85, 105, 0.4)');

    // 1. Dossier Header Tag
    ctx.shadowBlur = 0;
    ctx.textAlign = 'left';
    ctx.font = '800 10px "Orbitron", sans-serif';
    ctx.fillStyle = meta.color;
    ctx.fillText(`DOSSIER OPERASI // SEKTOR ${meta.stage < 10 ? '0' + meta.stage : meta.stage} (WORLD ${meta.world})`, dX + 24, dY + 30);

    // 2. Icon + Big Mission Title
    ctx.font = '36px sans-serif';
    ctx.fillText(meta.icon, dX + 24, dY + 76);

    ctx.font = '900 22px "Orbitron", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = meta.color;
    ctx.shadowBlur = 8;
    ctx.fillText(meta.name, dX + 76, dY + 68);

    // Threat Level Pill
    ctx.shadowBlur = 0;
    ctx.font = '700 11px "Orbitron", sans-serif';
    ctx.fillStyle = meta.threatColor || '#38bdf8';
    ctx.fillText(`⚡ ${meta.threat}`, dX + 76, dY + 88);

    // Divider Line
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(dX + 24, dY + 104);
    ctx.lineTo(dX + dW - 24, dY + 104);
    ctx.stroke();

    // 3. Tactical Briefing Box
    const briefX = dX + 24;
    const briefY = dY + 118;
    const briefW = dW - 48;
    const briefH = 88;

    ctx.fillStyle = 'rgba(30, 41, 59, 0.45)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.fillRect(briefX, briefY, briefW, briefH);
    ctx.strokeRect(briefX, briefY, briefW, briefH);

    ctx.font = '800 11px "Orbitron", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('📋 BRIEFING TAKTIS & INTEL MUSUH:', briefX + 16, briefY + 24);

    ctx.font = '400 12.5px "Outfit", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    this.drawWrappedText(ctx, meta.desc, briefX + 16, briefY + 46, briefW - 32, 18);

    // 4. Mission Target Box
    const tarY = dY + 220;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.45)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.fillRect(briefX, tarY, briefW, 52);
    ctx.strokeRect(briefX, tarY, briefW, 52);

    ctx.font = '800 10.5px "Orbitron", sans-serif';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText('🎯 TARGET ELIMINASI:', briefX + 16, tarY + 20);

    ctx.font = '700 13px "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(meta.target, briefX + 16, tarY + 40);

    // 5. Reward Box
    const rewY = dY + 286;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.45)';
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.25)';
    ctx.fillRect(briefX, rewY, briefW, 52);
    ctx.strokeRect(briefX, rewY, briefW, 52);

    ctx.font = '800 10.5px "Orbitron", sans-serif';
    ctx.fillStyle = '#eab308';
    ctx.fillText('🎁 HADIAH CLEAR SEKTOR:', briefX + 16, rewY + 20);

    ctx.font = '700 13px "Outfit", sans-serif';
    ctx.fillStyle = '#ffe600';
    ctx.fillText(meta.reward, briefX + 16, rewY + 40);

    // 6. Launch CTA Button
    const btnX = briefX;
    const btnY = dY + dH - 68;
    const btnW = briefW;
    const btnH = 48;

    const input = this.engine.input;
    const mx = input.mouse.x;
    const my = input.mouse.y;
    const hovBtn = mx >= btnX && mx <= btnX + btnW && my >= btnY && my <= btnY + btnH;

    if (isUnlocked) {
      ctx.fillStyle = hovBtn ? meta.color : 'rgba(0, 240, 255, 0.20)';
      ctx.strokeStyle = meta.color;
      ctx.lineWidth = hovBtn ? 2.5 : 1.5;
      ctx.shadowColor = meta.color;
      ctx.shadowBlur = hovBtn ? 18 : 8;
      ctx.fillRect(btnX, btnY, btnW, btnH);
      ctx.strokeRect(btnX, btnY, btnW, btnH);
      this.drawCyberCorners(ctx, btnX, btnY, btnW, btnH, 8, meta.color);

      ctx.textAlign = 'center';
      ctx.font = '900 14px "Orbitron", sans-serif';
      ctx.fillStyle = hovBtn ? '#060913' : '#ffffff';
      ctx.fillText(`▶ MULAI OPERASI SEKTOR ${meta.stage} [ENTER]`, btnX + btnW / 2, btnY + 30);
    } else {
      ctx.fillStyle = 'rgba(20, 25, 40, 0.6)';
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.fillRect(btnX, btnY, btnW, btnH);
      ctx.strokeRect(btnX, btnY, btnW, btnH);

      ctx.textAlign = 'center';
      ctx.font = '800 12.5px "Orbitron", sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`🔒 SEKTOR TERKUNCI (SELESAIKAN STAGE ${meta.stage - 1})`, btnX + btnW / 2, btnY + 30);
    }

    ctx.restore();
  }

  renderFooter(ctx, w) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '500 12px "Outfit", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('NAVIGASI: [↑ / ↓] Pilih Sektor  •  [← / →] Ganti World  •  [ENTER / KLIK] Mulai Operasi  •  [ESC] Menu', w / 2, 575);
    ctx.restore();
  }

  drawCyberCorners(ctx, x, y, w, h, size = 12, color = '#00f0ff') {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    // Top-Left
    ctx.moveTo(x, y + size); ctx.lineTo(x, y); ctx.lineTo(x + size, y);
    // Top-Right
    ctx.moveTo(x + w - size, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + size);
    // Bottom-Left
    ctx.moveTo(x, y + h - size); ctx.lineTo(x, y + h); ctx.lineTo(x + size, y + h);
    // Bottom-Right
    ctx.moveTo(x + w - size, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - size);
    ctx.stroke();
    ctx.restore();
  }

  drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currY);
        line = words[n] + ' ';
        currY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currY);
  }
}
