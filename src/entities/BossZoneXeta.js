import { Entity } from './Entity.js';
import { Bullet } from './Bullet.js';

/**
 * Stage 15 Final Boss: YGGDRASIL PRIMORDIAL (The Verdant Arbiter).
 * A colossal bio-mechanical botanical ancient guardian representing Zone Xeta.
 * Features:
 * 1. Living Organic Core: Pulsing chlorophyll heart with cellular resonance.
 * 2. Florian Petal Shields: 4 orbiting botanical petal shields that absorb damage and bloom to release Fibonacci thorn spirals.
 * 3. Bramble Vine Lashes: Thorny roots emerge with telegraph warning beams, creating lingering thorn traps.
 * 4. Solar Photosynthesis: At < 50% HP, emits solar chlorophyll rays and bullet-hell floral rings.
 * 5. Spore Minion Propagation: Summons mini bio-spores to protect its canopy.
 */
export class BossZoneXeta extends Entity {
  constructor(x, y) {
    super(x, y, 96, 84);
    this.name = 'YGGDRASIL PRIMORDIAL';
    this.title = 'VERDANT NATURE GUARDIAN';
    this.maxHp = 190;
    this.hp = 190;
    this.color = '#10b981'; // Emerald Green
    this.accentColor = '#84cc16'; // Lime/Yellow-Green
    this.woodColor = '#1e3a1e';
    this.targetY = 110;
    this.entering = true;
    this.hoverTime = 0;
    this.scoreValue = 15000;
    this.phase2Triggered = false;

    // Petal Shields (4 orbiting shields)
    this.petals = [
      { angle: 0, distance: 75, hp: 25, maxHp: 25, isAlive: true, bloomTimer: 0 },
      { angle: Math.PI * 0.5, distance: 75, hp: 25, maxHp: 25, isAlive: true, bloomTimer: 0 },
      { angle: Math.PI, distance: 75, hp: 25, maxHp: 25, isAlive: true, bloomTimer: 0 },
      { angle: Math.PI * 1.5, distance: 75, hp: 25, maxHp: 25, isAlive: true, bloomTimer: 0 }
    ];
    this.petalOrbitSpeed = 1.1;

    // Combat Timers
    this.thornBarrageTimer = 0;
    this.sporeBurstTimer = 0;
    this.vineLashTimer = 0;
    this.solarBeamTimer = 0;
    this.summonTimer = 0;

    // Vine Lash telegraphs
    this.activeVines = [];

    // Organic pulse & aesthetics
    this.pulse = 0;
    this.chlorophyllGlow = 0;
  }

