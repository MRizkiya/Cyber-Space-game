import { Entity } from './Entity.js';
import { Bullet } from './Bullet.js';
import { Collision } from '../utils/Collision.js';

/**
 * Stage 10 Final Boss: CHRONO OVERLORD (CHRONO MIRAGE).
 * Climax Boss featuring:
 * 1. Synchronized 3-ship dreadnought fleet formation that actively maneuvers together.
 * 2. Quantum Shuffle: disorienting vortex swap that shifts the real boss unpredictably between Left, Center, and Right.
 * 3. True Visual Deception: Decoys share the same intimidating cyber hull and pulsing quantum core.
 *    Decoys only reveal themselves through subtle micro-glitch flickers and hexagonal reflection barriers when struck!
 * 4. Quantum Counter-Reflection: Shooting a decoy reflects retaliatory plasma fire at the player.
 *    Decoys can be temporarily shattered by heavy damage, but are reconstructed upon each Quantum Shuffle!
 * 5. Anti-Homing Decoy Warfare: Clones actively draw homing seeker missiles, preventing easy auto-targeting.
 * 6. True Climax Bullet Hell: All living ships fire synchronized laser darts, spiral rings, and spatial fan sweeps.
 */
export class BossStage10 extends Entity {
  constructor(x, y) {
    super(x, y, 82, 68);
    this.name = 'CHRONO MIRAGE';
    this.maxHp = 140;
    this.hp = 140;
    this.color = '#a855f7';
    this.targetY = 120;
    this.entering = true;
    this.hoverTime = 0;
    this.scoreValue = 10000;
    this.phase2Triggered = false;

    // Fleet Slot Offsets: -150 (Left), 0 (Center), +150 (Right)
    // realSlot: 0 (Left), 1 (Center), 2 (Right)
    this.slotOffsets = [-150, 0, 150];
    this.realSlot = 1; // Start in center

    // Decoy Mirage Clones
    this.clones = [
      this.createClone(x - 150, y, 0),
      this.createClone(x + 150, y, 2)
    ];

    // Combat timers
    this.attackTimer = 0;
    this.spiralTimer = 0;
    this.sliceTimer = 0;
    this.shuffleTimer = 0;

    // Shuffle vortex animation state
    this.isShuffling = false;
    this.shuffleProgress = 0;
    this.shuffleDuration = 0.95;
    this.oldSlots = [0, 1, 2];
    this.targetSlots = [0, 1, 2];
  }

  createClone(x, y, slot) {
    return {
      x,
      y,
      slot,
      width: 82,
      height: 68,
      hp: 22,
      maxHp: 22,
      isAlive: true,
      glitchTimer: 1.6 + Math.random() * 1.4,
      isGlitching: false,
      glitchDuration: 0,
      hitFlashTimer: 0,
      glitchOffsetX: 0,
      getBounds() {
        return {
          x: this.x - this.width / 2,
          y: this.y - this.height / 2,
          width: this.width,
          height: this.height
        };
      },
      takeDamage(dmg, engine) {
        this.hp -= dmg;
        this.hitFlashTimer = 0.2;
        if (this.hp <= 0) {
          this.isAlive = false;
          return true;
        }
        return false;
      }
    };
  }

  /**
   * Returns valid targets for homing seeker projectiles.
   * Clones actively register as homing targets to trick seeker algorithms!
   */
  getHomingTargets() {
    const targets = [this];
    for (const c of this.clones) {
      if (c.isAlive) targets.push(c);
    }
    return targets;
  }

