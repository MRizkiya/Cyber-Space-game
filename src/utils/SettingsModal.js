import { SettingsManager } from './SettingsManager.js';

/**
 * Reusable Settings Modal component for toggling Sound & Screen Shake.
 */
export class SettingsModal {
  static update(input, engine, onClose) {
    if (input.justPressed('Escape') || input.justPressed('Enter') || input.justPressed('KeyO')) {
      if (engine.sound) engine.sound.playClick();
      onClose();
      return true;
    }

    const mx = input.mouse.x;
    const my = input.mouse.y;
    const clicked = input.justClicked();

    const w = engine.width;
    const h = engine.height;
    const modalW = 520;
    const modalH = 340;
    const modalX = (w - modalW) / 2;
    const modalY = (h - modalH) / 2;

    const soundBtn = { x: modalX + modalW - 145, y: modalY + 98, w: 115, h: 36 };
    const shakeBtn = { x: modalX + modalW - 145, y: modalY + 174, w: 115, h: 36 };
    const closeBtn = { x: w / 2 - 90, y: modalY + modalH - 58, w: 180, h: 40 };

    if (clicked) {
      // Toggle Sound
      if (mx >= soundBtn.x && mx <= soundBtn.x + soundBtn.w && my >= soundBtn.y && my <= soundBtn.y + soundBtn.h) {
        SettingsManager.toggleSound(engine);
        if (engine.sound) engine.sound.playClick();
        return true;
      }

      // Toggle Screen Shake
      if (mx >= shakeBtn.x && mx <= shakeBtn.x + shakeBtn.w && my >= shakeBtn.y && my <= shakeBtn.y + shakeBtn.h) {
        SettingsManager.toggleShake(engine);
        if (engine.sound) engine.sound.playClick();
        return true;
      }

      // Close Button
      if (mx >= closeBtn.x && mx <= closeBtn.x + closeBtn.w && my >= closeBtn.y && my <= closeBtn.y + closeBtn.h) {
        if (engine.sound) engine.sound.playClick();
        onClose();
        return true;
      }

      // Click outside modal closes it
      if (mx < modalX || mx > modalX + modalW || my < modalY || my > modalY + modalH) {
        if (engine.sound) engine.sound.playClick();
        onClose();
        return true;
      }
    }

    return false;
  }

  static render(ctx, w, h, engine) {
    ctx.save();

    // 1. Semi-transparent backdrop blur vignette
    ctx.fillStyle = 'rgba(5, 8, 16, 0.90)';
    ctx.fillRect(0, 0, w, h);

    // 2. Modal Container
    const modalW = 520;
    const modalH = 340;
    const modalX = (w - modalW) / 2;
    const modalY = (h - modalH) / 2;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 18;
    ctx.fillRect(modalX, modalY, modalW, modalH);
    ctx.strokeRect(modalX, modalY, modalW, modalH);

    // Corner cyber accents
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const size = 12;
    ctx.moveTo(modalX, modalY + size); ctx.lineTo(modalX, modalY); ctx.lineTo(modalX + size, modalY);
    ctx.moveTo(modalX + modalW - size, modalY); ctx.lineTo(modalX + modalW, modalY); ctx.lineTo(modalX + modalW, modalY + size);
    ctx.moveTo(modalX, modalY + modalH - size); ctx.lineTo(modalX, modalY + modalH); ctx.lineTo(modalX + size, modalY + modalH);
    ctx.moveTo(modalX + modalW - size, modalY + modalH); ctx.lineTo(modalX + modalW, modalY + modalH); ctx.lineTo(modalX + modalW, modalY + modalH - size);
    ctx.stroke();

    // 3. Header
    ctx.textAlign = 'center';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 12;
    ctx.font = '900 22px "Orbitron", sans-serif';
    ctx.fillStyle = '#00f0ff';
    ctx.fillText('⚙️ PENGATURAN SISTEM', w / 2, modalY + 42);

    ctx.shadowBlur = 0;
    ctx.font = '500 13px "Outfit", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Konfigurasi audio dan efek kenyamanan bermain', w / 2, modalY + 66);

    const isSoundOn = SettingsManager.getSound();
    const isShakeOn = SettingsManager.getShake();
    const input = engine.input;
    const mx = input.mouse.x;
    const my = input.mouse.y;

    // 4. Option 1: Suara (SFX)
    const row1Y = modalY + 98;
    ctx.textAlign = 'left';
    ctx.font = '700 15px "Orbitron", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('EFEK SUARA (AUDIO)', modalX + 32, row1Y + 16);

