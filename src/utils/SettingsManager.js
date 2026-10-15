import { Storage } from './Storage.js';

/**
 * Settings Manager handling sound and screen shake toggles with local persistence.
 */
export class SettingsManager {
  static getSound() {
    return Storage.get('setting_sound', true);
  }

  static setSound(val, engine = null) {
    const boolVal = !!val;
    Storage.set('setting_sound', boolVal);
    if (engine && engine.sound) {
      engine.sound.setEnabled(boolVal);
    }
    return boolVal;
  }

  static toggleSound(engine = null) {
    const current = this.getSound();
    return this.setSound(!current, engine);
  }

  static getShake() {
    return Storage.get('setting_shake', true);
  }

  static setShake(val, engine = null) {
    const boolVal = !!val;
    Storage.set('setting_shake', boolVal);
    if (engine && engine.camera) {
      engine.camera.setShakeEnabled(boolVal);
    }
    return boolVal;
  }

  static toggleShake(engine = null) {
    const current = this.getShake();
    return this.setShake(!current, engine);
  }

  static init(engine) {
    if (!engine) return;
    const soundEnabled = this.getSound();
    const shakeEnabled = this.getShake();

    if (engine.sound) {
      engine.sound.setEnabled(soundEnabled);
    }
    if (engine.camera) {
      engine.camera.setShakeEnabled(shakeEnabled);
    }
  }
}