  update(dt, player, engine, enemyBullets, spawnCallback) {
    if (!player || !player.isAlive) return;

    this.pulse += dt * 3.5;
    this.hoverTime += dt;
    this.chlorophyllGlow = 0.5 + 0.5 * Math.sin(this.pulse * 1.8);

    // Entry swoop
    if (this.entering) {
      this.pos.y += (this.targetY - this.pos.y) * 2.2 * dt;
      if (Math.abs(this.pos.y - this.targetY) < 3) {
        this.pos.y = this.targetY;
        this.entering = false;
        engine.camera.shake(8, 0.3);
      }
      return;
    }

    // Organic levitation hovering
    this.pos.x = engine.width / 2 + Math.sin(this.hoverTime * 0.7) * 90;
    this.pos.y = this.targetY + Math.cos(this.hoverTime * 1.2) * 16;

    // Update Petal Shields orbit
    this.petals.forEach((petal, idx) => {
      petal.angle += this.petalOrbitSpeed * dt;
      petal.bloomTimer = Math.max(0, petal.bloomTimer - dt);

      // Re-sprout petals slowly if destroyed in Phase 2
      if (!petal.isAlive && this.hp > this.maxHp * 0.5) {
        petal.hp += dt * 2.5;
        if (petal.hp >= petal.maxHp) {
          petal.hp = petal.maxHp;
          petal.isAlive = true;
          if (engine) {
            engine.particles.emit(this.pos.x, this.pos.y, 10, {
              color: '#34d399',
              speed: 90,
              size: 3
            });
          }
        }
      }
    });

    // Check Phase 2 (Enraged Nature Overgrowth at 50% HP)
    if (!this.phase2Triggered && this.hp <= this.maxHp * 0.5) {
      this.phase2Triggered = true;
      this.petalOrbitSpeed = 1.9;
      engine.camera.shake(12, 0.45);
      engine.sound.playBossAlert();
    }

    // 1. Thorn Barrage (Fibonacci Spiraling bio-thorns)
    this.thornBarrageTimer += dt;
    const thornInterval = this.phase2Triggered ? 1.6 : 2.4;
    if (this.thornBarrageTimer >= thornInterval) {
      this.thornBarrageTimer = 0;
      this.fireThornBarrage(enemyBullets, engine);
    }

    // 2. Pollen Spore Burst (Toxic cloud clusters)
    this.sporeBurstTimer += dt;
    if (this.sporeBurstTimer >= 3.2) {
      this.sporeBurstTimer = 0;
      this.fireSporeBursts(player, enemyBullets, engine);
    }

    // 3. Vine Lash Attack (Vertical root snares)
    this.vineLashTimer += dt;
    const vineInterval = this.phase2Triggered ? 4.0 : 6.0;
    if (this.vineLashTimer >= vineInterval) {
      this.vineLashTimer = 0;
      this.triggerVineLash(player, engine);
    }
    this.updateVineLashes(dt, player, engine);

    // 4. Phase 2: Solar Photosynthesis Chlorophyll Beam
    if (this.phase2Triggered) {
      this.solarBeamTimer += dt;
      if (this.solarBeamTimer >= 5.5) {
        this.solarBeamTimer = 0;
        this.fireSolarBlossom(player, enemyBullets, engine);
      }

      // Minion Propagation (Spawns Spore Crawlers)
      this.summonTimer += dt;
      if (this.summonTimer >= 7.0 && typeof spawnCallback === 'function') {
        this.summonTimer = 0;
        spawnCallback(this.pos.x - 70, this.pos.y + 40, 'spore');
        spawnCallback(this.pos.x + 70, this.pos.y + 40, 'spore');
        engine.particles.emit(this.pos.x, this.pos.y + 30, 16, {
          color: '#22c55e',
          speed: 120,
          size: 3.5
        });
      }
    }

    super.update(dt);
  }

  fireThornBarrage(enemyBullets, engine) {
    if (!enemyBullets) return;
    const count = this.phase2Triggered ? 14 : 10;
    const baseAng = this.hoverTime * 2.2;
    const speed = 230;

    for (let i = 0; i < count; i++) {
      const ang = baseAng + (i * (Math.PI * 2)) / count;
      const vx = Math.cos(ang) * speed;
      const vy = Math.sin(ang) * speed;

      enemyBullets.push(
        new Bullet(this.pos.x, this.pos.y, vx, vy, '#22c55e', {
          scale: 1.15,
          lifetime: 4.0
        })
      );
    }

    if (engine) {
      engine.sound.playLaser();
      engine.particles.emit(this.pos.x, this.pos.y, 8, {
        color: '#84cc16',
        speed: 80,
        size: 3
      });
    }
  }

  fireSporeBursts(player, enemyBullets, engine) {
    if (!enemyBullets || !player) return;
    const dx = player.x - this.pos.x;
    const dy = player.y - this.pos.y;
    const angle = Math.atan2(dy, dx);
    const speed = 200;

    // Fire 3 spreading toxic pollen clusters
    for (const offset of [-0.35, 0, 0.35]) {
      const a = angle + offset;
      enemyBullets.push(
        new Bullet(this.pos.x, this.pos.y + 20, Math.cos(a) * speed, Math.sin(a) * speed, '#a3e635', {
          scale: 1.4,
          lifetime: 3.8
        })
      );
    }

    if (engine) {
      engine.sound.playHit();
    }
  }

  triggerVineLash(player, engine) {
    // Spawn 2 vine hazard zones near player
    const targetX = player.x + (Math.random() - 0.5) * 80;
    this.activeVines.push({
      x: targetX,
      width: 44,
      telegraphTimer: 1.2,
      activeTimer: 1.6,
      dealtDamage: false
    });

    if (engine) {
      engine.particles.emit(targetX, 0, 6, {
        color: '#15803d',
        speed: 60,
        size: 3
      });
    }
  }

