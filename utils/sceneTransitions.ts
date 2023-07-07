export function cutsceneTransitionReverse(
  scene: Phaser.Scene,
  transitionRect: Phaser.GameObjects.Rectangle,
) {
  scene.tweens.add({
    targets: transitionRect,
    alpha: { from: 1, to: 0 },
    ease: 'Linear',
    duration: 3000,
    repeat: 0,
  });
}
