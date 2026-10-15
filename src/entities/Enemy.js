import { Entity } from './Entity.js';
import { Bullet } from './Bullet.js';

/**
 * Neon cyber enemy drone supporting World 1 (Standard, Fast, Tank)
 * and World 2 (Stealth, Sniper, Splitter, Micro) mechanics.
 */
export class Enemy extends Entity {
  constructor(x, y, type = 'drone', stage = 1) {
    super(x, y, 22, 22);
    this.type = type;
    this.stage = stage;

    // Base stats per type
    let baseHp = 2;
    let baseSpeed = 110;
    this.color = '#ff0055';
    this.scoreValue = 100;
    this.radius = 11;
    this.alpha = 1.0;

    if (type === 'fast') {
      baseHp = 1;
      baseSpeed = 175;
      this.color = '#ff9900';
      this.scoreValue = 150;
      this.radius = 9;
    } else if (type === 'tank') {
      baseHp = 4;
      baseSpeed = 70;
      this.color = '#b026ff';
      this.width = 34;
      this.height = 34;
      this.scoreValue = 300;
      this.radius = 16;
    } else if (type === 'stealth') {
      // World 2: Teleporting / Cloaking Phantom
      baseHp = 3;
      baseSpeed = 125;
      this.color = '#c084fc';
      this.scoreValue = 350;
      this.radius = 12;
      this.teleportTimer = 2.5;
      this.isPhased = false;
    } else if (type === 'sniper') {
      // World 2: Perimeter Sniper Drone
      baseHp = 3;
      baseSpeed = 80;
      this.color = '#eab308';
      this.scoreValue = 400;
      this.radius = 13;
      this.sniperTimer = 0;
      this.aimProgress = 0;
    } else if (type === 'splitter') {
      // World 2: Volatile Splitter
      baseHp = 4;
      baseSpeed = 130;
      this.color = '#10b981';
      this.scoreValue = 320;
      this.radius = 14;
    } else if (type === 'micro') {
      // Sub-unit from Splitter
      baseHp = 1;
      baseSpeed = 190;
      this.color = '#34d399';
      this.scoreValue = 100;
      this.radius = 6;
      this.width = 12;
      this.height = 12;
    } else if (type === 'spore') {
      // Zone Xeta: Spore Crawler (Pulsing fungal bio-pod)
      baseHp = 3;
      baseSpeed = 115;
      this.color = '#22c55e';
      this.scoreValue = 360;
      this.radius = 12;
      this.wobblePhase = Math.random() * Math.PI * 2;
    } else if (type === 'spore_shard') {
      // Zone Xeta: Mini spore sub-unit
      baseHp = 1;
      baseSpeed = 175;
      this.color = '#86efac';
      this.scoreValue = 120;
      this.radius = 6;
      this.width = 12;
      this.height = 12;
    } else if (type === 'thorn') {
      // Zone Xeta: Bramble Weaver (Thorny seedpod with bio-spikes)
      baseHp = 4;
      baseSpeed = 95;
      this.color = '#10b981';
      this.scoreValue = 420;
      this.radius = 13;
      this.thornTimer = 0;
    } else if (type === 'mantis') {
      // Zone Xeta: Bio-Mantis (Erratic high-speed predator)
      baseHp = 3;
      baseSpeed = 190;
      this.color = '#84cc16';
      this.scoreValue = 450;
      this.radius = 11;
      this.dashTimer = 0;
      this.dashDir = 1;
    } else if (type === 'colossus') {
      // Zone Xeta: Verdant Colossus (Armored ancient bark dreadnought)
      baseHp = 7;
      baseSpeed = 60;
      this.color = '#047857';
      this.scoreValue = 600;
      this.radius = 18;
      this.width = 38;
      this.height = 38;
      this.sporePulseTimer = 0;
    }

    // Stage scaling: enemies get thicker HP and speed as stages progress
    const stageMultiplier = Math.max(0, stage - 1);
    const hpBonus = Math.floor(stageMultiplier * (type === 'tank' ? 2.5 : type === 'micro' ? 0.2 : 1.4));
    this.maxHp = baseHp + hpBonus;
    this.hp = this.maxHp;

    const speedBonus = stageMultiplier * 8;
    this.speed = baseSpeed + speedBonus;

    this.scoreValue = Math.floor(this.scoreValue * (1 + stageMultiplier * 0.35));
    this.pulse = Math.random() * Math.PI * 2;

    // Elemental status timers (Technomancer)
    this.chillTimer = 0;
    this.frozenTimer = 0;
  }

