import { audioNames } from '../data/audioNames';
import { cutSceneAudioNames } from '../data/cutSceneSprites';
import { globalAudioManager, isMobileScreen } from '../src/app';
import { textAppears } from '../utils/textEffects';

export default class StartScene extends Phaser.Scene {
  dna: Phaser.GameObjects.Sprite;
  text: Phaser.GameObjects.Text;
  hasContinuedToBackstory: boolean;
  introSceneSound: Phaser.Sound.BaseSound;
  audioFinished: boolean;
  audioIsStillPlaying: boolean;
  canContinueToNextScene: boolean;

  constructor() {
    super({ key: 'StartScene' });
    this.hasContinuedToBackstory = false;
    this.audioFinished = false;
    this.audioIsStillPlaying = false;
    this.canContinueToNextScene = false;
  }

  preload() {
    // Load the image that will be used for the background
    this.load.image('background', 'assets/dnatodev.png');
    this.load.spritesheet('dna', 'assets/dna.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('codebrackets', 'assets/codebrackets.png', {
      frameWidth: 64,
      frameHeight: 32,
    });
  }

  create() {
    globalAudioManager.switchSoundTo(audioNames.lofiCutscene);
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.anims.create({
      key: 'dna-spin',
      frames: this.anims.generateFrameNumbers('dna', {
        start: 0,
        end: 19,
      }),
      frameRate: 15,
      repeat: -1,
    });
    // Create the animation for the DNA
    const dna = this.add.sprite(530, 140, 'dna').setScale(5).play('dna-spin');

    this.anims.create({
      key: 'codebrackets-pop',
      frames: this.anims.generateFrameNumbers('codebrackets', {
        start: 0,
        end: 26,
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.text = this.add.text(
      230,
      400,
      isMobileScreen ? 'Tap to continue' : 'Press any key to continue',
      {
        fontSize: '2rem',
        fontFamily: 'Rainyhearts',
        fontStyle: 'bold',
        color: '#fff',
      },
    );

    const codebrackets = this.add
      .sprite(280, 300, 'codebrackets')
      .setScale(2)
      .play('codebrackets-pop');

    // when the user presses start, start the first level
    this.input.keyboard.on('keydown', () => {
      this.text.setVisible(false);
      dna.setVisible(false);
      codebrackets.setVisible(false);
      background.setVisible(false);
      this.hasContinuedToBackstory = true;

      this.revealText();
    });

    // mobile controls
    this.input.on('pointerdown', () => {
      if (!isMobileScreen) return;
      if (this.hasContinuedToBackstory && this.canContinueToNextScene) {
        this.scene.start('DNAScene');
        return;
      }
      this.text.setVisible(false);
      dna.setVisible(false);
      codebrackets.setVisible(false);
      background.setVisible(false);
      this.hasContinuedToBackstory = true;

      this.revealText();
    });

    // on enter key, start the first level
    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.hasContinuedToBackstory && this.canContinueToNextScene) {
        this.scene.start('DNAScene');
      }
    });
  }

  progressToNextSection() {
    this.audioFinished = true;

    const text = this.add.text(
      300,
      465,
      isMobileScreen ? 'Press Space to continue' : 'Tap to continue',
      {
        fontSize: '1.3rem',
        fontFamily: 'Rainyhearts',
        fontStyle: 'bold',
        color: '#fff',
      },
    );

    this.tweens.add({
      targets: text,
      alpha: 0,
      duration: 1000,
      ease: 'Linear',
      repeat: -1,
      yoyo: true,
    });
  }

  revealText() {
    const { text1, text2, text3, text4 } = getBackgroundText();

    setTimeout(() => {
      textAppears(
        text1,
        '2rem',
        'Rainyhearts',
        1000,
        this.cameras.main.centerX / 2 - 10,
        30,
        this,
        400,
      );
    }, 10);

    const delays = [3000, 8000, 14000, 18000];

    this.time.delayedCall(delays[0], () => {
      textAppears(
        text2,
        '1.6rem',
        'Rainyhearts',
        1000,
        this.cameras.main.centerX / 2 - 10,
        80,
        this,
        550,
      );
    });

    this.time.delayedCall(delays[1], () => {
      textAppears(
        text3,
        '1.6rem',
        'Rainyhearts',
        1000,
        this.cameras.main.centerX / 2 - 10,
        210,
        this,
        550,
      );
    });

    this.time.delayedCall(delays[2], () => {
      textAppears(
        text4,
        '1.6rem',
        'Rainyhearts',
        1000,
        this.cameras.main.centerX / 2 - 10,
        340,
        this,
        550,
      );
    });

    this.time.delayedCall(delays[3], () => {
      this.canContinueToNextScene = true;
      const space = textAppears(
        'Press Space to continue',
        '1.6rem',
        'Rainyhearts',
        1000,
        this.cameras.main.centerX / 2 + 65,
        445,
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
}

function getBackgroundText() {
  const text1 = 'What happened so far...';
  const text2 =
    "You're in a lab, working as a molecular biologist after having spent years studying at university. You notice that in stressfull situations you tend to fall into imaginary fight scenes as a fight or flight response. ";
  const text3 =
    "This seems to help you overcome almost any obstacle you're facing. After having worked professionally in the scientific field you're having doubts about your future, but you decide to push through.";
  const text4 =
    "Even though you're working in a lab, you feel your DNA changing and searching for SOMETHING ELSE";

  return { text1, text2, text3, text4 };
}
