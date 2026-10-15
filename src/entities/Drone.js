import { Entity } from './Entity.js';
import { Bullet } from './Bullet.js';
import { Collision } from '../utils/Collision.js';

/**
 * Escort Companion Drone entity.
 * Supports:
 * - 'assault': Flanks player, targets enemies, and fires energy projectiles (with weapon inheritance & tesla synergy).
 * - 'aegis': Orbits player tightly with an energy barrier that intercepts & disintegrates enemy/boss bullets!
 */
export class Drone extends Entity {
  constructor(player, role = 'assault', slotIndex = 0) {
    super(player.x, player.y, 20, 20);
    this.role = role; // 'assault' | 'aegis'
    this.slotIndex = slotIndex; // 0 (left), 1 (right), 2 (rear)
    this.shootTimer = 0.15 + slotIndex * 0.12;
    this.shootInterval = 0.45;
    this.orbitAngle = slotIndex * ((Math.PI * 2) / 3);
    this.color = role === 'aegis' ? '#38bdf8' : '#00f0ff';
    this.bobTime = slotIndex * 1.5;
  }

  update(dt, player, enemies, bullets, engine, bossBullets = [], perks = {}) {
    this.bobTime += dt * 3.5;

    // Movement & Formation
    if (this.role === 'aegis') {
      // Aegis drone orbits closely around player
      this.orbitAngle += dt * 2.8;
      const orbitDist = 52;
      const targetX = player.x + Math.cos(this.orbitAngle) * orbitDist;
      const targetY = player.y + Math.sin(this.orbitAngle) * orbitDist;
      this.pos.x += (targetX - this.pos.x) * 16 * dt;
      this.pos.y += (targetY - this.pos.y) * 16 * dt;
      this.rotation = this.orbitAngle + Math.PI / 2;

      // Aegis Shield Interception: destroys hostile enemy/boss bullets!
      if (bossBullets && bossBullets.length > 0) {
        const shieldBounds = this.getBounds();
        for (let i = bossBullets.length - 1; i >= 0; i--) {
          const bb = bossBullets[i];
          if (Collision.aabb(shieldBounds, bb.getBounds())) {
            bb.isAlive = false;
            engine.sound.playHit();
            engine.particles.emit(bb.x, bb.y, 8, {
              color: '#38bdf8',
              speed: 120,
              size: 3,
              life: 0.25
            });
          }
        }
      }
    } else {
      // Assault drone wing formation relative to player rotation
      const forwardX = Math.cos(player.rotation);
      const forwardY = Math.sin(player.rotation);
      const perpX = -forwardY;
      const perpY = forwardX;

      let lateralDist = 0;
      let longitudinalDist = 0;

      if (this.slotIndex === 0) {
        lateralDist = -42;
        longitudinalDist = -12 + Math.sin(this.bobTime) * 3;
      } else if (this.slotIndex === 1) {
        lateralDist = 42;
        longitudinalDist = -12 + Math.cos(this.bobTime) * 3;
      } else {
        lateralDist = 0;
        longitudinalDist = -48 + Math.sin(this.bobTime) * 3;
      }

      const targetX = player.x + perpX * lateralDist + forwardX * longitudinalDist;
      const targetY = player.y + perpY * lateralDist + forwardY * longitudinalDist;

      this.pos.x += (targetX - this.pos.x) * 14 * dt;
      this.pos.y += (targetY - this.pos.y) * 14 * dt;
      this.rotation = player.rotation;

      // Thruster micro-particles
      if (Math.random() < 0.35) {
        engine.particles.emit(this.x, this.y, 1, {
          color: '#00f0ff',
          speed: 40,
          size: 2,
          life: 0.2,
          baseAngle: player.rotation + Math.PI,
          spread: 0.4
        });
      }

      // Shooting logic
      const isOvercharged = player.droneOverchargeTimer > 0;
      const isVanguard = perks.synergyVanguardFleet && player.isOverdrive;
      const fireInterval = isOvercharged ? 0.16 : (isVanguard ? 0.25 : this.shootInterval);

      this.shootTimer += dt;
      if (this.shootTimer >= fireInterval) {
        this.shootTimer = 0;
        this.shootAtEnemy(enemies, bullets, engine, perks, isOvercharged);
      }
    }
  }

  shootAtEnemy(enemies, bullets, engine, perks = {}, isOvercharged = false) {
    if (!enemies || enemies.length === 0) return;

    let nearest = null;
    let minDist = 520;

    for (const e of enemies) {
      if (!e.isAlive) continue;
      const d = Math.hypot(e.x - this.x, e.y - this.y);
      if (d < minDist) {
        minDist = d;
        nearest = e;
      }
    }

    if (nearest) {
      const angle = Math.atan2(nearest.y - this.y, nearest.x - this.x);
      const speed = isOvercharged ? 780 : 650;
      const damage = isOvercharged ? 1.4 : 0.75;
      const bulletColor = isOvercharged ? '#ffe600' : (perks.synergyTeslaDrones ? '#38bdf8' : '#00f0ff');

      // Check weapon inheritance (Apex Carrier Matrix)
      const weaponId = (perks.hasApexCarrier && perks.weapon) ? perks.weapon.id : 'vulcan';

      bullets.push(
        new Bullet(this.x, this.y, Math.cos(angle) * speed, Math.sin(angle) * speed, bulletColor, {
          damage: damage,
          scale: isOvercharged ? 1.15 : 0.85,
          weaponType: weaponId === 'railgun' ? 'railgun' : (weaponId === 'rocket' ? 'rocket' : 'vulcan'),
          isRocket: weaponId === 'rocket',
          hasChainLightning: perks.synergyTeslaDrones || false,
          lifetime: 1.4
        })
      );

      engine.sound.playLaser();

      engine.particles.emit(this.x, this.y, 2, {
        color: bulletColor,
        speed: 70,
        size: 2,
        life: 0.12,
        baseAngle: angle
      });
    }
  }

  onCollideEnemy(enemy, engine) {
    // Ramming damage against enemy
    engine.sound.playHit();
    enemy.takeDamage(2, engine);
    engine.particles.emit(this.x, this.y, 10, {
      color: '#00f0ff',
      speed: 120,
      size: 3,
      life: 0.3
    });
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.role === 'aegis') {
      // Aegis Deflector: Glowing hexagonal barrier frame
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.0;

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI) / 3;
        const hx = Math.cos(ang) * 12;
        const hy = Math.sin(ang) * 12;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(14, 116, 144, 0.4)';
      ctx.fill();
      ctx.stroke();

      // Core pulsating blue gem
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Assault Drone: Arrowhead chassis
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = '#00f0ff';
      ctx.fillStyle = '#071520';
      ctx.lineWidth = 1.6;

      ctx.beginPath();
      ctx.moveTo(9, 0);
      ctx.lineTo(-7, -7);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-7, 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Energy Core Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