  update(dt, player, engine, bossBullets, spawnMinionCallback) {
    this.hoverTime += dt * 1.7;

    // Update clone glitch and hit flash timers
    this.clones.forEach((clone) => {
      if (!clone.isAlive) return;

      if (clone.hitFlashTimer > 0) {
        clone.hitFlashTimer -= dt;
      }

      clone.glitchTimer -= dt;
      if (clone.glitchTimer <= 0) {
        clone.isGlitching = true;
        clone.glitchDuration = 0.18;
        clone.glitchOffsetX = (Math.random() - 0.5) * 8;
        clone.glitchTimer = 2.2 + Math.random() * 1.5;
      }

      if (clone.isGlitching) {
        clone.glitchDuration -= dt;
        if (clone.glitchDuration <= 0) {
          clone.isGlitching = false;
          clone.glitchOffsetX = 0;
        }
      }
    });

    // 1. Entrance animation
    if (this.entering) {
      this.pos.y += (this.targetY - this.pos.y) * 2.2 * dt;
      this.clones[0].y = this.pos.y;
      this.clones[1].y = this.pos.y;

      if (Math.abs(this.pos.y - this.targetY) < 3) {
        this.pos.y = this.targetY;
        this.entering = false;
      }
      return;
    }

    // 2. Phase 2 Enrage Check (HP <= 50%)
    const isEnraged = this.hp <= this.maxHp * 0.5;
    if (isEnraged && !this.phase2Triggered) {
      this.phase2Triggered = true;
      this.color = '#f43f5e';
      engine.sound.playBossAlert();
      engine.camera.shake(18, 0.65);
      engine.particles.emit(this.x, this.y, 50, {
        color: '#f43f5e',
        speed: 260,
        size: 6,
        life: 0.8
      });
      engine.particles.emit(this.x, this.y, 40, {
        color: '#a855f7',
        speed: 200,
        size: 5,
        life: 0.7
      });
    }

    // 3. Dynamic Arena Movement
    // Fleet moves continuously along smooth sinusoidal & Lissajous flight curves
    const moveSpeed = isEnraged ? 1.35 : 1.05;
    const centerFlightX = engine.width / 2 + Math.sin(this.hoverTime * 0.95 * moveSpeed) * (engine.width / 2 - 180);
    const centerFlightY = this.targetY + Math.cos(this.hoverTime * 1.7 * moveSpeed) * 32;

    // 4. Quantum Shuffle Vortex Animation
    if (this.isShuffling) {
      this.shuffleProgress += dt / this.shuffleDuration;
      const spinAngle = this.shuffleProgress * Math.PI * 4; // 2 full spin rotations
      const t = Math.min(1, this.shuffleProgress);

      // Interpolate slot positions while spinning
      for (let i = 0; i < 3; i++) {
        const fromX = centerFlightX + this.slotOffsets[this.oldSlots[i]];
        const toX = centerFlightX + this.slotOffsets[this.targetSlots[i]];
        const curX = fromX + (toX - fromX) * t + Math.cos(spinAngle + (i * Math.PI * 2) / 3) * 48 * (1 - t);
        const curY = centerFlightY + Math.sin(spinAngle + (i * Math.PI * 2) / 3) * 32 * (1 - t);

        if (i === this.realSlot) {
          this.pos.x = curX;
          this.pos.y = curY;
        } else {
          const cloneIdx = i < this.realSlot ? i : i - 1;
          if (this.clones[cloneIdx]) {
            this.clones[cloneIdx].x = curX;
            this.clones[cloneIdx].y = curY;
          }
        }
      }

      // Sparkle vortex particles with matching colors for all ships
      if (Math.random() < 0.75) {
        engine.particles.emit(centerFlightX + (Math.random() - 0.5) * 140, centerFlightY + (Math.random() - 0.5) * 60, 2, {
          color: '#c084fc',
          speed: 150,
          size: 3.5,
          life: 0.35
        });
      }

      if (this.shuffleProgress >= 1.0) {
        this.isShuffling = false;

        // Reconstruct any shattered clones with a quantum reconstruction pulse
        this.clones.forEach((c) => {
          if (!c.isAlive) {
            c.isAlive = true;
            c.hp = c.maxHp;
            engine.particles.emit(c.x, c.y, 25, {
              color: '#c084fc',
              speed: 160,
              size: 4,
              life: 0.5
            });
          }
        });

        // Post-shuffle shockwave attack
        this.firePostShuffleBurst(bossBullets, engine, isEnraged);
      }
    } else {
      // Normal formation flight
      this.pos.x = centerFlightX + this.slotOffsets[this.realSlot];
      this.pos.y = centerFlightY;

      let cIdx = 0;
      for (let s = 0; s < 3; s++) {
        if (s !== this.realSlot) {
          if (this.clones[cIdx]) {
            this.clones[cIdx].x = centerFlightX + this.slotOffsets[s];
            this.clones[cIdx].y = centerFlightY + Math.sin(this.hoverTime * 2.5 + cIdx) * 6;
          }
          cIdx++;
        }
      }

      // Quantum Shuffle Trigger Timer
      this.shuffleTimer += dt;
      const shuffleInterval = isEnraged ? 4.2 : 5.8;
      if (this.shuffleTimer >= shuffleInterval) {
        this.shuffleTimer = 0;
        this.startQuantumShuffle(engine);
      }
    }

    // Engine exhaust particles for real boss & living clones
    engine.particles.emit(this.x, this.y - 18, 1, {
      color: isEnraged ? '#f43f5e' : '#a855f7',
      speed: 80,
      size: 3.5,
      life: 0.28,
      baseAngle: -Math.PI / 2,
      spread: 0.4
    });

    this.clones.forEach((clone) => {
      if (clone.isAlive) {
        engine.particles.emit(clone.x, clone.y - 18, 1, {
          color: isEnraged ? '#f43f5e' : '#a855f7',
          speed: 80,
          size: 3.5,
          life: 0.28,
          baseAngle: -Math.PI / 2,
          spread: 0.4
        });
      }
    });

    if (!player || !player.isAlive || this.isShuffling) return;

    // 5. ATTACK 1: Aimed Chrono Darts (Fast alternating laser bursts from all ships)
    this.attackTimer += dt;
    const shootInterval = isEnraged ? 0.95 : 1.35;
    if (this.attackTimer >= shootInterval) {
      this.attackTimer = 0;
      this.fireChronoDarts(player, bossBullets, engine, isEnraged);
    }

    // 6. ATTACK 2: Paradox Helix Spiral (Radial bullet wave with clone sub-spirals)
    this.spiralTimer += dt;
    const spiralInterval = isEnraged ? 2.6 : 3.6;
    if (this.spiralTimer >= spiralInterval) {
      this.spiralTimer = 0;
      this.fireParadoxHelixRing(bossBullets, engine, isEnraged);
    }

    // 7. ATTACK 3: Spatial Slice Fan (Coordinated fleet fan barrage)
    this.sliceTimer += dt;
    const sliceInterval = isEnraged ? 4.0 : 5.5;
    if (this.sliceTimer >= sliceInterval) {
      this.sliceTimer = 0;
      this.fireSpatialSlice(player, bossBullets, engine, isEnraged);

      // Summon escort minion in Phase 2
      if (isEnraged && spawnMinionCallback && Math.random() < 0.75) {
        spawnMinionCallback(this.x + (Math.random() - 0.5) * 120, this.y + 40, 'stealth');
      }
    }
  }

