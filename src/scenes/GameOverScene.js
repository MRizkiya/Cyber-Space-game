import { Storage } from '../utils/Storage.js';

/**
 * Game Over scene displaying final stats, high score saving, and retry prompt.
 */
export class GameOverScene {
  constructor() {
    this.score = 0;
    this.highScore = 0;
    this.isNewRecord = false;
    this.enemiesDefeated = 0;
    this.pulse = 0;
    this.isEndless = false;
    this.survivalTime = 0;
    this.endlessWave = 1;
    this.isNewBestTime = false;
    this.bestSurvivalTime = 0;
    this.buffCount = 0;
  }

  enter(params = {}) {
    this.score = params.score || 0;
    this.enemiesDefeated = params.enemiesDefeated || 0;
    this.isEndless = !!params.isEndless;
    this.survivalTime = params.survivalTime || 0;
    this.endlessWave = params.endlessWave || 1;
    this.isNewBestTime = !!params.isNewBestTime;
    this.bestSurvivalTime = params.bestSurvivalTime || 0;
    this.buffCount = params.buffCount || 0;

    const previousHigh = Storage.get('high_score', 0);
    if (this.score > previousHigh) {
      this.isNewRecord = true;
      this.highScore = this.score;
      Storage.set('high_score', this.score);
    } else {
      this.isNewRecord = false;
      this.highScore = previousHigh;
    }

    this.engine.sound.playGameOver();
  }

  formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  update(dt) {
    this.pulse += dt * 3;

    const input = this.engine.input;
    if (input.justPressed('KeyM') || input.justPressed('Escape')) {
      this.engine.sound.playClick();
      this.sceneManager.set('menu');
      return;
    }

    if (input.justPressed('Space') || input.justPressed('Enter') || input.justClicked()) {
      this.engine.sound.playClick();
      if (this.isEndless) {
        this.sceneManager.set('game', { isEndless: true });
      } else {
        this.sceneManager.set('game');
      }
    }
  }

  render(ctx) {
    const w = this.engine.width;
    const h = this.engine.height;

    // Dark tinted backdrop
    ctx.fillStyle = 'rgba(11, 15, 25, 0.95)';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.textAlign = 'center';

    if (this.isEndless) {
      // Endless Game Over Banner
      ctx.font = '900 44px "Orbitron", "Outfit", sans-serif';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 25;
      ctx.fillStyle = '#f43f5e';
      ctx.fillText('ENDLESS TERMINATED', w / 2, h / 2 - 130);

      // Survival Record Banner
      if (this.isNewBestTime) {
        ctx.font = '800 18px "Outfit", sans-serif';
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#ffe600';
        ctx.fillText('★ REKOR SURVIVAL BARU TERCIPTA! ★', w / 2, h / 2 - 85);
      }

      // Survival Stats
      ctx.font = '700 24px "Orbitron", sans-serif';
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`WAKTU BERTAHAN: ${this.formatTime(this.survivalTime)}`, w / 2, h / 2 - 45);

      ctx.font = '600 16px "Outfit", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Wave Bertahan: Wave ${this.endlessWave}  •  Rekor Terbaik: ${this.formatTime(this.bestSurvivalTime)}`, w / 2, h / 2 - 15);

      ctx.font = '700 20px "Orbitron", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`TOTAL SCORE: ${this.score}`, w / 2, h / 2 + 20);

      ctx.font = '500 15px "Outfit", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Musuh Dimusnahkan: ${this.enemiesDefeated} unit  •  Buffs: ${this.buffCount} modul`, w / 2, h / 2 + 50);
    } else {
      // Campaign Game Over Title
      ctx.font = '900 48px "Orbitron", "Outfit", sans-serif';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 25;
      ctx.fillStyle = '#ff0055';
      ctx.fillText('MISSION FAILED', w / 2, h / 2 - 120);

      if (this.isNewRecord) {
        ctx.font = '800 20px "Outfit", sans-serif';
        ctx.shadowColor = '#ffe600';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#ffe600';
        ctx.fillText('★ NEW HIGH SCORE RECORD! ★', w / 2, h / 2 - 70);
      }

      ctx.font = '700 28px "Outfit", sans-serif';
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`SCORE: ${this.score}`, w / 2, h / 2 - 20);

      ctx.font = '500 18px "Outfit", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Best Score: ${this.highScore}  •  Enemies Destroyed: ${this.enemiesDefeated}`, w / 2, h / 2 + 20);
    }

    // Restart CTA (Smooth floating pulse using matrix transform)
    ctx.save();
    const ctaX = w / 2;
    const ctaY = h / 2 + 105;
    const scale = 1 + 0.04 * Math.sin(this.pulse);
    ctx.translate(ctaX, ctaY);
    ctx.scale(scale, scale);
    ctx.font = '700 20px "Orbitron", sans-serif';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 15 + 6 * Math.sin(this.pulse);
    ctx.fillStyle = '#00f0ff';
    ctx.fillText('TEKAN [SPACE] COBA LAGI', 0, 0);
    ctx.restore();

    // Back to Menu instruction
    ctx.shadowBlur = 0;
    ctx.font = '600 14px "Outfit", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('[M] KEMBALI KE MENU UTAMA', w / 2, h / 2 + 155);

    ctx.restore();
  }
}
