import { Entity } from './Entity.js';
import { Bullet } from './Bullet.js';
import { Drone } from './Drone.js';
import { Collision } from '../utils/Collision.js';
import { WEAPON_DEFINITIONS } from '../utils/UpgradeManager.js';

/**
 * Overhauled Player Ship Entity.
 * Integrates:
 * 1. 4 Primary Weapon Cores (Vulcan Gatling, Plasma Flak, Heavy Railgun, Cluster Missile).
 * 2. Fleet Commander Escort Drones (Assault & Aegis Shield deflector).
 * 3. Technomancer status effects (Chain Lightning & Cryo Frost Nova).
 * 4. Berserker Overdrive (Close-Combat Surge, Quantum Blink, Hyper Overdrive).
 */
export class Player extends Entity {
  constructor(x, y, perks = {}) {
    super(x, y, 26, 26);
    this.perks = perks;

    // Equipped Weapon
    this.weapon = perks.weapon || WEAPON_DEFINITIONS.vulcan;

    // Dynamic stats scaled by weapon & perks
    this.speed = 320 * (perks.speedMultiplier || 1.0);
    this.fireRate = this.weapon.fireRate;
    this.maxHealth = 3;
    this.health = this.maxHealth;
    this.color = this.weapon.color || '#38bdf8';

    this.shootCooldown = 0;
    this.invulnerableTimer = 0;
    this.tacticalSkillCooldownTimer = 0;
    this.droneOverchargeTimer = 0;
    this.isOverdrive = false;
    this.barrelToggle = false;

    // Escort Fleet Drones based on unlocked Commander perks
    this.drones = [];
    if (this.perks.hasAssaultDrone) {
      this.drones.push(new Drone(this, 'assault', 0));
    }
    if (this.perks.hasAegisDrone) {
      this.drones.push(new Drone(this, 'aegis', 1));
    }
    if (this.perks.hasWingmanReplicator) {
      this.drones.push(new Drone(this, 'assault', 2));
    }

    // Endless Mode Permanent Buff Multipliers
    this.buffMultipliers = {
      damage: 1.0,
      fireRate: 1.0,
      speed: 1.0,
      bulletSpeed: 1.0,
      critChanceBonus: 0,
      critDmgBonus: 0,
      aoeRadiusMultiplier: 1.0,
      skillCdMultiplier: 1.0
    };
  }

  applyEndlessBuff(buff, engine = null) {
    if (!buff) return;

    if (buff.type === 'damage') {
      this.buffMultipliers.damage += 0.25;
    } else if (buff.type === 'firerate') {
      this.buffMultipliers.fireRate += 0.20;
      this.fireRate = this.weapon.fireRate / this.buffMultipliers.fireRate;
    } else if (buff.type === 'shield') {
      this.maxHealth += 1;
      this.health = this.maxHealth; // Full shield repair
    } else if (buff.type === 'speed') {
      this.buffMultipliers.speed += 0.18;
      this.buffMultipliers.bulletSpeed += 0.18;
      this.speed = 320 * (this.perks.speedMultiplier || 1.0) * this.buffMultipliers.speed;
    } else if (buff.type === 'crit') {
      this.buffMultipliers.critChanceBonus += 0.15;
      this.buffMultipliers.critDmgBonus += 0.40;
    } else if (buff.type === 'drone') {
      if (this.drones.length < 5) {
        const droneType = this.drones.length % 2 === 0 ? 'assault' : 'aegis';
        this.drones.push(new Drone(this, droneType, this.drones.length));
      } else {
        this.buffMultipliers.damage += 0.20;
      }
    } else if (buff.type === 'cooldown') {
      this.buffMultipliers.skillCdMultiplier = Math.max(0.35, this.buffMultipliers.skillCdMultiplier - 0.20);
    } else if (buff.type === 'aoe') {
      this.buffMultipliers.aoeRadiusMultiplier += 0.35;
    }

    if (engine) {
      engine.particles.emit(this.x, this.y, 35, {
        color: buff.color || '#00f0ff',
        speed: 160,
        size: 4.5,
        life: 0.55
      });
    }
  }

