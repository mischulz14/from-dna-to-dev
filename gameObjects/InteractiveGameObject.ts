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
  isDialogueEnding: boolean;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    dialogueNodes: DialogueNode[],
    dialogueIndictaorKey: string,
    dialogueIndictaorText: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);
    this.dialogueIndicator = null;
    this.isSpeaking = false;
    this.dialogueField = new DialogueField();
    this.dialogueIndictaorKey = dialogueIndictaorKey;
    this.dialogueIndictaorText = dialogueIndictaorText;
    this.dialogueNodes = dialogueNodes;
    this.currentDialogueNodeIndex = 0;
    this.playerIsChosing = false;
    this.isDialogueEnding = false;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.advanceDialogueEventListener();
  }

  preload() {}

  talkToHero() {
    if (this.isDialogueEnding) {
      this.endAndResetDialogue();
      return;
    }
    this.currentDialogue = this.dialogueField?.dialogueField;

    if (this.currentDialogueNodeIndex >= this.dialogueNodes.length) {
      this.endAndResetDialogue();
    } else {
      this.dialogueField?.show();
      this.isSpeaking = true;
      this.dialogueEnded = false;
      this.currentDialogueNode =
        this.dialogueNodes[this.currentDialogueNodeIndex];
      this.dialogueField?.setText(this.currentDialogueNode.text);

      if (this.currentDialogueNode.options.length > 0 && !this.dialogueEnded) {
        this.playerIsChosing = true;
        this.currentDialogueNode.showOptions();
      } else {
        this.playerIsChosing = false;
      }
    }
  }

  showSpeechIndication(isColliding: boolean) {
    if (this.dialogueIndicator === null) {
      // Create the dialogue box
      this.dialogueIndicator = this.scene.add.dom(
        this.x - 25,
        this.y - 55,
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
          if (
            this.currentDialogueNode.currentlySelectedOption === null ||
            undefined
          ) {
            this.isDialogueEnding = true;
            return;
          }
          if (
            this.currentDialogueNode.currentlySelectedOption.endDialogue ||
            this.currentDialogueNode.currentlySelectedOption === undefined
          ) {
            // console.log('end dialogue after chosing option');
            this.isDialogueEnding = true;
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
          if (this.currentDialogue.currentlySelectedOption === undefined) {
            // this means that the dialogueNode has no options therefore we progress to the next dialogueNode
            // This is for dialogues that have no options
            this.currentDialogueNodeIndex += 1;
            return;
          }
          if (this.currentDialogue.currentlySelectedOption.endDialogue) {
            this.isDialogueEnding = true;
            return;
          }
        }
      }.bind(this),
    );
  }

  endAndResetDialogue() {
    console.log('end dialogue');
    this.dialogueField?.hide();
    this.currentDialogue = null;
    this.isSpeaking = false;
    this.dialogueEnded = true;
    this.currentDialogueNodeIndex = 0;
    this.playerIsChosing = false;
    this.currentDialogueNode.hideOptions();
    this.currentDialogueNode.currentlySelectedOption = null;
    this.isDialogueEnding = false;

    for (let node of this.dialogueNodes) {
      node.alreadyShownOptions = false;
    }
  }
}
