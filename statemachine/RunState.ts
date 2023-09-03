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
    let x = 0,
      y = 0;

    // Transition to attack state
    if (
      keyIsDown(this.hero.inputAKey) &&
      anyOfTheCursorKeysAreDown(this.hero.cursors)
    ) {
      this.hero.setVelocity(0);
      this.hero.playerStateMachine.switchState('attack');
      return;
    }

    // Transition to evade state
    if (
      keyIsDown(this.hero.inputSKey) &&
      anyOfTheCursorKeysAreDown(this.hero.cursors)
    ) {
      this.hero.setVelocity(0);
      this.hero.playerStateMachine.switchState('evade');
      return;
    }

    // Transition to idle state
    if (!anyOfTheCursorKeysAreDown(this.hero.cursors)) {
      this.hero.setVelocity(0);
      this.hero.playerStateMachine.switchState('idle');
      return;
    }

    // Horizontal Movement
    if (this.hero.cursors.left.isDown) {
      x = -1;
      this.hero.lastDirection = 'left';
    } else if (this.hero.cursors.right.isDown) {
      x = 1;
      this.hero.lastDirection = 'right';
    }

    // Vertical Movement
    if (this.hero.cursors.up.isDown) {
      y = -1;
      this.hero.lastDirection = 'up';
    } else if (this.hero.cursors.down.isDown) {
      y = 1;
      this.hero.lastDirection = 'down';
    }

    // Normalize diagonal movement
    if (x !== 0 && y !== 0) {
      x /= Math.sqrt(2);
      y /= Math.sqrt(2);
    }

    // Update velocity and animation
    this.hero.setVelocity(x * this.hero.speed, y * this.hero.speed);
    this.hero.anims.play('battle-run-' + this.hero.lastDirection, true);
  }
}
