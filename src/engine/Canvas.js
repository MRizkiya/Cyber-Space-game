/**
 * Canvas manager with crisp rendering and built-in visual drawing helpers.
 */
export class CanvasManager {
  constructor(canvasElement, width = 800, height = 600) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.width = width;
    this.height = height;

    this.canvas.width = width;
    this.canvas.height = height;
  }

  clear(color = '#0b0f19') {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawCircle(x, y, radius, color, glow = null) {
    this.ctx.save();
    if (glow) {
      this.ctx.shadowColor = glow.color || color;
      this.ctx.shadowBlur = glow.blur || 12;
    }
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.restore();
  }

  drawRect(x, y, w, h, color, glow = null) {
    this.ctx.save();
    if (glow) {
      this.ctx.shadowColor = glow.color || color;
      this.ctx.shadowBlur = glow.blur || 12;
    }
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
    this.ctx.restore();
  }

  drawText(text, x, y, options = {}) {
    const {
      font = '16px "Outfit", sans-serif',
      color = '#ffffff',
      align = 'left',
      baseline = 'middle',
      glow = null
    } = options;

    this.ctx.save();
    this.ctx.font = font;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = baseline;
    if (glow) {
      this.ctx.shadowColor = glow.color || color;
      this.ctx.shadowBlur = glow.blur || 10;
    }
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }
}
