import * as Phaser from 'phaser';

import MinionHealthBar from '../battle/MinionHealthBar';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  target: Phaser.Physics.Arcade.Sprite;
  hitTime: number;
  isHit: boolean;
  healthBar: MinionHealthBar;
  health: number;
  isTakingDamage: boolean;
  shadow: Phaser.GameObjects.Graphics;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    target: Phaser.Physics.Arcade.Sprite,
    texture: string,
  ) {
    super(scene, x, y, texture);
    this.target = target;

    this.shadow = scene.add.graphics({
      fillStyle: { color: 0x000000, alpha: 0.1 },
    });

    this.health = 30;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.healthBar = new MinionHealthBar(
      this.scene,
      this.x - 10,
      this.y - 10,
      this.health,
    );

    this.anims.play('enemy-idle', true);
  }

  update() {
    if (this === undefined) return;

    this.updateHealthBarPosition();
    this.updateShadowPosition();

    // If it dies
    if (this.healthBar.health === 0) {
      this.die();
      return;
    }

    // If it is hit
    if (this.isHit) {
      this.setVelocity(0, 0); // this will stop the enemy's movement
      // move it back a little bit
      this.scene.physics.moveToObject(this, this.target, -70);
      this.healthBar.showHealthBar();

      // check if it is dead (health <= 0)

      setTimeout(() => {
        this.isHit = false;
      }, 300);

      setTimeout(() => {
        this.healthBar.hideHealthBar();
      }, 1000);
    } else {
      this.scene.physics.moveToObject(this, this.target, 30);

      // if it is close enough to the target, stop moving
      if (
        Phaser.Math.Distance.Between(
          this.x,
          this.y,
          this.target.x,
          this.target.y + 30,
        ) < 2
      ) {
        this.setVelocity(0, 0);
      }

      // if it overlaps with the target, reduce the target health
    }
  }

  hit(time: number) {
    this.isHit = true;
  }

  die() {
    if (this.scene === undefined || this.scene.tweens === undefined) {
      return;
    }
    this.setVelocity(0, 0);
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 200,
      ease: 'Linear',
      onComplete: () => {
        // slice the enemy from the enemies array
        this.scene.enemies = this.scene.enemies.filter(
          (enemy: Enemy) => enemy !== this,
        );

        this.healthBar.destroy();
        this.shadow.destroy();
        this.body.destroy();
      },
    });
  }

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
