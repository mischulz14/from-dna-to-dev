import { DOM, Game } from 'phaser';

import { eventTriggerData } from '../data/eventTriggerData';
import { interactiveGameObjectData } from '../data/interactiveGameObjectData';
import { npcLabData } from '../data/npcData';
import DialogueController from '../dialogue/DialogueController';
import DialogueNode from '../dialogue/DialogueNode';
import EventTrigger from '../gameObjects/EventTrigger';
import InteractiveGameObject from '../gameObjects/InteractiveGameObject';
import LabHero from '../gameObjects/LabHero';
import LabNPC from '../gameObjects/LabNPC';
import LevelIntro from '../levelIntro/LevelIntro';
import areCollisionBoxesColliding from '../utils/collisonBoxCollison';

export default class LabScene extends Phaser.Scene {
  hero: LabHero;
  isDialoguePlaying: boolean;
  activeInteractiveGameObject: InteractiveGameObject | null;
  isEventTriggered: boolean;
  dialogueController: DialogueController;
  hasLevelIntroPlayed: any;
  levelIntro: LevelIntro;
  foregroundLayer: Phaser.Tilemaps.TilemapLayer;
  wallLayer: Phaser.Tilemaps.TilemapLayer;
  transitionRect: any | object[];

  // private npc: Phaser.GameObjects.Sprite;
  constructor() {
    super({ key: 'LabScene' });
    this.activeInteractiveGameObject = null;
    this.isEventTriggered = false;
    this.isDialoguePlaying = false;
    this.dialogueController = new DialogueController(this);
  }

  preload() {
    this.loadSpriteSheetsImagesAndTileMaps();
    this.input.keyboard.on(
      'keydown-ENTER',
      this.dialogueController.playerPressesEnterEventListener,
    );
  }

