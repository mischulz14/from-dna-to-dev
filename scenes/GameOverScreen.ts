import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    this.add
      .text(400, 300, 'Click to Restart', {
        fontFamily: 'Arial',
        fontSize: 48,
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.input.on('pointerdown', () => {
      this.scene.start('TestScene');
    });
  }
}
