export default class Fist extends Phaser.GameObjects.Sprite {
  deactivated: boolean;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);

    // make shadow into ellipse

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(25, 25);
    // this.body.setOffset(6, 10);
    this.setVisible(false);
    this.deactivated = false;
  }

  update(...args: any[]): void {}
}