  create() {
    this.createAnimations(this);
    this.scene.launch('UIScene');

    this.events.on('dialogueEnded', () => {
      this.activeInteractiveGameObject.triggerEventWhenDialogueEnds(
        this,
        this.activeInteractiveGameObject,
      );
      this.isEventTriggered = true;
      this.dialogueController.isActiveNPCTalking = false;
      console.log(
        'current npc',
        this.activeInteractiveGameObject.triggerEventWhenDialogueEnds,
      );
      console.log('dialogue ended and event got triggered');
    });

    this.events.on('addObjective', (data) => {
      // check if the UIScene is active
      if (this.scene.isActive('UIScene')) {
        console.log(this.scene.get('UIScene'), 'this.scene.get(UIScene)');
        // Emit the event in the ui scene
        this.scene.get('UIScene').events.emit('addObjective', data);
      }
    });
    const map = this.make.tilemap({ key: 'map' });
    // console.log(map);

    const tileset = map.addTilesetImage('labTileset', 'lab_tiles');
    // console.log(tileset);

    // CREATE LAYERS
    const groundLayer = map.createLayer('Floor', tileset, 0, 0);

    const tableLayer = map.createLayer('Tables', tileset);
    // tableLayer.setDepth(2);

    const computerLayer = map.createLayer('Computers', tileset, 0, 0);
    const chairLayer = map.createLayer('Chairs', tileset, 0, 0);

    const collisionLayer = map.createLayer('Collisions', tileset);
    collisionLayer.setVisible(false);
    collisionLayer.setCollisionByProperty({ collides: true });

    this.wallLayer = map.createLayer('Walls', tileset);
    this.wallLayer.setDepth(2);

    const otherGameObjectsLayer = map.createLayer('OtherGameobjects', tileset);
    otherGameObjectsLayer.setDepth(2);

    this.foregroundLayer = map.createLayer('Foreground', tileset);
    this.foregroundLayer.setDepth(10000);

    // ADD HERO
    this.hero = new LabHero(this, 800, 170, 'labHero');
    this.hero.setScale(2);
    this.hero.shadow.setDepth(1);
    this.add.existing(this.hero);

    // Make the camera follow the hero
    this.cameras.main.startFollow(this.hero);

    // ADD EVENT TRIGGERS
    const fridgeKey = new EventTrigger(
      this,
      1532,
      580,
      'fridgeKeyContainer',
      'E',
      'Interact',
      eventTriggerData.fridgeKeyContainer.dialogueNodesObj,
      eventTriggerData.fridgeKeyContainer.triggerEventWhenDialogueEnds,
      eventTriggerData.fridgeKeyContainer.updateDialogueNodeBasedOnPlayerState,
    );
    fridgeKey.setScale(2);

    const refrigeratorBattleTrigger = new EventTrigger(
      this,
      1532,
      70,
      'refrigerator',
      'E',
      'Interact',
      eventTriggerData.refrigerator.dialogueNodesObj,
      eventTriggerData.refrigerator.triggerEventWhenDialogueEnds,
      eventTriggerData.refrigerator.updateDialogueNodeBasedOnPlayerState,
    );

    refrigeratorBattleTrigger.setScale(3);

    const computerBattleTrigger = new EventTrigger(
      this,
      96,
      128,
      'computerBattleTrigger',
      'E',
      'Interact',
      eventTriggerData.computer.dialogueNodesObj,
      eventTriggerData.computer.triggerEventWhenDialogueEnds,
      eventTriggerData.computer.updateDialogueNodeBasedOnPlayerState,
    );
    computerBattleTrigger.setScale(2);
    computerBattleTrigger.play('computer');
    computerBattleTrigger.setBodySize(20, 10);
    computerBattleTrigger.setOffset(5, 20);

    // ADD NPCS
    const mainNPC = new LabNPC(
      this,
      880,
      645,
      'npc',
      'npc-idle-up',
      'E',
      'Talk',
      npcLabData.mainNPC.dialogueNodesObj,
      npcLabData.mainNPC.triggerEventWhenDialogueEnds,
      npcLabData.mainNPC.updateDialogueNodeBasedOnHeroState,
    );

    const infoNPC = new LabNPC(
      this,
      800,
      70,
      'infoNpc',
      'infoNpc-idle-down',
      'E',
      'Talk',
      npcLabData.infoNpc.dialogueNodesObj,
      npcLabData.infoNpc.triggerEventWhenDialogueEnds,
      npcLabData.infoNpc.updateDialogueNodeBasedOnHeroState,
    );

    infoNPC.setBodySize(40, 30);
    infoNPC.setScale(2);
    infoNPC.turnToHero = () => {
      return;
    };
    infoNPC.shadow.alpha = 0;

    mainNPC.setScale(2);

    const labNPCA = new LabNPC(
      this,
      1000,
      645,
      'npcA',
      'npcA-idle-up',
      'E',
      'Talk',
      npcLabData.npcA.dialogueNodesObj,
      npcLabData.npcA.triggerEventWhenDialogueEnds,
      npcLabData.npcA.updateDialogueNodeBasedOnHeroState,
    );
    labNPCA.setScale(2);

    const labNPCB = new LabNPC(
      this,
      410,
      330,
      'npcB',
      'npcB-idle-up',
      'E',
      'Talk',
      npcLabData.npcB.dialogueNodesObj,
      npcLabData.npcB.triggerEventWhenDialogueEnds,
      npcLabData.npcB.updateDialogueNodeBasedOnHeroState,
    );

    labNPCB.setScale(2);

    const labNPCC = new LabNPC(
      this,
      910,
      380,
      'npcC',
      'npcC-idle-right',
      'E',
      'Talk',
      npcLabData.npcC.dialogueNodesObj,
      npcLabData.npcC.triggerEventWhenDialogueEnds,
      npcLabData.npcC.updateDialogueNodeBasedOnHeroState,
    );

    labNPCC.setScale(2);

    // ADD OTHER GAME OBJECTS
    const janus = new InteractiveGameObject(this, 870, 600, 'janus');
    janus.setScale(4);
    janus.playAfterDelay('janus-idle', 1000);
    janus.setBodySize(30, 15);
    janus.setOffset(1.5, 13);
    janus.setImmovable(true);
    janus.showSpeechIndication = () => {
      return;
    };

    const janus2 = new InteractiveGameObject(this, 1000, 600, 'janus');
    janus2.setScale(4);
    janus2.play('janus-idle');
    janus2.setBodySize(30, 15);
    janus2.setOffset(1.5, 13);
    janus2.setImmovable(true);
    janus2.showSpeechIndication = () => {
      return;
    };

    const janus3 = new InteractiveGameObject(this, 1130, 600, 'janus');
    janus3.setScale(4);
    janus3.playAfterDelay('janus-idle', 2000);
    janus3.setBodySize(30, 15);
    janus3.setOffset(1.5, 13);
    janus3.setImmovable(true);
    janus3.showSpeechIndication = () => {
      return;
    };

    // SET UP COLLISIONS
    this.children.each((child) => {
      if (child instanceof InteractiveGameObject) {
        this.physics.add.collider(this.hero, child);
        this.physics.add.collider(collisionLayer, child);
      }
    });

    // Set up collisions
    this.physics.add.collider(this.hero, collisionLayer);
    this.physics.add.collider(mainNPC, collisionLayer);
    this.physics.add.collider(this.hero, this.foregroundLayer, () => {
      console.log('foreground collision');
    });

    console.log(this.children, 'this.children');
    this.playLevelIntroOnce();
  }

