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
        console.log(`Destroying bug at y: ${this.currentMinions[i].y}`);
        this.currentMinions[i].destroy();
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
    const timeInPhase =
      this.scene.currentPhase === 0
        ? 10000
        : 5000 * (this.scene.currentPhase + 1);
    this.continueBehavior = true;
    setTimeout(() => {
      this.continueBehavior = false;
      this.currentMinions.forEach((minion) => {
        if (minion.active) {
          console.log('destroying minion');
          minion.destroy();
        }
      });
      this.currentMinions = [];
      this.scene.children.each((child) => {
        if (child instanceof Bug) {
          child.destroy();
        }
      });
      console.log(this.currentMinions, 'current minions');
      console.log('switching to explanation');
      this.scene.finalBoss.anims.play(
        finalBattleSpriteInfos.finalBoss.animations[0].name,
        true,
      );

      this.scene.tweens
        .add({
          targets: this.scene.finalBoss,
          x: '-=10',
          ease: 'Power1',
          duration: 50,
          yoyo: true,
          repeat: 3,
        })
        .on('complete', () => {
          setTimeout(() => {
            this.scene.stateMachine.switchState('explanation');
            this.scene.finalBoss.healthBar.decrease(
              this.scene.finalBoss.healthBar.initialHealth /
                this.scene.phases.length,
            );
          }, 2000);
        });
    }, timeInPhase);

    // remove event listener
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

    const baseFrameRate = 10; // 10 frames per second for phase 1
    const additionalFrameRatePerPhase = 2; // Increase frame rate by 10 fps per phase
    const frameRateForCurrentPhase =
      baseFrameRate +
      additionalFrameRatePerPhase * (this.scene.currentPhase - 1);

    // Set the frame rate for the animation
    this.scene.finalBoss.anims.play(animation, true);
    this.scene.finalBoss.anims.msPerFrame = 1000 / frameRateForCurrentPhase;

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
