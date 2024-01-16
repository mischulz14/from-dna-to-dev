import { State } from '../../api/state';
import { finalBattleSpriteInfos } from '../../data/finalBattleSpriteInfos';
import DialogueNode from '../../dialogue/DialogueNode';
import Bug from '../../gameObjects/Bug';
import PostgresElephant from '../../gameObjects/PostgresElephant';
import FinalBattleScene from '../../scenes/FinalBattleScene';
import { isMobileScreen } from '../../src/app';
import { transitionToDNASceneAndBack } from '../../utils/sceneTransitions';

export default class ExplanationState implements State {
  scene: FinalBattleScene;
  dialogue: DialogueNode[];
  target: Phaser.GameObjects.Sprite;

  constructor(scene: FinalBattleScene) {
    this.scene = scene;

    this.scene.tweens.add({
      targets: this.scene.hero,
      alpha: 1,
      y: 435,
      ease: 'Linear',
      duration: 1000,
      repeat: 0,
    });

    this.scene.tweens.add({
      targets: this.scene.finalBoss,
      alpha: 1,
      y: 75,
      ease: 'Linear',
      duration: 1000,
      repeat: 0,
    });
  }

  enter() {
    this.resetState();

    console.log(
      'entering explanation state',
      this.scene.phases[this.scene.currentPhase],
      'scene.rectangle:',
      this.scene.rectangle,
    );
    if (this.scene.phases[this.scene.currentPhase] === undefined) {
      this.endGame();
      return;
    }

    this.target = this.scene.phases[this.scene.currentPhase].animationTarget;

    // check if there are any bugs or elepahnst in the scene left and remove them
    this.scene.children.each((child) => {
      if (child instanceof Bug || child instanceof PostgresElephant) {
        child.destroy();
      }
    });

    this.scene.rectangle = this.scene.add
      .rectangle(150, 170, 500, 200, 0xffffff)
      .setOrigin(0, 0)
      .setAlpha(0);
    this.scene.text = this.scene.add
      .text(170, 180, this.scene.phases[this.scene.currentPhase].text, {
        fontSize: '22px',
        fontFamily: 'Rainyhearts',
        color: '#000000',
        wordWrap: { width: 480 },
      })
      .setAlpha(0);

    this.scene.text2 = this.scene.add.text(
      325,
      330,
      isMobileScreen ? 'Tap to continue' : 'Press space to continue',
      {
        fontSize: '18px',
        fontFamily: 'Rainyhearts',
        color: '#000000',
        wordWrap: { width: 480 },
      },
    );

    this.scene.finalBoss.play(
      finalBattleSpriteInfos.finalBoss.animations[0].name,
      true,
    );

    this.revealExplanation();
  }

  async update() {
    this.scene.children.each((child) => {
      if (child instanceof Bug || child instanceof PostgresElephant) {
        child.destroy();
      }
    });
    // if player presses one of the right or left arrow keys twice or click with the mouse twice, switch to next phase
    if (
      this.scene.keys.space.isDown ||
      (isMobileScreen && this.scene.canProgress)
    ) {
      await this.exit();
      console.log(
        'switching to:',
        this.scene.phases[this.scene.currentPhase].nextPhase,
      );
      this.scene.stateMachine.switchState(
        this.scene.phases[this.scene.currentPhase].nextPhase,
      );
      this.scene.currentPhase += 1;
    }
  }

  revealExplanation() {
    console.log('reveal explanation');

    this.scene.tweens.add({
      targets: this.scene.rectangle,
      alpha: 1,
      ease: 'Linear',
      duration: 1000,
      repeat: 0,
    });

    this.scene.tweens.add({
      targets: this.scene.text,
      alpha: 1,
      ease: 'Linear',
      duration: 1000,
      repeat: 0,
    });

    this.scene.tweens.add({
      targets: this.target,
      alpha: 1,
      ease: 'Linear',
      duration: 1000,
      repeat: 0,
    });
  }

  async exit() {
    setTimeout(() => {
      this.resetState();
    }, 1000);

    this.scene.tweens.add({
      targets: this.scene.rectangle,
      alpha: 0,
      ease: 'Linear',
      duration: 1000,
      repeat: 0,
    });

    this.scene.tweens.add({
      targets: this.scene.text,
      alpha: 0,
      ease: 'Linear',
      duration: 1000,
      repeat: 0,
    });

    this.scene.tweens
      .add({
        targets: this.target,
        alpha: 0,
        ease: 'Linear',
        duration: 1000,
        repeat: 0,
      })
      .on('animationcomplete', () => {
        // destroy all
        console.log(this.scene.text);
      });
  }

  endGame() {
    this.scene.scene.get('FinalBattleScene').children.each((child) => {
      child.destroy();
    });
    // stop current scene
    this.scene.scene.stop('FinalBattleScene');

    transitionToDNASceneAndBack(
      this.scene,
      '',
      ['EndGameScene'],
      4,
      2000,
      true,
    );
  }

  resetState() {
    // Destroy game objects if they exist
    if (this.scene.rectangle) {
      this.scene.rectangle.destroy();
      this.scene.rectangle = null;
    }
    if (this.scene.text) {
      this.scene.text.destroy();
      this.scene.text = null;
    }
    if (this.scene.text2) {
      this.scene.text2.destroy();
      this.scene.text2 = null;
    }
  }
}
