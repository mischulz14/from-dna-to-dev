import { audioNames } from '../data/audioNames';
import { cutSceneAudioNames } from '../data/cutSceneSprites';
import { globalAudioManager } from '../src/app';
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
      this.text.setVisible(false);
      dna.setVisible(false);
      codebrackets.setVisible(false);
      background.setVisible(false);
      this.hasContinuedToBackstory = true;

      this.revealText();
    });

    // on enter key, start the first level
    this.input.keyboard.on('keydown-SPACE', () => {
      if (this.hasContinuedToBackstory && this.audioFinished) {
        this.scene.start('DNAScene');
      }
    });
  }

  progressToNextSection() {
    this.audioFinished = true;

    const text = this.add.text(300, 465, 'Press Space to continue', {
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
    const text = getBackgroundText();

    textAppears(
      text,
      '1.6rem',
      'Rainyhearts',
      2000,
      this.cameras.main.centerX / 2 + 20,
      30,
      this,
      500,
    );

    setTimeout(() => {
      this.progressToNextSection();
    }, 3000);
  }
}

function getBackgroundText() {
  const text =
    "What happened so far...\nYou're in a lab, working as a molecular biologist after having spent years studying at university. You notice that in stressfull situations you tend to fall into imaginary fight scenes as a fight or flight response. This seems to help you overcome almost any obstacle you're facing. After having worked professionally in the scientific field you're having doubts about your future, but you decide to push through. Even though you're working in a lab, you feel your DNA changing and searching for SOMETHING ELSE";

  return text;
}
