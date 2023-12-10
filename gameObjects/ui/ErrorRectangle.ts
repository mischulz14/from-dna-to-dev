import * as Phaser from 'phaser';

export default class ErrorRectangle extends Phaser.Physics.Arcade.Sprite {
  id: string;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    id: string,
  ) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.id = id;
    // Here we create our dialogue nodes

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body?.setSize(32, 32);
    // this.advanceDialogueEventListener();
  }

  create() {}

  async typeText() {}

  update() {
    return;
  }

  revealRectangle() {
    this.anims.play('XAnim');
  }
}