  updateVineLashes(dt, player, engine) {
    for (let i = this.activeVines.length - 1; i >= 0; i--) {
      const vine = this.activeVines[i];
      if (vine.telegraphTimer > 0) {
        vine.telegraphTimer -= dt;
      } else if (vine.activeTimer > 0) {
        vine.activeTimer -= dt;
        // Check damage to player
        if (!vine.dealtDamage && player && player.isAlive) {
          if (Math.abs(player.x - vine.x) < vine.width / 2 + 14) {
            player.takeDamage(1, engine);
            vine.dealtDamage = true;
            if (engine) engine.camera.shake(6, 0.2);
          }
        }
      } else {
        this.activeVines.splice(i, 1);
      }
    }
  }

  fireSolarBlossom(player, enemyBullets, engine) {
    if (!enemyBullets) return;
    // Massive floral ring of 20 bullets that expand and slow down
    const count = 20;
    const speed = 260;

    for (let i = 0; i < count; i++) {
      const ang = (i * Math.PI * 2) / count;
      enemyBullets.push(
        new Bullet(this.pos.x, this.pos.y, Math.cos(ang) * speed, Math.sin(ang) * speed, '#eab308', {
          scale: 1.25,
          lifetime: 3.5
        })
      );
    }

    if (engine) {
      engine.camera.shake(5, 0.2);
      engine.sound.playLaser();
      engine.particles.emit(this.pos.x, this.pos.y, 25, {
        color: '#facc15',
        speed: 150,
        size: 4
      });
    }
  }

  getHomingTargets() {
    const targets = [this];
    for (const petal of this.petals) {
      if (petal.isAlive) {
        targets.push({
          x: this.pos.x + Math.cos(petal.angle) * petal.distance,
          y: this.pos.y + Math.sin(petal.angle) * petal.distance,
          radius: 18,
          isPetal: true
        });
      }
    }
    return targets;
  }

  takeDamage(amount, engine) {
    this.hp -= amount;
    engine.sound.playHit();

    engine.particles.emit(this.pos.x, this.pos.y, 7, {
      color: '#34d399',
      speed: 100,
      size: 3.5,
      life: 0.3
    });

    if (this.hp <= 0) {
      this.isAlive = false;
      engine.sound.playExplosion();
      engine.camera.shake(14, 0.5);

      // Verdant blossom explosion
      engine.particles.emit(this.pos.x, this.pos.y, 45, {
        color: '#10b981',
        speed: 220,
        size: 5,
        life: 0.8
      });
      engine.particles.emit(this.pos.x, this.pos.y, 30, {
        color: '#facc15',
        speed: 180,
        size: 4,
        life: 0.7
      });
      return true;
    }
    return false;
  }

