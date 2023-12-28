import { State } from '../../api/state';
import DialogueNode from '../../dialogue/DialogueNode';
import FinalBattleScene from '../../scenes/FinalBattleScene';

export default class ExplanationState implements State {
  scene: FinalBattleScene;
  dialogue: DialogueNode[];
  rectangle: Phaser.GameObjects.Rectangle;
  text: Phaser.GameObjects.Text;
  target: Phaser.GameObjects.Sprite;

  constructor(scene: FinalBattleScene) {
    this.scene = scene;
    this.target = this.scene.phases[this.scene.currentPhase].animationTarget;
  }

  enter() {
    if (this.scene.currentPhase !== 0) {
      this.scene.currentPhase += 1;
    }

    if (this.scene.currentPhase === 0) {
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

    this.rectangle = this.scene.add
      .rectangle(150, 150, 500, 200, 0xffffff)
      .setOrigin(0, 0)
      .setAlpha(0);
    this.text = this.scene.add
      .text(170, 180, this.scene.phases[this.scene.currentPhase].text, {
        fontSize: '22px',
        fontFamily: 'Rainyhearts',
        color: '#000000',
        wordWrap: { width: 480 },
      })
      .setAlpha(0);

    this.scene.finalBoss.play('final-boss-idle', true);

    this.revealExplanation();
  }

  async update() {
    // if player presses one of the right or left arrow keys twice or click with the mouse twice, switch to next phase
    if (
      this.scene.keys.left.isDown ||
      this.scene.keys.right.isDown ||
      this.scene.input.activePointer.isDown
    ) {
      await this.exit();
      this.scene.stateMachine.switchState(
        this.scene.phases[this.scene.currentPhase].nextPhase,
      );
    }
  }

  revealExplanation() {
    this.scene.tweens.add({
      targets: this.rectangle,
      alpha: 1,
      ease: 'Linear',
      duration: 1000,
      repeat: 0,
    });

    this.scene.tweens.add({
      targets: this.text,
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
    this.scene.tweens.add({
      targets: this.rectangle,
      alpha: 0,
      ease: 'Linear',
      duration: 1000,
      repeat: 0,
    });

    this.scene.tweens.add({
      targets: this.text,
      alpha: 0,
      ease: 'Linear',
      duration: 1000,
      repeat: 0,
    });

    this.scene.tweens.add({
      targets: this.target,
      alpha: 0,
      ease: 'Linear',
      duration: 1000,
      repeat: 0,
    });
  }
}
