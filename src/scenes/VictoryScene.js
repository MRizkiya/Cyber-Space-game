import { Storage } from '../utils/Storage.js';

/**
 * Victory Scene displayed after conquering all 5 stages and destroying the Boss.
 */
export class VictoryScene {
  constructor() {
    this.score = 0;
    this.highScore = 0;
    this.isNewRecord = false;
    this.enemiesDefeated = 0;
    this.pulse = 0;
    this.fireworksTimer = 0;
  }

  enter(params = {}) {
    this.score = params.score || 0;
    this.enemiesDefeated = params.enemiesDefeated || 0;

    this.isWorld2Clear = params.isWorld2Clear || false;
    this.isZoneXetaClear = params.isZoneXetaClear || false;
    const previousHigh = Storage.get('high_score', 0);
    if (this.score > previousHigh) {
      this.isNewRecord = true;
      this.highScore = this.score;
      Storage.set('high_score', this.score);
    } else {
      this.isNewRecord = false;
      this.highScore = previousHigh;
    }

    this.engine.sound.playVictory();
  }

  update(dt) {
    this.pulse += dt * 3;

    // Victory celebration firework particles
    this.fireworksTimer += dt;
    if (this.fireworksTimer > 0.35) {
      this.fireworksTimer = 0;
      const rx = Math.random() * this.engine.width;
      const ry = Math.random() * (this.engine.height * 0.6);
      const colors = this.isZoneXetaClear
        ? ['#10b981', '#22c55e', '#84cc16', '#ffe600', '#34d399']
        : ['#00f0ff', '#ffe600', '#00ff88', '#ff0055', '#c084fc'];
      this.engine.particles.emit(rx, ry, 20, {
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 150,
        size: 4,
        life: 0.65
      });
    }

    const input = this.engine.input;
    if (input.justPressed('Space') || input.justPressed('Enter') || input.justClicked()) {
      this.engine.sound.playClick();
      this.sceneManager.set('menu');
    }
  }

  render(ctx) {
    const w = this.engine.width;
    const h = this.engine.height;

    // Elegant cyber dark background
    ctx.fillStyle = 'rgba(7, 10, 20, 0.94)';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.textAlign = 'center';

    // Crown / Victory badge
    ctx.font = '32px sans-serif';
    ctx.fillText(this.isZoneXetaClear ? '🌺' : '👑', w / 2, h / 2 - 140);

    // Title
    ctx.font = '900 46px "Orbitron", "Outfit", sans-serif';
    const titleColor = this.isZoneXetaClear ? '#10b981' : '#00ff88';
    ctx.shadowColor = titleColor;
    ctx.shadowBlur = 25;
    ctx.fillStyle = titleColor;
    const titleText = this.isZoneXetaClear
      ? 'ZONE XETA CONQUERED!'
      : (this.isWorld2Clear ? 'GRAND VICTORY!' : 'SECTOR SECURED!');
    ctx.fillText(titleText, w / 2, h / 2 - 90);

    ctx.font = '600 16px "Outfit", sans-serif';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#e2e8f0';
    const subText = this.isZoneXetaClear
      ? 'YGGDRASIL PRIMORDIAL DIKALAHKAN • SELURUH 15 SEKTOR TUNTAS DITAKLUKKAN!'
      : (this.isWorld2Clear
        ? 'CHRONO MIRAGE DIKALAHKAN • SEMUA 10 STAGE TUNTAS DITAKLUKKAN!'
        : 'TITAN NEXUS DIKALAHKAN • WORLD 2 (STAGE 6 - 10) KINI TERBUKA!');
    ctx.fillText(subText, w / 2, h / 2 - 50);

    // Score
    ctx.font = '700 32px "Orbitron", "Outfit", sans-serif';
    ctx.shadowColor = '#ffe600';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffe600';
    ctx.fillText(`TOTAL SKOR: ${this.score}`, w / 2, h / 2);

    ctx.font = '500 16px "Outfit", sans-serif';
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Enemies Eliminated: ${this.enemiesDefeated}  •  Rekor Tertinggi: ${this.highScore}`, w / 2, h / 2 + 40);

    // Play again prompt
    ctx.save();
    const ctaX = w / 2;
    const ctaY = h / 2 + 115;
    const scale = 1 + 0.05 * Math.sin(this.pulse);
    ctx.translate(ctaX, ctaY);
    ctx.scale(scale, scale);
    ctx.font = '700 22px "Outfit", sans-serif';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 16 + 6 * Math.sin(this.pulse);
    ctx.fillStyle = '#00f0ff';
    ctx.fillText('TEKAN [SPACE] UNTUK KEMBALI KE MENU', 0, 0);
    ctx.restore();

    ctx.restore();
  }
}
