import * as Phaser from 'phaser';

import DialogueNode from '../dialogue/DialogueNode';
import ObjectiveIndicator from '../gameObjects/ObjectiveIndicator';
import Hero from './Hero';
import InteractiveGameObject from './InteractiveGameObject';
import Laia from './Laia';

export default class LabNPC extends InteractiveGameObject {
  shadow: Phaser.GameObjects.Graphics;
  private behaviorTimer?: Phaser.Time.TimerEvent;
  dialogueNodesObj: { nodes: DialogueNode[] };
  hasEventAfterDialogue: boolean;
  firstEncounter: boolean;
  talkCount: number;
  updateDialogueNodeBasedOnPlayerState: (
    scene: Phaser.Scene,
    labNPC: LabNPC,
  ) => void;
  initialAnimation: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    initialAnimation: string,
    dialogueIndicatorKey: string,
    dialogueIndicatorText: string,
    dialogueNodesObj: { nodes: DialogueNode[] },
    triggerEventWhenDialogueEnds: (
      scene: Phaser.Scene,
      labNPC: InteractiveGameObject,
    ) => void,
    updateDialogueNodeBasedOnPlayerState: (
      scene: Phaser.Scene,
      labNPC: LabNPC,
    ) => void,
  ) {
    super(scene, x, y, texture, dialogueIndicatorKey, dialogueIndicatorText);

    // Here we create our dialogue nodes
    // this.behaviorLoop();
    this.hasEventAfterDialogue = true;
    this.firstEncounter = true;
    this.talkCount = 0;
    this.triggerEventWhenDialogueEnds = triggerEventWhenDialogueEnds;
    this.updateDialogueNodeBasedOnPlayerState =
      updateDialogueNodeBasedOnPlayerState;

    // I am instantiating the dialogue nodes here as an object because phaser is weird and deletes the options in the update function when I instantiate them as an array
    this.dialogueNodesObj = dialogueNodesObj;

    this.body?.setSize(17, 15);
    this.body?.setOffset(8, 22);

    // make body immovable so it doesn't get pushed around upon collision
    this.body!.immovable = true;
    this.shadow = scene.add.graphics({
      fillStyle: { color: 0x000000, alpha: 0.25 },
    });

    this.initialAnimation = initialAnimation;
    // Play the initial idle animation with a random delay
    const delay = Phaser.Math.Between(0, 2000);
    scene.time.delayedCall(delay, () => {
      this.anims.play(initialAnimation, true);
    });

    this.shadow.fillEllipse(this.x, this.y + 35, 30, 16);
  }

  preload() {}

  update() {
    super.update();
    this.updateShadow();
  }

  turnToHero = (hero: Hero | Laia) => {
    console.log('turnToHero');
    console.log('current animation: ', this.anims.currentAnim.key);
    console.log('texture: ', this.texture);
    // based on the last held direction, turn to face the hero
    if (hero.lastDirection === 'up') {
      this.anims.play(`${this.texture.key}-idle-down`, true);
    } else if (hero.lastDirection === 'down') {
      this.anims.play(`${this.texture.key}-idle-up`, true);
    } else if (hero.lastDirection === 'left') {
      this.anims.play(`${this.texture.key}-idle-right`, true);
    } else if (hero.lastDirection === 'right') {
      this.anims.play(`${this.texture.key}-idle-left`, true);
    }
  };

  turnBackToOriginalPosition = (hero: Hero) => {
    this.anims.play(this.initialAnimation, true);
  };

  behaviorLoop = () => {
    if (this.isSpeaking) {
      this.setVelocity(0, 0);
      return;
    }
    // walk in a random direction then stop
    const walkTime = Phaser.Math.Between(800, 1200);
    const stopTime = Phaser.Math.Between(1200, 3000);

    // pick a random direction (0-3)
    const direction = Phaser.Math.Between(0, 3);

    // set velocity based on direction
    // Only set velocity if not speaking
    if (!this.isSpeaking) {
      if (direction === 0) {
        this.setVelocity(0, -64);
      }
      if (direction === 1) {
        this.setVelocity(64, 0);
      }
      if (direction === 2) {
        this.setVelocity(0, 64);
      }
      if (direction === 3) {
        this.setVelocity(-64, 0);
      }
    }

    // stop moving after walkTime ms
    this.behaviorTimer = this.scene.time.delayedCall(walkTime, () => {
      this.setVelocity(0, 0);
      if (this.isSpeaking) {
        this.setVelocity(0, 0);
        return;
      }

      // resume behavior after stopTime ms
      this.behaviorTimer = this.scene.time.delayedCall(
        stopTime,
        this.behaviorLoop,
      );
    });
  };

  // function to immediately stop the NPC and the behavior loop. If this is not implemented it leads to bugs.
  stopBehaviorLoop = () => {
    if (this.behaviorTimer) {
      this.behaviorTimer.destroy(); // This immediately stops the timer
      this.behaviorTimer = undefined;
      this.setVelocity(0, 0);
    }
  };

  updateShadow = () => {
    this.shadow.clear();
    this.shadow.fillEllipse(this.x, this.y + 35, 30, 16);
  };

  incrementTalkingCount = () => {
    this.talkCount += 1;
  };

  moveAnotherNPC = () => {
    // @ts-ignore
    const npcB = this.scene.children.list[8] as LabNPC;
    // npcB.x = 200;
  };
}