  update(dt, engine, bullets, blackHoleCallback, enemies = [], bossBullets = [], combo = 1) {
    const input = engine.input;
    let dx = 0;
    let dy = 0;

    // 1. Movement controls
    if (input.isAnyDown('KeyW', 'ArrowUp')) dy -= 1;
    if (input.isAnyDown('KeyS', 'ArrowDown')) dy += 1;
    if (input.isAnyDown('KeyA', 'ArrowLeft')) dx -= 1;
    if (input.isAnyDown('KeyD', 'ArrowRight')) dx += 1;

    const mag = Math.sqrt(dx * dx + dy * dy);
    if (mag > 0) {
      this.vel.x = (dx / mag) * this.speed;
      this.vel.y = (dy / mag) * this.speed;

      // Thruster exhaust particles
      engine.particles.emit(this.x, this.y, 2, {
        color: this.isOverdrive ? '#ffe600' : this.color,
        speed: 75,
        size: 3.5,
        life: 0.25,
        baseAngle: this.rotation + Math.PI,
        spread: 0.5
      });
    } else {
      this.vel.x = 0;
      this.vel.y = 0;
    }

    super.update(dt);

    // Bounds checking
    const halfW = this.width / 2;
    const halfH = this.height / 2;
    this.pos.x = Math.max(halfW, Math.min(engine.width - halfW, this.pos.x));
    this.pos.y = Math.max(halfH, Math.min(engine.height - halfH, this.pos.y));

    // Rotate towards mouse cursor
    const mouseDx = input.mouse.x - this.pos.x;
    const mouseDy = input.mouse.y - this.pos.y;
    this.rotation = Math.atan2(mouseDy, mouseDx);

    // Overdrive state check (combo >= 5 with Hyper Overdrive perk)
    this.isOverdrive = (combo >= 5 && this.perks.hasHyperOverdrive);

    // Cooldown decays
    if (this.shootCooldown > 0) this.shootCooldown -= dt;
    if (this.tacticalSkillCooldownTimer > 0) this.tacticalSkillCooldownTimer -= dt;
    if (this.droneOverchargeTimer > 0) this.droneOverchargeTimer -= dt;
    if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;

    // 2. Weapon Firing
    const currentFireRate = this.isOverdrive ? (this.fireRate * 0.65) : this.fireRate;
    const wantToShoot = input.isDown('Space') || input.mouse.isDown;
    if (wantToShoot && this.shootCooldown <= 0) {
      this.shoot(engine, bullets, enemies);
      this.shootCooldown = currentFireRate;
    }

    // 3. Tactical Skill [Q] (Multi-Skill Synergy Trigger)
    const qPressed = input.justPressed('KeyQ') || input.justPressed('KeyE');
    if (qPressed && this.tacticalSkillCooldownTimer <= 0) {
      this.activateTacticalSkill(engine, enemies, blackHoleCallback);
    }

    // 4. Update Drones
    for (let i = this.drones.length - 1; i >= 0; i--) {
      const drone = this.drones[i];
      drone.update(dt, this, enemies, bullets, engine, bossBullets, this.perks);

      // Drone vs enemy physical contact
      if (enemies && enemies.length > 0) {
        for (const enemy of enemies) {
          if (!enemy.isAlive) continue;
          if (Collision.aabb(drone.getBounds(), enemy.getBounds())) {
            drone.onCollideEnemy(enemy, engine);
            break;
          }
        }
      }

      if (!drone.isAlive) {
        this.drones.splice(i, 1);
      }
    }
  }

  activateTacticalSkill(engine, enemies, blackHoleCallback) {
    const perks = this.perks;
    let activatedAny = false;

    // Skill 1: Quantum Blink (Berserker)
    if (perks.hasQuantumBlink) {
      activatedAny = true;
      const oldX = this.x;
      const oldY = this.y;
      const input = engine.input;

      // Teleport to cursor
      this.pos.x = Math.max(14, Math.min(engine.width - 14, input.mouse.x));
      this.pos.y = Math.max(14, Math.min(engine.height - 14, input.mouse.y));
      this.invulnerableTimer = 0.45; // i-frames

      engine.particles.emit(oldX, oldY, 18, {
        color: '#ffe600',
        speed: 160,
        size: 4,
        life: 0.35
      });
      engine.particles.emit(this.x, this.y, 24, {
        color: '#ffffff',
        speed: 180,
        size: 4.5,
        life: 0.4
      });

      // Cross-Synergy: Glacial Warp (releases Frost Nova at departure & arrival!)
      if (perks.synergyGlacialWarp) {
        this.triggerFrostNova(engine, enemies, oldX, oldY);
        this.triggerFrostNova(engine, enemies, this.x, this.y);
      }
    }

    // Skill 2: Frost Nova (Technomancer) - if not already cast via Glacial Warp
    if (perks.hasFrostNova && !perks.synergyGlacialWarp) {
      activatedAny = true;
      this.triggerFrostNova(engine, enemies, this.x, this.y);
    }

    // Skill 3: Overcharge Protocol (Commander)
    if (perks.hasDroneOvercharge) {
      activatedAny = true;
      this.droneOverchargeTimer = 6.0;
      engine.particles.emit(this.x, this.y, 25, {
        color: '#00f0ff',
        speed: 170,
        size: 4,
        life: 0.45
      });
    }

    if (activatedAny) {
      const cdMod = this.buffMultipliers ? this.buffMultipliers.skillCdMultiplier : 1.0;
      this.tacticalSkillCooldownTimer = 6.5 * cdMod;
      engine.sound.playLaser();
      engine.camera.shake(7, 0.22);
    }
  }