  update(dt, player, engine = null, enemyBullets = null, spawnCallback = null) {
    if (!player || !player.isAlive) return;

    // Handle Freeze & Chill status (Technomancer)
    if (this.frozenTimer > 0) {
      this.frozenTimer -= dt;
      this.vel.x = 0;
      this.vel.y = 0;
      return;
    }

    let effectiveSpeed = this.speed;
    if (this.chillTimer > 0) {
      this.chillTimer -= dt;
      effectiveSpeed *= 0.55;
      if (Math.random() < 0.2 && engine) {
        engine.particles.emit(this.x, this.y, 1, {
          color: '#38bdf8',
          speed: 30,
          size: 2,
          life: 0.2
        });
      }
    }

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);

    this.pulse += dt * 5;

    // Type-specific behaviors:
    if (this.type === 'stealth') {
      // Stealth / Phantom teleport & cloaking
      this.teleportTimer -= dt;
      if (this.teleportTimer <= 0.6) {
        this.isPhased = true;
        this.alpha = Math.max(0.2, this.teleportTimer / 0.6);
      } else {
        this.isPhased = false;
        this.alpha = 1.0;
      }

      if (this.teleportTimer <= 0) {
        this.teleportTimer = 3.0 + Math.random() * 1.5;
        // Teleport near player
        const angle = Math.random() * Math.PI * 2;
        const jumpDist = 120 + Math.random() * 90;
        this.pos.x = player.x + Math.cos(angle) * jumpDist;
        this.pos.y = player.y + Math.sin(angle) * jumpDist;

        if (engine) {
          engine.particles.emit(this.x, this.y, 14, {
            color: '#c084fc',
            speed: 120,
            size: 3.5,
            life: 0.35
          });
        }
      }

      // Normal tracking
      if (dist > 0) {
        this.vel.x = (dx / dist) * effectiveSpeed;
        this.vel.y = (dy / dist) * effectiveSpeed;
        this.rotation = Math.atan2(dy, dx);
      }
    } else if (this.type === 'sniper') {
      // Sniper: Keeps standoff distance around 240px
      const idealDist = 240;
      if (dist < idealDist - 30) {
        // Back off
        this.vel.x = -(dx / dist) * effectiveSpeed * 0.9;
        this.vel.y = -(dy / dist) * effectiveSpeed * 0.9;
      } else if (dist > idealDist + 40) {
        // Close in slowly
        this.vel.x = (dx / dist) * effectiveSpeed;
        this.vel.y = (dy / dist) * effectiveSpeed;
      } else {
        // Strafe around player
        this.vel.x = -(dy / dist) * effectiveSpeed * 0.7;
        this.vel.y = (dx / dist) * effectiveSpeed * 0.7;
      }

      this.rotation = Math.atan2(dy, dx);

      // Aim & Fire sniper beam
      this.sniperTimer += dt;
      this.aimProgress = Math.min(1.0, this.sniperTimer / 2.6);

      if (this.sniperTimer >= 2.6 && enemyBullets) {
        this.sniperTimer = 0;
        const bulletSpeed = 580;
        const angle = Math.atan2(dy, dx);
        enemyBullets.push(
          new Bullet(
            this.x + Math.cos(angle) * 16,
            this.y + Math.sin(angle) * 16,
            Math.cos(angle) * bulletSpeed,
            Math.sin(angle) * bulletSpeed,
            '#eab308',
            { scale: 1.3 }
          )
        );
        if (engine) {
          engine.sound.playLaser();
          engine.particles.emit(this.x, this.y, 8, {
            color: '#eab308',
            speed: 90,
            size: 3
          });
        }
      }
    } else if (this.type === 'thorn') {
      // Bramble Weaver: Standoff at ~220px, fires bio-thorn bullets
      this.thornTimer = (this.thornTimer || 0) + dt;
      if (dist < 180) {
        this.vel.x = -(dx / dist) * effectiveSpeed * 0.8;
        this.vel.y = -(dy / dist) * effectiveSpeed * 0.8;
      } else {
        this.vel.x = (dx / dist) * effectiveSpeed;
        this.vel.y = (dy / dist) * effectiveSpeed;
      }
      this.rotation = Math.atan2(dy, dx);

      if (this.thornTimer >= 2.8 && enemyBullets) {
        this.thornTimer = 0;
        const thornSpeed = 340;
        const angle = Math.atan2(dy, dx);
        enemyBullets.push(
          new Bullet(
            this.x + Math.cos(angle) * 14,
            this.y + Math.sin(angle) * 14,
            Math.cos(angle) * thornSpeed,
            Math.sin(angle) * thornSpeed,
            '#22c55e',
            { scale: 1.15 }
          )
        );
        if (engine) engine.sound.playLaser();
      }
    } else if (this.type === 'mantis') {
      // Bio-Mantis: Erratic predatory zig-zag dashes
      this.dashTimer = (this.dashTimer || 0) + dt;
      if (this.dashTimer >= 0.35) {
        this.dashTimer = 0;
        this.dashDir = -(this.dashDir || 1);
      }
      const normalX = -(dy / dist);
      const normalY = (dx / dist);
      this.vel.x = ((dx / dist) * 0.75 + normalX * 0.65 * (this.dashDir || 1)) * effectiveSpeed;
      this.vel.y = ((dy / dist) * 0.75 + normalY * 0.65 * (this.dashDir || 1)) * effectiveSpeed;
      this.rotation = Math.atan2(this.vel.y, this.vel.x);
    } else if (this.type === 'spore') {
      // Spore Crawler: Sinusoidal wave floating towards player
      this.wobblePhase = (this.wobblePhase || 0) + dt * 4;
      const wobble = Math.sin(this.wobblePhase) * 45;
      const normalX = -(dy / dist);
      const normalY = (dx / dist);
      this.vel.x = (dx / dist) * effectiveSpeed + normalX * wobble;
      this.vel.y = (dy / dist) * effectiveSpeed + normalY * wobble;
      this.rotation = Math.atan2(dy, dx);
    } else if (this.type === 'colossus') {
      // Verdant Colossus: Heavy forward push, emits periodic spore ring
      this.sporePulseTimer = (this.sporePulseTimer || 0) + dt;
      this.vel.x = (dx / dist) * effectiveSpeed;
      this.vel.y = (dy / dist) * effectiveSpeed;
      this.rotation = Math.atan2(dy, dx);

      if (this.sporePulseTimer >= 4.2 && enemyBullets) {
        this.sporePulseTimer = 0;
        const count = 6;
        for (let i = 0; i < count; i++) {
          const ang = (i * Math.PI * 2) / count;
          enemyBullets.push(
            new Bullet(
              this.x,
              this.y,
              Math.cos(ang) * 190,
              Math.sin(ang) * 190,
              '#10b981',
              { scale: 1.1 }
            )
          );
        }
        if (engine) engine.sound.playLaser();
      }
    } else {
      // Standard tracking
      if (dist > 0) {
        this.vel.x = (dx / dist) * effectiveSpeed;
        this.vel.y = (dy / dist) * effectiveSpeed;
        this.rotation = Math.atan2(dy, dx);
      }
    }

