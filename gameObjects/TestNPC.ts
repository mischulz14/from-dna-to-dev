import * as Phaser from 'phaser';

import DialogueNode from '../dialogue/DialogueNode';
import Hero from './Hero';
import InteractiveGameObject from './InteractiveGameObject';

export default class TestNPC extends InteractiveGameObject {
  private shadow: Phaser.GameObjects.Graphics;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    // dialogue: string[], // Add the dialogue parameter here
    dialogueNodes: DialogueNode[],
    dialogueIndictaorKey: string,
    dialogueIndictaorText: string,
    frame?: string | number,
  ) {
    super(
      scene,
      x,
      y,
      texture,
      // dialogue,
      dialogueNodes,
      dialogueIndictaorKey,
      dialogueIndictaorText,
      frame,
    );
    // Add this instance to the scene's display list and update list
    // this.behaviorLoop();
    // this.dialogue = dialogue; // Add the dialogue parameter here

    // You might want to adjust these values to fit your NPC sprite
    this.body?.setSize(17, 15);
    this.body?.setOffset(8, 22);
    // make body immovable so it doesn't get pushed around
    this.body!.immovable = true;
    this.shadow = scene.add.graphics({
      fillStyle: { color: 0x000000, alpha: 0.25 },
    });

    this.createAnimations(scene);

    // Play the initial idle animation
    this.anims.play('npc-idle-down', true);
    this.shadow.fillEllipse(this.x, this.y + 35, 30, 16);
  }

  createAnimations(scene: Phaser.Scene) {
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

  behaviorLoop = () => {
    // walk in a random direction for 2-6 seconds, then stop for 1-3 seconds
    const walkTime = Phaser.Math.Between(2000, 6000);
    const stopTime = Phaser.Math.Between(1000, 3000);

    // pick a random direction (0-3)
    const direction = Phaser.Math.Between(0, 3);

    // set velocity based on direction
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

    // stop moving after walkTime ms
    this.scene.time.delayedCall(walkTime, () => {
      this.setVelocity(0, 0);

      // resume behavior after stopTime ms
      this.scene.time.delayedCall(stopTime, this.behaviorLoop);
    });
  };
}
