import DialogueController from '../dialogue/DialogueController';
import DialogueNode from '../dialogue/DialogueNode';

export default class LabCutscene extends Phaser.Scene {
  dialogueController: DialogueController;
  transitionRect: Phaser.GameObjects.Rectangle;

  constructor() {
    super({ key: 'LabCutscene' });
    const dialogue = [
      new DialogueNode('After a long day of work, you look out of the window.'),
      new DialogueNode(
        'All this battling with stress, all of those nightshifts and sleep deprivation is certainly taking a toll on you...',
      ),
      new DialogueNode(
        'This was not how you imagined it to be when you were studying to become a scientist...',
      ),
      new DialogueNode(
        'Is this really what you want to do for the rest of your life?',
      ),
      new DialogueNode(
        'You should probably take a vacation and maybe you will feel better afterwards...',
      ),
    ];
    this.dialogueController = new DialogueController(this);
    this.dialogueController.initiateDialogueNodesArray(dialogue, null, null);
  }

  preload() {
    this.dialogueController.dialogueField.show();

    this.input.keyboard.on(
      'keydown-ENTER',
      this.dialogueController.playerPressesEnterEventListener,
    );
  }

  create() {
    this.dialogueController.dialogueField.show();
    this.dialogueController.typeText();
    this.dialogueController.isDialogueInCutscene = true;

    this.anims.create({
      key: 'labCutsceneSprite',
      frames: this.anims.generateFrameNumbers('LabCutsceneSprite', {
        start: 0,
        end: 7,
      }),
      frameRate: 4,
      repeat: -1,
    });

    const sprite = this.add.sprite(0, 0, 'LabCutsceneSprite').setOrigin(0, 0);
    sprite.setScale(8.2);

    // Start the animation
    sprite.play('labCutsceneSprite');

    this.events.on('dialogueEnded', () => {
      // this.input.keyboard.removeAllListeners('keydown-ENTER');
      this.dialogueController.dialogueField.hide();
      this.dialogueController.isDialogueInCutscene = false;

      this.cutsceneTransitionNormal();

      setTimeout(() => {
        this.scene.stop('LabCutscene');
        this.scene.start('WohnungsIntroScene');
      }, 2000);
    });

    // rectangle for transitions
    this.transitionRect = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
      .setOrigin(0, 0);
    this.transitionRect.setAlpha(0); // Start with 0 opacity

    this.cutsceneTransitionReverse();
  }

  progressDialogue() {
    this.dialogueController.progressDialogue();
  }

  cutsceneTransitionNormal() {
    this.tweens.add({
      targets: this.transitionRect,
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 3000,
      repeat: 0,
    });
  }

  cutsceneTransitionBlinking() {
    this.tweens.add({
      targets: this.transitionRect,
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 300,
      yoyo: true,
      repeat: 3,
    });
  }

  cutsceneTransitionReverse() {
    this.tweens.add({
      targets: this.transitionRect,
      alpha: { from: 1, to: 0 },
      ease: 'Linear',
      duration: 5000,
      repeat: 0,
    });
  }
}
