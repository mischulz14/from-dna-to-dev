import Phaser from 'phaser';

import { audioNames } from '../data/audioNames';
import { globalAudioManager } from '../src/app';
import { textAppears } from '../utils/textEffects';

export default class ProgressToBootcampScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ProgressToBootcampScene' });
  }

  preload() {
    // this.load.image('end-game', 'assets/images/end-game.png');
    globalAudioManager.switchSoundTo(audioNames.lofiCutscene);
  }

  create() {
    this.revealText();

    let graphics = this.add.graphics();
    graphics.fillStyle(0x000000);
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);

    setTimeout(() => {
      this.input.keyboard.on('keydown-SPACE', () => {
        this.scene.stop('ApartmentScene');
        this.scene.start('BootcampScene');
      });
    }, 1000);
  }

  revealText() {
    const { text1, text2, text3, text4 } = this.getBackgroundText();

    setTimeout(() => {
      textAppears(
        text1,
        '1.6rem',
        'Rainyhearts',
        1000,
        this.cameras.main.centerX / 2 + 10,
        40,
        this,
        400,
      );
    }, 10);

    const delays = [2000, 5000, 8000, 12000, 15000];

    this.time.delayedCall(delays[0], () => {
      textAppears(
        text2,
        '1.6rem',
        'Rainyhearts',
        1000,
        this.cameras.main.centerX / 2 + 10,
        110,
        this,
        500,
      );
    });

    this.time.delayedCall(delays[1], () => {
      textAppears(
        text3,
        '1.6rem',
        'Rainyhearts',
        1000,
        this.cameras.main.centerX / 2 + 10,
        230,
        this,
        500,
      );
    });

    this.time.delayedCall(delays[2], () => {
      textAppears(
        text4,
        '1.6rem',
        'Rainyhearts',
        1000,
        this.cameras.main.centerX / 2 + 10,
        330,
        this,
        500,
      );
    });

    this.time.delayedCall(delays[3], () => {
      const space = textAppears(
        'Press Space to continue',
        '1.6rem',
        'Rainyhearts',
        1000,
        this.cameras.main.centerX / 2 + 65,
        420,
        this,
      ).setAlpha(0);

      this.tweens.add({
        targets: space,
        alpha: 1,
        ease: 'Linear',
        duration: 1000,
        repeat: -1,
        yoyo: true,
      });
    });
  }

  getBackgroundText() {
    const text1 = 'After a lot of thinking you decide to change careers...';
    const text2 =
      'The added resistances to your DNA and the desire to drink coffee all day at home lead you to the decision to become a developer.';
    const text3 =
      'You start learning how to code on your own for 6 months before you decide to apply for a bootcamp.';
    const text4 = 'This is the last step of changing your DNA completely.';

    return { text1, text2, text3, text4 };
  }
}
