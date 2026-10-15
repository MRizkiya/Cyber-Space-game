import { Vector2 } from '../engine/Vector2.js';

/**
 * Base Entity class for all interactive game objects.
 */
export class Entity {
  constructor(x = 0, y = 0, width = 20, height = 20) {
    this.pos = new Vector2(x, y);
    this.vel = new Vector2(0, 0);
    this.width = width;
    this.height = height;
    this.color = '#ffffff';
    this.isAlive = true;
    this.rotation = 0;
  }

  get x() {
    return this.pos.x;
  }

  set x(val) {
    this.pos.x = val;
  }

  get y() {
    return this.pos.y;
  }

  set y(val) {
    this.pos.y = val;
  }

  getBounds() {
    return {
      x: this.pos.x - this.width / 2,
      y: this.pos.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }

  update(dt) {
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }
}
