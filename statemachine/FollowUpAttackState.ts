import LabHeroTest from '../gameObjects/LabHeroTest';
import AttackState from './AttackState';

export default class FollowUpAttackState extends AttackState {
  hero: LabHeroTest;

  update() {
    if (this.hero.anims.currentFrame.isLast) {
      this.hero.playerStateMachine.switchState('idle');
    }
  }

  playAttackAnimation(): void {
    this.hero.anims.play('attack2-' + this.hero.lastDirection, true);
  }
}