  render(ctx) {
    ctx.save();

    // 1. Render Active Vine Lash Traps
    for (const vine of this.activeVines) {
      ctx.save();
      if (vine.telegraphTimer > 0) {
        // Warning Telegraph Line
        ctx.fillStyle = 'rgba(234, 179, 8, 0.18)';
        ctx.fillRect(vine.x - vine.width / 2, 0, vine.width, 700);
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.strokeRect(vine.x - vine.width / 2, 0, vine.width, 700);
      } else {
        // Active Thorny Root Slam
        ctx.fillStyle = 'rgba(21, 128, 61, 0.55)';
        ctx.fillRect(vine.x - vine.width / 2, 0, vine.width, 700);
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(vine.x - vine.width / 2, 0, vine.width, 700);

        // Draw thorny spikes along the vine
        ctx.fillStyle = '#84cc16';
        for (let vy = 20; vy < 700; vy += 40) {
          ctx.beginPath();
          ctx.moveTo(vine.x - vine.width / 2, vy);
          ctx.lineTo(vine.x - vine.width / 2 - 12, vy + 10);
          ctx.lineTo(vine.x - vine.width / 2, vy + 20);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(vine.x + vine.width / 2, vy + 15);
          ctx.lineTo(vine.x + vine.width / 2 + 12, vy + 25);
          ctx.lineTo(vine.x + vine.width / 2, vy + 35);
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.restore();
    }

    ctx.translate(this.pos.x, this.pos.y);

    // 2. Render Living Root Wings / Branch Structure
    ctx.save();
    ctx.strokeStyle = this.woodColor;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    // Left Branch Wings
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-60, -30, -90, -10);
    ctx.quadraticCurveTo(-110, 20, -85, 45);
    ctx.stroke();

    // Right Branch Wings
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(60, -30, 90, -10);
    ctx.quadraticCurveTo(110, 20, 85, 45);
    ctx.stroke();

    // Branch Emerald Veins
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-55, -25, -80, -5);
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(55, -25, 80, -5);
    ctx.stroke();
    ctx.restore();

    // 3. Render Ancient Organic Core (Heart of Yggdrasil)
    const corePulse = 1 + 0.12 * Math.sin(this.pulse * 2.2);

    // Outer Bark Husk
    ctx.save();
    ctx.fillStyle = '#0f291e';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 14;

    ctx.beginPath();
    ctx.moveTo(0, -38 * corePulse);
    ctx.lineTo(38 * corePulse, -12);
    ctx.lineTo(28 * corePulse, 34);
    ctx.lineTo(0, 48 * corePulse);
    ctx.lineTo(-28 * corePulse, 34);
    ctx.lineTo(-38 * corePulse, -12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Inner Glowing Chlorophyll Core
    const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, 26 * corePulse);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.35, '#86efac');
    grad.addColorStop(0.75, '#10b981');
    grad.addColorStop(1, '#064e3b');

    ctx.fillStyle = grad;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(0, 0, 22 * corePulse, 0, Math.PI * 2);
    ctx.fill();

    // Rune Glyph inside core
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(0, 14);
    ctx.moveTo(-10, 0);
    ctx.lineTo(10, 0);
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 4. Render Orbiting Florian Petal Shields
    this.petals.forEach((petal) => {
      if (!petal.isAlive) return;
      const px = Math.cos(petal.angle) * petal.distance;
      const py = Math.sin(petal.angle) * petal.distance;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(petal.angle + Math.PI / 2);

      // Petal Shape
      ctx.fillStyle = 'rgba(16, 185, 129, 0.88)';
      ctx.strokeStyle = '#84cc16';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.quadraticCurveTo(14, 0, 0, 18);
      ctx.quadraticCurveTo(-14, 0, 0, -18);
      ctx.fill();
      ctx.stroke();

      // Petal Vein
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(0, 14);
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  }

  renderBossHealthBar(ctx, w) {
    const barW = Math.min(540, w - 80);
    const barH = 15;
    const x = (w - barW) / 2;
    const y = 80;

    ctx.save();
    // Glassmorphism Container
    ctx.fillStyle = 'rgba(7, 26, 17, 0.92)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 14;
    ctx.fillRect(x - 6, y - 24, barW + 12, barH + 34);
    ctx.strokeRect(x - 6, y - 24, barW + 12, barH + 34);

    // Title & Name
    ctx.font = '800 12px "Orbitron", sans-serif';
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 8;
    ctx.textAlign = 'left';
    ctx.fillText(`🌺 ${this.name} // ${this.title}`, x, y - 8);

    // HP Value
    ctx.textAlign = 'right';
    ctx.font = '700 12px "Outfit", sans-serif';
    ctx.fillStyle = '#ecfdf5';
    ctx.fillText(`${Math.max(0, this.hp)} / ${this.maxHp} HP`, x + barW, y - 8);

    // Health Bar Fill
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(x, y, barW, barH);

    const pct = Math.max(0, Math.min(1, this.hp / this.maxHp));
    const hpGrad = ctx.createLinearGradient(x, y, x + barW, y);
    hpGrad.addColorStop(0, '#059669');
    hpGrad.addColorStop(0.5, '#10b981');
    hpGrad.addColorStop(1, '#84cc16');

    ctx.fillStyle = hpGrad;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 10;
    ctx.fillRect(x, y, barW * pct, barH);

    ctx.restore();
  }
}
