import * as Phaser from 'phaser';

import HealthBar from '../battle/HealthBar';
import TestScene from '../scenes/TestScene';
import PlayerStateMachine from '../statemachine/PlayerStateMachine';
import checkCollisionWithLayer from '../utils/collisionWithLayer';

export default class LabHeroTest extends Phaser.Physics.Arcade.Sprite {
  inputAKey: Phaser.Input.Keyboard.Key;
  cooldownPeriodForAttack: number;
  cooldownPeriodForEvasion: number;
  currentScene: TestScene;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  damage: number;
  freeze: boolean;
  health: number;
  healthBar: HealthBar;
  heroBounds: Phaser.Geom.Rectangle;
  hitbox: any;
  isAttacking: boolean;
  isAttackingAgain: any;
  isEvading: boolean;
  isTakingDamage: boolean;
  lastActionTime: number;
  lastDirection: string;
  playerStateMachine: PlayerStateMachine;
  shadow: Phaser.GameObjects.Graphics;
  inputSKey: Phaser.Input.Keyboard.Key;
  speed: number;
  xandy: Phaser.GameObjects.Text;

  constructor(
    scene: TestScene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);

    this.currentScene = scene;

    this.freeze = false;
    this.shadow = scene.add.graphics({
      fillStyle: { color: 0x000000, alpha: 0.1 },
    });
    this.shadow.setDepth(this.depth + 1);

    this.heroBounds = this.getBounds();

    this.playerStateMachine = new PlayerStateMachine(this);
    this.lastActionTime = 0;
    this.isTakingDamage = false;
    this.healthBar = new HealthBar(this.scene, 50, 50, 100, 'health-bar');
    this.damage = 10;

    // Add this instance to the scene's display list and update list

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.body.setSize(18, 16);
    this.setOffset(55, 65);

    // Initialize the cursors object and the lastDirection string
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.inputAKey = this.scene.input.keyboard.addKey('A');
    this.inputSKey = this.scene.input.keyboard.addKey('S');
    this.lastDirection = 'down';
    this.speed = 200;

    this.cooldownPeriodForAttack = 50;
    this.cooldownPeriodForEvasion = 300;

    this.health = 100;
  }

  update() {
    // update last held direction
    this.updateLastDirection();
    this.updateShadow();

    this.playerStateMachine.update();
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

  damageAnimation() {
    const tint = 0xffb7b7;
    // Set initial tint
    this.setTint(tint);

    // Set up the blinking
    let blink = setInterval(() => {
      if (this.tintTopLeft === tint) {
        this.clearTint();
      } else {
        this.setTint(tint);
      }
    }, 100);

    // Stop the blinking
    setTimeout(() => {
      clearInterval(blink);
      this.clearTint();
    }, 500);

    // make rectangle out of heros body to check for collision
    const hitbox = new Phaser.Geom.Rectangle(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height,
    );

    let distanceToMove = 30;

    // move the hero back a few pixels based on the direction
    // if (checkCollisionWithLayer(hitbox, this.scene.collisionLayer, this.scene))
    //   distanceToMove = 0;

    // make this check also for all of the spikes in the scenes
    this.currentScene.spikes.forEach((spike) => {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(hitbox, spike.getBounds())
      ) {
        distanceToMove = 0;
        return;
      }
    });

    let tweenConfig: any = {
      targets: this,
      duration: 100,
      ease: 'Linear',
    };

    switch (this.lastDirection) {
      case 'up':
        tweenConfig.y = this.y + distanceToMove;
        break;
      case 'down':
        tweenConfig.y = this.y - distanceToMove;
        break;
      case 'left':
        tweenConfig.x = this.x + distanceToMove;
        break;
      case 'right':
        tweenConfig.x = this.x - distanceToMove;
        break;
    }

    this.scene.tweens.add(tweenConfig);
  }

  updateShadow() {
    this.shadow.clear();
    const shadowX = this.x;
    const shadowY = this.y + this.height / 2 - 36;
    const shadowWidth = 30;
    const shadowHeight = 15;
    this.shadow.fillEllipse(shadowX, shadowY, shadowWidth, shadowHeight);
  }
}
