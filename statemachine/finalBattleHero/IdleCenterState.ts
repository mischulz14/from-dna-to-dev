import { State } from '../../api/state';
import FinalBattleHero from '../../gameObjects/FinalBattleHero';

export default class IdleCenterState implements State {
  hero: FinalBattleHero;
  constructor(hero: FinalBattleHero) {
    this.hero = hero;
  }

  enter() {
    this.hero.anims.play('final-idle-center', true);
  }

  update() {
    // if any of the cursors are down, switch to run state
    if (Phaser.Input.Keyboard.JustDown(this.hero.cursors.left)) {
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
        });
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.hero.cursors.right)) {
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
        });
      return;
    }
  }
}