  startQuantumShuffle(engine) {
    this.isShuffling = true;
    this.shuffleProgress = 0;
    engine.sound.playBossAlert();
    engine.camera.shake(10, 0.35);

    // Matching quantum teleport particles on ALL 3 ships so player must track movement!
    engine.particles.emit(this.x, this.y, 22, {
      color: '#c084fc',
      speed: 170,
      size: 4.5,
      life: 0.45
    });
    engine.particles.emit(this.x, this.y, 16, {
      color: '#ffe600',
      speed: 150,
      size: 4,
      life: 0.4
    });

    this.clones.forEach((c) => {
      engine.particles.emit(c.x, c.y, 22, {
        color: '#c084fc',
        speed: 170,
        size: 4.5,
        life: 0.45
      });
      engine.particles.emit(c.x, c.y, 16, {
        color: '#ffe600',
        speed: 150,
        size: 4,
        life: 0.4
      });
    });

    // Record previous slots and pick randomized target slots
    const prevReal = this.realSlot;
    let nextReal = Math.floor(Math.random() * 3);
    if (nextReal === prevReal) nextReal = (nextReal + 1) % 3;

    this.oldSlots = [0, 1, 2];
    this.realSlot = nextReal;
  }

  firePostShuffleBurst(bossBullets, engine, isEnraged) {
    // Coordinated pincer burst immediately after positions swap!
    const count = isEnraged ? 12 : 9;
    const speed = 230;
    for (let i = 0; i < count; i++) {
      const ang = (i * Math.PI * 2) / count;
      bossBullets.push(
        new Bullet(this.x, this.y, Math.cos(ang) * speed, Math.sin(ang) * speed, '#f43f5e', { scale: 1.1 })
      );
    }

    // Clones also release a mini-shockwave
    this.clones.forEach((c) => {
      if (!c.isAlive) return;
      for (let i = 0; i < 4; i++) {
        const ang = (i * Math.PI * 2) / 4 + Math.PI / 4;
        bossBullets.push(
          new Bullet(c.x, c.y, Math.cos(ang) * 200, Math.sin(ang) * 200, '#c084fc', { scale: 0.9 })
        );
      }
    });

    engine.sound.playLaser();
    engine.camera.shake(7, 0.22);
  }

