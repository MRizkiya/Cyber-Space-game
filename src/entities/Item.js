import { Entity } from './Entity.js';

/**
 * Collectible Item entity with magnetic attraction to player.
 * Types:
 * - 'core': Rare Tech Upgrade Core (Golden rotating energy matrix)
 * - 'heal': Health repair nano-pack (Emerald plus icon)
 * - 'gem': Cyber score crystal (Cyan diamond gem)
 */
export class Item extends Entity {
  constructor(x, y, type = 'gem') {
    super(x, y, 16, 16);
    this.type = type; // 'gem', 'heal', or 'core'
    if (type === 'heal') {
      this.color = '#00ff88';
    } else if (type === 'core') {
      this.color = '#ffe600';
    } else {
      this.color = '#38bdf8'; // Cyan score gem
    }

    this.lifetime = 14.0; // Despawn timer
    this.bobTime = Math.random() * Math.PI * 2;
    this.magnetRadius = 140;
  }

  update(dt, player) {
    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.isAlive = false;
      return;
    }

    this.bobTime += dt * 4;

    // Magnetic pull towards player
    if (player && player.isAlive) {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < this.magnetRadius) {
        const pullSpeed = (1 - dist / this.magnetRadius) * 290;
        this.vel.x = (dx / dist) * pullSpeed;
        this.vel.y = (dy / dist) * pullSpeed;
      } else {
        this.vel.x *= 0.9;
        this.vel.y *= 0.9;
      }
    }

    super.update(dt);
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y + Math.sin(this.bobTime) * 3);

    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.type === 'core' ? 16 : 10;
    ctx.fillStyle = this.color;

    if (this.type === 'heal') {
      // Cross / Plus icon
      const s = 4.5;
      ctx.fillRect(-s * 2, -s / 2, s * 4, s);
      ctx.fillRect(-s / 2, -s * 2, s, s * 4);
    } else if (this.type === 'core') {
      // Rotating High-Tech Golden Energy Core
      ctx.rotate(this.bobTime * 1.5);

      // Outer golden hexagon/diamond ring
      ctx.strokeStyle = '#ffe600';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const hx = Math.cos(a) * 8;
        const hy = Math.sin(a) * 8;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();

      // Glowing white inner core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Core circuit cross dots
      ctx.fillStyle = '#ffe600';
      ctx.fillRect(-1.5, -9, 3, 2);
      ctx.fillRect(-1.5, 7, 3, 2);
      ctx.fillRect(-9, -1.5, 2, 3);
      ctx.fillRect(7, -1.5, 2, 3);
    } else {
      // Rotating cyan diamond crystal gem
      ctx.rotate(this.bobTime * 0.8);
      ctx.beginPath();
      ctx.moveTo(0, -7);
      ctx.lineTo(6, 0);
      ctx.lineTo(0, 7);
      ctx.lineTo(-6, 0);
      ctx.closePath();
      ctx.fill();

      // Gem inner highlight
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.moveTo(0, -4);
      ctx.lineTo(3, 0);
      ctx.lineTo(0, 4);
      ctx.lineTo(-3, 0);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }
}
