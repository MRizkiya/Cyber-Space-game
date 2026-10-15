import { Entity } from './Entity.js';

/**
 * Bullet projectile entity supporting 4 distinct Weapon types:
 * - Vulcan Gatling (Kinetic tracer)
 * - Plasma Flak (High-density plasma pellets)
 * - Heavy Railgun (Piercing hyper-beam)
 * - Cluster Missile (Rocket motor with AoE explosion)
 * As well as Elemental status effects (Chain Lightning, Cryo Stasis, Ice Shard).
 */
export class Bullet extends Entity {
  constructor(x, y, vx, vy, color = '#38bdf8', options = {}) {
    const scale = options.scale || 1.0;
    const baseSize = 6 * scale;
    super(x, y, baseSize, baseSize);

    this.vel.set(vx, vy);
    this.color = color;
    this.lifetime = options.lifetime || 1.9;
    this.damage = options.damage || 1;
    this.isCrit = options.isCrit || false;
    this.scale = scale;
    this.weaponType = options.weaponType || 'vulcan';

    // Rocket AoE settings
    this.isRocket = options.isRocket || false;
    this.explosionRadius = options.explosionRadius || 0;
    this.rocketSmokeTimer = 0;

    // Status effect tags
    this.hasChainLightning = options.hasChainLightning || false;
    this.hasCryo = options.hasCryo || false;
    this.isIceShard = options.isIceShard || false;

    // Homing settings
    this.isHoming = options.isHoming || false;
    this.homingTurnSpeed = options.homingTurnSpeed || 3.8;
    this.homingRadius = options.homingRadius || 240;

    // Pierce & Split settings
    this.pierce = options.pierce || 0;
    this.isInfinitePierce = options.isInfinitePierce || false;
    this.canSplit = options.canSplit || false;
    this.hasSplit = false;
    this.hitEnemies = new Set();
  }

  update(dt, enemies = [], engine = null) {
    if (!this.isAlive) return;

    // Rocket motor smoke particles & gentle tracking
    if (this.isRocket && engine) {
      this.rocketSmokeTimer += dt;
      if (this.rocketSmokeTimer > 0.04) {
        this.rocketSmokeTimer = 0;
        engine.particles.emit(this.x, this.y, 1, {
          color: Math.random() < 0.6 ? '#fbbf24' : '#f97316',
          speed: 35,
          size: 2.8,
          life: 0.22,
          baseAngle: Math.atan2(this.vel.y, this.vel.x) + Math.PI,
          spread: 0.35
        });
      }
    }

    // Homing or soft-homing rocket guidance
    if (this.isHoming && enemies.length > 0) {
      let nearest = null;
      let minDist = this.homingRadius;

      for (const e of enemies) {
        if (!e.isAlive) continue;
        const dist = Math.hypot(e.x - this.x, e.y - this.y);
        if (dist < minDist) {
          minDist = dist;
          nearest = e;
        }
      }

      if (nearest) {
        const targetAngle = Math.atan2(nearest.y - this.y, nearest.x - this.x);
        const currentAngle = Math.atan2(this.vel.y, this.vel.x);
        let diff = targetAngle - currentAngle;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));

        const steer = Math.sign(diff) * Math.min(Math.abs(diff), this.homingTurnSpeed * dt);
        const newAngle = currentAngle + steer;
        const speed = this.vel.mag() || 650;

        this.vel.x = Math.cos(newAngle) * speed;
        this.vel.y = Math.sin(newAngle) * speed;
      }
    }

    super.update(dt);
    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.isAlive = false;
    }
  }

  onHit(enemy) {
    if (this.hitEnemies.has(enemy)) return false;
    this.hitEnemies.add(enemy);

    if (this.isInfinitePierce) {
      return true; // Keep flying
    }

    if (this.pierce > 0) {
      this.pierce--;
      return true; // Pierced, keep flying
    }

    this.isAlive = false;
    return false;
  }

  render(ctx) {
    ctx.save();
    const renderColor = this.isCrit ? '#ffe600' : this.color;
    const rad = Math.max(2.5, 4 * this.scale);
    const angle = Math.atan2(this.vel.y, this.vel.x);

    ctx.shadowColor = renderColor;
    ctx.shadowBlur = this.isCrit ? 18 : (10 * this.scale);
    ctx.fillStyle = renderColor;

    if (this.weaponType === 'railgun' || this.scale > 1.4) {
      // Hyper-Velocity Railgun piercing beam bolt
      ctx.translate(this.x, this.y);
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.ellipse(0, 0, rad * 3.2, rad * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Blazing central white laser needle
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 24;
      ctx.shadowColor = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 0, rad * 2.2, rad * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.isRocket) {
      // Micro Missile chassis with warhead
      ctx.translate(this.x, this.y);
      ctx.rotate(angle);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-7, -3, 12, 6);

      // Warhead
      ctx.fillStyle = renderColor;
      ctx.beginPath();
      ctx.moveTo(5, -3);
      ctx.lineTo(10, 0);
      ctx.lineTo(5, 3);
      ctx.closePath();
      ctx.fill();

      // Fins
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-8, -5, 3, 10);
    } else if (this.isIceShard) {
      // Crystalline Ice Diamond
      ctx.translate(this.x, this.y);
      ctx.rotate(angle);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.fillStyle = 'rgba(224, 242, 254, 0.9)';
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(0, -3.5);
      ctx.lineTo(-6, 0);
      ctx.lineTo(0, 3.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.weaponType === 'shotgun') {
      // Plasma Flak Pellet (fiery plasma orb)
      ctx.beginPath();
      ctx.arc(this.x, this.y, rad * 1.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, rad * 0.45, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Vulcan Kinetic Round (elongated slug)
      ctx.translate(this.x, this.y);
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.ellipse(0, 0, rad * 1.6, rad * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 0, rad * 0.9, rad * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
