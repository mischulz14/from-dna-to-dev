import Phaser from 'phaser';

/**
 * Transitions to a new scene by fading out a rectangle
 * The rectangle has to be created in the scene that calls this function
 * an optional onCompleteFunction can be passed to this function
 * @param scene
 * @param transitionRect
 * @param onCompleteFunction
 */

export function cutsceneTransitionReverse(
  scene: Phaser.Scene,
  transitionRect: Phaser.GameObjects.Rectangle,
  onCompleteFunction?: () => void,
) {
  scene.tweens.add({
    targets: transitionRect,
    alpha: { from: 1, to: 0 },
    ease: 'Linear',
    duration: 3000,
    repeat: 0,
    onComplete: function () {
      onCompleteFunction ? onCompleteFunction() : null;
    },
  });
}
