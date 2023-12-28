import { State } from '../../api/state';
import { finalBattleSpriteInfos } from '../../data/finalBattleSpriteInfos';
import Bug from '../../gameObjects/Bug';
import FinalBattleScene from '../../scenes/FinalBattleScene';

export default class MinionPhaseState implements State {
  animationOptions: string[];
  minionOptions: Array<'htmlbug' | 'reactbug' | 'cssbug'>;
  currentMinions: Bug[];
  currentAnimation: string;
  scene: FinalBattleScene;
  continueBehavior: boolean = true;

  constructor(scene: any) {
    this.animationOptions = [
      'finalBoss-punch-left',
      'finalBoss-punch-right',
      'finalBoss-punch-middle-left',
      'finalBoss-punch-middle-right',
      'finalBoss-punch-middle',
      'finalBoss-punch-both',
    ];

    this.minionOptions = ['htmlbug', 'cssbug', 'reactbug'];
    this.currentAnimation = this.getRandomAnimation();
    this.scene = scene;
    this.continueBehavior = true;
    this.currentMinions = [];
  }

  async update() {
    for (let i = this.currentMinions.length - 1; i >= 0; i--) {
      this.currentMinions[i].update();
      if (this.currentMinions[i].y > 440) {
        this.currentMinions[i].destroy();
        // Replace isDone with your condition
        this.currentMinions.splice(i, 1);
      }
    }

    if (this.continueBehavior) {
      this.continueBehavior = false;
      this.getFinalBossBehavior();
      return;
    }
  }

  enter() {
    console.log('entering minion phase state');
  }

  getRandomAnimation(): string {
    return this.animationOptions[
      Math.floor(Math.random() * this.animationOptions.length)
    ];
  }

  getFinalBossBehavior() {
    const animation = this.getRandomAnimation();
    let animationType;

    if (animation.includes('finalBoss-punch-left')) {
      animationType = 'left';
    } else if (animation.includes('finalBoss-punch-right')) {
      animationType = 'right';
    } else if (animation.includes('finalBoss-punch-middle-right')) {
      animationType = 'middle-right';
    } else if (animation.includes('finalBoss-punch-middle-left')) {
      animationType = 'middle-left';
    } else if (animation.includes('finalBoss-punch-middle')) {
      animationType = 'middle';
    } else if (animation.includes('finalBoss-punch-both')) {
      animationType = 'both';
    }

    this.scene.finalBoss.play(animation).anims.msPerFrame =
      this.scene.finalBoss.speed;
    const animationCompleteListener = () => {
      // Remove the listener to prevent multiple triggers
      this.scene.finalBoss.off('animationcomplete', animationCompleteListener);
      this.continueBehavior = true;

      switch (animationType) {
        case 'left':
          this.spawnRandomMinion({ x: 320, y: 80 });
          break;
        case 'right':
          this.spawnRandomMinion({ x: 480, y: 80 });
          break;
        case 'middle-left':
          this.spawnRandomMinion({ x: 320, y: 80 });
          this.spawnRandomMinion({ x: 400, y: 80 });
          break;
        case 'middle-right':
          this.spawnRandomMinion({ x: 400, y: 80 });
          this.spawnRandomMinion({ x: 480, y: 80 });
          break;
        case 'middle':
          this.spawnRandomMinion({ x: 400, y: 80 });
          break;
        case 'both':
          this.spawnRandomMinion({ x: 320, y: 80 });
          this.spawnRandomMinion({ x: 480, y: 80 });
          break;
        // Optional: default case if needed
        default:
          console.log('Unexpected animation type:', animationType);
          break;
      }
    };

    // Attach the event listener
    this.scene.finalBoss.on('animationcomplete', animationCompleteListener);
  }

  spawnRandomMinion(position: { x: number; y: number }) {
    const randomMinion =
      this.minionOptions[Math.floor(Math.random() * this.minionOptions.length)];

    switch (randomMinion) {
      case 'htmlbug':
        const htmlbug = new Bug(
          this.scene,
          position.x,
          position.y,
          'htmlbug',
          10,
          'html',
        );
        this.currentMinions.push(htmlbug);
        break;
      case 'cssbug':
        const cssbug = new Bug(
          this.scene,
          position.x,
          position.y,
          'cssbug',
          20,
          'css',
        );
        this.currentMinions.push(cssbug);

        break;
      case 'reactbug':
        const reactbug = new Bug(
          this.scene,
          position.x,
          position.y,
          'reactbug',
          30,
          'react',
        );
        this.currentMinions.push(reactbug);
        break;
      default:
        break;
    }
  }
}
