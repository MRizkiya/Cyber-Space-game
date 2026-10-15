/**
 * 2D Camera supporting smooth follow and screen shake effects.
 */
export class Camera {
  constructor(viewportWidth, viewportHeight) {
    this.x = 0;
    this.y = 0;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;

    // Screen shake variables
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.shakeTimer = 0;
    this.shakeEnabled = true;
  }

  setShakeEnabled(val) {
    this.shakeEnabled = !!val;
    if (!this.shakeEnabled) {
      this.shakeTimer = 0;
    }
  }

  shake(intensity = 8, duration = 0.25) {
    if (!this.shakeEnabled) return;
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.shakeTimer = duration;
  }

  update(dt) {
    if (this.shakeTimer > 0) {
      this.shakeTimer -= dt;
      if (this.shakeTimer < 0) this.shakeTimer = 0;
    }
  }

  apply(ctx) {
    let offsetX = 0;
    let offsetY = 0;

    if (this.shakeTimer > 0) {
      const progress = this.shakeTimer / this.shakeDuration;
      const currentIntensity = this.shakeIntensity * progress;
      offsetX = (Math.random() * 2 - 1) * currentIntensity;
      offsetY = (Math.random() * 2 - 1) * currentIntensity;
    }

    ctx.save();
    ctx.translate(-this.x + offsetX, -this.y + offsetY);
  }

  restore(ctx) {
    ctx.restore();
  }
}
