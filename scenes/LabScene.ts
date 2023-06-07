import { Game } from 'phaser';

import BattleTrigger from '../battle/BattleTrigger';
import DialogueManager from '../dialogue/DialogueManager';
import DialogueNode from '../dialogue/DialogueNode';
import LabHero from '../gameObjects/LabHero';
import LabNPC from '../gameObjects/LabNPC';
import LabNPCA from '../gameObjects/LabNPCA';
import areCollisionBoxesColliding from '../utils/collisonBoxCollison';

export default class LabScene extends Phaser.Scene {
  private hero: LabHero;
  private isDialoguePlaying: boolean;
  activeInteractiveGameObject: LabNPC | BattleTrigger | null;
  isEventTriggered: boolean;

  // private npc: Phaser.GameObjects.Sprite;
  constructor() {
    super({ key: 'LabScene' });
    this.activeInteractiveGameObject = null;
    this.isEventTriggered = false;
    this.isDialoguePlaying = false;
  }

  preload() {
    this.loadSpriteSheetsImagesAndTileMaps();
  }

  create() {
    const hero = this.hero;
    const map = this.make.tilemap({ key: 'map' });
    // console.log(map);

    const tileset = map.addTilesetImage('labTileset', 'lab_tiles');
    // console.log(tileset);

    // Create layers, add objects, etc.
    const groundLayer = map.createLayer('Floor', tileset, 0, 0);

    groundLayer.setScale(1);

    this.hero = new LabHero(
      this,
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'labHero',
    );
    this.hero.setScale(2);
    this.add.existing(this.hero);

    // Make the camera follow the hero
    this.cameras.main.startFollow(this.hero);

    // Create the NPC

    const testNPC = new LabNPC(this, 50, 50, 'npc', 'E', 'Talk');
    const testNPC2 = new LabNPCA(this, 250, 150, 'npc', 'E', 'Talk');
    const testBattleTrigger = new BattleTrigger(
      this,
      350,
      350,
      'npc',
      'I',
      'Interact',
    );
    testBattleTrigger.setScale(2);

    testNPC.play('npc-idle-left');
    testNPC.setScale(2);
    testNPC2.setScale(2);
    this.add.existing(testNPC);

    const tableLayer = map.createLayer('Tables', tileset);
    tableLayer.setScale(1);

    const collisionLayer = map.createLayer('Collisions', tileset);
    collisionLayer.setScale(1);
    // collisionLayer.setVisible(false);
    // // Set up collisions with the specified tile
    collisionLayer.setCollisionByProperty({ collides: true });
    console.log(collisionLayer);

    // Set up collisions between the player and the NPC
    this.children.each((child) => {
      if (child instanceof LabNPC || child instanceof BattleTrigger) {
        this.physics.add.collider(this.hero, child);
        this.physics.add.collider(collisionLayer, child);
      }
    });

    const wallLayer = map.createLayer('Walls', tileset);
    wallLayer.setScale(1);

    // // Set up collisions between the player and the specified tile
    this.physics.add.collider(this.hero, collisionLayer);
    this.physics.add.collider(testNPC, collisionLayer);
  }

  update(time: number, delta: number) {
    // IF THE PLAYER IS TALKING TO AN NPC or a BattleTrigger
    if (this.isDialoguePlaying) {
      // this.time.removeAllEvents();
      this.handleDialogueLogic();
    }

    // Sort game objects by their y-coordinate
    this.sortGameObjectsByYCoordinate();

    this.children.each((child) => {
      child.update();

      // CHECK FOR NPC COLLISION
      if (
        (child instanceof LabNPC || child instanceof BattleTrigger) &&
        areCollisionBoxesColliding(this.hero, child) &&
        !this.isEventTriggered
      ) {
        child.showSpeechIndication();
        // CHECK FOR DIALOGUE TRIGGER
        this.handleDialogueTrigger(child);
      }
      // @ts-ignore
      this.hideSpeechIndication(child);
    });
  }

  loadSpriteSheetsImagesAndTileMaps() {
    // load the hero spritesheet
    this.load.spritesheet('labHero', 'assets/labHeroSpriteSheet.png', {
      frameWidth: 32,
      frameHeight: 36,
    });

    // load the npc spritesheet
    this.load.spritesheet('npc', 'assets/LabNPC.png', {
      frameWidth: 32,
      frameHeight: 38,
    });

    // Load the Tiled JSON file
    this.load.tilemapTiledJSON('map', 'assets/labMapJson.json');

    // Load the tileset image
    this.load.image('lab_tiles', 'assets/labTileset.png');
  }

  handleDialogueTrigger(child: LabNPC | BattleTrigger) {
    if (
      Phaser.Input.Keyboard.JustDown(
        this.input.keyboard.addKey(child.dialogueIndictaorKey),
      )
    ) {
      this.activeInteractiveGameObject = child;
      this.isDialoguePlaying = true;
    }
  }

  handleDialogueLogic() {
    this.hero.freeze = true;
    this.activeInteractiveGameObject.showSpeechIndication();
    this.activeInteractiveGameObject?.turnToHero(this.hero);
    this.activeInteractiveGameObject.startDialogue();
    this.activeInteractiveGameObject?.talkToHero();

    if (this.activeInteractiveGameObject?.dialogueEnded) {
      this.hero.freeze = false;
      this.isDialoguePlaying = false;
      this.activeInteractiveGameObject.hideSpeechIndication();
      this.activeInteractiveGameObject.endNPCDialogue();
      if (
        this.activeInteractiveGameObject instanceof BattleTrigger
        //&& !this.activeInteractiveGameObject.isDeactivated
      ) {
        this.isEventTriggered = true;
      }
      this.activeInteractiveGameObject = null;
    }
  }

  hideSpeechIndication(child: LabNPC | BattleTrigger) {
    if (
      (child instanceof LabNPC || child instanceof BattleTrigger) &&
      !areCollisionBoxesColliding(this.hero, child)
    ) {
      child.hideSpeechIndication();
    }
  }

  sortGameObjectsByYCoordinate() {
    this.children.sort('y');
  }
}
