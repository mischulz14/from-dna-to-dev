import * as Phaser from 'phaser';

import DialogueField from '../dialogue/DialogueField';
import DialogueIndication from '../dialogue/DialogueIndication';

export default class InteractiveGameObject extends Phaser.Physics.Arcade
  .Sprite {
  dialogueIndicator: Phaser.GameObjects.DOMElement;
  dialogueIndictaorKey: string;
  dialogueIndictaorText: string;
  currentDialogue: HTMLDivElement | null;
  isSpeaking: boolean;
  dialogueEnded: boolean;
  dialogue: string[];
  dialogueField: DialogueField;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    dialogue: string[],
    dialogueIndictaorKey: string,
    dialogueIndictaorText: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);
    this.dialogueIndicator = null;
    this.isSpeaking = false;
    this.dialogue = dialogue;
    this.dialogueField = new DialogueField();
    this.dialogueIndictaorKey = dialogueIndictaorKey;
    this.dialogueIndictaorText = dialogueIndictaorText;
    // Add this instance to the scene's display list and update list
    // this.behaviorLoop();
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  talkToHero(dialogueProgressNumber: number) {
    this.currentDialogue = this.dialogueField?.dialogueField;
    if (!this.dialogue) {
      console.error('Dialogue is undefined!');
      return;
    }
    // as long as the dialogue is not finished, keep showing the dialogue. The dialogue is finished when the dialogueProgressNumber is equal to the length of the dialogue array. The dialogueProgressNumber is increased by 1 every time the user presses the dialogueTrigger specified in the globalGameState.ts file.
    if (dialogueProgressNumber >= this.dialogue.length) {
      this.dialogueField?.hide();
      this.currentDialogue = null;
      this.isSpeaking = false;
      this.dialogueEnded = true;

      // if the dialogue is finished, hide the dialogue and return true
    } else {
      this.dialogueField?.show();
      this.isSpeaking = true;
      this.dialogueEnded = false;
      this.dialogueField?.setText(this.dialogue[dialogueProgressNumber]);
    }
  }

  showSpeechIndication(isColliding: boolean) {
    if (this.dialogueIndicator === null) {
      // Create the dialogue box
      this.dialogueIndicator = this.scene.add.dom(
        this.x,
        this.y - 50,
        new DialogueIndication(
          this.dialogueIndictaorKey,
          this.dialogueIndictaorText,
        ).indication,
      );
      this.dialogueIndicator?.setDepth(1);
    }

    // Show or hide the dialogue box
    this.dialogueIndicator.setVisible(isColliding);
  }
}
