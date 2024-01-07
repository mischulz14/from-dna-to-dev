import Phaser from 'phaser';

import { mostRecentScene } from '../src/app';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init() {
    this.scene.stop(mostRecentScene);
  }

  create() {
    this.cameras.main.setBackgroundColor(0x000000); // Set background color to black

    const gameOverText = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 40,
        'Game Over',
        { fontSize: '40px', color: '#ffffff', fontFamily: 'Rainyhearts' },
      )
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: gameOverText,
      alpha: 1,
      duration: 1000,
      ease: 'Linear',
    });

    this.time.delayedCall(2000, () => {
      const text = this.add
        .text(
          this.cameras.main.centerX,
          this.cameras.main.centerY + 50,
          'Continue from most recent level | Press Space',
          { fontSize: '24px', color: '#ffffff', fontFamily: 'Rainyhearts' },
        )
        .setOrigin(0.5)
        .setAlpha(0);

      this.tweens.add({
        targets: text,
        alpha: 1,
        duration: 1000,
        ease: 'Linear',
        repeat: -1,
        yoyo: true,
      });

      this.input.keyboard.on('keydown-SPACE', () => {
        this.scene.start(mostRecentScene);
      });
    });
  }
}
