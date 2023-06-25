export default class StartScene extends Phaser.Scene {
  dna: Phaser.GameObjects.Sprite;
  text: Phaser.GameObjects.Text;
  hasContinuedToBackstory: boolean;
  constructor() {
    super({ key: 'StartScene' });
    this.hasContinuedToBackstory = false;
  }

  preload() {
    // Load the image that will be used for the background
    this.load.image('background', 'assets/dnatodev.png');
    this.load.image('backstory', 'assets/backstory.png');
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
    const backgrouund = this.add.image(0, 0, 'background').setOrigin(0, 0);
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

    const backstory = this.add
      .image(0, 0, 'backstory')
      .setOrigin(0, 0)
      .setVisible(false);

    // when the user presses start, start the first level
    this.input.keyboard.on('keydown', () => {
      this.text.setVisible(false);
      backstory.setVisible(true);
      dna.setVisible(false);
      codebrackets.setVisible(false);
      backgrouund.setVisible(false);
      this.hasContinuedToBackstory = true;

      this.time.delayedCall(2000, () => {
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
      });
    });

    // on enter key, start the first level
    this.input.keyboard.on('keydown-ENTER', () => {
      if (this.hasContinuedToBackstory) {
        this.scene.start('LabScene');
      }
    });
  }
}