  fireChronoDarts(player, bossBullets, engine, isEnraged) {
    const angle = Math.atan2(player.y - this.y, player.x - this.x);
    const speed = 330;
    const bulletColor = isEnraged ? '#f43f5e' : '#a855f7';

    // Real boss fires heavy piercing purple/crimson chronosphere darts
    bossBullets.push(
      new Bullet(this.x - 24, this.y + 16, Math.cos(angle - 0.08) * speed, Math.sin(angle - 0.08) * speed, bulletColor, { scale: 1.25 })
    );
    bossBullets.push(
      new Bullet(this.x + 24, this.y + 16, Math.cos(angle + 0.08) * speed, Math.sin(angle + 0.08) * speed, bulletColor, { scale: 1.25 })
    );

    if (isEnraged) {
      bossBullets.push(
        new Bullet(this.x, this.y + 24, Math.cos(angle) * (speed * 1.1), Math.sin(angle) * (speed * 1.1), '#ffe600', { scale: 1.35 })
      );
    }

    // Living clones ALSO fire matching aimed darts to confuse & pressure player!
    this.clones.forEach((clone) => {
      if (!clone.isAlive) return;
      const cAngle = Math.atan2(player.y - clone.y, player.x - clone.x);
      bossBullets.push(
        new Bullet(clone.x - 18, clone.y + 16, Math.cos(cAngle - 0.07) * (speed * 0.92), Math.sin(cAngle - 0.07) * (speed * 0.92), '#c084fc', { scale: 1.05 })
      );
      bossBullets.push(
        new Bullet(clone.x + 18, clone.y + 16, Math.cos(cAngle + 0.07) * (speed * 0.92), Math.sin(cAngle + 0.07) * (speed * 0.92), '#c084fc', { scale: 1.05 })
      );
    });

    engine.sound.playLaser();
  }

  fireParadoxHelixRing(bossBullets, engine, isEnraged) {
    const count = isEnraged ? 18 : 14;
    const speed = 210;
    const baseAng = this.hoverTime * 1.6;

    for (let i = 0; i < count; i++) {
      const ang = baseAng + (i * Math.PI * 2) / count;
      bossBullets.push(
        new Bullet(this.x, this.y + 12, Math.cos(ang) * speed, Math.sin(ang) * speed, isEnraged ? '#f43f5e' : '#c084fc', { scale: 1.05 })
      );
    }

    // Living clones fire complementary spiral waves
    this.clones.forEach((c, idx) => {
      if (!c.isAlive) return;
      const cloneCount = 6;
      const cloneAngOffset = -baseAng * 1.2 + idx * Math.PI;
      for (let i = 0; i < cloneCount; i++) {
        const ang = cloneAngOffset + (i * Math.PI * 2) / cloneCount;
        bossBullets.push(
          new Bullet(c.x, c.y + 12, Math.cos(ang) * 185, Math.sin(ang) * 185, '#a855f7', { scale: 0.9 })
        );
      }
    });

    engine.sound.playLaser();
    engine.camera.shake(5, 0.16);
  }

  fireSpatialSlice(player, bossBullets, engine, isEnraged) {
    const angle = Math.atan2(player.y - this.y, player.x - this.x);
    const speed = 280;
    const fanCount = isEnraged ? 7 : 5;
    const spread = 0.55;

    // Real boss wide fan
    for (let i = 0; i < fanCount; i++) {
      const fanAngle = angle - spread / 2 + (i / (fanCount - 1)) * spread;
      bossBullets.push(
        new Bullet(this.x, this.y + 20, Math.cos(fanAngle) * speed, Math.sin(fanAngle) * speed, '#fbbf24', { scale: 1.15 })
      );
    }

    // Clones fire angled fan spreads to form a crossfire grid
    this.clones.forEach((c) => {
      if (!c.isAlive) return;
      const cAngle = Math.atan2(player.y - c.y, player.x - c.x);
      for (let i = 0; i < 3; i++) {
        const fanAngle = cAngle - 0.25 + (i / 2) * 0.5;
        bossBullets.push(
          new Bullet(c.x, c.y + 20, Math.cos(fanAngle) * 250, Math.sin(fanAngle) * 250, '#c084fc', { scale: 1.0 })
        );
      }
    });

    engine.sound.playLaser();
    engine.camera.shake(6, 0.2);
  }