  triggerFrostNova(engine, enemies, originX, originY) {
    engine.sound.playVictory();
    engine.camera.shake(8, 0.25);

    const aoeMod = this.buffMultipliers ? this.buffMultipliers.aoeRadiusMultiplier : 1.0;
    const freezeRadius = 360 * aoeMod;

    // Expand 360-degree freezing shockwave
    engine.particles.emit(originX, originY, 40, {
      color: '#38bdf8',
      speed: 240 * aoeMod,
      size: 4.5,
      life: 0.55
    });
    engine.particles.emit(originX, originY, 25, {
      color: '#ffffff',
      speed: 180 * aoeMod,
      size: 3.5,
      life: 0.45
    });

    // Freeze enemies in radius
    if (enemies && enemies.length > 0) {
      enemies.forEach((e) => {
        if (!e.isAlive) return;
        const dist = Math.hypot(e.x - originX, e.y - originY);
        if (dist <= freezeRadius) {
          e.frozenTimer = 2.5;
          e.chillTimer = 4.0;
          engine.particles.emit(e.x, e.y, 6, {
            color: '#38bdf8',
            speed: 80,
            size: 3,
            life: 0.3
          });
        }
      });
    }
  }

  shoot(engine, bullets, enemies = []) {
    const perks = this.perks;
    const weapon = this.weapon;
    const bSpeedMod = this.buffMultipliers ? this.buffMultipliers.bulletSpeed : 1.0;
    const bulletSpeed = (weapon.speed || 700) * (perks.bulletSpeedMultiplier || 1.0) * bSpeedMod;
    const forwardX = Math.cos(this.rotation);
    const forwardY = Math.sin(this.rotation);

    // 1. Calculate Base Damage + Close-Combat Surge + Endless Buffs
    let baseDmg = weapon.baseDamage || 1.0;
    if (perks.hasCloseCombatSurge && enemies.length > 0) {
      let minDist = 999;
      for (const e of enemies) {
        if (!e.isAlive) continue;
        const d = Math.hypot(e.x - this.x, e.y - this.y);
        if (d < minDist) minDist = d;
      }
      if (minDist <= 160) {
        const surgeRatio = 1 - (minDist / 160);
        baseDmg *= (1 + 0.45 * surgeRatio);
      }
    }

    // Overdrive damage multiplier
    if (this.isOverdrive) {
      baseDmg *= 1.25;
    }

    // Endless mode damage multiplier
    if (this.buffMultipliers && this.buffMultipliers.damage > 1.0) {
      baseDmg *= this.buffMultipliers.damage;
    }

    // 2. Critical Hit roll
    let isCrit = false;
    const critChance = (perks.critChance || 0.05) + (this.buffMultipliers ? this.buffMultipliers.critChanceBonus : 0);
    const critMultiplier = (perks.critMultiplier || 1.5) + (this.buffMultipliers ? this.buffMultipliers.critDmgBonus : 0);
    if (Math.random() < critChance) {
      isCrit = true;
      baseDmg *= critMultiplier;
    }
    baseDmg = Number(baseDmg.toFixed(2));

    const aoeMod = this.buffMultipliers ? this.buffMultipliers.aoeRadiusMultiplier : 1.0;
    const bulletColor = this.isOverdrive ? '#ffe600' : (weapon.bulletColor || this.color);
    const bulletOpts = {
      damage: baseDmg,
      isCrit: isCrit,
      scale: weapon.bulletScale || 1.0,
      weaponType: weapon.id,
      isRocket: weapon.isRocket || false,
      explosionRadius: (weapon.explosionRadius || 0) * aoeMod,
      pierce: weapon.pierce || 0,
      hasChainLightning: perks.hasChainLightning || false,
      hasCryo: perks.hasCryoStasis || false,
      lifetime: weapon.id === 'shotgun' ? 0.85 : 1.8
    };

    const spawnDist = this.width / 2 + 6;
    const bx = this.x + forwardX * spawnDist;
    const by = this.y + forwardY * spawnDist;

    // 3. Weapon firing patterns
    if (weapon.id === 'vulcan') {
      // Rapid Gatling: alternating dual barrels
      this.barrelToggle = !this.barrelToggle;
      const perpX = -forwardY * (this.barrelToggle ? 7 : -7);
      const perpY = forwardX * (this.barrelToggle ? 7 : -7);
      const spreadAng = (Math.random() - 0.5) * (weapon.spread || 0.06);
      const finalAng = this.rotation + spreadAng;

      bullets.push(
        new Bullet(bx + perpX, by + perpY, Math.cos(finalAng) * bulletSpeed, Math.sin(finalAng) * bulletSpeed, bulletColor, bulletOpts)
      );

      // Brass casing ejection particle
      engine.particles.emit(this.x, this.y, 1, {
        color: '#fbbf24',
        speed: 45,
        size: 1.8,
        life: 0.2,
        baseAngle: this.rotation + Math.PI / 2 + (Math.random() - 0.5) * 0.4
      });

      engine.sound.playLaser();
    } else if (weapon.id === 'shotgun') {
      // Plasma Flak: 6 pellets in a deadly spread arc
      const count = weapon.pelletCount || 6;
      for (let i = 0; i < count; i++) {
        const spreadOffset = ((i / (count - 1)) - 0.5) * (weapon.spread || 0.32) + (Math.random() - 0.5) * 0.08;
        const finalAng = this.rotation + spreadOffset;
        const pSpeed = bulletSpeed * (0.9 + Math.random() * 0.2);
        bullets.push(
          new Bullet(bx, by, Math.cos(finalAng) * pSpeed, Math.sin(finalAng) * pSpeed, bulletColor, {
            ...bulletOpts,
            scale: (weapon.bulletScale || 1.0) * (0.8 + Math.random() * 0.3)
          })
        );
      }

      engine.sound.playLaser();
      engine.camera.shake(4, 0.12);
    } else if (weapon.id === 'railgun') {
      // Piercing Hyper-Beam: single colossal bolt
      bullets.push(
        new Bullet(bx, by, forwardX * bulletSpeed, forwardY * bulletSpeed, bulletColor, {
          ...bulletOpts,
          isInfinitePierce: true
        })
      );

      engine.sound.playLaser();
      engine.camera.shake(6, 0.18);
    } else if (weapon.id === 'rocket') {
      // Cluster Missile: Dual rocket launch
      for (const offset of [-8, 8]) {
        const perpX = -forwardY * offset;
        const perpY = forwardX * offset;
        const spreadAng = this.rotation + (offset > 0 ? 0.08 : -0.08);

        bullets.push(
          new Bullet(bx + perpX, by + perpY, Math.cos(spreadAng) * bulletSpeed, Math.sin(spreadAng) * bulletSpeed, bulletColor, bulletOpts)
        );
      }

      engine.sound.playLaser();
      engine.camera.shake(5, 0.15);
    }

    // Muzzle flash particle
    engine.particles.emit(bx, by, 3, {
      color: bulletColor,
      speed: 90,
      size: 2.8,
      life: 0.12,
      baseAngle: this.rotation,
      spread: 0.35
    });
  }

