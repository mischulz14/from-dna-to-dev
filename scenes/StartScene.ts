import { cutSceneAudioNames } from '../data/cutSceneSprites';
import { textAppears } from '../utils/textEffects';

export default class StartScene extends Phaser.Scene {
  dna: Phaser.GameObjects.Sprite;
  text: Phaser.GameObjects.Text;
  hasContinuedToBackstory: boolean;
  introSceneSound: Phaser.Sound.BaseSound;
  audioFinished: boolean;
  audioIsStillPlaying: boolean;
  constructor() {
    super({ key: 'StartScene' });
    this.hasContinuedToBackstory = false;
    this.audioFinished = false;
    this.audioIsStillPlaying = false;
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
    this.introSceneSound = this.sound.add(cutSceneAudioNames.intro);
    // this.introSceneSound.on('complete', this.audioHasFinishedPlaying, this);
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

    this.text = this.add.text(230, 400, 'Press any key to continue', {
      fontSize: '2rem',
      fontFamily: 'Rainyhearts',
      color: '#fff',
    });

    const codebrackets = this.add
      .sprite(280, 300, 'codebrackets')
      .setScale(2)
      .play('codebrackets-pop');

    // when the user presses start, start the first level
    this.input.keyboard.on('keydown', () => {
      if (this.audioIsStillPlaying) return;
      this.audioIsStillPlaying = true;
      // this.introSceneSound.play();
      this.text.setVisible(false);
      dna.setVisible(false);
      codebrackets.setVisible(false);
      background.setVisible(false);
      this.hasContinuedToBackstory = true;

      this.revealText();
    });

    // on enter key, start the first level
    this.input.keyboard.on('keydown-ENTER', () => {
      if (this.hasContinuedToBackstory && this.audioFinished) {
        this.scene.start('LabScene');
      }
    });
  }

  progressToNextSection() {
    this.audioFinished = true;

    const text = this.add.text(300, 465, 'Press enter to continue', {
      fontSize: '1.3rem',
      fontFamily: 'Rainyhearts',
      color: '#fff',
    });

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
    const { text1, text2, text3, text4, text5, text6 } = getBackgroundText();

    textAppears(text1, '1.6rem', 'Rainyhearts', 1000, 10, 10, this);

    this.time.delayedCall(2000, () => {
      textAppears(text2, '1.6rem', 'Rainyhearts', 1000, 10, 60, this);
    });

    this.time.delayedCall(9500, () => {
      textAppears(text3, '1.6rem', 'Rainyhearts', 1000, 10, 120, this);
    });

    this.time.delayedCall(18000, () => {
      textAppears(text4, '1.6rem', 'Rainyhearts', 1000, 10, 180, this);
    });

    this.time.delayedCall(24000, () => {
      textAppears(text5, '1.6rem', 'Rainyhearts', 1000, 10, 220, this);
    });

    this.time.delayedCall(31500, () => {
      textAppears(text6, '1.6rem', 'Rainyhearts', 1000, 10, 290, this);
      this.time.delayedCall(2000, () => {
        this.progressToNextSection();
      });
    });
  }
}

function getBackgroundText() {
  const text1 = 'What happened so far...';
  const text2 =
    "You're in a lab, working as a molecular biologist after having spent \n years studying at university.";
  const text3 =
    'You notice that in stressfull situations you tend to fall into imaginary \n fight scenes as a fight or flight response.';
  const text4 =
    "This seems to help you overcome almost any obstacle you're facing.";
  const text5 =
    "After having worked professionally in the scientific field \n you're having doubts about your future, but you decide to push through.";
  const text6 =
    "Even though you're working in a lab, \n you feel your DNA changing and searching for \n SOMETHING ELSE";

  return { text1, text2, text3, text4, text5, text6 };
}
