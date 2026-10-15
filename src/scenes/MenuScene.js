import { Storage } from '../utils/Storage.js';
import { UpgradeManager, WEAPON_DEFINITIONS } from '../utils/UpgradeManager.js';
import { SettingsModal } from '../utils/SettingsModal.js';

/**
 * Main Menu scene welcoming the player with cyber aesthetics, start game & upgrade buttons.
 */
export class MenuScene {
  constructor() {
    this.highScore = 0;
    this.pulse = 0;
    this.bgStars = [];
    this.showingSettings = false;
  }

  enter() {
    this.highScore = Storage.get('high_score', 0);
    this.endlessBestTime = Storage.get('endless_best_time', 0);
    this.pulse = 0;
    this.showingSettings = false;

    // Generate background stars
    if (this.bgStars.length === 0) {
      for (let i = 0; i < 60; i++) {
        this.bgStars.push({
          x: Math.random() * this.engine.width,
          y: Math.random() * this.engine.height,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 20 + 10,
          brightness: Math.random() * 0.7 + 0.3
        });
      }
    }
  }

  update(dt) {
    this.pulse += dt * 3;
    const input = this.engine.input;

    // Drift background stars
    for (const star of this.bgStars) {
      star.y += star.speed * dt;
      if (star.y > this.engine.height) {
        star.y = 0;
        star.x = Math.random() * this.engine.width;
      }
    }

    // Handle Settings modal
    if (this.showingSettings) {
      SettingsModal.update(input, this.engine, () => {
        this.showingSettings = false;
      });
      return;
    }

    const mx = input.mouse.x;
    const my = input.mouse.y;
    const clicked = input.justClicked();

    // Check Button Coordinates (4 Balanced Action Buttons)
    const w = this.engine.width;
    const btnW = 148;
    const btnH = 46;
    const gap = 12;
    const startX = (w - (btnW * 4 + gap * 3)) / 2;

    const playBtn = { x: startX, y: 340, w: btnW, h: btnH };
    const endlessBtn = { x: startX + btnW + gap, y: 340, w: btnW, h: btnH };
    const upgradeBtn = { x: startX + (btnW + gap) * 2, y: 340, w: btnW, h: btnH };
    const settingBtn = { x: startX + (btnW + gap) * 3, y: 340, w: btnW, h: btnH };

    // Keyboard Shortcuts
    if (input.justPressed('Space') || input.justPressed('Enter')) {
      this.engine.sound.playClick();
      this.sceneManager.set('stageselect');
      return;
    }

    if (input.justPressed('KeyE')) {
      this.engine.sound.playClick();
      this.sceneManager.set('game', { isEndless: true });
      return;
    }

    if (input.justPressed('KeyU')) {
      this.engine.sound.playClick();
      this.sceneManager.set('upgrade');
      return;
    }

    if (input.justPressed('KeyO') || input.justPressed('KeyS')) {
      this.engine.sound.playClick();
      this.showingSettings = true;
      return;
    }

    // Mouse Clicks on buttons
    if (clicked) {
      if (mx >= playBtn.x && mx <= playBtn.x + playBtn.w && my >= playBtn.y && my <= playBtn.y + playBtn.h) {
        this.engine.sound.playClick();
        this.sceneManager.set('stageselect');
      } else if (mx >= endlessBtn.x && mx <= endlessBtn.x + endlessBtn.w && my >= endlessBtn.y && my <= endlessBtn.y + endlessBtn.h) {
        this.engine.sound.playClick();
        this.sceneManager.set('game', { isEndless: true });
      } else if (mx >= upgradeBtn.x && mx <= upgradeBtn.x + upgradeBtn.w && my >= upgradeBtn.y && my <= upgradeBtn.y + upgradeBtn.h) {
        this.engine.sound.playClick();
        this.sceneManager.set('upgrade');
      } else if (mx >= settingBtn.x && mx <= settingBtn.x + settingBtn.w && my >= settingBtn.y && my <= settingBtn.y + settingBtn.h) {
        this.engine.sound.playClick();
        this.showingSettings = true;
      }
    }
  }

  formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  render(ctx) {
    const w = this.engine.width;
    const h = this.engine.height;

    // Draw starfield
    ctx.fillStyle = '#ffffff';
    for (const star of this.bgStars) {
      ctx.globalAlpha = star.brightness;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1.0;

    // Title Glowing Banner
    ctx.save();
    ctx.textAlign = 'center';

    // Game Logo
    ctx.font = '900 48px "Orbitron", "Outfit", sans-serif';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 25;
    ctx.fillStyle = '#00f0ff';
    ctx.fillText('CYBER DEFENDER', w / 2, h / 2 - 130);

    // Subtitle
    ctx.font = '500 16px "Outfit", sans-serif';
    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('MODULAR 2D WEB GAME ENGINE', w / 2, h / 2 - 85);

    // High Score Badge & Endless Best Time
    ctx.font = '600 15px "Orbitron", sans-serif';
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffe600';
    if (this.endlessBestTime > 0) {
      ctx.fillText(`★ SKOR TERTINGGI: ${this.highScore}  •  ♾️ REKOR SURVIVAL: ${this.formatTime(this.endlessBestTime)} ★`, w / 2, h / 2 - 42);
    } else {
      ctx.fillText(`★ SKOR TERTINGGI: ${this.highScore} ★`, w / 2, h / 2 - 42);
    }

    // Current Equipped Weapon & Cores Status
    const weapon = UpgradeManager.getEquippedWeapon();
    const techPoints = UpgradeManager.getTechPoints();

    ctx.font = '700 13px "Orbitron", sans-serif';
    ctx.fillStyle = weapon.color || '#38bdf8';
    ctx.shadowColor = weapon.color || '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.fillText(`SENJATA AKTIF: ${weapon.name}`, w / 2, h / 2 - 14);

    ctx.font = '600 12px "Outfit", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.shadowBlur = 0;
    ctx.fillText(`${weapon.subtitle}  •  💎 ${techPoints} Tech Cores Siap Pakai`, w / 2, h / 2 + 6);

    // Four Interactive Menu Buttons
    const input = this.engine.input;
    const mx = input.mouse.x;
    const my = input.mouse.y;

    const btnW = 148;
    const btnH = 46;
    const gap = 12;
    const startX = (w - (btnW * 4 + gap * 3)) / 2;

    const playBtn = { x: startX, y: 340, w: btnW, h: btnH };
    const endlessBtn = { x: startX + btnW + gap, y: 340, w: btnW, h: btnH };
    const upgradeBtn = { x: startX + (btnW + gap) * 2, y: 340, w: btnW, h: btnH };
    const settingBtn = { x: startX + (btnW + gap) * 3, y: 340, w: btnW, h: btnH };

    const hoverPlay = mx >= playBtn.x && mx <= playBtn.x + playBtn.w && my >= playBtn.y && my <= playBtn.y + playBtn.h;
    const hoverEndless = mx >= endlessBtn.x && mx <= endlessBtn.x + endlessBtn.w && my >= endlessBtn.y && my <= endlessBtn.y + endlessBtn.h;
    const hoverUpgr = mx >= upgradeBtn.x && mx <= upgradeBtn.x + upgradeBtn.w && my >= upgradeBtn.y && my <= upgradeBtn.y + upgradeBtn.h;
    const hoverSetting = mx >= settingBtn.x && mx <= settingBtn.x + settingBtn.w && my >= settingBtn.y && my <= settingBtn.y + settingBtn.h;

    // 1. Play Button (Campaign Stages 1-10)
    ctx.save();
    ctx.fillStyle = hoverPlay ? 'rgba(0, 240, 255, 0.3)' : 'rgba(0, 240, 255, 0.15)';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = hoverPlay ? 2.5 : 1.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = hoverPlay ? 18 : 8;
    ctx.fillRect(playBtn.x, playBtn.y, playBtn.w, playBtn.h);
    ctx.strokeRect(playBtn.x, playBtn.y, playBtn.w, playBtn.h);

    ctx.font = '800 13px "Orbitron", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('🎮 KAMPANYE', playBtn.x + playBtn.w / 2, playBtn.y + 29);
    ctx.restore();

    // 2. Endless Button (Infinite Survival)
    ctx.save();
    ctx.fillStyle = hoverEndless ? 'rgba(244, 63, 94, 0.32)' : 'rgba(244, 63, 94, 0.15)';
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = hoverEndless ? 2.5 : 1.5;
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = hoverEndless ? 20 : 8;
    ctx.fillRect(endlessBtn.x, endlessBtn.y, endlessBtn.w, endlessBtn.h);
    ctx.strokeRect(endlessBtn.x, endlessBtn.y, endlessBtn.w, endlessBtn.h);

    ctx.font = '800 13px "Orbitron", sans-serif';
    ctx.fillStyle = '#fb7185';
    ctx.fillText('♾️ ENDLESS', endlessBtn.x + endlessBtn.w / 2, endlessBtn.y + 29);
    ctx.restore();

    // 3. Upgrade Button
    ctx.save();
    ctx.fillStyle = hoverUpgr ? 'rgba(255, 230, 0, 0.3)' : 'rgba(255, 230, 0, 0.15)';
    ctx.strokeStyle = '#ffe600';
    ctx.lineWidth = hoverUpgr ? 2.5 : 1.5;
    ctx.shadowColor = '#ffe600';
    ctx.shadowBlur = hoverUpgr ? 18 : 8;
    ctx.fillRect(upgradeBtn.x, upgradeBtn.y, upgradeBtn.w, upgradeBtn.h);
    ctx.strokeRect(upgradeBtn.x, upgradeBtn.y, upgradeBtn.w, upgradeBtn.h);

    ctx.font = '800 13px "Orbitron", sans-serif';
    ctx.fillStyle = '#ffe600';
    ctx.fillText('⚡ UPGRADE', upgradeBtn.x + upgradeBtn.w / 2, upgradeBtn.y + 29);
    ctx.restore();

    // 4. Setting Button
    ctx.save();
    ctx.fillStyle = hoverSetting ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.15)';
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = hoverSetting ? 2.5 : 1.5;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = hoverSetting ? 18 : 8;
    ctx.fillRect(settingBtn.x, settingBtn.y, settingBtn.w, settingBtn.h);
    ctx.strokeRect(settingBtn.x, settingBtn.y, settingBtn.w, settingBtn.h);

    ctx.font = '800 13px "Orbitron", sans-serif';
    ctx.fillStyle = '#e9d5ff';
    ctx.fillText('⚙️ SETTING', settingBtn.x + settingBtn.w / 2, settingBtn.y + 29);
    ctx.restore();

    // Hotkey Hint
    ctx.shadowBlur = 0;
    ctx.font = '600 12.5px "Outfit", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('[SPACE] Kampanye  •  [E] Endless  •  [U] Upgrade  •  [O] Setting', w / 2, 425);

    // Tech Cores status
    ctx.font = '600 13px "Outfit", sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.fillText(`Tersedia: ${techPoints} Tech Cores untuk Upgrade`, w / 2, 452);

    // Controls Guide box
    ctx.shadowBlur = 0;
    ctx.font = '400 14px "Outfit", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('KONTROL: [W A S D / Arrow] Gerak  •  [Mouse / Space] Tembak  •  [Q] Skill Taktis  •  [P] Jeda', w / 2, h / 2 + 205);

    ctx.restore();

    // Render Settings Modal overlay if active
    if (this.showingSettings) {
      SettingsModal.render(ctx, w, h, this.engine);
    }
  }
}
