import * as Phaser from 'phaser';

export default class NonInteractiveGameObject extends Phaser.Physics.Arcade
  .Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.scene = scene;
    // Here we create our dialogue nodes

    scene.add.existing(this);
    scene.physics.add.existing(this);
    // this.advanceDialogueEventListener();
  }

  create() {}

  async typeText() {}

  update() {
    return;
  }
}
