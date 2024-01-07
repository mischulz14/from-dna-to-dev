import * as Phaser from 'phaser';

import { finalBattleSpriteInfos } from '../data/finalBattleSpriteInfos';
import FinalBattleScene from '../scenes/FinalBattleScene';

export default class PostgresElephant extends Phaser.Physics.Arcade.Sprite {
  speed: number;
  bugBounds: Phaser.Geom.Rectangle;
  damage: number;
  type: string;
  followHero: boolean = false;
  scene: FinalBattleScene;
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
    this.scene = scene;
    this.followHero = false;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setImmovable(true);
    this.body?.setSize(28, 28);
    this.damage = damage;
    this.type = type;
    this.speed = 1;
    this.setScale(2);
    this.setInteractive();
    this.on('pointerover', () => {
      this.setTint(0xff0000);
    });
    this.on('pointerout', () => {
      this.clearTint();
    });
    this.on('pointerdown', () => {
      this.destroy();
      console.log('destroying minion', this.active);
    });

    this.anims.play(finalBattleSpriteInfos.postgresElephant.animations[0].name);

    this.scene.tweens.add({
      targets: this,
      x: this.x + 15,
      ease: 'Linear',
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    scene.physics.add.collider(this, scene.hero, () => {
      scene.hero.takeDamage(this.damage);
      this.destroy();
    });
  }

  setSpeed(speedMultiplier: number) {
    this.speed *= speedMultiplier;
  }

  update() {
    if (!this.active) return;
    this.y += this.speed;

    if (this.y > 440) {
      this.scene.hero.takeDamage(this.damage);
      this.destroy();
    }
  }
}