  /**
   * Checks collision with player bullets.
   * If a decoy clone is hit, it absorbs the damage, flickers a reflection shield,
   * and retaliates with a counter-bullet at the player!
   */
  checkBulletHit(bullet, engine, bossBullets, player) {
    // 1. Check if bullet hit the REAL boss body
    const realBounds = this.getBounds();
    const hitReal = (
      bullet.x >= realBounds.x &&
      bullet.x <= realBounds.x + realBounds.width &&
      bullet.y >= realBounds.y &&
      bullet.y <= realBounds.y + realBounds.height
    );

    if (hitReal) {
      return { hit: true, isDecoy: false, target: this };
    }

    // 2. Check if bullet hit one of the DECOY mirages
    for (const clone of this.clones) {
      if (!clone.isAlive) continue;
      const cBounds = clone.getBounds();
      if (
        bullet.x >= cBounds.x &&
        bullet.x <= cBounds.x + cBounds.width &&
        bullet.y >= cBounds.y &&
        bullet.y <= cBounds.y + cBounds.height
      ) {
        clone.hitFlashTimer = 0.22;
        const dmg = bullet.damage || 1;
        clone.hp -= dmg;
        engine.sound.playHit();

        // Holographic deflection glitch spark
        engine.particles.emit(bullet.x, bullet.y, 10, {
          color: '#38bdf8',
          speed: 130,
          size: 3.5,
          life: 0.25
        });

        // Retaliatory counter-fire directed back at player
        if (bossBullets && Math.random() < 0.70) {
          const targetX = player ? player.x : clone.x;
          const targetY = player ? player.y : clone.y + 350;
          const retAngle = Math.atan2(targetY - clone.y, targetX - clone.x);
          const retSpeed = 270;
          bossBullets.push(
            new Bullet(clone.x, clone.y + 16, Math.cos(retAngle) * retSpeed, Math.sin(retAngle) * retSpeed, '#c084fc', { scale: 1.0 })
          );
        }

        // Decoy destruction blast
        if (clone.hp <= 0) {
          clone.isAlive = false;
          engine.sound.playExplosion();
          engine.camera.shake(8, 0.3);
          engine.particles.emit(clone.x, clone.y, 35, {
            color: '#38bdf8',
            speed: 200,
            size: 5,
            life: 0.65
          });
          engine.particles.emit(clone.x, clone.y, 25, {
            color: '#c084fc',
            speed: 160,
            size: 4,
            life: 0.5
          });
        }

        return { hit: true, isDecoy: true, target: clone };
      }
    }

    return { hit: false };
  }

  takeDamage(amount, engine) {
    this.hp -= amount;
    engine.sound.playHit();

    // Heavy damage impact particles on the real hull
    engine.particles.emit(this.x + (Math.random() - 0.5) * 35, this.y + (Math.random() - 0.5) * 25, 7, {
      color: this.phase2Triggered ? '#f43f5e' : '#ffe600',
      speed: 120,
      size: 4,
      life: 0.35
    });

    if (this.hp <= 0) {
      this.isAlive = false;
      engine.sound.playExplosion();
      engine.camera.shake(22, 1.0);

      engine.particles.emit(this.x, this.y, 80, {
        color: '#f43f5e',
        speed: 300,
        size: 8,
        life: 1.4
      });
      engine.particles.emit(this.x, this.y, 60, {
        color: '#ffe600',
        speed: 260,
        size: 6,
        life: 1.2
      });
      engine.particles.emit(this.x, this.y, 50, {
        color: '#38bdf8',
        speed: 220,
        size: 5,
        life: 1.0
      });
      return true;
    }
    return false;
  }

  render(ctx) {
    // 1. Render living clones with genuine cyber hull disguise
    this.clones.forEach((clone) => {
      if (clone.isAlive) {
        this.renderShip(ctx, clone.x + clone.glitchOffsetX, clone.y, true, clone);
      }
    });

    // 2. Render the REAL Boss
    this.renderShip(ctx, this.x, this.y, false);
  }

