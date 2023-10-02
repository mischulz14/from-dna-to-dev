// textEffects

/**
 * This function creates a text object, adds it to the scene and makes it appear with a specified duration
 * @param textContent
 * @param fontSize
 * @param fontFamily
 * @param duration
 * @param x
 * @param y
 * @param scene
 * @returns the text object that was created
 */

export function textAppears(
  textContent: Phaser.GameObjects.Text,
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

/**
 * This function makes the text object you put into it disappear with a specified duration
 * @param text
 * @param duration
 * @param scene
 */

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
