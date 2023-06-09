import MinionHealthBar from '../battle/MinionHealthBar';
import Enemy from './Enemy';
import LabHeroTest from './LabHeroTest';

export default class Minion extends Enemy {
  target: Phaser.Physics.Arcade.Sprite;
  hitTime: number;
  isHit: boolean;
  healthBar: MinionHealthBar;
  health: number;
  isTakingDamage: boolean;
  damage: number;
  shadow: Phaser.GameObjects.Graphics;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    target: Phaser.Physics.Arcade.Sprite,
    texture: string,
  ) {
    super(scene, x, y, texture);
    this.target = target;

    this.shadow = scene.add.graphics({
      fillStyle: { color: 0x000000, alpha: 0.1 },
    });

    this.shadow.setDepth(this.depth + 1);

    this.health = 20;
    this.damage = 10;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.healthBar = new MinionHealthBar(
      this.scene,
      this.x - 10,
      this.y - 10,
      this.health,
    );

    this.anims.play('enemy-idle', true);
  }

  update() {
    if (this === undefined) return;

    this.updateHealthBarPosition();
    this.updateShadowPosition();

    // If it dies
    if (this.healthBar.health === 0) {
      this.die();
      return;
    }

    // If it is hit
    if (this.isHit) {
      this.setVelocity(0, 0); // this will stop the enemy's movement
      // move it back a little bit
      this.scene.physics.moveToObject(this, this.target, -70);
      this.healthBar.showHealthBar();

      // check if it is dead (health <= 0)

      setTimeout(() => {
        this.isHit = false;
      }, 300);

      setTimeout(() => {
        this.healthBar.hideHealthBar();
      }, 1000);
    } else {
      this.scene.physics.moveToObject(this, this.target, 30);

      // if it is close enough to the target, stop moving
      if (
        Phaser.Math.Distance.Between(
          this.x,
          this.y,
          this.target.x,
          this.target.y + 30,
        ) < 2
      ) {
        this.setVelocity(0, 0);
      }
    }
  }

  hit(time: number) {
    this.isHit = true;
  }

  die() {
    if (this.scene === undefined || this.scene.tweens === undefined) {
      return;
    }
    this.setVelocity(0, 0);
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 200,
      ease: 'Linear',
      onComplete: () => {
        // slice the enemy from the enemies array
        this.scene.enemies = this.scene.enemies.filter(
          (enemy: Enemy) => enemy !== this,
        );

        this.healthBar.destroy();
        this.shadow.destroy();
        this.body.destroy();
      },
    });
  }

  heroOverlap(hero: LabHeroTest, enemy) {
    // console.log(hero.isEvading);
    if (hero.isEvading) {
      return;
    }
    if (!hero.isTakingDamage) {
      hero.health -= enemy.damage;
      hero.isTakingDamage = true;
      hero.healthBar.decrease(enemy.damage);
      hero.damageAnimation();
      hero.freeze = true;
      setTimeout(() => {
        hero.freeze = false;
      }, 300);
      // console.log('Hero health: ', hero.health); // log the new health value

      setTimeout(() => {
        hero.isTakingDamage = false;
      }, 2000);
    }
  }
}
