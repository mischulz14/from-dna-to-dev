import { State } from '../../api/state';
import Hero from '../../gameObjects/Hero';
import { isMobileScreen } from '../../src/app';
import { anyOfTheCursorKeysAreDown } from '../../utils/keyIsDown';

export default class IdleState implements State {
  hero: Hero;
  constructor(hero: Hero) {
    this.hero = hero;
    console.log(isMobileScreen);
  }

  enter() {
    this.hero.anims.play(
      this.hero.animPrefix + '-idle-' + this.hero.lastDirection,
      true,
    );
  }

  update() {
    // if any of the cursors are down, switch to run state
    if (
      anyOfTheCursorKeysAreDown(this.hero.cursors) ||
      (isMobileScreen && this.anyOfTheMobileButtonsAreDown())
    ) {
      console.log('switching to run state');
      this.hero.stateMachine.switchState('run');
      return;
    }

    this.hero.play(
      this.hero.animPrefix + '-idle-' + this.hero.lastDirection,
      true,
    );
  }

  anyOfTheMobileButtonsAreDown() {
    return (
      this.hero.mobileCursors.up.isDown ||
      this.hero.mobileCursors.down.isDown ||
      this.hero.mobileCursors.left.isDown ||
      this.hero.mobileCursors.right.isDown
    );
  }
}
