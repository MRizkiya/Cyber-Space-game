import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { Boss } from '../entities/Boss.js';
import { BossStage10 } from '../entities/BossStage10.js';
import { BossZoneXeta } from '../entities/BossZoneXeta.js';
import { Item } from '../entities/Item.js';
import { Bullet } from '../entities/Bullet.js';
import { BlackHole } from '../entities/BlackHole.js';
import { Collision } from '../utils/Collision.js';
import { Storage } from '../utils/Storage.js';
import { UpgradeManager } from '../utils/UpgradeManager.js';
import { SettingsModal } from '../utils/SettingsModal.js';

export const ENDLESS_BUFF_POOL = [
  {
    id: 'dmg_boost',
    type: 'damage',
    title: 'KINETIC OVERCHARGE',
    short: '+25% Weapon Damage',
    desc: 'Tingkatkan daya hancur senjata utama dan semua proyektil.',
    tag: 'OFFENSE',
    color: '#f43f5e',
    icon: '⚔️'
  },
  {
    id: 'fire_rate',
    type: 'firerate',
    title: 'RAPID ACCELERATOR',
    short: '+20% Fire Rate',
    desc: 'Percepat laju tembakan peluru per detik secara masif.',
    tag: 'OFFENSE',
    color: '#f59e0b',
    icon: '⚡'
  },
  {
    id: 'shield_boost',
    type: 'shield',
    title: 'AEGIS BARRIER MATRIX',
    short: '+1 Max Shield & Full Repair',
    desc: 'Tambah kapasitas maksimal perisai dan pulihkan shield seketika.',
    tag: 'DEFENSE',
    color: '#00f0ff',
    icon: '🛡️'
  },
  {
    id: 'speed_boost',
    type: 'speed',
    title: 'HYPER THRUSTERS',
    short: '+18% Speed & Velocity',
    desc: 'Kelincahan manuver pesawat dan laju kecepatan proyektil bertambah.',
    tag: 'MOBILITY',
    color: '#10b981',
    icon: '🚀'
  },
  {
    id: 'crit_mastery',
    type: 'crit',
    title: 'QUANTUM CRITICAL',
    short: '+15% Crit Rate & +40% Crit Dmg',
    desc: 'Tingkatkan peluang serangan fatal dan pelipatganda damage critical.',
    tag: 'OFFENSE',
    color: '#eab308',
    icon: '🎯'
  },
  {
    id: 'drone_escort',
    type: 'drone',
    title: 'AUXILIARY DRONE FLEET',
    short: '+1 Drone Pengawal Otomatis',
    desc: 'Panggil drone tempur ekstra untuk mengawal dan menembak musuh.',
    tag: 'TACTICAL',
    color: '#38bdf8',
    icon: '🛸'
  },
  {
    id: 'skill_overclock',
    type: 'cooldown',
    title: 'TACTICAL OVERCLOCK',
    short: '-20% Cooldown Skill [Q]',
    desc: 'Persingkat waktu jeda pendinginan skill taktis aktif [Q].',
    tag: 'TACTICAL',
    color: '#c084fc',
    icon: '⏱️'
  },
  {
    id: 'aoe_expansion',
    type: 'aoe',
    title: 'BLAST RESONANCE',
    short: '+35% Blast & Nova AoE',
    desc: 'Perbesar radius ledakan Rudal, Frost Nova, dan serpihan es.',
    tag: 'UTILITY',
    color: '#ec4899',
    icon: '💥'
  }
];

const STAGE_CONFIGS = [
  // WORLD 1 (STAGE 1 - 5)
  {
    stage: 1,
    world: 1,
    title: 'STAGE 1',
    subtitle: 'PROTOCOL AWAKENING',
    objective: 'Basmi 10 Unit Drone Musuh',
    targetKills: 10,
    spawnInterval: 1.8,
    color: '#00f0ff'
  },
  {
    stage: 2,
    world: 1,
    title: 'STAGE 2',
    subtitle: 'RAPID INTERCEPTION',
    objective: 'Musuh lebih cepat! Basmi 14 Unit',
    targetKills: 14,
    spawnInterval: 1.5,
    color: '#38bdf8'
  },
  {
    stage: 3,
    world: 1,
    title: 'STAGE 3',
    subtitle: 'HEAVY ARMOR ASSAULT',
    objective: 'Drone berperisai tebal terdeteksi! Basmi 18 Unit',
    targetKills: 18,
    spawnInterval: 1.3,
    color: '#b026ff'
  },
  {
    stage: 4,
    world: 1,
    title: 'STAGE 4',
    subtitle: 'CYBER ONSLAUGHT',
    objective: 'Gempuran intensitas tinggi! Basmi 22 Unit',
    targetKills: 22,
    spawnInterval: 1.05,
    color: '#ff9900'
  },
  {
    stage: 5,
    world: 1,
    title: 'STAGE 5',
    subtitle: 'FINAL CONFRONTATION: WORLD 1',
    objective: 'Basmi 12 Minion pengawal, lalu hancurkan TITAN NEXUS!',
    targetKills: 12,
    spawnInterval: 0.95,
    color: '#ff0055'
  },
  // WORLD 2 (STAGE 6 - 10)
  {
    stage: 6,
    world: 2,
    title: 'STAGE 6',
    subtitle: 'QUANTUM HORIZON',
    objective: 'Phantom Drone berjubah teleportasi terdeteksi! Basmi 16 Unit',
    targetKills: 16,
    spawnInterval: 1.15,
    color: '#c084fc'
  },
  {
    stage: 7,
    world: 2,
    title: 'STAGE 7',
    subtitle: 'PERIMETER BREACH',
    objective: 'Hindari tembakan Sniper Drone! Basmi 20 Unit',
    targetKills: 20,
    spawnInterval: 1.0,
    color: '#eab308'
  },
  {
    stage: 8,
    world: 2,
    title: 'STAGE 8',
    subtitle: 'VOLATILE SWARM',
    objective: 'Waspada Splitter Drone yang membelah! Basmi 24 Unit',
    targetKills: 24,
    spawnInterval: 0.9,
    color: '#10b981'
  },
  {
    stage: 9,
    world: 2,
    title: 'STAGE 9',
    subtitle: 'APEX CONVERGENCE',
    objective: 'Badai musuh elit terkuat antariksa! Basmi 28 Unit',
    targetKills: 28,
    spawnInterval: 0.8,
    color: '#f97316'
  },
  {
    stage: 10,
    world: 2,
    title: 'STAGE 10',
    subtitle: 'THE CHRONO SINGULARITY',
    objective: 'Basmi 15 Pasukan Pengawal, lalu kalahkan CHRONO MIRAGE!',
    targetKills: 15,
    spawnInterval: 0.85,
    color: '#a855f7'
  },
  // WORLD 3 / ZONE XETA (STAGE 11 - 15)
  {
    stage: 11,
    world: 3,
    zone: 'xeta',
    title: 'STAGE 11',
    subtitle: 'VERDANT THRESHOLD',
    objective: 'Basmi 18 Unit Spore Crawler',
    targetKills: 18,
    spawnInterval: 1.1,
    color: '#10b981'
  },
  {
    stage: 12,
    world: 3,
    zone: 'xeta',
    title: 'STAGE 12',
    subtitle: 'THORNWOOD CANOPY',
    objective: 'Basmi 22 Unit Bramble Weaver',
    targetKills: 22,
    spawnInterval: 0.95,
    color: '#22c55e'
  },
  {
    stage: 13,
    world: 3,
    zone: 'xeta',
    title: 'STAGE 13',
    subtitle: 'BIO-MANTIS NEST',
    objective: 'Basmi 26 Unit Bio-Mantis',
    targetKills: 26,
    spawnInterval: 0.85,
    color: '#84cc16'
  },
  {
    stage: 14,
    world: 3,
    zone: 'xeta',
    title: 'STAGE 14',
    subtitle: 'OVERGROWTH SEEDPOD',
    objective: 'Basmi 30 Unit Verdant Colossus',
    targetKills: 30,
    spawnInterval: 0.78,
    color: '#14b8a6'
  },
  {
    stage: 15,
    world: 3,
    zone: 'xeta',
    title: 'STAGE 15',
    subtitle: 'YGGDRASIL PRIMORDIAL',
    objective: 'Basmi 18 Pengawal Hutan, lalu kalahkan YGGDRASIL PRIMORDIAL!',
    targetKills: 18,
    spawnInterval: 0.8,
    color: '#10b981'
  }
];

/**
 * Main active gameplay scene handling stage progression across World 1 & 2, combat, and Bosses.
 */
export class GameScene {
  constructor() {
    this.player = null;
    this.bullets = [];
    this.bossBullets = [];
    this.enemies = [];
    this.items = [];
    this.blackHoles = [];
    this.bosses = [];

    this.score = 0;
    this.enemiesDefeated = 0;
    this.combo = 1;
    this.comboTimer = 0;

    // Endless Mode Management
    this.isEndless = false;
    this.survivalTime = 0;
    this.endlessWave = 1;
    this.waveTimer = 0;
    this.waveDuration = 45; // 45 detik per wave
    this.endlessBossKillCount = 0;
    this.bossRespawnTimer = 0;
    this.titanRespawnTimer = 0;
    this.chronoRespawnTimer = 0;
    this.bossAnnouncement = '';
    this.bossAnnouncementTimer = 0;
    this.showingBuffModal = false;
    this.buffChoices = [];
    this.appliedBuffs = [];

    // Stage Management (0 to 14 representing Stage 1 to 15)
    this.currentStageIndex = 0;
    this.stageKills = 0;
    this.stageState = 'stage_intro';
    this.stateTimer = 0;

    // Stage 10 Black Hole Cinematic Cutscene
    this.blackholeCutsceneTimer = 0;
    this.blackholeEventPhase = 0;
    this.blackoutAlpha = 0;
    this.shipSuckScale = 1.0;
    this.shipSuckAngle = 0;

    this.spawnTimer = 0;
    this.bgStars = [];
    this.paused = false;
    this.showingSettings = false;
    this.uiPulse = 0;
  }

  get boss() {
    return this.bosses[0] || null;
  }

  set boss(val) {
    if (!val) this.bosses = [];
    else this.bosses = [val];
  }

  get currentStageConfig() {
    return STAGE_CONFIGS[this.currentStageIndex] || STAGE_CONFIGS[0];
  }

  formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  triggerBossAnnouncement(text, duration = 3.2) {
    this.bossAnnouncement = text;
    this.bossAnnouncementTimer = duration;
  }

  triggerEndlessBuffModal() {
    this.showingBuffModal = true;
    this.engine.sound.playVictory();

    // Pick 3 random unique buffs
    const shuffled = [...ENDLESS_BUFF_POOL].sort(() => Math.random() - 0.5);
    this.buffChoices = shuffled.slice(0, 3);
  }

