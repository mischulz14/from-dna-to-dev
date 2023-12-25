import { State } from '../../api/state';
import Hero from '../../gameObjects/Hero';
import { anyOfTheCursorKeysAreDown } from '../../utils/keyIsDown';

export default class IdleState implements State {
  hero: Hero;
  constructor(hero: Hero) {
    this.hero = hero;
  }

  enter() {
    this.hero.anims.play(
      this.hero.animPrefix + '-idle-' + this.hero.lastDirection,
      true,
    );
  }

  update() {
    // if any of the cursors are down, switch to run state
    if (anyOfTheCursorKeysAreDown(this.hero.cursors)) {
      this.hero.stateMachine.switchState('run');
      return;
    }

    this.hero.play(
      this.hero.animPrefix + '-idle-' + this.hero.lastDirection,
      true,
    );
  }
}