  update(time: number, delta: number) {
    if (this.dialogueController.dialogueInProgress) {
      this.hero.freeze = true;
    }

    if (!this.dialogueController.dialogueInProgress) {
      this.hero.freeze = false;
      this.isEventTriggered = false;
    }

    // Sort game objects by their y-coordinate
    this.sortGameObjectsByYCoordinate();

    this.children.each((child) => {
      child.update();

      // CHECK FOR NPC COLLISION
      if (
        child instanceof InteractiveGameObject &&
        areCollisionBoxesColliding(this.hero, child)
      ) {
        !this.isEventTriggered && child.showSpeechIndication();
        // CHECK FOR DIALOGUE TRIGGER
        this.handleDialogueTrigger(child);
      }
      // @ts-ignore
      this.hideSpeechIndication(child);
    });
  }

  handleDialogueTrigger(child: InteractiveGameObject) {
    if (
      Phaser.Input.Keyboard.JustDown(
        this.input.keyboard.addKey(child.dialogueIndictaorKey),
      )
    ) {
      child.updateDialogueNodeBasedOnPlayerState(this, child);

      this.activeInteractiveGameObject = child;
      this.hero.freeze = true;
      this.dialogueController.dialogueInProgress = true;
      this.dialogueController.isActiveNPCTalking = true;
      this.isEventTriggered = true;
      this.dialogueEvent(child.dialogueNodesObj.nodes);
    }
  }

  hideSpeechIndication(child: LabNPC | EventTrigger) {
    if (
      (child instanceof LabNPC || child instanceof EventTrigger) &&
      !areCollisionBoxesColliding(this.hero, child)
    ) {
      child.hideSpeechIndication();
    }
  }

  sortGameObjectsByYCoordinate() {
    this.children.each((child) => {
      if (
        child !== this.foregroundLayer &&
        (child instanceof Phaser.GameObjects.Sprite ||
          child instanceof Phaser.GameObjects.Image)
      ) {
        child.setDepth(child.y);
      }
    });
  }

  dialogueEvent(dialogue: DialogueNode[]) {
    if (this.activeInteractiveGameObject instanceof LabNPC) {
      this.activeInteractiveGameObject.turnToHero(this.hero);
    }
    this.activeInteractiveGameObject.hideSpeechIndication();
    this.dialogueController.dialogueField.show();
    this.dialogueController.initiateDialogueNodesArray(
      dialogue,
      this.activeInteractiveGameObject,
      this.hero,
    );
    this.dialogueController.typeText();
  }

