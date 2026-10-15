import { Entity } from './Entity.js';
import { Bullet } from './Bullet.js';

/**
 * Stage 5 Boss: TITAN NEXUS.
 * Features multi-phase attack patterns, heavy cyber hull, and dedicated boss mechanics.
 */
export class Boss extends Entity {
  constructor(x, y) {
    super(x, y, 76, 60);
    this.name = 'TITAN NEXUS';
    this.maxHp = 50;
    this.hp = 50;
    this.color = '#ff0055';
    this.coreColor = '#ffe600';
    this.targetY = 115;
    this.entering = true;
    this.hoverTime = 0;
    this.attackTimer = 0;
    this.radialTimer = 0;
    this.radius = 35;
    this.scoreValue = 2500;
    this.phase2Triggered = false;
  }

  update(dt, player, engine, bossBullets, spawnMinionCallback) {
    this.hoverTime += dt * 1.5;

    // Entrance animation
    if (this.entering) {
      this.pos.y += (this.targetY - this.pos.y) * 2.5 * dt;
      if (Math.abs(this.pos.y - this.targetY) < 2) {
        this.pos.y = this.targetY;
        this.entering = false;
      }
      return;
    }

    // Horizontal swaying motion across canvas
    const margin = 100;
    this.pos.x = engine.width / 2 + Math.sin(this.hoverTime * 0.9) * (engine.width / 2 - margin);
    this.pos.y = this.targetY + Math.sin(this.hoverTime * 2) * 12;

    // Thruster particles
    engine.particles.emit(this.x - 22, this.y - 15, 2, {
      color: '#ff0055',
      speed: 70,
      size: 4,
      life: 0.3,
      baseAngle: -Math.PI / 2,
      spread: 0.5
    });
    engine.particles.emit(this.x + 22, this.y - 15, 2, {
      color: '#ff0055',
      speed: 70,
      size: 4,
      life: 0.3,
      baseAngle: -Math.PI / 2,
      spread: 0.5
    });

    if (!player || !player.isAlive) return;

    // Check Phase 2 (HP <= 50%)
    const isEnraged = this.hp <= this.maxHp / 2;
    if (isEnraged && !this.phase2Triggered) {
      this.phase2Triggered = true;
      engine.sound.playBossAlert();
      engine.camera.shake(12, 0.4);
      engine.particles.emit(this.x, this.y, 30, {
        color: '#ffe600',
        speed: 180,
        size: 5,
        life: 0.6
      });
    }

    // Primary Attack: Dual aimed lasers
    this.attackTimer += dt;
    const shootInterval = isEnraged ? 0.9 : 1.4;
    if (this.attackTimer >= shootInterval) {
      this.attackTimer = 0;
      this.fireAimedLasers(player, bossBullets, engine);
    }

    // Secondary Attack: Radial bullet ring
    this.radialTimer += dt;
    const radialInterval = isEnraged ? 2.8 : 4.0;
    if (this.radialTimer >= radialInterval) {
      this.radialTimer = 0;
      this.fireRadialBurst(bossBullets, engine, isEnraged ? 10 : 8);

      // In enraged mode, summon an escort minion
      if (isEnraged && spawnMinionCallback) {
        spawnMinionCallback(this.x + (Math.random() - 0.5) * 80, this.y + 40);
      }
    }
  }

  fireAimedLasers(player, bossBullets, engine) {
    const angle = Math.atan2(player.y - this.y, player.x - this.x);
    const speed = 260;

    // Left cannon
    const lx = this.x - 26;
    const ly = this.y + 20;
    bossBullets.push(new Bullet(lx, ly, Math.cos(angle - 0.08) * speed, Math.sin(angle - 0.08) * speed, '#ff0055'));

    // Right cannon
    const rx = this.x + 26;
    const ry = this.y + 20;
    bossBullets.push(new Bullet(rx, ry, Math.cos(angle + 0.08) * speed, Math.sin(angle + 0.08) * speed, '#ff0055'));

    engine.sound.playLaser();
  }

