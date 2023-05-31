export default class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  create() {
    // Add text to the scene
    this.add.text(400, 300, 'Press any key to start', {
      fontSize: '32px',
      color: '#ffffff',
      align: 'center'
    })
    .setOrigin(0.5); // This line centers the text

    // when the user presses start, start the first level
    this.input.keyboard.once('keydown', () => {
      this.scene.start('LabScene');
    });
  }
}