  playLevelIntroOnce() {
    if (this.hasLevelIntroPlayed) {
      return;
    }
    this.hasLevelIntroPlayed = true;
    this.hero.freeze = true;
    this.levelIntro = new LevelIntro({
      levelNr: 1,
      levelName: 'The Lab',
    });
    this.levelIntro.createHTML();
    setTimeout(() => {
      this.hero.freeze = false;
    }, 3000);
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

    this.load.spritesheet('infoNpc', 'assets/LabNPCInfoGuy.png', {
      frameWidth: 50,
      frameHeight: 45,
    });

    // Load the Tiled JSON file
    this.load.tilemapTiledJSON('map', 'assets/labMapJson.json');

    // Load the tileset image
    this.load.image('lab_tiles', 'assets/labTileset.png');

    this.load.spritesheet(
      'refrigerator',
      'assets/refrigeratorBattleTrigger.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );

    this.load.spritesheet(
      'computerBattleTrigger',
      'assets/computerBattleTrigger.png',
      {
        frameHeight: 32,
        frameWidth: 32,
      },
    );

    this.load.spritesheet(
      'fridgeKeyContainer',
      'assets/fridgeKeyContainer.png',
      {
        frameHeight: 32,
        frameWidth: 32,
      },
    );

    this.load.spritesheet('janus', 'assets/janus.png', {
      frameHeight: 32,
      frameWidth: 32,
    });

    this.load.spritesheet('npcA', 'assets/labNPCA.png', {
      frameHeight: 38,
      frameWidth: 32,
    });

    this.load.spritesheet('npcB', 'assets/labNpcB.png', {
      frameHeight: 38,
      frameWidth: 32,
    });

    this.load.spritesheet('npcC', 'assets/labNpcC.png', {
      frameHeight: 38,
      frameWidth: 32,
    });
  }

  createAnimations(scene: Phaser.Scene) {
    this.anims.create({
      key: 'npc-idle-down',
      frames: this.anims.generateFrameNumbers('npc', {
        start: 14,
        end: 20,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'npc-idle-up',
      frames: this.anims.generateFrameNumbers('npc', { start: 21, end: 27 }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'npc-idle-right',
      frames: this.anims.generateFrameNumbers('npc', { start: 0, end: 6 }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'npc-idle-left',
      frames: this.anims.generateFrameNumbers('npc', { start: 7, end: 13 }),
      frameRate: 6,
      repeat: -1,
    });

    const npcNames = ['npcA', 'npcB', 'npcC'];

    npcNames.forEach((name) => {
      this.anims.create({
        key: `${name}-idle-down`,
        frames: this.anims.generateFrameNumbers(name, {
          start: 0,
          end: 6,
        }),
        frameRate: 6,
        repeat: -1,
      });

      this.anims.create({
        key: `${name}-idle-up`,
        frames: this.anims.generateFrameNumbers(name, {
          start: 21,
          end: 27,
        }),
        frameRate: 6,
        repeat: -1,
      });

      this.anims.create({
        key: `${name}-idle-right`,
        frames: this.anims.generateFrameNumbers(name, {
          start: 7,
          end: 13,
        }),
        frameRate: 6,
        repeat: -1,
      });

      this.anims.create({
        key: `${name}-idle-left`,
        frames: this.anims.generateFrameNumbers(name, {
          start: 14,
          end: 20,
        }),
        frameRate: 6,
        repeat: -1,
      });
    });

    this.anims.create({
      key: 'infoNpc-idle-down',
      frames: this.anims.generateFrameNumbers('infoNpc', {
        start: 0,
        end: 7,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'computer',
      frames: this.anims.generateFrameNumbers('computerBattleTrigger', {
        start: 0,
        end: 4,
      }),
      frameRate: 3,
      repeat: -1,
    });

    this.anims.create({
      key: 'janus-idle',
      frames: this.anims.generateFrameNumbers('janus', {
        start: 0,
        end: 70,
      }),
      frameRate: 8,
      repeat: -1,
    });
  }

  cutsceneTransitionReverse() {
    this.tweens.add({
      targets: this.transitionRect,
      alpha: { from: 1, to: 0 },
      ease: 'Linear',
      duration: 3000,
      repeat: 0,
    });
  }
}
