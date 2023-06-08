import 'phaser';

import { Events } from 'phaser';

import DialogueField from '../dialogue/DialogueField';

export default class LabCutscene extends Phaser.Scene {
  gameEvents: Events.EventEmitter;
  dialogueField: DialogueField;
  constructor() {
    super({ key: 'LabCutscene' });
    const dialogueField = new DialogueField();
    this.gameEvents = new Phaser.Events.EventEmitter();
    this.gameEvents.on('progressDialogue', this.progressDialogue, this);
    dialogueField.show();
  }

  preload() {
    this.load.image('labCutscene', 'assets/labCutscene.png');
  }

  create() {
    this.add.image(0, 4, 'labCutscene').setOrigin(0, 0).setScale(8);
    this.dialogueField.show();
  }

  update() {}

  progressDialogue() {}
}
