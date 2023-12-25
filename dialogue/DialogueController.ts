import DialogueField from '../dialogue/DialogueField';
import NPC from '../gameObjects/NPC';
import DialogueNode from './DialogueNode';

export default class DialogueController {
  dialogueField: DialogueField;
  dialogue: DialogueNode[];
  currentDialogueIndex: number = 0;
  isTextComplete: boolean = false;
  typeTimeoutId: NodeJS.Timeout;
  currentDialogueNode: DialogueNode;
  dialogueInProgress: boolean = false;
  isDialogueInCutscene: boolean = false;
  isActiveNPCTalking: boolean = false;
  scene: Phaser.Scene;
  interactiveGameObject: any;
  hero: any;
  triggerEvent: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.dialogueField = new DialogueField();
    this.dialogue = [];
    this.currentDialogueNode = this.dialogue[0];
    this.scene = scene;
  }

  async typeText() {
    let currentText = this.dialogue[this.currentDialogueIndex].text;
    if (!this.dialogue[this.currentDialogueIndex].text) {
      console.log('no text');
      return;
    }
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

  async progressDialogue() {
    console.log('progressing dialogue in dialogueController');

    if (!this.dialogue[this.currentDialogueIndex].text) {
      console.log('no text');
      return;
    }
    if (this.currentDialogueIndex < this.dialogue.length - 1) {
      this.triggerEventWhenDialogueIsProgressed();
      console.log('dialogue progressed in dialogueController');
      // Reset the states of the current node before progressing to the next node
      const currentNode = this.dialogue[this.currentDialogueIndex];
      currentNode.alreadyShownOptions = false;
      currentNode.currentlySelectedOption = null;

      this.currentDialogueIndex++;
      this.isTextComplete = false;
      this.dialogueInProgress = true;
      await this.typeText();
    } else {
      this.resetDialogueAfterDialogueEnds();
    }
  }

  playerPressesEnterEventListener = () => {
    // console.log('player presses enter to progress dialogue');
    if (!this.isActiveNPCTalking && !this.isDialogueInCutscene) return;
    if (!this.isTextComplete) {
      // handle the case when the text is not complete yet
      this.isTextComplete = true;
      clearTimeout(this.typeTimeoutId);
      this.dialogueField.setText(this.dialogue[this.currentDialogueIndex].text);
    } else {
      // handle the case when the text is complete
      const currentNode = this.dialogue[this.currentDialogueIndex];
      if (currentNode.options.length > 0) {
        if (!currentNode.alreadyShownOptions) {
          // If options are not shown yet, show them
          currentNode.showOptions();
        } else {
          // If options are shown, then select the currently selected option
          const selectedOption = currentNode.currentlySelectedOption;
          if (selectedOption) {
            if (selectedOption.endDialogue) {
              this.resetDialogueAfterDialogueEnds(currentNode);
            } else {
              // Move to the next dialogue according to the selected option
              this.currentDialogueIndex = selectedOption.nextNodeIndex;
              this.isTextComplete = false;
              currentNode.hideOptions();
              this.typeText();
            }
          } else {
            console.log('No option selected');
          }
        }
      } else {
        this.progressDialogue();
      }
    }
  };

  resetAlreadyShownOptions() {
    for (let node of this.dialogue) {
      node.alreadyShownOptions = false;
    }
  }

  initiateDialogue(
    dialogue: DialogueNode[],
    interactiveGameObject: any,
    hero: any,
  ) {
    this.dialogue = dialogue;
    this.interactiveGameObject = interactiveGameObject;
    this.hero = hero;
  }

  triggerEventAfterDialogueEnds() {
    this.scene.events.emit('dialogueEnded');
  }

  triggerEventWhenDialogueIsProgressed() {
    this.scene.events.emit('dialogueProgressed');
  }

  resetDialogueAfterDialogueEnds(currentNode?: DialogueNode) {
    this.dialogueField.hide();
    this.dialogueInProgress = false;
    this.currentDialogueIndex = 0;
    this.isTextComplete = false;
    if (this.interactiveGameObject instanceof NPC)
      this.interactiveGameObject.turnBackToOriginalPosition(this.hero);
    this.resetAlreadyShownOptions();
    this.triggerEventAfterDialogueEnds();
    currentNode.hideOptions();
    console.log('dialogue ended in dialogueController');
  }
}
