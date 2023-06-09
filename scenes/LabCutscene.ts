import 'phaser';

import { Events } from 'phaser';

import DialogueField from '../dialogue/DialogueField';

export default class LabCutscene extends Phaser.Scene {
  gameEvents: Events.EventEmitter;
  dialogueField: DialogueField;
  playerPressesEnterEventListener: any;
  dialogue: string[];
  currentDialogueIndex: number = 0;
  isTextComplete: boolean = false;
  typeTimeoutId: NodeJS.Timeout;

  constructor() {
    super({ key: 'LabCutscene' });
    this.dialogueField = new DialogueField();
    this.gameEvents = new Phaser.Events.EventEmitter();
    this.gameEvents.on('progressDialogue', this.progressDialogue, this);
    this.dialogue = [
      'Phew that was a really tough day...',
      'I am so tired...',
      "I don't how many more nightshifts I can take...",
      "This really isn't what I imagined when I was studying to become a scientist",
      'I need a vacation',
    ];
  }

  preload() {
    this.dialogueField.show();

    this.playerPressesEnterEventListener = () => {
      if (!this.isTextComplete) {
        this.isTextComplete = true;
        clearTimeout(this.typeTimeoutId);
        this.dialogueField.setText(this.dialogue[this.currentDialogueIndex]);
      } else {
        this.progressDialogue();
      }
    };

    this.input.keyboard.on(
      'keydown-ENTER',
      this.playerPressesEnterEventListener,
    );

    this.load.image('labCutscene', 'assets/labCutscene.png');
  }

  create() {
    this.add.image(0, 4, 'labCutscene').setOrigin(0, 0).setScale(8);
    this.dialogueField.show();
    this.typeText();
  }

  async typeText() {
    let currentText = this.dialogue[this.currentDialogueIndex];
    for (let i = 0; i <= currentText.length; i++) {
      this.dialogueField.setText(currentText.slice(0, i));
      if (!this.isTextComplete) {
        await new Promise(
          (resolve) => (this.typeTimeoutId = setTimeout(resolve, 100)),
        );
      }
    }
    this.isTextComplete = true;
  }

  progressDialogue() {
    if (this.currentDialogueIndex < this.dialogue.length - 1) {
      this.currentDialogueIndex++;
      this.isTextComplete = false;
      this.typeText();
    } else {
      this.input.keyboard.removeAllListeners('keydown-ENTER');
      this.dialogueField.hide();
      this.scene.stop('LabCutscene');
      this.scene.start('LabScene');
    }
  }
}
