export default function areCollisionBoxesColliding(box1: any, box2: any) {
  return Phaser.Geom.Intersects.RectangleToRectangle(
    box1.getBounds(),
    box2.getBounds(),
  );
}
