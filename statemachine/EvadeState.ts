import { State } from '../api/state';
import LabHeroTest from '../gameObjects/LabHeroTest';
import checkCollisionWithLayer from '../utils/collisionWithLayer';

export default class EvadeState implements State {
  hero: LabHeroTest;
  constructor(hero) {
    this.hero = hero;
  }

  enter() {
    let distanceToEvade = 150;
    this.hero.anims.play('evade-' + this.hero.lastDirection, true);
    this.hero.isEvading = true;

    let tweenConfig: any = {
      targets: this.hero,
      duration: 200,
      ease: 'Linear',
      onComplete: () => {
        this.hero.playerStateMachine.switchState('idle');
        this.hero.isEvading = false;
      },
    };

    switch (this.hero.lastDirection) {
      case 'up':
        tweenConfig.y = this.hero.y - distanceToEvade;
        break;
      case 'down':
        tweenConfig.y = this.hero.y + distanceToEvade;
        break;
      case 'left':
        tweenConfig.x = this.hero.x - distanceToEvade;
        break;
      case 'right':
        tweenConfig.x = this.hero.x + distanceToEvade;
        break;
    }

    this.hero.scene.tweens.add(tweenConfig);
  }

  update() {}
}
