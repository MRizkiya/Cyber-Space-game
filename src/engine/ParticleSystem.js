/**
 * Lightweight and performant Particle System for visual effects.
 */
export class Particle {
  constructor(x, y, vx, vy, color, size, life, decay, shape = 'circle') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.maxLife = life;
    this.life = life;
    this.decay = decay;
    this.shape = shape;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= this.decay * dt;
    return this.life > 0;
  }

  render(ctx) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;

    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.5, this.size * alpha), 0, Math.PI * 2);
      ctx.fill();
    } else {
      const s = Math.max(1, this.size * alpha);
      ctx.fillRect(this.x - s / 2, this.y - s / 2, s, s);
    }
    ctx.restore();
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(x, y, count = 10, options = {}) {
    const {
      color = '#00f0ff',
      speed = 100,
      size = 3,
      life = 0.5,
      shape = 'circle',
      spread = Math.PI * 2,
      baseAngle = 0
    } = options;

    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (Math.random() - 0.5) * spread;
      const spd = speed * (0.3 + Math.random() * 0.7);
      const vx = Math.cos(angle) * spd;
      const vy = Math.sin(angle) * spd;
      const pLife = life * (0.7 + Math.random() * 0.6);
      const pSize = size * (0.6 + Math.random() * 0.8);

      this.particles.push(
        new Particle(x, y, vx, vy, color, pSize, pLife, 1, shape)
      );
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const alive = this.particles[i].update(dt);
      if (!alive) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(ctx) {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].render(ctx);
    }
  }

  clear() {
    this.particles = [];
  }
}
