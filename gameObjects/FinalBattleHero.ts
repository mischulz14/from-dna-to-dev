import * as Phaser from 'phaser';

import HealthBar from '../battle/HealthBar';
import FinalBattleHeroFiniteStateMachine from '../statemachine/finalBattleHero/FinalBattleHeroFiniteStateMachine';

export default class FinalBattleHero extends Phaser.Physics.Arcade.Sprite {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  freeze: boolean;
  heroBounds: Phaser.Geom.Rectangle;
  stateMachine: FinalBattleHeroFiniteStateMachine;
  animPrefix: string;
  healthBar: HealthBar;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    animPrefix: string,
    frame?: string | number,
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys,
  ) {
    super(scene, x, y, texture, frame);
    this.freeze = false;
    this.healthBar = new HealthBar(
      scene,
      x,
      y,
      100,
      -375,
      40,
      'hero-health-bar',
    );

    this.stateMachine = new FinalBattleHeroFiniteStateMachine(this);
    this.animPrefix = animPrefix;

    // Add this instance to the scene's display list and update list

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setImmovable(true);

    // Set the size of the physics body
    this.body.setSize(26, 32);
    this.body.setOffset(12, 16);

    // Initialize the cursors object and the lastDirection string
    this.cursors = cursors;
  }

  update() {
    // Hero is frozen while talking or during a cuscene
    this.stateMachine.update();
  }

  takeDamage(damage: number) {
    this.healthBar.decrease(damage);
    console.log('taking damage', damage);
    // make tint blink red
    this.setTint(0xff0000);
    setTimeout(() => {
      this.clearTint();
    }, 100);
    setTimeout(() => {
      this.setTint(0xff0000);
    }, 200);
    setTimeout(() => {
      this.clearTint();
    }, 300);
  }
}
