import * as Phaser from 'phaser';

import { npcLabData } from '../data/npcData';
import DialogueField from '../dialogue/DialogueField';
import DialogueIndication from '../dialogue/DialogueIndication';
import Hero from './Hero';

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  dialogueIndicator: Phaser.GameObjects.DOMElement | null;
  // private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  // private dialogueProgressNumber: number;
  currentDialogue: HTMLDivElement;
  isSpeaking: boolean;
  dialogueEnded: boolean;
  dialogue: any;
  dialogueField: Phaser.GameObjects.DOMElement | null;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame);
    this.dialogueIndicator = null;
    this.isSpeaking = false;
    this.dialogue = npcLabData.npcA.dialogue;
    this.dialogueField = new DialogueField();
    // Add this instance to the scene's display list and update list
    // this.behaviorLoop();
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // You might want to adjust these values to fit your NPC sprite
    this.body?.setSize(17, 15);
    this.body?.setOffset(8, 22);
    // make body immovable so it doesn't get pushed around
    this.body!.immovable = true;

    this.createAnimations(scene);

    // Play the initial idle animation
    // Replace 'idle' with the correct animation key for your NPC
    this.anims.play('npc-idle-down', true);

    // set up event listener to listen for space bar press
  }

  createAnimations(scene: Phaser.Scene) {
    // Define your animations here...
    // Replace these values with the correct ones for your NPC
    scene.anims.create({
      key: 'npc-idle-down',
      frames: scene.anims.generateFrameNumbers('npc', { start: 14, end: 20 }),
      frameRate: 6,
      repeat: -1,
    });

    scene.anims.create({
      key: 'npc-idle-right',
      frames: scene.anims.generateFrameNumbers('npc', { start: 0, end: 6 }),
      frameRate: 6,
      repeat: -1,
    });

    scene.anims.create({
      key: 'npc-idle-left',
      frames: scene.anims.generateFrameNumbers('npc', { start: 7, end: 13 }),
      frameRate: 6,
      repeat: -1,
    });
  }

  update() {}

  turnToHero(hero: Hero) {
    // based on the last held direction, turn to face the hero
    if (hero.lastDirection === 'up') {
      this.anims.play('npc-idle-down', true);
    } else if (hero.lastDirection === 'down') {
      this.anims.play('npc-idle-up', true);
    } else if (hero.lastDirection === 'left') {
      this.anims.play('npc-idle-right', true);
    } else if (hero.lastDirection === 'right') {
      this.anims.play('npc-idle-left', true);
    }
  }

  talkToHero(dialogueProgressNumber: number) {
    this.currentDialogue = this.dialogueField.dialogueField;
    // as long as the dialogue is not finished, keep showing the dialogue. The dialogue is finished when the dialogueProgressNumber is equal to the length of the dialogue array. The dialogueProgressNumber is increased by 1 every time the user presses the dialogueTrigger specified in the globalGameState.ts file.
    if (dialogueProgressNumber >= this.dialogue.length) {
      this.dialogueField.hide();
      console.log('dialogue ended');
      this.currentDialogue = null;
      this.isSpeaking = false;
      this.dialogueEnded = true;

      // if the dialogue is finished, hide the dialogue and return true
    } else {
      this.dialogueField.show();
      this.isSpeaking = true;
      this.dialogueEnded = false;
      this.dialogueField.setText(this.dialogue[dialogueProgressNumber]);
    }
  }

  showSpeechIndication(scene: Phaser.Scene, isColliding: boolean) {
    if (this.dialogueIndicator === null) {
      // Create the dialogue box
      this.dialogueIndicator = scene.add.dom(
        this.x,
        this.y - 50,
        new DialogueIndication('E', 'Talk').indication,
      );
      this.dialogueIndicator.setDepth(1);
    }

    // Show or hide the dialogue box
    this.dialogueIndicator.setVisible(isColliding);
  }

  // hideSpeechIndication() {
  //   if (this.dialogueIndicator !== null) {
  //     this.dialogueIndicator.destroy();
  //     this.dialogueIndicator = null;
  //   }
  // }
}
