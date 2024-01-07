import Phaser from 'phaser';

import { audioNames } from '../data/audioNames';
import { globalAudioManager } from '../src/app';
import { textAppears } from '../utils/textEffects';

export default class EndGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndGameScene' });
    console.log('EndGameScene');
  }

  init() {
    console.log('init endgame');
  }

  preload() {
    // this.load.image('end-game', 'assets/images/end-game.png');
    globalAudioManager.switchSoundTo(audioNames.lofiCutscene);
  }

  create() {
    this.revealText();

    let graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 0.4);
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);

    setTimeout(() => {
      this.input.keyboard.on('keydown-SPACE', () => {
        this.scene.start('CreditsScene');
      });
    }, 1000);
  }

  revealText() {
    const { text1, text2, text3, text4 } = this.getBackgroundText();

    setTimeout(() => {
      textAppears(
        text1,
        '2.2rem',
        'Rainyhearts',
        1000,
        this.cameras.main.centerX / 2 + 65,
        20,
        this,
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
        70,
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
        200,
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
        300,
        this,
        500,
      );
    });

    this.time.delayedCall(delays[3], () => {
      const space = textAppears(
        'Press Space to see the credits',
        '1.6rem',
        'Rainyhearts',
        1000,
        this.cameras.main.centerX / 2 + 35,
        400,
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
    const text1 = 'You finally did it...';
    const text2 =
      'You added stress resistance, near immunity to sleep deprivation, a lot of coffee and the will to push through to your DNA.';
    const text3 =
      'You conquered a new profession and completed an exhausting bootcamp in the process.';
    const text4 =
      "You are now a Fullstack Developer. Congratulations! You've earned it.";

    return { text1, text2, text3, text4 };
  }
}
