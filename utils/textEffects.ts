// textEffects

export function textAppears(
  textContent: string,
  fontSize,
  fontFamily,
  duration,
  x,
  y,
  scene,
) {
  const text = scene.add.text(x, y, textContent, {
    fontSize: fontSize,
    fontFamily: fontFamily,
    color: '#fff',
    name: textContent,
  });

  text.setAlpha(0);

  scene.tweens.add({
    targets: text,
    alpha: 1,
    duration: duration,
    ease: 'Linear',
    repeat: 0,
    yoyo: false,
  });

  return text;
}

export function textDisappears(
  text: Phaser.GameObjects.Text,
  duration: number,
  scene: Phaser.Scene,
) {
  scene.tweens.add({
    targets: text,
    alpha: 0,
    duration: duration,
    ease: 'Linear',
    repeat: 0,
    yoyo: false,
    onComplete: function () {
      text.destroy(); // Destroys the text object once the animation is complete
    },
  });
}
