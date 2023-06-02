import * as Phaser from 'phaser';

import DialogueField from '../dialogue/DialogueField';
import DialogueIndication from '../dialogue/DialogueIndication';
import DialogueNode from '../dialogue/DialogueNode';

export default class InteractiveGameObject extends Phaser.Physics.Arcade
  .Sprite {
  dialogueIndicator: Phaser.GameObjects.DOMElement;
  dialogueIndictaorKey: string;
  dialogueIndictaorText: string;
  currentDialogue: HTMLDivElement | null;
  currentDialogueNode: DialogueNode | null;
  isSpeaking: boolean;
  dialogueEnded: boolean;
  dialogue: string[];
  dialogueField: DialogueField;
  dialogueNodes: DialogueNode[];
  currentDialogueNodeIndex: number;
  playerIsChosing: boolean;
  isDialogueEndingAfterChosingThisOption: boolean;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    // dialogue: string[],
    dialogueNodes: DialogueNode[],
    dialogueIndictaorKey: string,
    dialogueIndictaorText: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);
    this.dialogueIndicator = null;
    this.isSpeaking = false;
    // this.dialogue = dialogue;
    this.dialogueField = new DialogueField();
    this.dialogueIndictaorKey = dialogueIndictaorKey;
    this.dialogueIndictaorText = dialogueIndictaorText;
    this.dialogueNodes = dialogueNodes;
    this.currentDialogueNodeIndex = 0;
    this.playerIsChosing = false;
    this.isDialogueEndingAfterChosingThisOption = false;
    // Add this instance to the scene's display list and update list
    // this.behaviorLoop();
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.advanceDialogueEventListener();
  }

  // talkToHero(dialogueProgressNumber: number) {
  //   this.currentDialogue = this.dialogueField?.dialogueField;
  //   if (!this.dialogue) {
  //     console.error('Dialogue is undefined!');
  //     return;
  //   }
  //   // as long as the dialogue is not finished, keep showing the dialogue. The dialogue is finished when the dialogueProgressNumber is equal to the length of the dialogue array. The dialogueProgressNumber is increased by 1 every time the user presses the dialogueTrigger specified in the globalGameState.ts file.
  //   if (dialogueProgressNumber >= this.dialogue.length) {
  //     this.dialogueField?.hide();
  //     this.currentDialogue = null;
  //     this.isSpeaking = false;
  //     this.dialogueEnded = true;

  //     // if the dialogue is finished, hide the dialogue and return true
  //   } else {
  //     this.dialogueField?.show();
  //     this.isSpeaking = true;
  //     this.dialogueEnded = false;
  //     this.dialogueField?.setText(this.dialogue[dialogueProgressNumber]);
  //   }
  // }
  preload() {}

  talkToHero() {
    // html element of the dialogue field
    if (this.playerIsChosing) {
      this.dialogueEnded = true;
    }
    if (this.isDialogueEndingAfterChosingThisOption) {
      this.endDialogue();
      return;
    }
    this.currentDialogue = this.dialogueField?.dialogueField;

    if (this.currentDialogueNodeIndex >= this.dialogueNodes.length) {
      this.endDialogue();
    } else {
      this.dialogueField?.show();
      this.isSpeaking = true;
      this.dialogueEnded = false;
      this.currentDialogueNode =
        this.dialogueNodes[this.currentDialogueNodeIndex];
      this.dialogueField?.setText(this.currentDialogueNode.text);
      if (this.currentDialogueNode.options.length > 0) {
        this.playerIsChosing = true;
        // set short timeout and then show options
        this.currentDialogueNode.showOptions();
      } else {
        this.playerIsChosing = false;
      }
      // this.currentDialogueNode.isCompleted = true;
    }
  }

  showSpeechIndication(isColliding: boolean) {
    if (this.dialogueIndicator === null) {
      // Create the dialogue box
      this.dialogueIndicator = this.scene.add.dom(
        this.x + 20,
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

  advanceDialogueEventListener() {
    document.addEventListener(
      'keydown',
      function (event) {
        if (this.playerIsChosing && event.key === 'Enter') {
          if (this.currentDialogueNode.currentlySelectedOption === null) {
            this.isDialogueEndingAfterChosingThisOption = true;
            return;
          }
          if (this.currentDialogueNode.currentlySelectedOption.endDialogue) {
            this.isDialogueEndingAfterChosingThisOption = true;
            return;
          }

          if (
            this.currentDialogueNode.currentlySelectedOption.nextNodeIndex !==
            null
          ) {
            this.currentDialogueNodeIndex =
              this.currentDialogueNode.currentlySelectedOption.nextNodeIndex;
            this.currentDialogueNode =
              this.dialogueNodes[this.currentDialogueNodeIndex];
            this.dialogueField?.setText(this.currentDialogueNode.text);
            this.currentDialogueNode?.hideOptions();
          }
          this.currentDialogueNode.currentlySelectedOption = null;
        }

        if (!this.playerIsChosing && this.isSpeaking && event.key === 'Enter') {
          if (this.currentDialogue.currentlySelectedOption.endDialogue) {
            this.isDialogueEndingAfterChosingThisOption = true;
            return;
          }
          this.currentDialogueNodeIndex += 1;
        }
      }.bind(this),
    );
  }

  endDialogue() {
    console.log('end dialogue');
    this.dialogueField?.hide();
    this.currentDialogue = null;
    this.isSpeaking = false;
    this.dialogueEnded = true;
    this.currentDialogueNodeIndex = 0;
    this.playerIsChosing = false;
    this.currentDialogueNode.hideOptions();
    this.currentDialogueNode.currentlySelectedOption = null;
    this.isDialogueEndingAfterChosingThisOption = false;

    for (let node of this.dialogueNodes) {
      node.alreadyShownOptions = false;
    }
  }
}
