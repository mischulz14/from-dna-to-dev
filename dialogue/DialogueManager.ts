import DialogueField from './DialogueField';

export default class DialogueManager {
  dialougeField: DialogueField;

  constructor(scene: Phaser.Scene) {
    this.dialougeField = new DialogueField();
  }

  startDialogue(dialogue: string[]) {
    this.dialougeField.show();
    this.dialougeField.setText(dialogue[0]);
  }

  nextDialogue(dialogue: string[]) {
    this.dialougeField.setText(dialogue[0]);
  }

  endDialogue() {
    this.dialougeField.hide();
  }
}
