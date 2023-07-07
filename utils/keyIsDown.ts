export function keyIsDown(key: Phaser.Input.Keyboard.Key) {
  return Phaser.Input.Keyboard.JustDown(key);
}

export function anyOfTheCursorKeysAreDown(
  cursors: Phaser.Types.Input.Keyboard.CursorKeys,
) {
  return (
    cursors.left.isDown ||
    cursors.right.isDown ||
    cursors.up.isDown ||
    cursors.down.isDown
  );
}
