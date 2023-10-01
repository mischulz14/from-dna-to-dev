import { State } from '../api/state';
import LabHero from '../gameObjects/LabHero';
import { anyOfTheCursorKeysAreDown, keyIsDown } from '../utils/keyIsDown';

export default class IdleState implements State {
  hero: LabHero;
  constructor(hero: LabHero) {
    this.hero = hero;
  }

  enter() {
    this.hero.anims.play('idle-' + this.hero.lastDirection, true);
  }

  update() {
    // if any of the cursors are down, switch to run state
    if (anyOfTheCursorKeysAreDown(this.hero.cursors)) {
      this.hero.stateMachine.switchState('run');
      return;
    }

    this.hero.play('idle-' + this.hero.lastDirection, true);
  }
}
