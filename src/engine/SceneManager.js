/**
 * Scene manager for transitioning between game states (Menu, Playing, GameOver).
 */
export class SceneManager {
  constructor(engine) {
    this.engine = engine;
    this.scenes = new Map();
    this.currentScene = null;
    this.currentSceneName = '';
  }

  add(name, sceneInstance) {
    sceneInstance.sceneManager = this;
    sceneInstance.engine = this.engine;
    this.scenes.set(name, sceneInstance);
  }

  set(name, params = {}) {
    if (!this.scenes.has(name)) {
      console.error(`Scene "${name}" not found!`);
      return;
    }

    if (this.currentScene && typeof this.currentScene.exit === 'function') {
      this.currentScene.exit();
    }

    this.currentSceneName = name;
    this.currentScene = this.scenes.get(name);

    if (typeof this.currentScene.enter === 'function') {
      this.currentScene.enter(params);
    }
  }

  update(dt) {
    if (this.currentScene && typeof this.currentScene.update === 'function') {
      this.currentScene.update(dt);
    }
  }

  render(ctx) {
    if (this.currentScene && typeof this.currentScene.render === 'function') {
      this.currentScene.render(ctx);
    }
  }
}
