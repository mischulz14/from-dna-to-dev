import { State } from '../api/state';
import LabHeroTest from '../gameObjects/LabHeroTest';
import { anyOfTheCursorKeysAreDown, keyIsDown } from '../utils/keyIsDown';

export default class IdleState implements State {
  hero: LabHeroTest;
  constructor(hero: LabHeroTest) {
    this.hero = hero;
  }

  enter() {
    this.hero.anims.play('battle-idle-' + this.hero.lastDirection, true);
  }

  update() {
    // if any of the cursors are down, switch to run state
    if (anyOfTheCursorKeysAreDown(this.hero.cursors)) {
      this.hero.playerStateMachine.switchState('run');
      return;
    }

    // if the A key is down, switch to attack state
    if (keyIsDown(this.hero.inputAKey)) {
      this.hero.playerStateMachine.switchState('attack');
      return;
    }

    this.hero.play('battle-idle-' + this.hero.lastDirection, true);
  }
}
