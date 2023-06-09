import * as Phaser from 'phaser';

import HealthBar from '../battle/HealthBar';
import TestScene from '../scenes/TestScene';
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
  isEvading: boolean;
  lastActionTime: number;
  cooldownPeriodForEvasion: number;
  cooldownPeriodForAttack: number;
  health: number;
  isTakingDamage: boolean;
  healthBar: HealthBar;
  xandy: Phaser.GameObjects.Text;
  hitbox: any;
  damage: number;

  constructor(
    scene: TestScene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);
    this.createAnimations(scene);

    this.freeze = false;
    this.shadow = scene.add.graphics({
      fillStyle: { color: 0x000000, alpha: 0.1 },
    });
    this.shadow.setDepth(this.depth + 1);

    this.heroBounds = this.getBounds();

    const possibleStates = {
      idle: { running: 'running', attack: 'attacking', evade: 'evading' },
      running: {
        stop: 'idle',
        attack: 'attacking',
        evade: 'evading',
        running: 'running',
      },
      attacking: { stopAttack: 'idle', running: 'running' },
      evading: { stopEvade: 'idle', running: 'running' },
    };

    this.stateMachine = new StateMachine('idle', possibleStates);
    this.lastActionTime = 0;
    this.isTakingDamage = false;
    this.healthBar = new HealthBar(this.scene, 50, 50, 100, 'health-bar');
    this.damage = 10;

    // Add this instance to the scene's display list and update list

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(18, 16);
    this.setOffset(31, 65);

    // Initialize the cursors object and the lastDirection string
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.lastDirection = 'down';
    this.speed = 200;

    this.cooldownPeriodForAttack = 50;
    this.cooldownPeriodForEvasion = 300;

    this.health = 100;
  }

  drawXandY() {
    // clear the text
    this.xandy?.destroy();
    this.xandy = this.scene.add.circle(this.x, this.y, 30, 0x00ff00);
  }

  update() {
    // this.drawXandY();
    // Update the shadow's position
    this.updateShadow();

    // Handle movement keys press
    if (
      (this.cursors.left.isDown ||
        this.cursors.right.isDown ||
        this.cursors.up.isDown ||
        this.cursors.down.isDown) &&
      !this.freeze &&
      this.stateMachine.getState() !== 'attacking' &&
      this.stateMachine.getState() !== 'evading'
    ) {
      this.stateMachine.transition('running');
    } else if (this.stateMachine.getState() === 'running') {
      this.stateMachine.transition('stop');
    }

    // Handle evade key press
    if (Phaser.Input.Keyboard.JustDown(this.scene.input.keyboard.addKey('S'))) {
      if (
        this.stateMachine.getState() !== 'evading' &&
        this.stateMachine.getState() !== 'attacking' &&
        this.scene.time.now - this.lastActionTime >
          this.cooldownPeriodForEvasion
      )
        this.stateMachine.transition('evade');
    }

    // Handle attack key press
    if (
      Phaser.Input.Keyboard.JustDown(this.scene.input.keyboard.addKey('A')) &&
      this.stateMachine.getState() !== 'attacking' &&
      this.stateMachine.getState() !== 'evading' &&
      this.scene.time.now - this.lastActionTime > this.cooldownPeriodForAttack
    ) {
      this.stateMachine.transition('attack');
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
      this.play('battle-run-left', true);
    } else if (this.cursors.right.isDown) {
      this.setVelocity(this.speed, 0);
      this.lastDirection = 'right';
      this.play('battle-run-right', true);
    } else if (this.cursors.up.isDown) {
      this.setVelocity(0, -this.speed);
      this.lastDirection = 'up';
      this.play('battle-run-up', true);
    } else if (this.cursors.down.isDown) {
      this.setVelocity(0, this.speed);
      this.lastDirection = 'down';
      this.play('battle-run-down', true);
    }
  }

  attack() {
    this.lastActionTime = this.scene.time.now;
    this.cooldownPeriodForEvasion = 0;
    this.isAttacking = true;
    this.anims.play('attack-' + this.lastDirection, true);
    this.setVelocity(0);

    const animationDuration = this.scene.anims.get(
      'attack-' + this.lastDirection,
    ).duration;

    // get the duration it takes to get to the third frame of the attack animation
    const delay = animationDuration / 3.5;

    this.hitbox = this.createHitbox();

    let graphics = this.scene.add.graphics();

    // check if enemy is in the hitbox
    this.scene.time.delayedCall(delay, () => this.checkEnemyHit(this.hitbox));

    // draw the hitbox
    // graphics.lineStyle(2, 0xff0000);
    // graphics.strokeRect(
    //   this.hitbox.x,
    //   this.hitbox.y,
    //   this.hitbox.width,
    //   this.hitbox.height,
    // );

    // Block transitions and set a callback to unblock when the animation finishes
    this.on('animationcomplete', () => {
      this.stateMachine.transition('stopAttack');
      this.isAttacking = false;
      graphics.clear();
    });
  }

  createHitbox() {
    const hitBoxSize = 40;
    const xOffset = 25;
    const yOffsetMap = {
      up: -40,
      down: 40,
      left: -10,
      right: -10,
    };
    const xMap = {
      up: this.x - xOffset,
      down: this.x - xOffset,
      left: this.x - this.width + 20,
      right: this.x + this.width / 2 - 20,
    };

    this.hitbox = new Phaser.Geom.Rectangle(
      xMap[this.lastDirection],
      this.y + yOffsetMap[this.lastDirection],
      hitBoxSize,
      hitBoxSize,
    );

    return this.hitbox;
  }

  checkEnemyHit(hitbox) {
    this.scene.enemies.forEach((enemy) => {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(hitbox, enemy.getBounds())
      ) {
        console.log('Enemy hit!');
        if (enemy.isTakingDamage) return;
        enemy.hit();
        enemy.healthBar.decrease(this.damage);
        enemy.isTakingDamage = true;

        setTimeout(() => {
          enemy.isTakingDamage = false;
        }, 1000);

        console.log(enemy.healthBar.health);
      }
    });

    // check for boss hit
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        hitbox,
        this.scene.boss.getBounds(),
      )
    ) {
      console.log('Boss hit!');
      if (this.scene.boss.isTakingDamage) return;
      this.scene.boss.hit();
      this.scene.boss.healthBar.decrease(10);
      this.scene.boss.isTakingDamage = true;

      setTimeout(() => {
        this.scene.boss.isTakingDamage = false;
      }, 1000);

      console.log(this.scene.boss.healthBar.health);
    }
  }

  evade() {
    this.isEvading = true;
    this.cooldownPeriodForEvasion = 300;
    this.lastActionTime = this.scene.time.now;
    this.anims.play('evade-' + this.lastDirection, true);
    this.freeze = true;

    let tweenConfig: any = {
      targets: this,
      duration: 100,
      ease: 'Linear',
      onComplete: () => {
        this.freeze = false;
        this.stateMachine.transition('stopEvade');
      },
    };

    const distanceToEvade = 70;

    switch (this.lastDirection) {
      case 'up':
        tweenConfig.y = this.y - distanceToEvade;
        break;
      case 'down':
        tweenConfig.y = this.y + distanceToEvade;
        break;
      case 'left':
        tweenConfig.x = this.x - distanceToEvade;
        break;
      case 'right':
        tweenConfig.x = this.x + distanceToEvade;
        break;
    }

    this.scene.tweens.add(tweenConfig);

    setTimeout(() => {
      this.isEvading = false;
    }, 500);
  }

  idle() {
    this.anims.play('battle-idle-' + this.lastDirection, true);
    this.setVelocity(0);
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
    if (this.checkCollisionWithLayer(hitbox, this.scene.collisionLayer))
      distanceToMove = 0;

    // make this check also for all of the spikes in the scenes
    this.scene.spikes.forEach((spike) => {
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

  // TODO fix this
  checkCollisionWithLayer(
    hitbox: Phaser.Geom.Rectangle,
    layer: Phaser.Tilemaps.TilemapLayer,
  ) {
    const worldHitbox = this.scene.physics.world.bounds;
    console.log(worldHitbox, 'worldHitbox');
    console.log('layer', layer);
    const tiles = layer.getTilesWithinWorldXY(
      worldHitbox.x,
      worldHitbox.y,
      worldHitbox.width,
      worldHitbox.height,
      { isColliding: true },
    );
    console.log(tiles, 'tiles');
    for (const tile of tiles) {
      const tileBounds = new Phaser.Geom.Rectangle(
        tile.pixelX,
        tile.pixelY,
        tile.width,
        tile.height,
      );

      console.log(tileBounds, 'tileBounds');
      if (Phaser.Geom.Intersects.RectangleToRectangle(hitbox, tileBounds)) {
        console.log('collision');
        if (hitbox.width === undefined) {
          console.log('hitbox is undefined');
          return false;
        }
        if (tileBounds.width === undefined) {
          console.log('tileBounds is undefined');
          return false;
        }

        if (layer === undefined) {
          console.log('layer is undefined');
          return false;
        }

        if (tile.width === undefined) {
          console.log('tile.width is undefined');
          return false;
        }
        return true;
      }
    }
    return false;
  }

  updateShadow() {
    this.shadow.clear();
    const shadowX = this.x;
    const shadowY = this.y + this.height / 2 - 36;
    const shadowWidth = 30;
    const shadowHeight = 15;
    this.shadow.fillEllipse(shadowX, shadowY, shadowWidth, shadowHeight);
  }

  createAnimations(scene: Phaser.Scene) {
    this.scene.anims.create({
      key: 'attack-right',
      frames: this.scene.anims.generateFrameNumbers('punchrighttest', {
        start: 1,
        end: 8,
      }),
      frameRate: 13,
      duration: 500,
    });

    this.scene.anims.create({
      key: 'attack-left',
      frames: this.scene.anims.generateFrameNumbers('punchrighttest', {
        start: 10,
        end: 17,
      }),
      frameRate: 13,
      duration: 500,
    });

    this.scene.anims.create({
      key: 'attack-down',
      frames: this.scene.anims.generateFrameNumbers('punchdown', {
        start: 1,
        end: 8,
      }),
      frameRate: 12,
      duration: 500,
    });

    this.scene.anims.create({
      key: 'attack-up',
      frames: this.scene.anims.generateFrameNumbers('punchdown', {
        start: 10,
        end: 17,
      }),
      frameRate: 12,
      duration: 500,
    });
  }
}
