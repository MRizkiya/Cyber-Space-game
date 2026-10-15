/**
 * Unified input system supporting Keyboard, Mouse, and Touch events.
 */
export class InputManager {
  constructor() {
    this.keys = new Set();
    this.justPressedKeys = new Set();
    this.mouse = {
      x: 0,
      y: 0,
      isDown: false,
      justClicked: false
    };
    this.touch = {
      active: false,
      x: 0,
      y: 0
    };
    this.canvas = null;
  }

  init(canvasElement) {
    this.canvas = canvasElement;

    // Keyboard events
    window.addEventListener('keydown', (e) => {
      if (!this.keys.has(e.code)) {
        this.justPressedKeys.add(e.code);
      }
      this.keys.add(e.code);

      // Prevent scrolling on common game keys
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });

    // Mouse events
    canvasElement.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      this.mouse.x = (e.clientX - rect.x) * scaleX;
      this.mouse.y = (e.clientY - rect.y) * scaleY;
    });

    canvasElement.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      this.mouse.x = (e.clientX - rect.x) * scaleX;
      this.mouse.y = (e.clientY - rect.y) * scaleY;
      this.mouse.isDown = true;
      this.mouse.justClicked = true;
    });

    window.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
    });

    // Touch events for mobile
    const updateTouch = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        this.touch.active = true;
        this.touch.x = (touch.clientX - rect.x) * scaleX;
        this.touch.y = (touch.clientY - rect.y) * scaleY;
        this.mouse.x = this.touch.x;
        this.mouse.y = this.touch.y;
      }
    };

    canvasElement.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.mouse.isDown = true;
      this.mouse.justClicked = true;
      updateTouch(e);
    }, { passive: false });

    canvasElement.addEventListener('touchmove', (e) => {
      e.preventDefault();
      updateTouch(e);
    }, { passive: false });

    canvasElement.addEventListener('touchend', (e) => {
      this.touch.active = false;
      this.mouse.isDown = false;
    });
  }

  isDown(code) {
    return this.keys.has(code);
  }

  isAnyDown(...codes) {
    return codes.some((code) => this.keys.has(code));
  }

  justPressed(code) {
    return this.justPressedKeys.has(code);
  }

  justClicked() {
    return this.mouse.justClicked;
  }

  /**
   * Clears single-frame trigger buffers. Must be called at the end of each engine tick.
   */
  flush() {
    this.justPressedKeys.clear();
    this.mouse.justClicked = false;
  }
}

export const Input = new InputManager();