  /**
   * Renders the dreadnought hull.
   * Both Real Boss and Clones share the SAME dark cyber hull, wings, and core geometry!
   * The subtle tell is that clones experience periodic micro-glitches and cyan reflection ripples when struck.
   */
  renderShip(ctx, posX, posY, isDecoy, cloneData = null) {
    ctx.save();
    ctx.translate(posX, posY);

    const mainColor = this.phase2Triggered ? '#f43f5e' : this.color;
    const bodyFill = this.phase2Triggered ? '#260a12' : '#170b28';

    ctx.globalAlpha = 1.0;
    ctx.shadowColor = mainColor;
    ctx.shadowBlur = 20;
    ctx.strokeStyle = mainColor;
    ctx.fillStyle = bodyFill;
    ctx.lineWidth = 2.5;

    // Heavy Quantum Dreadnought Hull
    ctx.beginPath();
    ctx.moveTo(0, 36);
    ctx.lineTo(-38, 14);
    ctx.lineTo(-44, -20);
    ctx.lineTo(-22, -30);
    ctx.lineTo(0, -16);
    ctx.lineTo(22, -30);
    ctx.lineTo(44, -20);
    ctx.lineTo(38, 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Side Forward Wing Fins
    ctx.fillStyle = this.phase2Triggered ? '#f43f5e' : '#c084fc';
    ctx.fillRect(-36, 4, 8, 20);
    ctx.fillRect(28, 4, 8, 20);

    // Singularity Core:
    // Real Boss has a steady, blazing Golden/Crimson core with orbiting white photon rings.
    // Decoys have matching golden appearance, BUT experience periodic micro-glitches (flickering cyan for 0.18s).
    const isGlitching = isDecoy && cloneData && cloneData.isGlitching;
    const corePulse = 1 + 0.3 * Math.sin(this.hoverTime * 5.5);
    const coreColor = isGlitching
      ? '#38bdf8'
      : (this.phase2Triggered ? '#f43f5e' : '#ffe600');

    ctx.fillStyle = coreColor;
    ctx.shadowColor = coreColor;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(0, 4, 10 * corePulse, 0, Math.PI * 2);
    ctx.fill();

    // Orbiting white photon boundary rings
    ctx.strokeStyle = isGlitching ? '#38bdf8' : '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, 4, 16, 0, Math.PI * 2);
    ctx.stroke();

    // Core Center Marker
    ctx.fillStyle = isGlitching ? '#38bdf8' : '#ffffff';
    ctx.fillRect(-2, 2, 4, 4);

    // If decoy was hit recently: display brief hexagonal holographic reflection barrier
    if (isDecoy && cloneData && cloneData.hitFlashTimer > 0) {
      ctx.strokeStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.lineWidth = 2.0;

      ctx.beginPath();
      ctx.moveTo(0, 42);
      ctx.lineTo(-45, 18);
      ctx.lineTo(-45, -26);
      ctx.lineTo(0, -38);
      ctx.lineTo(45, -26);
      ctx.lineTo(45, 18);
      ctx.closePath();
      ctx.stroke();
    }

    ctx.restore();
  }

  renderBossHealthBar(ctx, screenWidth) {
    ctx.save();
    const barW = Math.min(560, screenWidth - 50);
    const barH = 16;
    const x = (screenWidth - barW) / 2;
    const y = 64;

    // Card background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = this.phase2Triggered ? 'rgba(244, 63, 94, 0.7)' : 'rgba(168, 85, 247, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.fillRect(x - 8, y - 26, barW + 16, barH + 36);
    ctx.strokeRect(x - 8, y - 26, barW + 16, barH + 36);

    // Title
    ctx.font = '800 13px "Orbitron", sans-serif';
    ctx.fillStyle = this.phase2Triggered ? '#f43f5e' : '#c084fc';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 8;
    ctx.textAlign = 'left';
    ctx.fillText(`⚡ FINAL OVERLORD [STAGE 10]: ${this.name}`, x, y - 9);

    // Gimmick Warning
    ctx.textAlign = 'right';
    ctx.font = '700 11px "Outfit", sans-serif';
    ctx.fillStyle = '#ffe600';
    ctx.shadowColor = '#ffe600';
    ctx.shadowBlur = 6;
    ctx.fillText(
      this.phase2Triggered
        ? '💥 OVERDRIVE: TEMPORAL COLLAPSE!'
        : '⚠️ AWAS QUANTUM MIRAGE: AMATI GLITCH & HINDARI PANTULAN CLONE!',
      x + barW,
      y - 9
    );

    // Health container
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.fillRect(x, y, barW, barH);

    // Health Gradient fill
    const pct = Math.max(0, this.hp / this.maxHp);
    const grad = ctx.createLinearGradient(x, y, x + barW, y);
    if (this.phase2Triggered) {
      grad.addColorStop(0, '#f43f5e');
      grad.addColorStop(1, '#e11d48');
    } else {
      grad.addColorStop(0, '#ffe600');
      grad.addColorStop(0.5, '#c084fc');
      grad.addColorStop(1, '#a855f7');
    }

    ctx.fillStyle = grad;
    ctx.shadowColor = this.phase2Triggered ? '#f43f5e' : '#c084fc';
    ctx.shadowBlur = 10;
    ctx.fillRect(x, y, barW * pct, barH);

    ctx.restore();
  }
}
