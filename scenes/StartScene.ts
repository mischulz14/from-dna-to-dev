export default class StartScene extends Phaser.Scene {
  dna: Phaser.GameObjects.Sprite;
  text: Phaser.GameObjects.Text;
  constructor() {
    super({ key: 'StartScene' });
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
    this.add.image(0, 0, 'background').setOrigin(0, 0);
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
    this.add.sprite(530, 140, 'dna').setScale(5).play('dna-spin');

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

    this.add
      .sprite(280, 300, 'codebrackets')
      .setScale(2)
      .play('codebrackets-pop');

    // when the user presses start, start the first level
    this.input.keyboard.once('keydown', () => {
      this.scene.start('LabScene');
    });
  }
}
