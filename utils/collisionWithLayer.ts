/**
 * Takes in a hitbox and a tilemap layer and returns true if the hitbox collides with any tiles in the layer.
 * @param hitbox
 * @param layer
 * @returns boolean
 */
export default function checkCollisionWithLayer(
  hitbox: Phaser.Geom.Rectangle,
  layer: Phaser.Tilemaps.TilemapLayer,
) {
  const tiles = layer.getTilesWithinWorldXY(
    hitbox.x,
    hitbox.y,
    hitbox.width,
    hitbox.height,
    { isColliding: true },
  );

  for (const tile of tiles) {
    const tileBounds = new Phaser.Geom.Rectangle(
      tile.pixelX,
      tile.pixelY,
      tile.width,
      tile.height,
    );

    if (Phaser.Geom.Intersects.RectangleToRectangle(hitbox, tileBounds)) {
      console.log('collision');
      return true;
    }
  }
  return false;
}
