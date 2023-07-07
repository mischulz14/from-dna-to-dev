import LabHeroTest from '../gameObjects/LabHeroTest';

export default class AttackState {
  hero: LabHeroTest;
  isAttackingAgain: boolean;
  hitbox: any;
  constructor(hero: LabHeroTest) {
    this.hero = hero;
    this.enter();
  }

  enter() {
    this.playAttackAnimation();
    this.attack();
  }

  update() {
    if (
      Phaser.Input.Keyboard.JustDown(this.hero.scene.input.keyboard.addKey('A'))
    ) {
      this.isAttackingAgain = true;
    }
    // The A key is down
    if (this.hero.anims.currentFrame.isLast && this.isAttackingAgain) {
      this.hero.playerStateMachine.switchState('followUpAttack');
      this.isAttackingAgain = false;
    } else if (this.hero.anims.currentFrame.isLast) {
      this.hero.playerStateMachine.switchState('idle');
      this.isAttackingAgain = false;
    }
  }

  attack() {
    // const animationDuration = this.hero.scene.anims.get(
    //   'attack-' + this.hero.lastDirection,
    // ).duration;

    // get the duration it takes to get to the third frame of the attack animation
    const delay = 300;

    this.hitbox = this.createHitbox();

    let graphics = this.hero.scene.add.graphics();

    // check if enemy is in the hitbox
    this.hero.scene.time.delayedCall(delay, () =>
      this.checkEnemyHit(this.hitbox),
    );

    // draw the hitbox
    graphics.lineStyle(2, 0xff0000);
    graphics.strokeRect(
      this.hitbox.x,
      this.hitbox.y,
      this.hitbox.width,
      this.hitbox.height,
    );

    // remove the hitbox after the animation is done
    this.hero.scene.time.delayedCall(delay, () => {
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
      up: this.hero.x - xOffset,
      down: this.hero.x - xOffset,
      left: this.hero.x - this.hero.width + 20,
      right: this.hero.x + this.hero.width / 2 - 20,
    };

    this.hitbox = new Phaser.Geom.Rectangle(
      xMap[this.hero.lastDirection],
      this.hero.y + yOffsetMap[this.hero.lastDirection],
      hitBoxSize,
      hitBoxSize,
    );

    return this.hitbox;
  }

  checkEnemyHit(hitbox) {
    this.hero.scene.enemies.forEach((enemy) => {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(hitbox, enemy.getBounds())
      ) {
        console.log('Enemy hit!');
        if (enemy.isTakingDamage) return;
        enemy.hit();
        enemy.healthBar.decrease(this.hero.damage);
        enemy.isTakingDamage = true;

        setTimeout(() => {
          enemy.isTakingDamage = false;
        }, 300);

        console.log(enemy.healthBar.health);
      }
    });

    // check for boss hit
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        hitbox,
        this.hero.scene.boss.getBounds(),
      )
    ) {
      console.log('Boss hit!');
      if (this.hero.scene.boss.isTakingDamage) return;
      this.hero.scene.boss.hit();
      this.hero.scene.boss.healthBar.decrease(10);
      this.hero.scene.boss.isTakingDamage = true;

      setTimeout(() => {
        this.hero.scene.boss.isTakingDamage = false;
      }, 300);

      console.log(this.hero.scene.boss.healthBar.health);
    }
  }

  playAttackAnimation() {
    this.hero.anims.play('attack-' + this.hero.lastDirection, true);
  }
}