  selectEndlessBuff(buffIndex) {
    const buff = this.buffChoices[buffIndex];
    if (!buff) return;

    if (this.player && this.player.isAlive) {
      this.player.applyEndlessBuff(buff, this.engine);
    }
    this.appliedBuffs.push(buff);
    this.showingBuffModal = false;
    this.engine.sound.playClick();
    this.triggerBossAnnouncement(`⚡ BUFF DIAKTIFKAN: ${buff.short.toUpperCase()}!`, 2.8);
  }

  updateBuffModal(input) {
    const mx = input.mouse.x;
    const my = input.mouse.y;
    const clicked = input.justClicked();

    // Hotkeys 1, 2, 3
    if (input.justPressed('Digit1') || input.justPressed('Numpad1')) {
      this.selectEndlessBuff(0);
      return;
    }
    if (input.justPressed('Digit2') || input.justPressed('Numpad2')) {
      this.selectEndlessBuff(1);
      return;
    }
    if (input.justPressed('Digit3') || input.justPressed('Numpad3')) {
      this.selectEndlessBuff(2);
      return;
    }

    // Mouse click on cards
    if (clicked) {
      const w = this.engine.width;
      const cardW = 220;
      const cardH = 265;
      const gap = 25;
      const startX = (w - (cardW * 3 + gap * 2)) / 2;
      const cardY = 175;

      for (let i = 0; i < this.buffChoices.length; i++) {
        const cx = startX + i * (cardW + gap);
        if (mx >= cx && mx <= cx + cardW && my >= cardY && my <= cardY + cardH) {
          this.selectEndlessBuff(i);
          return;
        }
      }
    }
  }

  enter(params = {}) {
    const perks = UpgradeManager.getCombatPerks();
    this.player = new Player(this.engine.width / 2, this.engine.height - 100, perks);

    this.bullets = [];
    this.bossBullets = [];
    this.enemies = [];
    this.items = [];
    this.blackHoles = [];
    this.bosses = [];

    this.score = 0;
    this.enemiesDefeated = 0;
    this.combo = 1;
    this.comboTimer = 0;

    this.isEndless = !!(params && params.isEndless);
    this.survivalTime = 0;
    this.endlessWave = 1;
    this.waveTimer = 0;
    this.waveDuration = 45;
    this.endlessBossKillCount = 0;
    this.bossRespawnTimer = 0;
    this.titanRespawnTimer = 0;
    this.chronoRespawnTimer = 0;
    this.bossAnnouncement = '';
    this.bossAnnouncementTimer = 0;
    this.showingBuffModal = false;
    this.buffChoices = [];
    this.appliedBuffs = [];

    if (this.isEndless) {
      this.currentStageIndex = 0;
      this.stageState = 'combat';
      this.stageKills = 0;
      this.triggerBossAnnouncement('♾️ ENDLESS PROTOCOL ACTIVE // SURVIVE AS LONG AS YOU CAN');

      // High-speed galaxy starfield with magenta, cyan, and white streaks
      this.bgStars = [];
      for (let i = 0; i < 90; i++) {
        const randColor = Math.random();
        this.bgStars.push({
          x: Math.random() * this.engine.width,
          y: Math.random() * this.engine.height,
          size: Math.random() * 2.2 + 0.5,
          speed: Math.random() * 80 + 35,
          alpha: Math.random() * 0.7 + 0.3,
          color: randColor < 0.3 ? '#f43f5e' : randColor < 0.6 ? '#38bdf8' : '#ffffff'
        });
      }
    } else {
      // Start at selected stage (or resume last played stage)
      const chosenStage = (params && params.startStage) || Storage.get('last_played_stage', 1);
      this.currentStageIndex = Math.max(0, Math.min(14, chosenStage - 1));
      Storage.set('last_played_stage', this.currentStageIndex + 1);

      this.stageKills = 0;
      this.startStageIntro();

      // Reset cutscene variables
      this.blackholeCutsceneTimer = 0;
      this.blackholeEventPhase = 0;
      this.blackoutAlpha = 0;
      this.shipSuckScale = 1.0;
      this.shipSuckAngle = 0;

      // Background starfield (World 1: Cyan, World 2: Violet, World 3: Emerald Spores)
      const isW3 = this.currentStageIndex >= 10;
      const isW2 = this.currentStageIndex >= 5 && this.currentStageIndex < 10;
      this.bgStars = [];
      for (let i = 0; i < 85; i++) {
        const randCol = Math.random();
        let starColor = '#ffffff';
        if (isW3) {
          starColor = randCol < 0.4 ? '#10b981' : randCol < 0.7 ? '#86efac' : '#ffffff';
        } else if (isW2) {
          starColor = randCol < 0.4 ? '#c084fc' : '#ffffff';
        } else {
          starColor = randCol < 0.3 ? '#00f0ff' : '#ffffff';
        }
        this.bgStars.push({
          x: Math.random() * this.engine.width,
          y: Math.random() * this.engine.height,
          size: Math.random() * (isW3 ? 2.5 : 2) + 0.5,
          speed: Math.random() * 55 + 25,
          alpha: Math.random() * 0.7 + 0.3,
          color: starColor
        });
      }
    }

    this.spawnTimer = 0;
    this.paused = false;
    this.showingSettings = false;
    this.engine.particles.clear();
  }

  startStageIntro() {
    this.stageState = 'stage_intro';
    this.stateTimer = 2.6;
    this.stageKills = 0;
    this.bullets = [];
    this.bossBullets = [];
    this.enemies = [];
    this.blackHoles = [];
    this.bosses = [];

    if (!this.isEndless) {
      const stageNum = this.currentStageIndex + 1;
      Storage.set('last_played_stage', stageNum);

      // Adapt starfield colors if advancing across world thresholds
      const isW3 = this.currentStageIndex >= 10;
      const isW2 = this.currentStageIndex >= 5 && this.currentStageIndex < 10;
      for (const star of this.bgStars) {
        const randCol = Math.random();
        if (isW3) {
          star.color = randCol < 0.4 ? '#10b981' : randCol < 0.7 ? '#86efac' : '#ffffff';
        } else if (isW2) {
          star.color = randCol < 0.4 ? '#c084fc' : '#ffffff';
        } else {
          star.color = randCol < 0.3 ? '#00f0ff' : '#ffffff';
        }
      }
    }
  }

