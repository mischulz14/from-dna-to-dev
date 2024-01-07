import * as Phaser from 'phaser';

import HealthBar from '../battle/HealthBar';
import { finalBattleSpriteInfos } from '../data/finalBattleSpriteInfos';
import FinalBattleScene from '../scenes/FinalBattleScene';

export default class FinalBattleBoss extends Phaser.Physics.Arcade.Sprite {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  animPrefix: string;
  healthBar: HealthBar;
  speed: number;
  scene: FinalBattleScene;

  constructor(scene: FinalBattleScene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    // this.healthBar = new HealthBar(scene, 30, 400, 100, 'boss-health-bar');

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setImmovable(true);

    this.speed = 100;

    this.healthBar = new HealthBar(
      scene,
      50,
      40,
      100,
      590,
      0,
      'boss-health-bar',
    );

    this.play(finalBattleSpriteInfos.finalBoss.animations[0].name);
  }

  update() {}

  takeDamage(damage: number) {
    this.healthBar.decrease(damage);
    console.log('taking damage', damage);
  }
}
