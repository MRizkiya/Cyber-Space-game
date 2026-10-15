import { Engine } from './engine/Engine.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';
import { UpgradeScene } from './scenes/UpgradeScene.js';
import { StageSelectScene } from './scenes/StageSelectScene.js';
import { SettingsManager } from './utils/SettingsManager.js';

// Wait for DOM
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }

  // Initialize Core Game Engine (800x600 logical internal resolution)
  const engine = new Engine(canvas, 800, 600);

  // Initialize Settings (Sound & Screen Shake)
  SettingsManager.init(engine);

  // Register Scenes
  engine.scenes.add('menu', new MenuScene());
  engine.scenes.add('stageselect', new StageSelectScene());
  engine.scenes.add('game', new GameScene());
  engine.scenes.add('gameover', new GameOverScene());
  engine.scenes.add('victory', new VictoryScene());
  engine.scenes.add('upgrade', new UpgradeScene());

  // Start at the Menu
  engine.scenes.set('menu');

  // Start engine loop
  engine.start();

  // Fullscreen UI
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const canvasContainer = document.querySelector('.canvas-container');
  if (btnFullscreen && canvasContainer) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        canvasContainer.requestFullscreen?.().catch((err) => {
          console.warn('Fullscreen request failed', err);
        });
      } else {
        document.exitFullscreen?.();
      }
    });
  }

  // Initialize Web Audio Context on first user touch/click/key
  const unlockAudio = () => {
    engine.sound.init();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);
});
