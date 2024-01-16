import { State } from '../../api/state';
import FinalBattleHero from '../../gameObjects/FinalBattleHero';
import { isMobileScreen } from '../../src/app';

export default class IdleCenterState implements State {
  hero: FinalBattleHero;
  switchingState = false;
  constructor(hero: FinalBattleHero) {
    this.hero = hero;
    this.switchingState = false;
  }

  enter() {
    this.hero.anims.play('final-idle-center', true);

    if (isMobileScreen) {
      this.switchingState = true;
      setTimeout(() => {
        this.switchingState = false;
      }, 50);
    }
  }

  update() {
    // if any of the cursors are down, switch to run state
    if (
      Phaser.Input.Keyboard.JustDown(this.hero.cursors.left) ||
      this.hero.mobileCursors.left.isDown
    ) {
      if (this.switchingState) return;
      this.switchingState = true;
      this.hero.scene.tweens
        .add({
          targets: this.hero,
          x: this.hero.x - 100,
          duration: 100,
          ease: 'Linear',
          repeat: 0,
        })
        .on('complete', () => {
          this.hero.stateMachine.switchState('idleLeft');
          this.switchingState = false;
        });
      return;
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.hero.cursors.right) ||
      this.hero.mobileCursors.right.isDown
    ) {
      if (this.switchingState) return;
      this.switchingState = true;
      this.hero.scene.tweens
        .add({
          targets: this.hero,
          x: this.hero.x + 100,
          duration: 50,
          ease: 'Linear',
          repeat: 0,
        })
        .on('complete', () => {
          this.hero.stateMachine.switchState('idleRight');
          this.switchingState = false;
        });
      return;
    }
  }
}
