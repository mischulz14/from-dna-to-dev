import { State } from '../../api/state';
import Hero from '../../gameObjects/Hero';
import { anyOfTheCursorKeysAreDown } from '../../utils/keyIsDown';

export default class RunState implements State {
  hero: Hero;
  constructor(hero) {
    this.hero = hero;
  }

  enter() {
    this.hero.anims.play(
      this.hero.animPrefix + '-run-' + this.hero.lastDirection,
      true,
    );
  }

  update() {
    let x = 0,
      y = 0;

    // Transition to idle state
    if (!anyOfTheCursorKeysAreDown(this.hero.cursors)) {
      this.hero.setVelocity(0);
      this.hero.stateMachine.switchState('idle');
      return;
    }

    if (this.hero.cursors.left.isDown) {
      x = -1;
    } else if (this.hero.cursors.right.isDown) {
      x = 1;
    } else if (this.hero.cursors.up.isDown) {
      y = -1;
    } else if (this.hero.cursors.down.isDown) {
      y = 1;
    }

    // Update velocity and animation
    this.hero.setVelocity(x * this.hero.speed, y * this.hero.speed);
    this.hero.anims.play(
      this.hero.animPrefix + '-run-' + this.hero.lastDirection,
      true,
    );
  }
}
