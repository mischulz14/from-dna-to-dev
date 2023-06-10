import DialogueController from '../dialogue/DialogueController';
import DialogueNode from '../dialogue/DialogueNode';

export default class LabCutscene extends Phaser.Scene {
  dialogueController: DialogueController;

  constructor() {
    super({ key: 'LabCutscene' });
    const dialogue = [
      new DialogueNode('You have entered the lab!'),
      new DialogueNode('You can use the arrow keys to move around.'),
    ];
    this.dialogueController = new DialogueController(this);
    this.dialogueController.initiateDialogueNodesArray(dialogue);
  }

  preload() {
    this.dialogueController.dialogueField.show();

    this.input.keyboard.on(
      'keydown-ENTER',
      this.dialogueController.playerPressesEnterEventListener,
    );

    this.load.image('labCutscene', 'assets/labCutscene.png');
  }

  create() {
    this.add.image(0, 4, 'labCutscene').setOrigin(0, 0).setScale(8);
    this.dialogueController.dialogueField.show();
    this.dialogueController.typeText();
  }

  progressDialogue() {
    this.dialogueController.progressDialogue();
    if (
      this.dialogueController.currentDialogueIndex >=
      this.dialogueController.dialogue.length - 1
    ) {
      this.input.keyboard.removeAllListeners('keydown-ENTER');
      this.dialogueController.dialogueField.hide();
      this.scene.stop('LabCutscene');
      this.scene.start('LabScene');
    }
  }
}
