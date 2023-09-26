/**
 * checks if passed in key is down
 * @param key
 * @returns boolean
 */

export function keyIsDown(key: Phaser.Input.Keyboard.Key) {
  return Phaser.Input.Keyboard.JustDown(key);
}

/**
 * checks if any of the cursor keys are down
 * @param cursors
 * @returns boolean
 */

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
