import * as Phaser from 'phaser';

import FinalBattleHeroFiniteStateMachine from '../statemachine/FinalBattleHeroFiniteStateMachine';

export default class FinalBattleHero extends Phaser.Physics.Arcade.Sprite {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  freeze: boolean;
  heroBounds: Phaser.Geom.Rectangle;
  stateMachine: FinalBattleHeroFiniteStateMachine;
  animPrefix: string;

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

    this.stateMachine = new FinalBattleHeroFiniteStateMachine(this);
    this.animPrefix = animPrefix;

    // Add this instance to the scene's display list and update list

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Initialize the cursors object and the lastDirection string
    this.cursors = cursors;
  }

  update() {
    // Hero is frozen while talking or during a cuscene
    this.stateMachine.update();
  }
}
