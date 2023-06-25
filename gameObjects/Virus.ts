import HealthBar from '../battle/HealthBar';
import Enemy from './Enemy';
import LabHeroTest from './LabHeroTest';

export default class Virus extends Enemy {
  healthBar: HealthBar;
  health: number;
  freed: boolean;
  canAttack: boolean;
  lastAttackTime: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    target: Phaser.Physics.Arcade.Sprite,
    texture: string,
  ) {
    super(scene, x, y, texture);
    this.target = target;
    this.canAttack = true;
    this.lastAttackTime = 0;

    this.freed = false;

    this.shadow = scene.add.graphics({
      fillStyle: { color: 0x000000, alpha: 0.1 },
    });

    this.health = 200;
    this.damage = 10;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.healthBar = new HealthBar(
      this.scene,
      150,
      450,
      this.health,
      'boss-health-bar',
      'Virus',
    );

    this.anims.play('virus-idle', true);
    this.body.setSize(30, 36);
    this.body.immovable = true;
  }

  update() {
    if (this === undefined || !this.freed) return;

    // If it dies
    if (this.healthBar.health === 0) {
      this.die();
      return;
    }

    // if (
    //   Phaser.Geom.Intersects.RectangleToRectangle(
    //     this.getBounds(),
    //     this.target.getBounds(),
    //   )
    // ) {
    //   console.log('hit');
    //   this.target.healthBar.decrease(this.damage);
    // }

    // If it is hit
    if (this.isHit) {
      this.setVelocity(0, 0); // this will stop the enemy's movement
      // move it back a little bit
      this.scene.physics.moveToObject(this, this.target, -70);

      // check if it is dead (health <= 0)

      setTimeout(() => {
        this.isHit = false;
      }, 300);
    } else {
      this.scene.physics.moveToObject(this, this.target, 30);

      // if it is close enough to the target
      if (
        Phaser.Math.Distance.Between(
          this.x,
          this.y,
          this.target.x,
          this.target.y + 30,
        ) < 200
      ) {
        // Only attack if the cooldown has passed
        if (this.canAttack) {
          this.attack();
        }
      }

      // If it's been more than 3 seconds since the last attack, allow the virus to attack again
      if (this.scene.time.now - this.lastAttackTime > 3000) {
        this.canAttack = true;
      }
    }
  }

  attack() {
    // ATTACK
    // go back for a small distance and then jump fast towards the target, but only once and then stop moving, but first check for collision with collision layer
    const hitbox = new Phaser.Geom.Rectangle(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height,
    );

    let distanceToMove = 30;

    // move the hero back a few pixels based on the direction

    // Adding some randomness to the target's position
    const targetX = this.checkCollisionWithLayer(
      hitbox,
      this.scene.collisionLayer,
    )
      ? this.target.x + Math.random() * 10
      : this.target.x; // Random number between -100 and 100
    const targetY = this.checkCollisionWithLayer(
      hitbox,
      this.scene.collisionLayer,
    )
      ? this.target.y + Math.random() * 10
      : this.target.y; // Random number between -100 and 100

    this.scene.tweens.add({
      targets: this,
      // move back a little bit depending on the target's position
      x: this.x + (this.x - this.target.x) * 0.25,
      y: this.y + (this.y - this.target.y) * 0.25,
      duration: 800,
      ease: 'Linear',
      onComplete: () => {
        this.scene.tweens.add({
          targets: this,
          x: targetX, // Changed to the random targetX
          y: targetY, // Changed to the random targetY
          duration: 300,
          ease: 'Linear',
          onComplete: () => {
            this.setVelocity(0, 0);
          },
        });
      },
    });

    // The virus has attacked, so it can't attack again until the cooldown has passed
    this.canAttack = false;
    this.lastAttackTime = this.scene.time.now;
  }

  hit(time: number) {
    this.isHit = true;
  }

  die() {
    if (this.scene === undefined || this.scene.tweens === undefined) {
      return;
    }
    this.setVelocity(0, 0);
    // this.scene.tweens.add({
    //   targets: this,
    //   alpha: 0,
    //   duration: 200,
    //   ease: 'Linear',
    //   onComplete: () => {
    //     // slice the enemy from the enemies array
    //     this.scene.enemies = this.scene.enemies.filter(
    //       (enemy: Enemy) => enemy !== this,
    //     );

    //     this.healthBar.destroy();
    //     this.shadow.destroy();
    //     this.body.destroy();
    //   },
    // });
  }

  virusCollision(hero: LabHeroTest, virus: Virus) {
    if (hero.isEvading) {
      return;
    }
    // if hero collides with the virus, decrease hero health
    if (!hero.isTakingDamage) {
      hero.health -= virus.damage;
      hero.isTakingDamage = true;
      hero.healthBar.decrease(virus.damage);
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

  checkCollisionWithLayer(
    hitbox: Phaser.Geom.Rectangle,
    layer: Phaser.Tilemaps.TilemapLayer,
  ) {
    const worldHitbox = this.scene.physics.world.bounds;
    const tiles = layer.getTilesWithinWorldXY(
      worldHitbox.x,
      worldHitbox.y,
      worldHitbox.width,
      worldHitbox.height,
      { isColliding: true },
    );
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
}
