import * as Phaser from 'phaser';

import FinalBattleScene from '../scenes/FinalBattleScene';

export default class Bug extends Phaser.Physics.Arcade.Sprite {
  speed: number;
  bugBounds: Phaser.Geom.Rectangle;
  damage: number;
  type: string;
  constructor(
    scene: FinalBattleScene,
    x: number,
    y: number,
    texture: string,
    damage: number,
    type: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);
    this.bugBounds = this.getBounds();
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body?.setSize(28, 28);
    this.damage = damage;
    this.type = type;
    this.speed = 5;
    this.setScale(1.5);

    scene.physics.add.collider(this, scene.hero, () => {
      scene.hero.takeDamage(this.damage);
      this.destroy();
    });
  }

  update() {
    this.y += this.speed;
  }
}
