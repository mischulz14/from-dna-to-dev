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
    }

    this.rectangle = this.scene.add
      .rectangle(150, 150, 500, 200, 0xffffff)
      .setOrigin(0, 0)
      .setAlpha(0);
    this.text = this.scene.add
      .text(160, 180, this.scene.phases[this.scene.currentPhase].text, {
        fontSize: '24px',
        fontFamily: 'Rainyhearts',
        color: '#000000',
      })
      .setAlpha(0);

    this.revealExplanation();
  }

  update() {}

  revealExplanation() {
    this.scene.tweens.add({
      targets: this.rectangle,
      alpha: 1,
      ease: 'Linear',
      duration: 2000,
      repeat: 0,
    });

    this.scene.tweens.add({
      targets: this.text,
      alpha: 1,
      ease: 'Linear',
      duration: 2000,
      repeat: 0,
    });

    this.scene.tweens.add({
      targets: this.target,
      alpha: 1,
      ease: 'Linear',
      duration: 2000,
      repeat: 0,
    });

    setTimeout(() => {
      this.scene.stateMachine.switchState(
        this.scene.phases[this.scene.currentPhase].nextPhase,
      );
    }, 4000);
  }
}
