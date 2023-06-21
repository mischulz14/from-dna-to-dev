import * as Phaser from 'phaser';

import StateMachine from '../statemachine/StateMachine';

export default class LabHeroTest extends Phaser.Physics.Arcade.Sprite {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  lastDirection: string;
  speed: number;
  freeze: boolean;
  shadow: Phaser.GameObjects.Graphics;
  heroBounds: Phaser.Geom.Rectangle;
  stateMachine: StateMachine;
  isAttacking: boolean;

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
    this.shadow = scene.add.graphics({
      fillStyle: { color: 0x000000, alpha: 0.1 },
    });
    this.heroBounds = this.getBounds();
    this.stateMachine = new StateMachine('idle');

    // Add this instance to the scene's display list and update list

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(12, 20);
    this.body.setOffset(35, 15);

    // Initialize the cursors object and the lastDirection string
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.lastDirection = 'down';
    this.speed = 200;
  }

  update() {
    this.shadow.clear();
    // Update current state according to user input
    if (
      this.cursors.left.isDown ||
      this.cursors.right.isDown ||
      this.cursors.up.isDown ||
      (this.cursors.down.isDown &&
        !this.freeze &&
        this.stateMachine.getState() !== 'attacking')
    ) {
      this.stateMachine.transition('run');
    } else {
      this.stateMachine.transition('stop');
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.scene.input.keyboard.addKey('A')) &&
      this.stateMachine.getState() !== 'attacking'
    ) {
      this.stateMachine.transition('attack');
    } else if (this.stateMachine.getState() !== 'attacking') {
      this.stateMachine.transition('stopAttack');
    }

    if (Phaser.Input.Keyboard.JustDown(this.scene.input.keyboard.addKey('S'))) {
      this.stateMachine.transition('evade');
    } else {
      this.stateMachine.transition('stopEvade');
    }

    // Execute the action corresponding to the current state
    const state = this.stateMachine.getState();
    if (state === 'idle') {
      this.idle();
    } else if (state === 'running') {
      this.run();
    } else if (state === 'attacking') {
      this.attack();
    } else if (state === 'evading') {
      this.evade();
    }
  }

  run() {
    if (this.cursors.left.isDown) {
      this.setVelocity(-this.speed, 0);
      this.lastDirection = 'left';
      this.play('run-left', true);
    } else if (this.cursors.right.isDown) {
      this.setVelocity(this.speed, 0);
      this.lastDirection = 'right';
      this.play('run-right', true);
    } else if (this.cursors.up.isDown) {
      this.setVelocity(0, -this.speed);
      this.lastDirection = 'up';
      this.play('run-up', true);
    } else if (this.cursors.down.isDown) {
      this.setVelocity(0, this.speed);
      this.lastDirection = 'down';
      this.play('run-down', true);
    }
  }

  attack() {
    this.anims.play('attack-' + this.lastDirection, true);
    this.setVelocity(0);

    const animationDuration = this.scene.anims.get(
      'attack-' + this.lastDirection,
    ).duration;

    // at the half way point of the animation, create a rectangle to represent the attack hitbox based on the direction of the attack. Then check if the hitbox overlaps with any enemies and damage them if they do.

    // Block transitions and set a callback to unblock when the animation finishes
    this.once('animationcomplete', () => {
      this.stateMachine.transition('stopAttack');
    });
  }

  evade() {
    this.freeze = true;
    if (this.lastDirection === 'up') {
      this.scene.tweens.add({
        targets: this,
        y: this.y - 100,
        duration: 100,
        ease: 'Linear',
        onComplete: () => {
          this.freeze = false;
        },
      });
    }

    if (this.lastDirection === 'down') {
      this.scene.tweens.add({
        targets: this,
        y: this.y + 100,
        duration: 100,
        ease: 'Linear',
        onComplete: () => {
          this.freeze = false;
        },
      });
    }

    if (this.lastDirection === 'left') {
      this.scene.tweens.add({
        targets: this,
        x: this.x - 100,
        duration: 100,
        ease: 'Linear',
        onComplete: () => {
          this.freeze = false;
        },
      });
    }

    if (this.lastDirection === 'right') {
      this.scene.tweens.add({
        targets: this,
        x: this.x + 100,
        duration: 100,
        ease: 'Linear',
        onComplete: () => {
          this.freeze = false;
        },
      });
    }
  }

  idle() {
    this.anims.play('idle-' + this.lastDirection, true);
    this.setVelocity(0);
  }
}
