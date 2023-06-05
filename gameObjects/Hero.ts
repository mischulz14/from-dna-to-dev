import * as Phaser from 'phaser';

import { StateMachine } from '../state/State';

export default class Hero extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  lastDirection: string;
  speed: number;
  freeze: boolean;
  private shadow: Phaser.GameObjects.Graphics;
  heroBounds: Phaser.Geom.Rectangle;
  // stateMachine: StateMachine;

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
      fillStyle: { color: 0x000000, alpha: 0.25 },
    });
    this.heroBounds = this.getBounds();

    // Add this instance to the scene's display list and update list

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(17, 10);
    this.body.setOffset(8, 24);

    // Initialize the cursors object and the lastDirection string
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.lastDirection = 'down';
    this.speed = 200;

    this.createAnimations(scene);
  }

  createAnimations(scene: Phaser.Scene) {
    // Define your animations here...
    scene.anims.create({
      key: 'idle-down',
      frames: scene.anims.generateFrameNumbers('labHero', {
        start: 29,
        end: 33,
      }),
      frameRate: 6,
      repeat: -1,
    });

    scene.anims.create({
      key: 'run-down',
      frames: scene.anims.generateFrameNumbers('labHero', {
        start: 34,
        end: 41,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: 'idle-up',
      frames: scene.anims.generateFrameNumbers('labHero', {
        start: 42,
        end: 46,
      }),
      frameRate: 6,
      repeat: -1,
    });

    scene.anims.create({
      key: 'run-up',
      frames: scene.anims.generateFrameNumbers('labHero', {
        start: 47,
        end: 54,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: 'idle-left',
      frames: scene.anims.generateFrameNumbers('labHero', {
        start: 16,
        end: 20,
      }),
      frameRate: 6,
      repeat: -1,
    });

    scene.anims.create({
      key: 'run-left',
      frames: scene.anims.generateFrameNumbers('labHero', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: 'idle-right',
      frames: scene.anims.generateFrameNumbers('labHero', {
        start: 21,
        end: 25,
      }),
      frameRate: 6,
      repeat: -1,
    });

    scene.anims.create({
      key: 'run-right',
      frames: scene.anims.generateFrameNumbers('labHero', {
        start: 8,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Play the initial idle-down animation
    this.anims.play('idle-down', true);
  }

  update() {
    // Hero is frozen while talking or during a cuscene
    if (this.freeze) {
      this.body.enable = false; // disable collision response
      this.anims.play('idle-' + this.lastDirection, true);

      return;
    }
    this.shadow.clear();
    this.body.enable = true; // enable collision response

    // Reset the velocity
    this.setVelocity(0);

    // Check for input and update the animation and velocity accordingly
    if (this.cursors.left.isDown) {
      this.runLeft();
    } else if (this.cursors.right.isDown) {
      this.runRight();
    } else if (this.cursors.up.isDown) {
      this.runUp();
    } else if (this.cursors.down.isDown) {
      this.runDown();
    } else {
      // If no keys are pressed, play the idle animation corresponding to the last direction
      this.idle();
    }
  }

  runRight() {
    this.setVelocityX(this.speed);
    this.anims.play('run-right', true);
    this.lastDirection = 'right';
    this.shadow.fillEllipse(this.x + 3, this.y + 30, 30, 16);
  }

  runLeft() {
    this.setVelocityX(-this.speed);
    this.anims.play('run-left', true);
    this.lastDirection = 'left';
    this.shadow.fillEllipse(this.x - 3, this.y + 30, 30, 16);
  }

  runUp() {
    this.setVelocityY(-this.speed);
    this.anims.play('run-up', true);
    this.lastDirection = 'up';
    this.shadow.fillEllipse(this.x, this.y + 23, 30, 18);
  }

  runDown() {
    this.setVelocityY(this.speed);
    this.anims.play('run-down', true);
    this.lastDirection = 'down';
    this.shadow.fillEllipse(this.x, this.y + 30, 30, 16);
  }

  idle() {
    this.anims.play('idle-' + this.lastDirection, true);
    this.setVelocity(0);
    if (this.lastDirection === 'up') {
      this.shadow.fillEllipse(this.x, this.y + 28, 30, 16);
    } else {
      this.shadow.fillEllipse(this.x, this.y + 30, 30, 16);
    }
  }
}