  fireRadialBurst(bossBullets, engine, count = 8) {
    const speed = 200;
    const offsetAngle = this.hoverTime;
    for (let i = 0; i < count; i++) {
      const angle = offsetAngle + (i * Math.PI * 2) / count;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      bossBullets.push(new Bullet(this.x, this.y + 10, vx, vy, '#ffe600'));
    }
    engine.sound.playLaser();
    engine.camera.shake(4, 0.15);
  }

  takeDamage(amount, engine) {
    this.hp -= amount;
    engine.sound.playHit();

    engine.particles.emit(this.x + (Math.random() - 0.5) * 40, this.y + (Math.random() - 0.5) * 30, 5, {
      color: '#ffe600',
      speed: 100,
      size: 3.5,
      life: 0.3
    });

    if (this.hp <= 0) {
      this.isAlive = false;
      engine.sound.playExplosion();
      engine.camera.shake(14, 0.6);

      // Mega death explosion
      engine.particles.emit(this.x, this.y, 60, {
        color: '#ff0055',
        speed: 260,
        size: 6,
        life: 1.0
      });
      engine.particles.emit(this.x, this.y, 40, {
        color: '#ffe600',
        speed: 200,
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

    // Glowing Neon Dreadnought Body
    ctx.shadowColor = this.phase2Triggered ? '#ffe600' : this.color;
    ctx.shadowBlur = 18;
    ctx.strokeStyle = this.phase2Triggered ? '#ffe600' : this.color;
    ctx.lineWidth = 2.5;
    ctx.fillStyle = '#110c1f';

    // Main Heavy Warship Hull
    ctx.beginPath();
    ctx.moveTo(0, 32);
    ctx.lineTo(-38, 10);
    ctx.lineTo(-34, -20);
    ctx.lineTo(-14, -28);
    ctx.lineTo(0, -18);
    ctx.lineTo(14, -28);
    ctx.lineTo(34, -20);
    ctx.lineTo(38, 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Heavy Wing Cannons
    ctx.fillStyle = '#ff0055';
    ctx.fillRect(-30, 10, 8, 16);
    ctx.fillRect(22, 10, 8, 16);

    // Center Reactor Core (Pulsing)
    const corePulse = 1 + 0.3 * Math.sin(this.hoverTime * 5);
    ctx.fillStyle = this.phase2Triggered ? '#ffe600' : '#00f0ff';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(0, 2, 9 * corePulse, 0, Math.PI * 2);
    ctx.fill();

    // Core Ring
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 2, 14, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  renderBossHealthBar(ctx, screenWidth) {
    ctx.save();
    const barW = Math.min(520, screenWidth - 60);
    const barH = 14;
    const x = (screenWidth - barW) / 2;
    const y = 68;

    // Background Card
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(255, 0, 85, 0.5)';
    ctx.lineWidth = 1;
    ctx.fillRect(x - 6, y - 22, barW + 12, barH + 30);
    ctx.strokeRect(x - 6, y - 22, barW + 12, barH + 30);

    // Boss Name & Phase
    ctx.font = '800 13px "Orbitron", sans-serif';
    ctx.fillStyle = '#ff0055';
    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 8;
    ctx.textAlign = 'left';
    ctx.fillText(`⚡ BOSS: ${this.name}`, x, y - 6);

    ctx.textAlign = 'right';
    ctx.font = '700 12px "Outfit", sans-serif';
    ctx.fillStyle = this.phase2Triggered ? '#ffe600' : '#e2e8f0';
    ctx.fillText(this.phase2Triggered ? 'PHASE 2: ENRAGED' : `${this.hp}/${this.maxHp} HP`, x + barW, y - 6);

    // Health Bar Container
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.fillRect(x, y, barW, barH);

    // Health Fill with Gradient
    const pct = Math.max(0, this.hp / this.maxHp);
    const grad = ctx.createLinearGradient(x, y, x + barW, y);
    if (this.phase2Triggered) {
      grad.addColorStop(0, '#ff0055');
      grad.addColorStop(1, '#ffe600');
    } else {
      grad.addColorStop(0, '#b026ff');
      grad.addColorStop(1, '#ff0055');
    }

    ctx.fillStyle = grad;
    ctx.shadowColor = this.phase2Triggered ? '#ffe600' : '#ff0055';
    ctx.shadowBlur = 10;
    ctx.fillRect(x, y, barW * pct, barH);

    ctx.restore();
  }
}
