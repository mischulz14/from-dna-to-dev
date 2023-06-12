import * as Phaser from 'phaser';

import DialogueController from '../dialogue/DialogueController';
import DialogueIndication from '../dialogue/DialogueIndication';
import DialogueNode from '../dialogue/DialogueNode';

export default class InteractiveGameObject extends Phaser.Physics.Arcade
  .Sprite {
  dialogueIndicator: Phaser.GameObjects.DOMElement | null;
  dialogueIndictaorKey: string;
  dialogueIndictaorText: string;
  isSpeaking: boolean;
  dialogueNodesObj: { nodes: DialogueNode[] };
  updateDialogueNodeBasedOnPlayerState: (
    scene: Phaser.Scene,
    interactiveGameObject: InteractiveGameObject,
  ) => void;
  bounds = new Phaser.Geom.Rectangle();
  dialogueEnded: boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    dialogueIndictaorKey: string,
    dialogueIndictaorText: string,
  ) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.dialogueIndicator = null;
    this.isSpeaking = false;
    this.dialogueIndictaorKey = dialogueIndictaorKey;
    this.dialogueIndictaorText = dialogueIndictaorText;
    // Here we create our dialogue nodes

    this.bounds = this.getBounds();

    scene.add.existing(this);
    scene.physics.add.existing(this);
    // this.advanceDialogueEventListener();
  }

  create() {}

  async typeText() {}

  update() {
    this.updateSpeechIndicationPosition();
  }

  showSpeechIndication() {
    if (this.dialogueIndicator === null) {
      // Create the dialogue box
      this.dialogueIndicator = this.scene.add.dom(
        this.x,
        this.y - 55,
        new DialogueIndication(
          this.dialogueIndictaorKey,
          this.dialogueIndictaorText,
        ).indication,
      );
      this.dialogueIndicator?.setDepth(1);
    }
    this.dialogueIndicator.setVisible(true);
  }

  hideSpeechIndication() {
    this.dialogueIndicator && this.dialogueIndicator.setVisible(false);
  }

  behaviorLoop() {}

  updateSpeechIndicationPosition() {
    if (this.dialogueIndicator !== null) {
      this.dialogueIndicator.setPosition(this.x, this.y - 55);
    }
  }

  triggerEventWhenDialogueEnds = (scene: Phaser.Scene, gameObject?: any) => {};

  stopBehaviorLoop() {}

  // startDialogue = () => {
  //   this.isSpeaking = true;
  //   this.stopBehaviorLoop();
  //   if (this.body instanceof Phaser.Physics.Arcade.Body) {
  //     this.body.enable = false; // disable collision response
  //   }
  // };

  // endNPCDialogue = () => {
  //   this.isSpeaking = false;
  //   // this.behaviorLoop(); // resume NPC movement after dialogue ends
  //   if (this.body instanceof Phaser.Physics.Arcade.Body) {
  //     this.body.enable = true; // re-enable collision response
  //   }
  // };
}
