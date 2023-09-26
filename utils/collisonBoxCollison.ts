/**
 * takes in two collision boxes (e.g. your player and an npc) and returns true if they are colliding
 * @param box1
 * @param box2
 * @returns boolean
 */

export default function areCollisionBoxesColliding(box1: any, box2: any) {
  return Phaser.Geom.Intersects.RectangleToRectangle(
    box1.getBounds(),
    box2.getBounds(),
  );
}
