import 'phaser';

import DialogueField from '../dialogue/DialogueField';

export default class LabCutscene extends Phaser.Scene {
  constructor() {
    super({ key: 'LabCutscene' });
    const dialogueField = new DialogueField();
    const gameEvents = new Phaser.Events.EventEmitter();
    dialogueField.show();
  }

  preload() {
    this.load.image('labCutscene', 'assets/labCutscene.png');
  }

  create() {
    this.add.image(0, 4, 'labCutscene').setOrigin(0, 0).setScale(8);
  }

  update() {}
}
