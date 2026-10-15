/**
 * Collision detection helpers for 2D games
 */
export class Collision {
  /**
   * Axis-Aligned Bounding Box (AABB) intersection check
   */
  static aabb(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  /**
   * Circle to Circle collision check
   */
  static circleCircle(c1, c2) {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const distSq = dx * dx + dy * dy;
    const radSum = (c1.radius || c1.width / 2) + (c2.radius || c2.width / 2);
    return distSq < radSum * radSum;
  }

  /**
   * Point in Rect check
   */
  static pointInRect(px, py, rect) {
    return (
      px >= rect.x &&
      px <= rect.x + rect.width &&
      py >= rect.y &&
      py <= rect.y + rect.height
    );
  }
}
