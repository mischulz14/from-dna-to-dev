import * as Phaser from 'phaser';

import PlayerFiniteStateMachine from '../stateMachine/PlayerFiniteStateMachine';
import LabHero from './LabHero';

export default class Laia extends Phaser.Physics.Arcade.Sprite {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  lastDirection: string;
  speed: number;
  freeze: boolean;
  heroBounds: Phaser.Geom.Rectangle;
  stateMachine: PlayerFiniteStateMachine;
  animPrefix: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);
    // this.stateMachine = new StateMachine();
    this.freeze = false;
    this.heroBounds = this.getBounds();
    this.animPrefix = 'laia';
    this.stateMachine = new PlayerFiniteStateMachine(this);
    // Add this instance to the scene's display list and update list

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(15, 15);
    this.body.setOffset(9.2, 20.5);

    // Initialize the cursors object and the lastDirection string
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.lastDirection = 'down';
    this.speed = 200;
  }

  update() {
    // Hero is frozen while talking or during a cuscene
    if (this.freeze) {
      this.body.enable = false; // disable collision response
      this.anims.play('laia-idle-' + this.lastDirection, true);
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
