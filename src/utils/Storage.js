/**
 * LocalStorage wrapper with safe JSON parsing and fallback.
 */
export class Storage {
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(`game_${key}`);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(`game_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(`game_${key}`);
    } catch (e) {
      console.warn("Could not remove from localStorage", e);
    }
  }
}