    ctx.font = '400 12px "Outfit", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Suara tembakan, ledakan, dan musik retro', modalX + 32, row1Y + 34);

    const soundBtn = { x: modalX + modalW - 145, y: row1Y, w: 115, h: 36 };
    const hovSound = mx >= soundBtn.x && mx <= soundBtn.x + soundBtn.w && my >= soundBtn.y && my <= soundBtn.y + soundBtn.h;

    ctx.save();
    ctx.fillStyle = isSoundOn ? (hovSound ? 'rgba(0, 240, 255, 0.35)' : 'rgba(0, 240, 255, 0.20)') : (hovSound ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.15)');
    ctx.strokeStyle = isSoundOn ? '#00f0ff' : '#ef4444';
    ctx.lineWidth = hovSound ? 2 : 1.2;
    ctx.shadowColor = isSoundOn ? '#00f0ff' : '#ef4444';
    ctx.shadowBlur = hovSound ? 10 : 4;
    ctx.fillRect(soundBtn.x, soundBtn.y, soundBtn.w, soundBtn.h);
    ctx.strokeRect(soundBtn.x, soundBtn.y, soundBtn.w, soundBtn.h);

    ctx.textAlign = 'center';
    ctx.font = '800 12px "Orbitron", sans-serif';
    ctx.fillStyle = isSoundOn ? '#ffffff' : '#fca5a5';
    ctx.fillText(isSoundOn ? 'AKTIF 🔊' : 'MUTE 🔇', soundBtn.x + soundBtn.w / 2, soundBtn.y + 22);
    ctx.restore();

    // Line Divider
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(modalX + 25, modalY + 155);
    ctx.lineTo(modalX + modalW - 25, modalY + 155);
    ctx.stroke();

    // 5. Option 2: Getar Layar (Shake)
    const row2Y = modalY + 174;
    ctx.textAlign = 'left';
    ctx.font = '700 15px "Orbitron", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('GETAR LAYAR (SHAKE)', modalX + 32, row2Y + 16);

    ctx.font = '400 12px "Outfit", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Hentakan kamera saat ledakan & tembakan kuat', modalX + 32, row2Y + 34);

    const shakeBtn = { x: modalX + modalW - 145, y: row2Y, w: 115, h: 36 };
    const hovShake = mx >= shakeBtn.x && mx <= shakeBtn.x + shakeBtn.w && my >= shakeBtn.y && my <= shakeBtn.y + shakeBtn.h;

    ctx.save();
    ctx.fillStyle = isShakeOn ? (hovShake ? 'rgba(0, 240, 255, 0.35)' : 'rgba(0, 240, 255, 0.20)') : (hovShake ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.15)');
    ctx.strokeStyle = isShakeOn ? '#00f0ff' : '#ef4444';
    ctx.lineWidth = hovShake ? 2 : 1.2;
    ctx.shadowColor = isShakeOn ? '#00f0ff' : '#ef4444';
    ctx.shadowBlur = hovShake ? 10 : 4;
    ctx.fillRect(shakeBtn.x, shakeBtn.y, shakeBtn.w, shakeBtn.h);
    ctx.strokeRect(shakeBtn.x, shakeBtn.y, shakeBtn.w, shakeBtn.h);

    ctx.textAlign = 'center';
    ctx.font = '800 12px "Orbitron", sans-serif';
    ctx.fillStyle = isShakeOn ? '#ffffff' : '#fca5a5';
    ctx.fillText(isShakeOn ? 'AKTIF 📳' : 'OFF ❌', shakeBtn.x + shakeBtn.w / 2, shakeBtn.y + 22);
    ctx.restore();

    // 6. Close Button
    const closeBtn = { x: w / 2 - 90, y: modalY + modalH - 58, w: 180, h: 40 };
    const hovClose = mx >= closeBtn.x && mx <= closeBtn.x + closeBtn.w && my >= closeBtn.y && my <= closeBtn.y + closeBtn.h;

    ctx.save();
    ctx.fillStyle = hovClose ? 'rgba(0, 240, 255, 0.30)' : 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = hovClose ? 2 : 1.2;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = hovClose ? 14 : 4;
    ctx.fillRect(closeBtn.x, closeBtn.y, closeBtn.w, closeBtn.h);
    ctx.strokeRect(closeBtn.x, closeBtn.y, closeBtn.w, closeBtn.h);

    ctx.textAlign = 'center';
    ctx.font = '800 13px "Orbitron", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('SIMPAN & TUTUP', closeBtn.x + closeBtn.w / 2, closeBtn.y + 24);
    ctx.restore();

    ctx.restore();
  }
}