  update(dt) {
    const input = this.engine.input;
    this.uiPulse += dt * 3.5;

    // Handle Endless Tactical Buff selection modal (pauses all other updates)
    if (this.showingBuffModal) {
      this.updateBuffModal(input);
      return;
    }

    // Handle input when game is paused
    if (this.paused) {
      if (this.showingSettings) {
        SettingsModal.update(input, this.engine, () => {
          this.showingSettings = false;
        });
        return;
      }

      const mx = input.mouse.x;
      const my = input.mouse.y;
      const clicked = input.justClicked();

      const btnResume = { x: 176, y: 310, w: 140, h: 46 };
      const btnSettings = { x: 330, y: 310, w: 140, h: 46 };
      const btnMenu = { x: 484, y: 310, w: 140, h: 46 };

      // Resume shortcuts: P or Space
      if (input.justPressed('KeyP') || input.justPressed('Space')) {
        this.paused = false;
        this.engine.sound.playClick();
        return;
      }

      // Settings shortcut: O or S
      if (input.justPressed('KeyO')) {
        this.showingSettings = true;
        this.engine.sound.playClick();
        return;
      }

      // Return to Menu shortcuts: M or Escape
      if (input.justPressed('KeyM') || input.justPressed('Escape')) {
        this.paused = false;
        this.engine.sound.playClick();
        this.sceneManager.set('menu');
        return;
      }

      // Mouse click on pause buttons
      if (clicked) {
        if (mx >= btnResume.x && mx <= btnResume.x + btnResume.w && my >= btnResume.y && my <= btnResume.y + btnResume.h) {
          this.paused = false;
          this.engine.sound.playClick();
          return;
        }
        if (mx >= btnSettings.x && mx <= btnSettings.x + btnSettings.w && my >= btnSettings.y && my <= btnSettings.y + btnSettings.h) {
          this.showingSettings = true;
          this.engine.sound.playClick();
          return;
        }
        if (mx >= btnMenu.x && mx <= btnMenu.x + btnMenu.w && my >= btnMenu.y && my <= btnMenu.y + btnMenu.h) {
          this.paused = false;
          this.engine.sound.playClick();
          this.sceneManager.set('menu');
          return;
        }
      }

      return;
    }

    // Toggle pause with P or Escape while playing
    if (input.justPressed('KeyP') || input.justPressed('Escape')) {
      this.paused = true;
      this.engine.sound.playClick();
      return;
    }

    // Dev shortcut for Endless Mode (KeyT: Fast-Forward +1 Wave and trigger Buff Modal)
    if (this.isEndless && input.justPressed('KeyT')) {
      this.endlessWave += 1;
      this.survivalTime += this.waveDuration;
      this.waveTimer = 0;
      if (this.player) {
        this.player.health = this.player.maxHealth;
        this.player.invulnerableTimer = 4.0;
      }
      this.enemies = [];
      this.bossBullets = [];
      this.engine.sound.playLaser();

      if (this.endlessWave === 10) {
        this.triggerBossAnnouncement(`⏩ FAST-FORWARD (+1 WAVE) // WAVE 10: 1 BOSS PROTOCOL!`, 3.0);
      } else if (this.endlessWave >= 20 && this.endlessWave % 10 === 0) {
        this.triggerBossAnnouncement(`⏩ FAST-FORWARD (+1 WAVE) // WAVE ${this.endlessWave}: 2 BOSS PROTOCOL!`, 3.0);
      } else {
        this.triggerBossAnnouncement(`⏩ FAST-FORWARD (+1 WAVE) // WAVE ${this.endlessWave} (SURVIVAL: ${this.formatTime(this.survivalTime)})`, 2.5);
      }

      this.triggerEndlessBuffModal();
      return;
    }

    if (this.bossAnnouncementTimer > 0) {
      this.bossAnnouncementTimer -= dt;
    }

    // Combo decaying
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 1;
      }
    }

    // Scroll stars
    for (const star of this.bgStars) {
      star.y += star.speed * dt;
      if (star.y > this.engine.height) {
        star.y = 0;
        star.x = Math.random() * this.engine.width;
      }
    }

    if (this.stageState === 'stage_intro') {
      this.updateStageIntro(dt, input);
      return;
    }

    if (this.stageState === 'boss_warning') {
      this.updateBossWarning(dt);
      return;
    }

    if (this.stageState === 'stage_clear') {
      this.updateStageClear(dt);
      return;
    }

    if (this.stageState === 'stage10_blackhole_event') {
      this.updateStage10Cutscene(dt, input);
      return;
    }

    this.updateGameplay(dt);
  }

  updateStageIntro(dt, input) {
    this.stateTimer -= dt;

    if (input.justPressed('Space') || input.justPressed('Enter') || input.justClicked() || this.stateTimer <= 0) {
      this.stageState = 'combat';
      this.stateTimer = 0;
      this.spawnTimer = 0.5;
      this.engine.sound.playClick();
    }
  }

  updateBossWarning(dt) {
    this.stateTimer -= dt;
    this.engine.camera.shake(4, 0.1);

    if (this.stateTimer <= 0) {
      this.stageState = 'boss_fight';
      const stageNum = this.currentStageIndex + 1;

      if (stageNum === 15) {
        // Stage 15 Boss: YGGDRASIL PRIMORDIAL (Zone Xeta Ancient Nature Titan)
        this.bosses = [new BossZoneXeta(this.engine.width / 2, -90)];
      } else if (stageNum === 10) {
        // Stage 10 Boss: CHRONO MIRAGE (Decoys & Quantum Shuffle)
        this.bosses = [new BossStage10(this.engine.width / 2, -60)];
      } else {
        // Stage 5 Boss: TITAN NEXUS
        this.bosses = [new Boss(this.engine.width / 2, -60)];
      }
      this.engine.sound.playBossAlert();
    }
  }

  updateStageClear(dt) {
    this.stateTimer -= dt;
    if (this.stateTimer <= 0) {
      this.currentStageIndex++;
      this.startStageIntro();
    }
  }

  spawnBulletSplits(bullet) {
    const splitSpeed = (bullet.vel.mag() || 650) * 0.85;
    const baseAng = Math.atan2(bullet.vel.y, bullet.vel.x);
    for (const offset of [-0.55, 0.55]) {
      const dartVx = Math.cos(baseAng + offset) * splitSpeed;
      const dartVy = Math.sin(baseAng + offset) * splitSpeed;
      this.bullets.push(
        new Bullet(bullet.x, bullet.y, dartVx, dartVy, '#00f0ff', {
          damage: 0.25,
          scale: 0.65,
          isHoming: true,
          homingTurnSpeed: 3.8,
          homingRadius: 200,
          lifetime: 0.85,
          canSplit: false
        })
      );
    }
  }

  updateGameplay(dt) {
    if (this.stageState !== 'combat' && this.stageState !== 'boss_fight') return;

    // 1. Update Player & Active Skills
    const activeBosses = this.isEndless ? this.bosses.filter(b => b && b.isAlive) : (this.boss && this.boss.isAlive ? [this.boss] : []);
    const allBossCombatTargets = [];
    for (const b of activeBosses) {
      if (typeof b.getHomingTargets === 'function') {
        allBossCombatTargets.push(...b.getHomingTargets());
      } else {
        allBossCombatTargets.push(b);
      }
    }
    const droneCombatTargets = allBossCombatTargets.length > 0
      ? [...this.enemies, ...allBossCombatTargets]
      : this.enemies;

    if (this.player.isAlive) {
      this.player.update(
        dt,
        this.engine,
        this.bullets,
        (bx, by, perks) => {
          this.blackHoles.push(new BlackHole(bx, by, perks));
          this.engine.sound.playBossAlert();
          this.engine.camera.shake(6, 0.2);
        },
        droneCombatTargets,
        this.bossBullets,
        this.combo
      );
    } else {
      if (this.isEndless) {
        const prevBest = Storage.get('endless_best_time', 0);
        const isNewBest = this.survivalTime > prevBest;
        if (isNewBest) {
          Storage.set('endless_best_time', Math.floor(this.survivalTime));
        }
        this.sceneManager.set('gameover', {
          score: this.score,
          enemiesDefeated: this.enemiesDefeated,
          isEndless: true,
          survivalTime: this.survivalTime,
          endlessWave: this.endlessWave,
          isNewBestTime: isNewBest,
          bestSurvivalTime: Math.max(prevBest, Math.floor(this.survivalTime)),
          buffCount: this.appliedBuffs.length
        });
      } else {
        this.sceneManager.set('gameover', {
          score: this.score,
          enemiesDefeated: this.enemiesDefeated,
          isEndless: false
        });
      }
      return;
    }

    // 2. Update Black Holes
    for (let i = this.blackHoles.length - 1; i >= 0; i--) {
      const bh = this.blackHoles[i];
      if (!bh || !bh.isAlive) continue;

      if (activeBosses.length > 0) {
        for (const b of activeBosses) {
          bh.update(
            dt,
            this.enemies,
            this.engine,
            (killedEnemy) => this.onEnemyKilled(killedEnemy),
            b,
            (bossKilled) => {
              if (bossKilled) {
                this.handleBossDefeated(b);
              }
            }
          );
          if (this.stageState !== 'combat' && this.stageState !== 'boss_fight') return;
        }
      } else {
        bh.update(
          dt,
          this.enemies,
          this.engine,
          (killedEnemy) => this.onEnemyKilled(killedEnemy),
          null,
          null
        );
      }
      if (!bh.isAlive) {
        this.blackHoles.splice(i, 1);
      }
    }
    if (this.stageState !== 'combat' && this.stageState !== 'boss_fight') return;

    // 3. Update Bullets (with Homing guidance towards enemies & active Boss/Clones)
    const homingTargets = allBossCombatTargets.length > 0
      ? [...this.enemies, ...allBossCombatTargets]
      : this.enemies;

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      if (!b) continue;
      b.update(dt, homingTargets, this.engine);
      if (!b.isAlive) {
        this.bullets.splice(i, 1);
      }
    }

    // 4. Update Boss Bullets (and Sniper beams)
    for (let i = this.bossBullets.length - 1; i >= 0; i--) {
      const bb = this.bossBullets[i];
      bb.update(dt);

      if (this.player.isAlive && Collision.aabb(bb.getBounds(), this.player.getBounds())) {
        bb.isAlive = false;
        this.player.takeDamage(1, this.engine);
        this.combo = 1;
      }

      if (!bb.isAlive) {
        this.bossBullets.splice(i, 1);
      }
    }

    // 5. Update Items
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.update(dt, this.player);

      if (Collision.aabb(this.player.getBounds(), item.getBounds())) {
        if (item.type === 'heal') {
          this.player.health = Math.min(this.player.maxHealth, this.player.health + 1);
          this.score += 50;
          this.engine.sound.playPickup();
        } else if (item.type === 'core') {
          UpgradeManager.addTechPoints(1);
          this.score += 250;
          this.engine.sound.playPickup();
          this.engine.particles.emit(item.x, item.y, 18, {
            color: '#ffe600',
            speed: 130,
            size: 3.5,
            life: 0.5
          });
        } else {
          this.score += 150 * this.combo;
          this.combo = Math.min(8, this.combo + 1);
          this.comboTimer = 3.5;
          this.engine.sound.playPickup();
        }

        this.engine.particles.emit(item.x, item.y, 12, {
          color: item.color,
          speed: 110,
          size: 3,
          life: 0.35
        });

        this.items.splice(i, 1);
      } else if (!item.isAlive) {
        this.items.splice(i, 1);
      }
    }

    // 6. Update Enemies & Spawning
    const config = this.currentStageConfig;
    const stageNum = this.currentStageIndex + 1;

    if (this.isEndless) {
      this.survivalTime += dt;
      this.waveTimer = (this.waveTimer || 0) + dt;

      // Trigger Wave Progression & Tactical Buff modal every 1 wave (45s per wave)
      if (this.waveTimer >= this.waveDuration) {
        this.waveTimer = 0;
        this.endlessWave += 1;

        if (this.endlessWave === 10) {
          this.triggerBossAnnouncement('⚠️ WAVE 10: TITAN NEXUS PROTOCOL ACTIVE!', 3.2);
        } else if (this.endlessWave >= 20 && this.endlessWave % 10 === 0) {
          this.triggerBossAnnouncement(`☠️ WAVE ${this.endlessWave}: DUAL OVERLORD PROTOCOL ACTIVE!`, 3.2);
        } else {
          this.triggerBossAnnouncement(`🌊 WAVE ${this.endlessWave} DIMULAI // TACTICAL BUFF SIAP!`, 2.5);
        }

        this.triggerEndlessBuffModal();
        return;
      }

      const elapsedMinutes = this.survivalTime / 60;
      const spawnInterval = Math.max(0.40, 1.4 - elapsedMinutes * 0.045);
      this.spawnTimer += dt;
      if (this.spawnTimer >= spawnInterval) {
        this.spawnTimer = 0;
        this.spawnEndlessEnemy(elapsedMinutes);
      }
      this.updateEndlessBossSpawns(dt, elapsedMinutes);
    } else {
      if (this.stageState === 'combat') {
        this.spawnTimer += dt;
        if (this.spawnTimer >= config.spawnInterval) {
          this.spawnTimer = 0;
          this.spawnEnemy(stageNum);
        }
      }
    }

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.update(dt, this.player, this.engine, this.bossBullets);

      // Bullet vs Enemy
      for (let j = this.bullets.length - 1; j >= 0; j--) {
        const bullet = this.bullets[j];
        if (!bullet.isAlive) continue;

        if (Collision.aabb(bullet.getBounds(), enemy.getBounds())) {
          const dmg = bullet.damage || 1;
          const keepFlying = bullet.onHit(enemy);

          if (bullet.isRocket && bullet.explosionRadius > 0) {
            this.triggerRocketExplosion(bullet.x, bullet.y, bullet.explosionRadius, dmg * 0.75, enemy);
            if (this.stageState !== 'combat' && this.stageState !== 'boss_fight') return;
          }

          if (bullet.hasChainLightning && Math.random() < 0.45) {
            this.triggerChainLightning(enemy.x, enemy.y, 2, dmg * 0.65, enemy);
          }

          const wasIcy = enemy.chillTimer > 0 || enemy.frozenTimer > 0;
          const killed = enemy.takeDamage(dmg, this.engine, (sx, sy, stype) => {
            this.enemies.push(new Enemy(sx, sy, stype, this.isEndless ? 10 : stageNum));
          }, bullet.hasCryo);

          if (killed) {
            if (wasIcy && this.player.perks.hasIceShatter) {
              this.triggerIceShatter(enemy.x, enemy.y);
            }

            this.onEnemyKilled(enemy);
            if (!keepFlying) {
              bullet.isAlive = false;
            }
            break;
          }

          if (!keepFlying) {
            bullet.isAlive = false;
            break;
          }
        }
      }

      // Enemy vs Player collision
      if (enemy.isAlive && Collision.aabb(enemy.getBounds(), this.player.getBounds())) {
        const damaged = this.player.takeDamage(1, this.engine);
        if (damaged) {
          this.combo = 1;
        }
      }

      if (!enemy.isAlive) {
        this.enemies.splice(i, 1);
      }
    }

    // 7. Update Bosses in combat
    const bossesToUpdate = this.isEndless ? this.bosses : (this.stageState === 'boss_fight' && this.boss ? [this.boss] : []);
    for (const b of bossesToUpdate) {
      if (!b || !b.isAlive) continue;
      b.update(dt, this.player, this.engine, this.bossBullets, (mx, my, type = 'fast') => {
        this.enemies.push(new Enemy(mx, my, type, this.isEndless ? 10 : stageNum));
      });
    }

    if (this.stageState !== 'combat' && this.stageState !== 'boss_fight') return;

    for (let j = this.bullets.length - 1; j >= 0; j--) {
      const bullet = this.bullets[j];
      if (!bullet || !bullet.isAlive) continue;

      for (const b of bossesToUpdate) {
        if (!b || !b.isAlive) continue;

        if (b instanceof BossStage10) {
          const hitResult = b.checkBulletHit(bullet, this.engine, this.bossBullets, this.player);
          if (hitResult.hit) {
            if (bullet.canSplit && !bullet.hasSplit) {
              bullet.hasSplit = true;
              this.spawnBulletSplits(bullet);
            }

            if (!hitResult.isDecoy) {
              const dmg = bullet.damage || 1;
              const killed = b.takeDamage(dmg, this.engine);
              if (killed) {
                this.handleBossDefeated(b);
                return;
              }
            }
            if (!bullet.onHit(hitResult.target || b)) {
              bullet.isAlive = false;
              break;
            }
          }
        } else {
          if (Collision.aabb(bullet.getBounds(), b.getBounds())) {
            if (bullet.canSplit && !bullet.hasSplit) {
              bullet.hasSplit = true;
              this.spawnBulletSplits(bullet);
            }

            const dmg = bullet.damage || 1;
            const keepFlying = bullet.onHit(b);
            const killed = b.takeDamage(dmg, this.engine);

            if (killed) {
              this.handleBossDefeated(b);
              return;
            }

            if (!keepFlying) {
              bullet.isAlive = false;
              break;
            }
          }
        }
      }
    }

    // Boss and Decoy Clones vs Player collision
    for (const b of bossesToUpdate) {
      if (!b.isAlive) continue;
      if (Collision.aabb(b.getBounds(), this.player.getBounds())) {
        this.player.takeDamage(1, this.engine);
        this.combo = 1;
      }
      if (b instanceof BossStage10 && b.clones) {
        for (const clone of b.clones) {
          if (clone.isAlive && Collision.aabb(clone.getBounds(), this.player.getBounds())) {
            this.player.takeDamage(1, this.engine);
            this.combo = 1;
          }
        }
      }
    }
  }

  triggerRocketExplosion(x, y, radius, damage, excludeTarget = null) {
    this.engine.sound.playExplosion();
    this.engine.camera.shake(6, 0.2);
    this.engine.particles.emit(x, y, 22, {
      color: '#f97316',
      speed: 150,
      size: 4.5,
      life: 0.38
    });
    this.engine.particles.emit(x, y, 16, {
      color: '#fbbf24',
      speed: 110,
      size: 3.5,
      life: 0.3
    });

    for (const e of this.enemies) {
      if (!e.isAlive || e === excludeTarget) continue;
      const d = Math.hypot(e.x - x, e.y - y);
      if (d <= radius) {
        e.takeDamage(damage, this.engine);
      }
    }
    const bossesToCheck = this.isEndless ? this.bosses : (this.boss ? [this.boss] : []);
    for (const b of bossesToCheck) {
      if (b && b.isAlive && b !== excludeTarget) {
        const d = Math.hypot(b.x - x, b.y - y);
        if (d <= radius + 35) {
          const killed = b.takeDamage(damage, this.engine);
          if (killed) {
            this.handleBossDefeated(b);
            return;
          }
        }
      }
    }
  }

  triggerChainLightning(originX, originY, maxJumps = 2, damage = 1, excludeTarget = null) {
    let currentX = originX;
    let currentY = originY;
    let hitCount = 0;
    const visited = new Set();
    if (excludeTarget) visited.add(excludeTarget);

    for (const e of this.enemies) {
      if (!e.isAlive || visited.has(e)) continue;
      const dist = Math.hypot(e.x - currentX, e.y - currentY);
      if (dist <= 200) {
        visited.add(e);
        hitCount++;

        // Draw electrical lightning spark particles
        const steps = 7;
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const px = currentX + (e.x - currentX) * t + (Math.random() - 0.5) * 16;
          const py = currentY + (e.y - currentY) * t + (Math.random() - 0.5) * 16;
          this.engine.particles.emit(px, py, 1, {
            color: '#38bdf8',
            speed: 40,
            size: 2.5,
            life: 0.18
          });
        }

        e.takeDamage(damage, this.engine);
        currentX = e.x;
        currentY = e.y;
        if (hitCount >= maxJumps) break;
      }
    }
  }

  triggerIceShatter(x, y) {
    this.engine.sound.playLaser();
    this.engine.particles.emit(x, y, 16, {
      color: '#38bdf8',
      speed: 140,
      size: 3.5,
      life: 0.35
    });

    const speed = 550;
    const angles = [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2];
    for (const ang of angles) {
      this.bullets.push(
        new Bullet(x, y, Math.cos(ang) * speed, Math.sin(ang) * speed, '#38bdf8', {
          damage: 1.2,
          scale: 0.9,
          isIceShard: true,
          pierce: 1,
          lifetime: 0.85
        })
      );
    }
  }

  onEnemyKilled(enemy) {
    this.enemiesDefeated++;
    this.stageKills++;
    this.score += enemy.scoreValue * this.combo;
    this.combo = Math.min(8, this.combo + 1);
    this.comboTimer = 3.5;

    // Harder & Balanced Tech Core acquisition:
    // Only elite/heavy enemies have decent chance (14%), basic enemies have low chance (2.5%), micro 0%
    const isElite = ['tank', 'stealth', 'sniper', 'splitter'].includes(enemy.type);
    const coreChance = isElite ? 0.14 : enemy.type === 'micro' ? 0 : 0.025;

    if (Math.random() < coreChance) {
      // Physical collectible Tech Core item dropped in battle
      this.items.push(new Item(enemy.x, enemy.y, 'core'));
    } else if (Math.random() < 0.28) {
      // Score crystal gem or emergency heal
      const needsHeal = this.player.health < this.player.maxHealth;
      const itemType = (needsHeal && Math.random() < 0.22) ? 'heal' : 'gem';
      this.items.push(new Item(enemy.x, enemy.y, itemType));
    }

    // Technomancer: Singularity Collapse on Elite kills
    const perks = this.player.perks;
    if (perks && perks.hasSingularityCollapse && isElite && Math.random() < 0.6) {
      this.blackHoles.push(new BlackHole(enemy.x, enemy.y, { blackHoleDamage: 1.5, blackHoleRadius: 90, blackHoleDuration: 2.2 }, true));
      this.engine.particles.emit(enemy.x, enemy.y, 16, {
        color: '#a855f7',
        speed: 130,
        size: 3.5,
        life: 0.4
      });
    }

    // Check Stage Progression (Campaign only)
    if (!this.isEndless) {
      const config = this.currentStageConfig;
      const stageNum = this.currentStageIndex + 1;

      if (this.stageState === 'combat' && this.stageKills >= config.targetKills) {
        if (stageNum === 5 || stageNum === 10 || stageNum === 15) {
          this.stageState = 'boss_warning';
          this.stateTimer = 2.4;
          this.engine.sound.playBossAlert();
        } else {
          this.stageState = 'stage_clear';
          this.stateTimer = 2.0;
          this.score += 1000;
          UpgradeManager.addTechPoints(1);

          const nextStageNum = stageNum + 1;
          if (nextStageNum <= 15) {
            const highestUnlocked = Storage.get('unlocked_stage', 1);
            Storage.set('unlocked_stage', Math.max(highestUnlocked, nextStageNum));
            Storage.set('last_played_stage', nextStageNum);
          }

          this.player.health = Math.min(this.player.maxHealth, this.player.health + 1);
          this.engine.sound.playStageClear();
        }
      }
    }
  }

  handleBossDefeated(defeatedBoss = null) {
    const targetBoss = defeatedBoss || (this.isEndless ? this.bosses[0] : this.boss);
    if (!targetBoss) return;

    this.score += (targetBoss.scoreValue || 2500) * this.combo;
    this.enemiesDefeated++;

    if (this.isEndless) {
      this.endlessBossKillCount = (this.endlessBossKillCount || 0) + 1;
      const isChrono = targetBoss instanceof BossStage10;
      UpgradeManager.addTechPoints(isChrono ? 3 : 2);
      this.engine.sound.playVictory();
      this.engine.camera.shake(12, 0.4);

      // Remove from alive bosses array
      targetBoss.isAlive = false;
      this.bosses = this.bosses.filter(b => b !== targetBoss && b.isAlive);

      if (isChrono) {
        this.chronoRespawnTimer = 4.0;
      } else {
        this.titanRespawnTimer = 4.0;
      }
      this.bossRespawnTimer = 4.0;

      this.triggerBossAnnouncement(`⚡ ${targetBoss.name} HANCUR! (+${targetBoss.scoreValue} PTS)`);
      return;
    }

    // Campaign Mode Boss Rewards
    const stageNum = this.currentStageIndex + 1;
    if (stageNum === 5) {
      UpgradeManager.addTechPoints(2);
      const highestUnlocked = Storage.get('unlocked_stage', 1);
      Storage.set('unlocked_stage', Math.max(highestUnlocked, 6));
      Storage.set('last_played_stage', 6);

      this.stageState = 'stage_clear';
      this.stateTimer = 2.5;
      this.score += 2500;
      this.engine.sound.playStageClear();
      this.player.health = Math.min(this.player.maxHealth, this.player.health + 2);
      this.bosses = [];
    } else if (stageNum === 10) {
      UpgradeManager.addTechPoints(4);
      Storage.set('stage10_beaten', true);
      Storage.set('zone_xeta_unlocked', true);
      const highestUnlocked = Storage.get('unlocked_stage', 1);
      Storage.set('unlocked_stage', Math.max(highestUnlocked, 11));
      Storage.set('last_played_stage', 11);

      this.score += 5000;
      this.bosses = [];
      this.startStage10BlackholeCutscene();
      return;
    } else if (stageNum === 15) {
      UpgradeManager.addTechPoints(8);
      const highestUnlocked = Storage.get('unlocked_stage', 1);
      Storage.set('unlocked_stage', Math.max(highestUnlocked, 15));
      Storage.set('last_played_stage', 15);

      this.score += 10000;
      this.bosses = [];
      setTimeout(() => {
        this.sceneManager.set('victory', {
          score: this.score,
          enemiesDefeated: this.enemiesDefeated,
          isZoneXetaClear: true
        });
      }, 1400);
    }
  }

  updateEndlessBossSpawns(dt, elapsedMinutes) {
    // Clean up dead bosses
    this.bosses = this.bosses.filter(b => b && b.isAlive);

    if (this.endlessWave >= 20) {
      // Wave 20 ke atas: Muncul 2 BOSS SEKALIGUS (Boss Stage 5 Titan Nexus & Boss Stage 10 Chrono Mirage)
      const hasTitan = this.bosses.some(b => b instanceof Boss && !(b instanceof BossStage10));
      const hasChrono = this.bosses.some(b => b instanceof BossStage10);

      if (!hasTitan && this.titanRespawnTimer <= 0) {
        const hpBonus = Math.floor((this.endlessWave - 20) * 12);
        const titan = new Boss(this.engine.width / 2 - 130, -70);
        titan.targetY = 85; // Jalur atas formasi
        titan.maxHp += hpBonus;
        titan.hp = titan.maxHp;
        this.bosses.push(titan);
        this.engine.sound.playBossAlert();
        this.triggerBossAnnouncement('⚠️ TITAN NEXUS PROTOCOL ACTIVE!');
      } else if (!hasTitan) {
        this.titanRespawnTimer -= dt;
      }

      if (!hasChrono && this.chronoRespawnTimer <= 0) {
        const hpBonus = Math.floor((this.endlessWave - 20) * 16);
        const chrono = new BossStage10(this.engine.width / 2 + 130, -80);
        chrono.targetY = 155; // Jalur bawah formasi
        chrono.maxHp += hpBonus;
        chrono.hp = chrono.maxHp;
        this.bosses.push(chrono);
        this.engine.sound.playBossAlert();
        this.triggerBossAnnouncement('☠️ CHRONO MIRAGE QUANTUM INTERCEPTION!');
      } else if (!hasChrono) {
        this.chronoRespawnTimer -= dt;
      }
    } else if (this.endlessWave >= 10) {
      // Wave 10 - 19: Muncul 1 BOSS TANPA HENTI (Mati langsung respawn loop)
      if (this.bosses.length === 0) {
        if (this.bossRespawnTimer > 0) {
          this.bossRespawnTimer -= dt;
        } else {
          // Spawn 1 boss (bergantian antara Titan Nexus dan Chrono Mirage)
          const spawnType = (this.endlessBossKillCount % 2 === 0) ? 'titan' : 'chrono';
          const hpBonus = Math.floor((this.endlessWave - 10) * 10);
          if (spawnType === 'titan') {
            const titan = new Boss(this.engine.width / 2, -70);
            titan.maxHp += hpBonus;
            titan.hp = titan.maxHp;
            this.bosses.push(titan);
            this.triggerBossAnnouncement('⚠️ TITAN NEXUS ENTERING SECTOR!');
          } else {
            const chrono = new BossStage10(this.engine.width / 2, -70);
            chrono.maxHp += hpBonus;
            chrono.hp = chrono.maxHp;
            this.bosses.push(chrono);
            this.triggerBossAnnouncement('🌀 CHRONO MIRAGE WARP SIGNATURE!');
          }
          this.engine.sound.playBossAlert();
        }
      }
    }
  }

  spawnEndlessEnemy(elapsedMinutes) {
    const margin = 30;
    let sx, sy;
    const side = Math.floor(Math.random() * 4);

    if (side === 0) {
      sx = Math.random() * this.engine.width;
      sy = -margin;
    } else if (side === 1) {
      sx = this.engine.width + margin;
      sy = Math.random() * this.engine.height;
    } else if (side === 2) {
      sx = Math.random() * this.engine.width;
      sy = this.engine.height + margin;
    } else {
      sx = -margin;
      sy = Math.random() * this.engine.height;
    }

    const rand = Math.random();
    let type = 'drone';

    // Evolusi komposisi musuh seiring berjalannya menit
    if (elapsedMinutes >= 15) {
      if (rand < 0.25) type = 'tank';
      else if (rand < 0.50) type = 'sniper';
      else if (rand < 0.72) type = 'stealth';
      else if (rand < 0.88) type = 'splitter';
      else type = 'fast';
    } else if (elapsedMinutes >= 8) {
      if (rand < 0.25) type = 'splitter';
      else if (rand < 0.50) type = 'sniper';
      else if (rand < 0.75) type = 'stealth';
      else if (rand < 0.90) type = 'tank';
      else type = 'fast';
    } else if (elapsedMinutes >= 4) {
      if (rand < 0.30) type = 'tank';
      else if (rand < 0.60) type = 'fast';
      else if (rand < 0.85) type = 'sniper';
      else type = 'drone';
    } else if (elapsedMinutes >= 1.5) {
      if (rand < 0.45) type = 'fast';
      else if (rand < 0.70) type = 'drone';
      else type = 'tank';
    } else {
      type = rand < 0.4 ? 'fast' : 'drone';
    }

    // Setara dengan level kesulitan stage 1 - 10
    const virtualStage = Math.min(10, Math.floor(elapsedMinutes * 0.8) + 1);
    const enemy = new Enemy(sx, sy, type, virtualStage);

    // Multiplier HP dan kecepatan yang terus bertambah tanpa henti
    const hpScale = 1.0 + elapsedMinutes * 0.14;
    enemy.maxHp = Math.max(1, Math.round(enemy.maxHp * hpScale));
    enemy.hp = enemy.maxHp;
    enemy.speed = Math.round(enemy.speed * (1.0 + Math.min(0.65, elapsedMinutes * 0.03)));

    this.enemies.push(enemy);
  }

  spawnEnemy(stageNum) {
    const margin = 30;
    let sx, sy;
    const side = Math.floor(Math.random() * 4);

    if (side === 0) {
      sx = Math.random() * this.engine.width;
      sy = -margin;
    } else if (side === 1) {
      sx = this.engine.width + margin;
      sy = Math.random() * this.engine.height;
    } else if (side === 2) {
      sx = Math.random() * this.engine.width;
      sy = this.engine.height + margin;
    } else {
      sx = -margin;
      sy = Math.random() * this.engine.height;
    }

    const rand = Math.random();
    let type = 'drone';

    // Enemy Type Allocation per Stage
    if (stageNum >= 14) {
      // Stage 14 - 15: Deep Zone Xeta Canopy & Boss Minions
      if (rand < 0.32) type = 'colossus';
      else if (rand < 0.58) type = 'mantis';
      else if (rand < 0.82) type = 'thorn';
      else type = 'spore';
    } else if (stageNum === 13) {
      // Stage 13: Bio-Mantis Nest
      if (rand < 0.45) type = 'mantis';
      else if (rand < 0.75) type = 'thorn';
      else type = 'spore';
    } else if (stageNum === 12) {
      // Stage 12: Thornwood Canopy
      if (rand < 0.50) type = 'thorn';
      else if (rand < 0.80) type = 'spore';
      else type = 'fast';
    } else if (stageNum === 11) {
      // Stage 11: Verdant Threshold
      if (rand < 0.65) type = 'spore';
      else if (rand < 0.85) type = 'fast';
      else type = 'tank';
    } else if (stageNum >= 9) {
      if (rand < 0.22) type = 'stealth';
      else if (rand < 0.44) type = 'sniper';
      else if (rand < 0.66) type = 'splitter';
      else if (rand < 0.82) type = 'tank';
      else type = 'fast';
    } else if (stageNum >= 8) {
      if (rand < 0.35) type = 'splitter';
      else if (rand < 0.65) type = 'sniper';
      else if (rand < 0.85) type = 'fast';
      else type = 'tank';
    } else if (stageNum >= 7) {
      if (rand < 0.38) type = 'sniper';
      else if (rand < 0.70) type = 'stealth';
      else type = 'fast';
    } else if (stageNum >= 6) {
      if (rand < 0.40) type = 'stealth';
      else if (rand < 0.75) type = 'fast';
      else type = 'tank';
    } else {
      if (stageNum >= 3 && rand < 0.28) {
        type = 'tank';
      } else if (stageNum >= 2 && rand < 0.6) {
        type = 'fast';
      }
    }

    this.enemies.push(new Enemy(sx, sy, type, stageNum));
  }

  render(ctx) {
    const w = this.engine.width;
    const h = this.engine.height;

    // Background Starfield
    for (const star of this.bgStars) {
      ctx.fillStyle = star.color || '#ffffff';
      ctx.globalAlpha = star.alpha;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1.0;

    // Render Black Holes
    for (const bh of this.blackHoles) {
      bh.render(ctx);
    }

    // Render Items
    for (const item of this.items) {
      item.render(ctx);
    }

    // Render Enemies
    for (const enemy of this.enemies) {
      enemy.render(ctx);
    }

    // Render Boss Bullets & Sniper beams
    for (const bb of this.bossBullets) {
      bb.render(ctx);
    }

    // Render Bullets
    for (const bullet of this.bullets) {
      bullet.render(ctx);
    }

    // Render Bosses
    const bossesToRender = this.isEndless ? this.bosses : (this.boss ? [this.boss] : []);
    for (const b of bossesToRender) {
      if (b && b.isAlive) {
        b.render(ctx);
      }
    }
    this.renderBossHealthBars(ctx, w);

    // Render Player (hidden during blackhole event since it is rendered inside cutscene with scale/rotation)
    if (this.player && this.player.isAlive && this.stageState !== 'stage10_blackhole_event') {
      this.player.render(ctx);
    }

    // Render HUD (hidden during blackhole event for cinematic immersion)
    if (this.stageState !== 'stage10_blackhole_event') {
      this.renderHUD(ctx, w, h);
    }

    // Overlays for specific states
    if (this.bossAnnouncementTimer > 0) {
      this.renderBossAnnouncementOverlay(ctx, w, h);
    }

    if (this.stageState === 'stage_intro') {
      this.renderStageIntroOverlay(ctx, w, h);
    } else if (this.stageState === 'boss_warning') {
      this.renderBossWarningOverlay(ctx, w, h);
    } else if (this.stageState === 'stage_clear') {
      this.renderStageClearOverlay(ctx, w, h);
    } else if (this.stageState === 'stage10_blackhole_event') {
      this.renderStage10Cutscene(ctx, w, h);
    }

    // Pause Overlay
    if (this.paused) {
      this.renderPauseOverlay(ctx, w, h);
    }

    // Endless Tactical Buff Selection Modal
    if (this.showingBuffModal) {
      this.renderBuffModal(ctx, w, h);
    }
  }

  renderBossHealthBars(ctx, w) {
    const aliveBosses = this.bosses.filter(b => b && b.isAlive);
    if (aliveBosses.length === 0) return;

    if (aliveBosses.length === 1) {
      aliveBosses[0].renderBossHealthBar(ctx, w);
      return;
    }

    // Dual Boss Side-by-Side Health Bars at Top
    const barW = (w - 70) / 2;
    const barH = 12;
    const y = 82;

    aliveBosses.forEach((boss, idx) => {
      const x = idx === 0 ? 25 : w / 2 + 10;
      const isChrono = boss instanceof BossStage10;
      const themeColor = isChrono ? '#a855f7' : '#ff0055';

      ctx.save();
      // Background Box
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 1.2;
      ctx.fillRect(x - 5, y - 20, barW + 10, barH + 28);
      ctx.strokeRect(x - 5, y - 20, barW + 10, barH + 28);

      // Name & HP text
      ctx.font = '800 11px "Orbitron", sans-serif';
      ctx.fillStyle = themeColor;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 6;
      ctx.textAlign = 'left';
      ctx.fillText(`⚡ ${boss.name}`, x, y - 6);

      ctx.textAlign = 'right';
      ctx.font = '700 11px "Outfit", sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(`${Math.max(0, boss.hp)}/${boss.maxHp} HP`, x + barW, y - 6);

      // Bar container & fill
      ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
      ctx.fillRect(x, y, barW, barH);

      const pct = Math.max(0, Math.min(1, boss.hp / boss.maxHp));
      ctx.fillStyle = themeColor;
      ctx.shadowColor = themeColor;
      ctx.shadowBlur = 8;
      ctx.fillRect(x, y, barW * pct, barH);
      ctx.restore();
    });
  }

  renderBossAnnouncementOverlay(ctx, w, h) {
    ctx.save();
    ctx.textAlign = 'center';
    const alpha = Math.min(1, this.bossAnnouncementTimer * 1.5);
    ctx.globalAlpha = alpha;

    const bannerW = 480;
    const bannerH = 38;
    const bannerX = w / 2 - bannerW / 2;
    const bannerY = 115;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 15;
    ctx.fillRect(bannerX, bannerY, bannerW, bannerH);
    ctx.strokeRect(bannerX, bannerY, bannerW, bannerH);

    ctx.font = '800 13px "Orbitron", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(this.bossAnnouncement, w / 2, bannerY + 24);
    ctx.restore();
  }

  renderHUD(ctx, w, h) {
    ctx.save();

    // Top HUD Bar Glassmorphism
    ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
    ctx.fillRect(10, 10, w - 20, 52);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, w - 20, 52);

    // Health Shield Indicators
    ctx.font = '700 13px "Outfit", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('SHIELD:', 22, 38);

    for (let i = 0; i < this.player.maxHealth; i++) {
      const active = i < this.player.health;
      ctx.fillStyle = active ? '#00f0ff' : '#334155';
      ctx.shadowColor = active ? '#00f0ff' : 'transparent';
      ctx.shadowBlur = active ? 8 : 0;
      ctx.fillRect(80 + i * 22, 28, 16, 14);
    }

    // Score & Combo
    ctx.shadowBlur = 0;
    ctx.textAlign = 'center';
    ctx.font = '800 20px "Orbitron", "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${this.score}`, w / 2, 35);

    if (this.combo > 1) {
      ctx.font = '800 12px "Outfit", sans-serif';
      ctx.fillStyle = '#ffe600';
      ctx.shadowColor = '#ffe600';
      ctx.shadowBlur = 6;
      ctx.fillText(`${this.combo}x COMBO`, w / 2, 51);
    }

    // Stage & Target Progress (Right Side)
    ctx.textAlign = 'right';
    ctx.shadowBlur = 0;

    if (this.isEndless) {
      ctx.font = '800 13px "Orbitron", sans-serif';
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 6;
      ctx.fillText(`♾️ ENDLESS SURVIVAL`, w - 22, 28);

      ctx.shadowBlur = 0;
      ctx.font = '700 11px "Orbitron", sans-serif';
      ctx.fillStyle = '#38bdf8';
      const buffText = this.appliedBuffs.length > 0 ? `  •  ⚡ BUFFS: ${this.appliedBuffs.length}` : '';
      ctx.fillText(`WAVE ${this.endlessWave}  •  ⏱️ ${this.formatTime(this.survivalTime)}${buffText}`, w - 22, 46);
    } else {
      const config = this.currentStageConfig;
      const stageNum = this.currentStageIndex + 1;

      const isW3 = stageNum >= 11;
      const isW2 = stageNum >= 6 && stageNum <= 10;
      ctx.font = '800 14px "Orbitron", sans-serif';
      ctx.fillStyle = config.color;
      ctx.fillText(`STAGE ${stageNum} / 15`, w - 22, 30);

      ctx.font = '600 12px "Outfit", sans-serif';
      ctx.fillStyle = '#94a3b8';
      if (this.stageState === 'boss_fight') {
        ctx.fillStyle = '#f43f5e';
        const bossTarget = stageNum === 15 ? 'TARGET: DESTROY YGGDRASIL PRIMORDIAL' : (stageNum === 10 ? 'TARGET: DESTROY CHRONO MIRAGE' : 'TARGET: DESTROY TITAN NEXUS');
        ctx.fillText(bossTarget, w - 22, 48);
      } else {
        ctx.fillText(`TARGET: ${Math.min(config.targetKills, this.stageKills)}/${config.targetKills}`, w - 22, 48);
      }
    }

    // Active Tactical Skill & Cooldown Status (Bottom-Left HUD)
    const perks = this.player.perks;
    const hasAnySkill = perks.hasQuantumBlink || perks.hasFrostNova || perks.hasDroneOvercharge;

    if (hasAnySkill) {
      let skillName = 'TACTICAL SKILL';
      let skillColor = '#38bdf8';

      if (perks.synergyGlacialWarp) {
        skillName = 'GLACIAL WARP';
        skillColor = '#38bdf8';
      } else if (perks.hasQuantumBlink) {
        skillName = 'QUANTUM BLINK';
        skillColor = '#eab308';
      } else if (perks.hasFrostNova) {
        skillName = 'FROST NOVA';
        skillColor = '#c084fc';
      } else if (perks.hasDroneOvercharge) {
        skillName = 'DRONE OVERCHARGE';
        skillColor = '#38bdf8';
      }

      const cd = this.player.tacticalSkillCooldownTimer;
      const isReady = cd <= 0;
      const maxCd = 6.5;
      const barX = 16;
      const barY = h - 48;
      const barW = 230;
      const barH = 34;

      ctx.textAlign = 'left';
      ctx.fillStyle = isReady ? 'rgba(15, 23, 42, 0.92)' : 'rgba(15, 23, 42, 0.75)';
      ctx.strokeStyle = isReady ? skillColor : 'rgba(71, 85, 105, 0.6)';
      ctx.lineWidth = isReady ? 1.8 : 1;
      ctx.shadowColor = isReady ? skillColor : 'transparent';
      ctx.shadowBlur = isReady ? 8 : 0;
      ctx.fillRect(barX, barY, barW, barH);
      ctx.strokeRect(barX, barY, barW, barH);

      // Cooldown progress bar fill
      if (!isReady) {
        const progress = Math.min(1, Math.max(0, 1 - cd / maxCd));
        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.fillRect(barX, barY, barW * progress, barH);
      }

      // Overcharge indicator glow
      if (this.player.droneOverchargeTimer > 0) {
        ctx.fillStyle = '#ffe600';
        ctx.font = '700 11px "Orbitron", sans-serif';
        ctx.fillText(`⚡ OVERCHARGE: ${this.player.droneOverchargeTimer.toFixed(1)}s`, barX + 12, barY + 22);
      } else {
        ctx.font = '700 11px "Orbitron", sans-serif';
        ctx.fillStyle = isReady ? skillColor : '#94a3b8';
        if (isReady) {
          ctx.fillText(`[Q] ${skillName}: SIAP`, barX + 12, barY + 22);
        } else {
          ctx.fillText(`[Q] ${skillName} (${cd.toFixed(1)}s)`, barX + 12, barY + 22);
        }
      }
    }

    // Tech Cores earned display on right bottom
    const currentPoints = UpgradeManager.getTechPoints();
    ctx.textAlign = 'right';
    ctx.font = '700 12px "Orbitron", sans-serif';
    ctx.fillStyle = '#ffe600';
    ctx.shadowColor = '#ffe600';
    ctx.shadowBlur = 6;
    ctx.fillText(`⚡ CORES: ${currentPoints}`, w - 20, h - 25);

    ctx.restore();
  }

  renderStageIntroOverlay(ctx, w, h) {
    const config = this.currentStageConfig;
    const stageNum = this.currentStageIndex + 1;
    const isW3 = stageNum >= 11;
    const isW2 = stageNum >= 6 && stageNum <= 10;
    const sectorTheme = isW3 ? 'ZONE XETA: VERDANT NATURE' : (isW2 ? 'WORLD 2: QUANTUM RIFT' : 'WORLD 1: NEON CORE');

    ctx.save();
    ctx.fillStyle = 'rgba(7, 10, 18, 0.88)';
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = 'center';

    const cardW = 560;
    const cardH = 265;
    const cardX = (w - cardW) / 2;
    const cardY = (h - cardH) / 2;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = config.color;
    ctx.lineWidth = 2;
    ctx.shadowColor = config.color;
    ctx.shadowBlur = 18;
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    ctx.shadowBlur = 0;
    ctx.font = '700 13px "Outfit", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`SECTOR INFILTRATION • ${sectorTheme} • STAGE ${stageNum} / 15`, w / 2, cardY + 45);

    ctx.font = '900 38px "Orbitron", sans-serif';
    ctx.fillStyle = config.color;
    ctx.shadowColor = config.color;
    ctx.shadowBlur = 20;
    ctx.fillText(config.title, w / 2, cardY + 95);

    ctx.font = '700 17px "Outfit", sans-serif';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(config.subtitle, w / 2, cardY + 135);

    ctx.font = '500 14px "Outfit", sans-serif';
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`Misi: ${config.objective}`, w / 2, cardY + 168);

    ctx.save();
    const ctaY = cardY + 218;
    const scale = 1 + 0.04 * Math.sin(this.uiPulse);
    ctx.translate(w / 2, ctaY);
    ctx.scale(scale, scale);
    ctx.font = '700 16px "Outfit", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.fillText('TEKAN [SPACE] ATAU KLIK UNTUK MEMULAI', 0, 0);
    ctx.restore();

    ctx.restore();
  }

  renderBossWarningOverlay(ctx, w, h) {
    ctx.save();
    const flash = Math.sin(this.uiPulse * 2.5) > 0;
    const stageNum = this.currentStageIndex + 1;

    ctx.fillStyle = flash ? 'rgba(255, 0, 85, 0.25)' : 'rgba(11, 15, 25, 0.7)';
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = 'center';
    ctx.font = '900 40px "Orbitron", sans-serif';
    ctx.fillStyle = stageNum === 10 ? '#c084fc' : '#ff0055';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 25;
    ctx.fillText(stageNum === 10 ? '⚠️ CHRONO PARADOX: BOSS INCOMING ⚠️' : '⚠️ WARNING: BOSS INCOMING ⚠️', w / 2, h / 2 - 20);

    ctx.font = '700 20px "Outfit", sans-serif';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffe600';
    ctx.fillText(
      stageNum === 10
        ? 'CHRONO MIRAGE TELAH MEMECAH REALITAS ARENA!'
        : 'TITAN NEXUS TELAH MEMASUKI ARENA!',
      w / 2,
      h / 2 + 30
    );
    ctx.restore();
  }

  renderStageClearOverlay(ctx, w, h) {
    const stageNum = this.currentStageIndex + 1;
    ctx.save();

    ctx.fillStyle = 'rgba(7, 10, 18, 0.75)';
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = 'center';
    ctx.font = '900 38px "Orbitron", sans-serif';
    ctx.fillStyle = '#00ff88';
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 20;
    ctx.fillText(`STAGE ${stageNum} SELESAI!`, w / 2, h / 2 - 25);

    ctx.font = '600 16px "Outfit", sans-serif';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffe600';
    if (stageNum === 5) {
      ctx.fillText('★ WORLD 1 CLEARED! WORLD 2 (STAGE 6 - 10) TERBUKA! ★', w / 2, h / 2 + 15);
    } else {
      ctx.fillText('+1000 POINT BONUS  •  SHIELD +1  •  TECH CORES DIDAPATKAN', w / 2, h / 2 + 15);
    }

    ctx.font = '500 14px "Outfit", sans-serif';
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Mempersiapkan Sektor Berikutnya...', w / 2, h / 2 + 50);

    ctx.restore();
  }

  renderPauseOverlay(ctx, w, h) {
    ctx.save();
    ctx.fillStyle = 'rgba(7, 10, 18, 0.85)';
    ctx.fillRect(0, 0, w, h);

    const cardW = 500;
    const cardH = 260;
    const cardX = (w - cardW) / 2;
    const cardY = (h - cardH) / 2;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 18;
    ctx.fillRect(cardX, cardY, cardW, cardH);
    ctx.strokeRect(cardX, cardY, cardW, cardH);
    this.drawCyberCorners(ctx, cardX, cardY, cardW, cardH, 12, '#00f0ff');

    ctx.textAlign = 'center';

    ctx.font = '900 32px "Orbitron", sans-serif';
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 15;
    ctx.fillText('GAME DIJEDA', w / 2, cardY + 48);

    ctx.shadowBlur = 0;
    ctx.font = '600 13px "Outfit", sans-serif';
    ctx.fillStyle = '#94a3b8';
    const stageNum = this.currentStageIndex + 1;
    ctx.fillText(`STAGE ${stageNum} / 10  •  SKOR: ${this.score}  •  KILLS: ${this.enemiesDefeated}`, w / 2, cardY + 78);

    const input = this.engine.input;
    const mx = input.mouse.x;
    const my = input.mouse.y;

    const btnResume = { x: 176, y: 310, w: 140, h: 46 };
    const btnSettings = { x: 330, y: 310, w: 140, h: 46 };
    const btnMenu = { x: 484, y: 310, w: 140, h: 46 };

    const hoverResume = mx >= btnResume.x && mx <= btnResume.x + btnResume.w && my >= btnResume.y && my <= btnResume.y + btnResume.h;
    const hoverSettings = mx >= btnSettings.x && mx <= btnSettings.x + btnSettings.w && my >= btnSettings.y && my <= btnSettings.y + btnSettings.h;
    const hoverMenu = mx >= btnMenu.x && mx <= btnMenu.x + btnMenu.w && my >= btnMenu.y && my <= btnMenu.y + btnMenu.h;

    // 1. Resume Button
    ctx.fillStyle = hoverResume ? 'rgba(0, 240, 255, 0.3)' : 'rgba(0, 240, 255, 0.15)';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = hoverResume ? 2.5 : 1.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = hoverResume ? 15 : 6;
    ctx.fillRect(btnResume.x, btnResume.y, btnResume.w, btnResume.h);
    ctx.strokeRect(btnResume.x, btnResume.y, btnResume.w, btnResume.h);

    ctx.font = '800 13px "Orbitron", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('▶ LANJUT', btnResume.x + btnResume.w / 2, btnResume.y + 29);

    // 2. Settings Button
    ctx.fillStyle = hoverSettings ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.15)';
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = hoverSettings ? 2.5 : 1.5;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = hoverSettings ? 15 : 6;
    ctx.fillRect(btnSettings.x, btnSettings.y, btnSettings.w, btnSettings.h);
    ctx.strokeRect(btnSettings.x, btnSettings.y, btnSettings.w, btnSettings.h);

    ctx.font = '800 13px "Orbitron", sans-serif';
    ctx.fillStyle = hoverSettings ? '#ffffff' : '#e9d5ff';
    ctx.fillText('⚙️ SETTING', btnSettings.x + btnSettings.w / 2, btnSettings.y + 29);

    // 3. Menu Button
    ctx.fillStyle = hoverMenu ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.15)';
    ctx.strokeStyle = hoverMenu ? '#ef4444' : 'rgba(239, 68, 68, 0.6)';
    ctx.lineWidth = hoverMenu ? 2.5 : 1.5;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = hoverMenu ? 15 : 6;
    ctx.fillRect(btnMenu.x, btnMenu.y, btnMenu.w, btnMenu.h);
    ctx.strokeRect(btnMenu.x, btnMenu.y, btnMenu.w, btnMenu.h);

    ctx.font = '800 13px "Orbitron", sans-serif';
    ctx.fillStyle = hoverMenu ? '#ffffff' : '#fca5a5';
    ctx.fillText('🏠 KE MENU', btnMenu.x + btnMenu.w / 2, btnMenu.y + 29);

    ctx.shadowBlur = 0;
    ctx.font = '500 12px "Outfit", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('[P / Space] Lanjutkan  •  [O] Setting  •  [M / ESC] Ke Menu', w / 2, cardY + 230);

    ctx.restore();

    // Render Settings Modal if open
    if (this.showingSettings) {
      SettingsModal.render(ctx, w, h, this.engine);
    }
  }

  drawCyberCorners(ctx, x, y, w, h, size = 12, color = '#00f0ff') {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
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
    let currentY = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
  }

  renderBuffModal(ctx, w, h) {
    ctx.save();

    // 1. Semi-transparent backdrop blur vignette
    ctx.fillStyle = 'rgba(7, 10, 18, 0.88)';
    ctx.fillRect(0, 0, w, h);

    // 2. Modal Container Frame
    const modalW = 750;
    const modalH = 430;
    const modalX = (w - modalW) / 2;
    const modalY = 85;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 18;
    ctx.fillRect(modalX, modalY, modalW, modalH);
    ctx.strokeRect(modalX, modalY, modalW, modalH);
    this.drawCyberCorners(ctx, modalX, modalY, modalW, modalH, 14, '#00f0ff');

    // 3. Modal Header
    ctx.textAlign = 'center';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.font = '800 11px "Orbitron", sans-serif';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText(`⚡ ENDLESS SURVIVAL PROTOCOL // WAVE ${this.endlessWave} REWARD ⚡`, w / 2, modalY + 32);

    ctx.font = '900 24px "Orbitron", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 14;
    ctx.fillText(`PILIH TACTICAL BUFF (WAVE ${this.endlessWave})`, w / 2, modalY + 60);

    ctx.shadowBlur = 0;
    ctx.font = '500 13px "Outfit", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Wave ${Math.max(1, this.endlessWave - 1)} berhasil diselesaikan! Pilih 1 modul tempur permanen:`, w / 2, modalY + 82);

    // 4. Cards
    const input = this.engine.input;
    const mx = input.mouse.x;
    const my = input.mouse.y;

    const cardW = 220;
    const cardH = 265;
    const gap = 25;
    const startX = (w - (cardW * 3 + gap * 2)) / 2;
    const cardY = 175;

    for (let i = 0; i < this.buffChoices.length; i++) {
      const buff = this.buffChoices[i];
      const cx = startX + i * (cardW + gap);
      const hover = mx >= cx && mx <= cx + cardW && my >= cardY && my <= cardY + cardH;

      ctx.save();
      // Card Body
      ctx.fillStyle = hover ? 'rgba(30, 41, 59, 0.98)' : 'rgba(15, 23, 42, 0.90)';
      ctx.strokeStyle = hover ? buff.color : 'rgba(56, 189, 248, 0.28)';
      ctx.lineWidth = hover ? 2.5 : 1.5;
      ctx.shadowColor = buff.color;
      ctx.shadowBlur = hover ? 18 : 5;
      ctx.fillRect(cx, cardY, cardW, cardH);
      ctx.strokeRect(cx, cardY, cardW, cardH);
      this.drawCyberCorners(ctx, cx, cardY, cardW, cardH, 8, hover ? buff.color : 'rgba(0, 240, 255, 0.4)');

      // Card Tag Pill
      const tagW = 76;
      const tagH = 18;
      const tagX = cx + 12;
      const tagY = cardY + 12;
      ctx.fillStyle = hover ? buff.color : 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(tagX, tagY, tagW, tagH);
      ctx.font = '800 10px "Orbitron", sans-serif';
      ctx.fillStyle = hover ? '#000000' : buff.color;
      ctx.textAlign = 'center';
      ctx.fillText(buff.tag, tagX + tagW / 2, tagY + 13);

      // Icon
      ctx.font = '34px sans-serif';
      ctx.fillText(buff.icon, cx + cardW / 2, cardY + 68);

      // Title
      ctx.font = '800 12.5px "Orbitron", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = buff.color;
      ctx.shadowBlur = hover ? 10 : 0;
      ctx.fillText(buff.title, cx + cardW / 2, cardY + 102);

      // Short Stat
      ctx.font = '800 13px "Outfit", sans-serif';
      ctx.fillStyle = buff.color;
      ctx.fillText(buff.short, cx + cardW / 2, cardY + 124);

      // Description (Wrapped text)
      ctx.shadowBlur = 0;
      ctx.font = '500 11.5px "Outfit", sans-serif';
      ctx.fillStyle = '#94a3b8';
      this.drawWrappedText(ctx, buff.desc, cx + cardW / 2, cardY + 148, 195, 16);

      // Bottom Button
      const btnW = 186;
      const btnH = 34;
      const btnX = cx + (cardW - btnW) / 2;
      const btnY = cardY + cardH - 46;

      ctx.fillStyle = hover ? buff.color : 'rgba(255, 255, 255, 0.06)';
      ctx.strokeStyle = buff.color;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = buff.color;
      ctx.shadowBlur = hover ? 12 : 0;
      ctx.fillRect(btnX, btnY, btnW, btnH);
      ctx.strokeRect(btnX, btnY, btnW, btnH);

      ctx.font = '800 12px "Orbitron", sans-serif';
      ctx.fillStyle = hover ? '#000000' : '#ffffff';
      ctx.fillText(`[ ${i + 1} ] PILIH MODUL`, cx + cardW / 2, btnY + 22);

      ctx.restore();
    }

    // 5. Footer Instructions
    ctx.textAlign = 'center';
    ctx.shadowBlur = 0;
    ctx.font = '600 12px "Outfit", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Tekan tombol [1], [2], atau [3] pada keyboard atau Klik Kartu untuk memilih', w / 2, modalY + modalH - 14);

    ctx.restore();
  }

  startStage10BlackholeCutscene() {
    this.stageState = 'stage10_blackhole_event';
    this.blackholeCutsceneTimer = 0;
    this.blackholeEventPhase = 1; // 1: Gargantua singularity & suction, 2: fadeout, 3: congratulation screen
    this.blackoutAlpha = 0;
    this.shipSuckScale = 1.0;
    this.shipSuckAngle = 0;

    // Safely deactivate all combat entities
    for (const e of this.enemies) e.isAlive = false;
    for (const bb of this.bossBullets) bb.isAlive = false;
    for (const b of this.bullets) b.isAlive = false;
    for (const bh of this.blackHoles) bh.isAlive = false;

    this.enemies.length = 0;
    this.bossBullets.length = 0;
    this.bullets.length = 0;
    this.blackHoles.length = 0;

    if (this.player) {
      this.player.invulnerableTimer = 999;
    }
    this.engine.sound.playBossAlert();
  }

  updateStage10Cutscene(dt, input) {
    this.blackholeCutsceneTimer += dt;
    const w = this.engine.width;
    const h = this.engine.height;
    const bhX = w / 2;
    const bhY = h * 0.36;

    // Phase 1: Gargantua emerges & ship suction (0s to 7.0s)
    if (this.blackholeEventPhase === 1) {
      // Camera gravitational rumbling
      const rumble = Math.min(10, 2 + this.blackholeCutsceneTimer * 1.4);
      this.engine.camera.shake(rumble, 0.1);

      // Suction starts at 1.4s
      if (this.blackholeCutsceneTimer >= 1.4 && this.player) {
        const pullProgress = (this.blackholeCutsceneTimer - 1.4) / 4.8;
        this.shipSuckScale = Math.max(0, 1.0 - pullProgress);
        this.shipSuckAngle += dt * (3 + (1 - this.shipSuckScale) * 14);

        // Move player towards singularity
        this.player.x += (bhX - this.player.x) * 2.2 * dt;
        this.player.y += (bhY - this.player.y) * 2.2 * dt;

        // Particle trail from ship
        if (this.shipSuckScale > 0.05) {
          this.engine.particles.emit(this.player.x, this.player.y, 2, {
            color: '#00f0ff',
            speed: 50,
            size: 2.5,
            life: 0.3
          });
        }
      }

      if (this.blackholeCutsceneTimer >= 6.8) {
        this.blackholeEventPhase = 2; // Begin smooth fade to black
        this.engine.sound.playExplosion();
      }
    } else if (this.blackholeEventPhase === 2) {
      // Phase 2: Fade to pitch black
      this.blackoutAlpha = Math.min(1.0, (this.blackholeCutsceneTimer - 6.8) / 1.4);
      if (this.blackoutAlpha >= 1.0) {
        this.blackholeEventPhase = 3; // Revelation screen
      }
    } else if (this.blackholeEventPhase === 3) {
      // Phase 3: Congratulations Screen
      this.blackoutAlpha = 1.0;
      if (input.justPressed('Space') || input.justPressed('Enter') || input.justClicked()) {
        this.engine.sound.playClick();
        this.sceneManager.set('stageselect', { world: 3 });
      }
    }
  }

  renderStage10Cutscene(ctx, w, h) {
    const bhX = w / 2;
    const bhY = h * 0.36;

    // 1. If in Phase 1 or 2, render the Interstellar Gargantua Black Hole
    if (this.blackholeEventPhase === 1 || this.blackholeEventPhase === 2) {
      const bhRadius = Math.min(76, Math.max(20, this.blackholeCutsceneTimer * 24));
      const accretionWidth = bhRadius * 3.4;
      const accretionHeight = bhRadius * 0.65;
      const pulse = this.blackholeCutsceneTimer * 2.2;

      ctx.save();

      // Gravitational Lensing Outer Space Warp (Distortion Aura)
      const spaceGrad = ctx.createRadialGradient(bhX, bhY, bhRadius * 0.8, bhX, bhY, bhRadius * 3.8);
      spaceGrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
      spaceGrad.addColorStop(0.3, 'rgba(245, 158, 11, 0.25)');
      spaceGrad.addColorStop(0.6, 'rgba(217, 119, 6, 0.12)');
      spaceGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = spaceGrad;
      ctx.beginPath();
      ctx.arc(bhX, bhY, bhRadius * 3.8, 0, Math.PI * 2);
      ctx.fill();

      // Top Lensed Accretion Arc (Bent light from back of disc over event horizon)
      ctx.save();
      ctx.translate(bhX, bhY);
      const topArcGrad = ctx.createRadialGradient(0, 0, bhRadius * 0.95, 0, 0, bhRadius * 2.3);
      topArcGrad.addColorStop(0, '#ffffff');
      topArcGrad.addColorStop(0.2, '#fef08a');
      topArcGrad.addColorStop(0.5, '#f59e0b');
      topArcGrad.addColorStop(0.8, '#b45309');
      topArcGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');
      ctx.fillStyle = topArcGrad;
      ctx.beginPath();
      ctx.ellipse(0, -bhRadius * 0.35, bhRadius * 1.85, bhRadius * 1.55, 0, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Bottom Lensed Accretion Arc (Bent light under event horizon)
      ctx.save();
      ctx.translate(bhX, bhY);
      const bottomArcGrad = ctx.createRadialGradient(0, 0, bhRadius * 0.95, 0, 0, bhRadius * 1.9);
      bottomArcGrad.addColorStop(0, '#ffffff');
      bottomArcGrad.addColorStop(0.25, '#fef08a');
      bottomArcGrad.addColorStop(0.55, '#f59e0b');
      bottomArcGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = bottomArcGrad;
      ctx.beginPath();
      ctx.ellipse(0, bhRadius * 0.35, bhRadius * 1.6, bhRadius * 1.25, 0, 0, Math.PI);
      ctx.fill();
      ctx.restore();

      // Equatorial Accretion Disk (Horizontal glowing disc crossing in front)
      ctx.save();
      ctx.translate(bhX, bhY);
      const discGrad = ctx.createLinearGradient(-accretionWidth, 0, accretionWidth, 0);
      // Relativistic Doppler beaming: Left side is brighter/bluer, right side is dimmer/redder
      discGrad.addColorStop(0, 'rgba(254, 240, 138, 0)');
      discGrad.addColorStop(0.25, 'rgba(255, 255, 255, 0.95)');
      discGrad.addColorStop(0.45, 'rgba(245, 158, 11, 0.9)');
      discGrad.addColorStop(0.75, 'rgba(185, 28, 28, 0.7)');
      discGrad.addColorStop(1, 'rgba(120, 53, 15, 0)');
      ctx.fillStyle = discGrad;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.ellipse(0, 0, accretionWidth, accretionHeight, -0.06, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Swirling Matter Filaments & Spiral Streamers
      ctx.save();
      ctx.translate(bhX, bhY);
      ctx.rotate(pulse * 0.8);
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.7)';
      ctx.lineWidth = 2;
      for (let s = 0; s < 4; s++) {
        const spiralAng = (s * Math.PI) / 2;
        ctx.beginPath();
        for (let r = bhRadius * 0.98; r < bhRadius * 2.6; r += 8) {
          const a = spiralAng + (r / bhRadius) * 1.2;
          const sx = Math.cos(a) * r;
          const sy = Math.sin(a) * r * 0.45;
          if (r === bhRadius * 0.98) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }
      ctx.restore();

      // Central Event Horizon (Absolute pitch-black void)
      ctx.save();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(bhX, bhY, bhRadius, 0, Math.PI * 2);
      ctx.fill();

      // Blinding Photon Sphere (Inner halo of trapped photons)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.restore();

      ctx.restore();

      // Render Player Ship getting pulled and spaghettified
      if (this.player && this.shipSuckScale > 0.02) {
        ctx.save();
        ctx.translate(this.player.x, this.player.y);
        ctx.rotate(this.shipSuckAngle);
        // Spaghettification stretch
        ctx.scale(this.shipSuckScale * 0.7, this.shipSuckScale * 1.6);

        const shipColor = this.player.isOverdrive ? '#ffe600' : this.player.color;
        ctx.shadowColor = shipColor;
        ctx.shadowBlur = 14;
        ctx.strokeStyle = shipColor;
        ctx.fillStyle = '#08121e';
        ctx.lineWidth = 2.2;

        // Sleek Arrowhead Fighter Hull drawn at local origin
        ctx.beginPath();
        ctx.moveTo(14, 0);
        ctx.lineTo(-12, -11);
        ctx.lineTo(-7, 0);
        ctx.lineTo(-12, 11);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Weapon Barrels
        ctx.fillStyle = shipColor;
        ctx.fillRect(-2, -10, 4, 3);
        ctx.fillRect(-2, 7, 4, 3);

        // Glowing Cockpit Core
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(1, 0, 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Cinematic Status Banner
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = '800 13px "Orbitron", sans-serif';
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12;
      ctx.fillText('⚠️ GRAVITATIONAL SINGULARITY DETECTED // EVENT HORIZON BREACH', w / 2, h - 55);
      ctx.restore();
    }

    // 2. Blackout Overlay (Fade to dark)
    if (this.blackoutAlpha > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(0, 0, 0, ${this.blackoutAlpha})`;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    // 3. Phase 3: The Congratulations & Next Zone Announcement
    if (this.blackholeEventPhase === 3) {
      ctx.save();
      // Absolute Dark Canvas
      ctx.fillStyle = '#020408';
      ctx.fillRect(0, 0, w, h);

      // Subtle Emerald Wormhole Glow at center
      const centerGrad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, 380);
      centerGrad.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
      centerGrad.addColorStop(0.6, 'rgba(6, 78, 59, 0.1)');
      centerGrad.addColorStop(1, 'rgba(2, 4, 8, 0)');
      ctx.fillStyle = centerGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.textAlign = 'center';

      // Portal Glyphs
      ctx.font = '36px sans-serif';
      ctx.fillText('🌀', w / 2, h / 2 - 135);

      // Medium-Large Title: CONGRATULATIONS
      ctx.font = '900 36px "Orbitron", sans-serif';
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 24;
      ctx.fillText('CONGRATULATIONS', w / 2, h / 2 - 80);

      // English Subtitles as requested by user
      ctx.shadowBlur = 0;
      ctx.font = '700 16px "Orbitron", sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('STAGE 10 CONQUERED • SINGULARITY TRAVERSED', w / 2, h / 2 - 38);

      ctx.font = '500 15px "Outfit", sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('Your vessel survived the gravitational singularity wormhole.', w / 2, h / 2 - 5);

      ctx.font = '700 17px "Orbitron", sans-serif';
      ctx.fillStyle = '#34d399';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 10;
      ctx.fillText('YOU CAN NOW PROCEED TO THE NEXT ZONE', w / 2, h / 2 + 30);

      ctx.shadowBlur = 0;
      ctx.font = '500 14px "Outfit", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Prepare your ship for Zone Xeta: A primordial verdant ecosystem with 5 new sectors.', w / 2, h / 2 + 62);

      // Interactive Action Button
      const btnW = 440;
      const btnH = 52;
      const btnX = (w - btnW) / 2;
      const btnY = h / 2 + 105;

      const input = this.engine.input;
      const mx = input.mouse.x;
      const my = input.mouse.y;
      const hover = mx >= btnX && mx <= btnX + btnW && my >= btnY && my <= btnY + btnH;

      ctx.fillStyle = hover ? 'rgba(16, 185, 129, 0.35)' : 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = hover ? '#34d399' : '#10b981';
      ctx.lineWidth = hover ? 2.5 : 1.5;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = hover ? 20 : 8;
      ctx.fillRect(btnX, btnY, btnW, btnH);
      ctx.strokeRect(btnX, btnY, btnW, btnH);
      this.drawCyberCorners(ctx, btnX, btnY, btnW, btnH, 10, '#34d399');

      ctx.font = '800 14px "Orbitron", sans-serif';
      ctx.fillStyle = hover ? '#ffffff' : '#ecfdf5';
      ctx.shadowBlur = hover ? 12 : 0;
      ctx.fillText('ENTER ZONE XETA  [ SPACE / CLICK ]', w / 2, btnY + 32);

      ctx.restore();
    }
  }
}