  takeDamage(amount, engine) {
    if (this.invulnerableTimer > 0) return false;

    this.health -= amount;
    this.invulnerableTimer = 1.0;
    engine.sound.playHit();
    engine.camera.shake(12, 0.4);

    engine.particles.emit(this.x, this.y, 25, {
      color: '#f43f5e',
      speed: 150,
      size: 4,
      life: 0.45
    });

    if (this.health <= 0) {
      this.isAlive = false;
      engine.sound.playExplosion();
      engine.particles.emit(this.x, this.y, 45, {
        color: '#f43f5e',
        speed: 220,
        size: 5,
        life: 0.8
      });
      return true;
    }
    return false;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Overdrive golden energetic aura
    if (this.isOverdrive) {
      ctx.strokeStyle = '#ffe600';
      ctx.shadowColor = '#ffe600';
      ctx.shadowBlur = 18;
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Flashing i-frames
    if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer * 14) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Hull glow & styling
    const shipColor = this.isOverdrive ? '#ffe600' : this.color;
    ctx.shadowColor = shipColor;
    ctx.shadowBlur = 14;
    ctx.strokeStyle = shipColor;
    ctx.fillStyle = '#08121e';
    ctx.lineWidth = 2.2;

    // Sleek Arrowhead Fighter Hull
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(-12, -11);
    ctx.lineTo(-7, 0);
    ctx.lineTo(-12, 11);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Weapon Barrel Wings
    ctx.fillStyle = shipColor;
    ctx.fillRect(-2, -10, 4, 3);
    ctx.fillRect(-2, 7, 4, 3);

    // Glowing Pilot Cockpit Gem
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(1, 0, 3.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Render escort drones
    this.drones.forEach((d) => d.render(ctx));
  }
}
