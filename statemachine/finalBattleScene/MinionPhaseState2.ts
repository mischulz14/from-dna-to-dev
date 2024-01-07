import { State } from '../../api/state';
import { finalBattleSpriteInfos } from '../../data/finalBattleSpriteInfos';
import PostgresElephant from '../../gameObjects/PostgresElephant';
import FinalBattleScene from '../../scenes/FinalBattleScene';

export default class MinionPhaseState2 implements State {
  animationOptions: string[];
  currentMinions: PostgresElephant[];
  scene: FinalBattleScene;
  arrayIsDefaultEmpty: boolean = true;

  constructor(scene: any) {
    this.scene = scene;
    this.currentMinions = [];
    this.arrayIsDefaultEmpty = true;
  }

  async update() {
    // console.log('all minions are dead', allMinionsAreDead);

    this.currentMinions.forEach((minion) => {
      minion.update();
    });

    let allMinionsAreDead = this.currentMinions.every(
      (minion) => !minion.active,
    );

    if (allMinionsAreDead && !this.arrayIsDefaultEmpty) {
      this.exit();

      return;
    }
  }

  enter() {
    this.arrayIsDefaultEmpty = true;
    this.scene.finalBoss.anims.play(
      finalBattleSpriteInfos.finalBoss.animations[0].name,
      true,
    );
    this.spawnMinions(this.scene.currentPhase + 5);
  }

  async exit() {
    this.scene.finalBoss.healthBar.decrease(
      this.scene.finalBoss.healthBar.initialHealth / this.scene.phases.length,
    );
    this.arrayIsDefaultEmpty = true;
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
        }, 2000);
      });
  }

  spawnMinions(numMinions: number): void {
    for (let i = 0; i < numMinions; i++) {
      // Calculate a random delay between 200ms and 1000ms
      const speed = Math.random() * (1.5 - 1.1) + 1.1;

      // Calculate a random x-coordinate between 250 and 400
      const xCoordinate = Math.random() * (550 - 220) + 220;

      const elephant = new PostgresElephant(
        this.scene,
        xCoordinate,
        50,
        finalBattleSpriteInfos.postgresElephant.texture,
        10,
        'elephant',
      );

      elephant.setSpeed(speed);

      // randomly choose if the elephant follows the hero or not
      const followHero = Math.random() < 0.5;
      if (followHero) {
        elephant.followHero = true;
      }

      this.currentMinions.push(elephant);
    }

    this.arrayIsDefaultEmpty = false;
    console.log('current minions', this.currentMinions);
  }
}
