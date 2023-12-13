import Phaser from 'phaser';

import { UISpritesData } from '../../data/UISpritesData';

export default class Heart extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture, frame) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
  }

  destroyHeart() {
    this.anims.play(UISpritesData.heart.name);
  }
}