    super.update(dt);
  }

  takeDamage(amount, engine, spawnCallback = null, isCryo = false) {
    if (isCryo) {
      this.chillTimer = 3.5;
    }

    this.hp -= amount;
    engine.sound.playHit();

    engine.particles.emit(this.x, this.y, 6, {
      color: isCryo ? '#38bdf8' : this.color,
      speed: 90,
      size: 3,
      life: 0.25
    });

    if (this.hp <= 0) {
      this.isAlive = false;
      engine.sound.playExplosion();
      engine.camera.shake(6, 0.2);

      engine.particles.emit(this.x, this.y, 22, {
        color: (this.chillTimer > 0 || this.frozenTimer > 0) ? '#38bdf8' : this.color,
        speed: 160,
        size: 4,
        life: 0.55
      });

      // Splitter spawns 2 mini-swarmers on death
      if (this.type === 'splitter' && typeof spawnCallback === 'function') {
        spawnCallback(this.x - 12, this.y, 'micro');
        spawnCallback(this.x + 12, this.y, 'micro');
      }

      // Spore Crawler spawns 2 mini spore shards on death
      if (this.type === 'spore' && typeof spawnCallback === 'function') {
        spawnCallback(this.x - 10, this.y, 'spore_shard');
        spawnCallback(this.x + 10, this.y, 'spore_shard');
      }

      return true; // killed
    }
    return false;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.alpha;

    const isIcy = this.frozenTimer > 0 || this.chillTimer > 0;
    const strokeCol = isIcy ? '#38bdf8' : this.color;

    ctx.shadowColor = strokeCol;
    ctx.shadowBlur = 12;
    ctx.strokeStyle = strokeCol;
    ctx.lineWidth = 2;
    ctx.fillStyle = isIcy ? '#082f49' : '#16091c';

    const r = this.radius;

    if (this.type === 'fast') {
      ctx.beginPath();
      ctx.moveTo(r + 3, 0);
      ctx.lineTo(0, -r);
      ctx.lineTo(-r, 0);
      ctx.lineTo(0, r);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.type === 'tank') {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-r / 2, -r / 2, r, r);
    } else if (this.type === 'stealth') {
      // Phantom sharp crescent
      ctx.beginPath();
      ctx.arc(0, 0, r, 0.4 * Math.PI, 1.6 * Math.PI);
      ctx.lineTo(r + 4, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.type === 'sniper') {
      // Long barrel rifle drone
      ctx.beginPath();
      ctx.moveTo(r + 8, 0);
      ctx.lineTo(-r, -r * 0.7);
      ctx.lineTo(-r * 0.5, 0);
      ctx.lineTo(-r, r * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Aiming laser beam line towards player
      if (this.aimProgress > 0.4) {
        ctx.save();
        ctx.strokeStyle = 'rgba(234, 179, 8, ' + this.aimProgress + ')';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(r + 8, 0);
        ctx.lineTo(r + 260, 0);
        ctx.stroke();
        ctx.restore();
      }
    } else if (this.type === 'splitter') {
      // Bio-mechanical hexagonal split core
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI) / 3;
        const px = Math.cos(ang) * r;
        const py = Math.sin(ang) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.type === 'micro') {
      // Fast triangle shard
      ctx.beginPath();
      ctx.moveTo(r + 2, 0);
      ctx.lineTo(-r, -r);
      ctx.lineTo(-r, r);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.type === 'spore') {
      // Spore Crawler: Bulbous fungal pod with pulsating caps
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Fungal spore dots
      ctx.fillStyle = '#86efac';
      for (let i = 0; i < 4; i++) {
        const dotAng = (i * Math.PI) / 2 + this.pulse;
        ctx.beginPath();
        ctx.arc(Math.cos(dotAng) * (r * 0.55), Math.sin(dotAng) * (r * 0.55), 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (this.type === 'spore_shard') {
      // Mini spore droplet
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (this.type === 'thorn') {
      // Bramble Weaver: Diamond thorny seedpod with outer needles
      ctx.beginPath();
      ctx.moveTo(r + 4, 0);
      ctx.lineTo(0, -r);
      ctx.lineTo(-r, 0);
      ctx.lineTo(0, r);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Sharp thorny spikes
      ctx.strokeStyle = '#84cc16';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -r); ctx.lineTo(0, -r - 6);
      ctx.moveTo(0, r); ctx.lineTo(0, r + 6);
      ctx.moveTo(-r, 0); ctx.lineTo(-r - 6, 0);
      ctx.stroke();
    } else if (this.type === 'mantis') {
      // Bio-Mantis: Slender predatory bio-ship with scythe-like leaf blades
      ctx.beginPath();
      ctx.moveTo(r + 6, 0);
      ctx.lineTo(-r * 0.6, -r * 0.9);
      ctx.lineTo(-r, 0);
      ctx.lineTo(-r * 0.6, r * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Scythe blade arcs
      ctx.strokeStyle = '#a3e635';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(r * 0.2, -r * 0.7);
      ctx.lineTo(r + 8, -r * 1.1);
      ctx.moveTo(r * 0.2, r * 0.7);
      ctx.lineTo(r + 8, r * 1.1);
      ctx.stroke();
    } else if (this.type === 'colossus') {
      // Verdant Colossus: Massive armored ancient wood hull
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        const px = Math.cos(ang) * r;
        const py = Math.sin(ang) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Inner wood growth rings
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Standard Drone
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(-r, -r);
      ctx.lineTo(-r / 2, 0);
      ctx.lineTo(-r, r);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Glowing menacing eye/core
    const pulseFactor = 0.8 + 0.3 * Math.sin(this.pulse);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(1.5, 3 * pulseFactor), 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Render mini health bar
    if (this.hp < this.maxHp && this.maxHp > 1) {
      ctx.save();
      const barW = Math.max(22, this.width);
      const barH = 3.5;
      const bx = this.x - barW / 2;
      const by = this.y - this.height / 2 - 8;

      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(bx, by, barW, barH);

      const pct = Math.max(0, this.hp / this.maxHp);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 4;
      ctx.fillRect(bx, by, barW * pct, barH);
      ctx.restore();
    }
  }
}
