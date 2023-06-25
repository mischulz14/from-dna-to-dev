import * as Phaser from 'phaser';

import HealthBar from '../battle/HealthBar';
import MinionHealthBar from '../battle/MinionHealthBar';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  target: Phaser.Physics.Arcade.Sprite;
  hitTime: number;
  isHit: boolean;
  healthBar: MinionHealthBar | HealthBar | undefined;
  health: number;
  isTakingDamage: boolean;
  damage: number;
  shadow: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.shadow = scene.add.graphics({
      fillStyle: { color: 0x000000, alpha: 0.1 },
    });

    this.health = 20;
    this.damage = 10;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.healthBar = new MinionHealthBar(
      this.scene,
      this.x - 10,
      this.y - 10,
      this.health,
    );
  }

  update() {}

  hit(time: number) {
    this.isHit = true;
  }

  die() {}

  updateHealthBarPosition() {
    this.healthBar.setPosition(this.x - 10, this.y - 10);
  }

  updateShadowPosition() {
    this.shadow.clear();
    this.shadow.fillEllipse(
      this.x,
      this.y + this.height / 2,
      this.width / 1.5,
      this.height / 3.5,
    );
  }
}
