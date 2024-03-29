import * as Phaser from 'phaser';

import PlayerFiniteStateMachine from '../statemachine/overworldHero/PlayerFiniteStateMachine';

export default class Hero<TBooleanConditions> extends Phaser.Physics.Arcade
  .Sprite {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  lastDirection: string;
  speed: number;
  freeze: boolean;
  heroBounds: Phaser.Geom.Rectangle;
  booleanConditions: TBooleanConditions;
  stateMachine: PlayerFiniteStateMachine;
  animPrefix: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    booleanConditions: TBooleanConditions,
    animPrefix: string,
    bodySizes: { x: number; y: number },
    bodyOffset: { x: number; y: number },
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);
    this.freeze = false;
    this.heroBounds = this.getBounds();
    this.booleanConditions = booleanConditions;

    this.stateMachine = new PlayerFiniteStateMachine(this);
    this.animPrefix = animPrefix;

    // Add this instance to the scene's display list and update list

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(bodySizes.x, bodySizes.y);
    this.body.setOffset(bodyOffset.x, bodyOffset.y);

    // Initialize the cursors object and the lastDirection string
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.lastDirection = 'down';
    this.speed = 200;
  }

  update() {
    // Hero is frozen while talking or during a cuscene
    if (this.freeze) {
      this.body.enable = false; // disable collision response
      this.anims.play(this.animPrefix + '-idle-' + this.lastDirection, true);
      return;
    }

    this.body.enable = true; // enable collision response if not frozen
    // Reset the velocity
    this.setVelocity(0);
    this.updateLastDirection();
    this.stateMachine.update();
  }

  updateLastDirection() {
    if (this.cursors.left.isDown) {
      this.lastDirection = 'left';
    } else if (this.cursors.right.isDown) {
      this.lastDirection = 'right';
    } else if (this.cursors.up.isDown) {
      this.lastDirection = 'up';
    } else if (this.cursors.down.isDown) {
      this.lastDirection = 'down';
    }
  }
}
