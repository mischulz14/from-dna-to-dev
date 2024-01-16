import { State } from '../../api/state';
import Hero from '../../gameObjects/Hero';
import { isMobileScreen } from '../../src/app';
import { anyOfTheCursorKeysAreDown } from '../../utils/keyIsDown';

export default class RunState implements State {
  hero: Hero;
  constructor(hero) {
    this.hero = hero;
    console.log(isMobileScreen);
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
    if (
      (!isMobileScreen && !anyOfTheCursorKeysAreDown(this.hero.cursors)) ||
      (isMobileScreen && this.noMobileButtonsPressed())
    ) {
      this.hero.setVelocity(0);
      this.hero.stateMachine.switchState('idle');
      return;
    }
    if (
      this.hero.cursors.left.isDown ||
      (isMobileScreen && this.hero.mobileCursors.left.isDown)
    ) {
      x = -1;
    } else if (
      this.hero.cursors.right.isDown ||
      (isMobileScreen && this.hero.mobileCursors.right.isDown)
    ) {
      x = 1;
    } else if (
      this.hero.cursors.up.isDown ||
      (isMobileScreen && this.hero.mobileCursors.up.isDown)
    ) {
      y = -1;
    } else if (
      this.hero.cursors.down.isDown ||
      (isMobileScreen && this.hero.mobileCursors.down.isDown)
    ) {
      y = 1;
    }

    // Update velocity and animation
    this.hero.setVelocity(x * this.hero.speed, y * this.hero.speed);
    this.hero.anims.play(
      this.hero.animPrefix + '-run-' + this.hero.lastDirection,
      true,
    );
  }

  noMobileButtonsPressed() {
    return (
      !this.hero.mobileCursors.up.isDown &&
      !this.hero.mobileCursors.down.isDown &&
      !this.hero.mobileCursors.left.isDown &&
      !this.hero.mobileCursors.right.isDown
    );
  }
}
