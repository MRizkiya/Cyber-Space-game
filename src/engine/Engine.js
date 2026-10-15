import { CanvasManager } from './Canvas.js';
import { Input } from './Input.js';
import { Sound } from './Audio.js';
import { Camera } from './Camera.js';
import { SceneManager } from './SceneManager.js';
import { ParticleSystem } from './ParticleSystem.js';

/**
 * Core Game Engine orchestrating loop, scenes, rendering, and inputs.
 */
export class Engine {
  constructor(canvasElement, width = 800, height = 600) {
    this.canvasManager = new CanvasManager(canvasElement, width, height);
    this.camera = new Camera(width, height);
    this.particles = new ParticleSystem();
    this.scenes = new SceneManager(this);
    this.input = Input;
    this.sound = Sound;

    this.width = width;
    this.height = height;

    this.lastTime = 0;
    this.running = false;
    this.isPaused = false;
    this.fps = 60;
    this.fpsTimer = 0;
    this.frameCount = 0;

    // Initialize inputs
    this.input.init(canvasElement);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    this.running = false;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  loop(currentTime) {
    if (!this.running) return;

    let dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Safety clamp dt to avoid physics spiral when tab is hidden
    if (dt > 0.1) dt = 0.1;

    // Calculate FPS
    this.frameCount++;
    this.fpsTimer += dt;
    if (this.fpsTimer >= 1.0) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.fpsTimer = 0;
    }

    if (!this.isPaused) {
      this.update(dt);
    }

    this.render();

    // Reset single-frame input triggers
    this.input.flush();

    requestAnimationFrame(this.loop.bind(this));
  }

  update(dt) {
    this.camera.update(dt);
    this.particles.update(dt);
    this.scenes.update(dt);
  }

  render() {
    const ctx = this.canvasManager.ctx;
    this.canvasManager.clear();

    // Apply camera transformation
    this.camera.apply(ctx);

    // Render current scene
    this.scenes.render(ctx);

    // Render particles
    this.particles.render(ctx);

    // Restore camera
    this.camera.restore(ctx);
  }
}
