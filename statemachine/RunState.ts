import { State } from '../api/state';
import LabHeroTest from '../gameObjects/LabHeroTest';
import { anyOfTheCursorKeysAreDown, keyIsDown } from '../utils/keyIsDown';

export default class RunState implements State {
  hero: LabHeroTest;
  constructor(hero) {
    this.hero = hero;
  }

  enter() {
    this.hero.anims.play('battle-run-' + this.hero.lastDirection, true);
  }

  update() {
    //  transition to attack state
    if (
      keyIsDown(this.hero.inputAKey) &&
      anyOfTheCursorKeysAreDown(this.hero.cursors)
    ) {
      this.hero.setVelocity(0);
      this.hero.playerStateMachine.switchState('attack');
      return;
    }

    //  transition to evade state
    if (
      keyIsDown(this.hero.inputSKey) &&
      anyOfTheCursorKeysAreDown(this.hero.cursors)
    ) {
      this.hero.setVelocity(0);
      this.hero.playerStateMachine.switchState('evade');
      return;
    }

    //  transition to idle state
    if (!anyOfTheCursorKeysAreDown(this.hero.cursors)) {
      this.hero.setVelocity(0);
      this.hero.playerStateMachine.switchState('idle');
      return;
    }

    //  transition to run state
    if (anyOfTheCursorKeysAreDown(this.hero.cursors)) {
      if (this.hero.cursors.left.isDown) {
        this.hero.setVelocity(-this.hero.speed, 0);
        this.hero.lastDirection = 'left';
        this.hero.play('battle-run-left', true);
      } else if (this.hero.cursors.right.isDown) {
        this.hero.setVelocity(this.hero.speed, 0);
        this.hero.lastDirection = 'right';
        this.hero.play('battle-run-right', true);
      } else if (this.hero.cursors.up.isDown) {
        this.hero.setVelocity(0, -this.hero.speed);
        this.hero.lastDirection = 'up';
        this.hero.play('battle-run-up', true);
      } else if (this.hero.cursors.down.isDown) {
        this.hero.setVelocity(0, this.hero.speed);
        this.hero.lastDirection = 'down';
        this.hero.play('battle-run-down', true);
      }
      return;
    }
  }
}
