import { DOM, Game } from 'phaser';

import { eventTriggerData } from '../data/eventTriggerData';
import { npcLabData } from '../data/npcData';
import DialogueController from '../dialogue/DialogueController';
import DialogueNode from '../dialogue/DialogueNode';
import EventTrigger from '../gameObjects/EventTrigger';
import Hero from '../gameObjects/Hero';
import InteractiveGameObject from '../gameObjects/InteractiveGameObject';
import NonInteractiveGameObject from '../gameObjects/NonInteractiveGameObject';
import NPC from '../gameObjects/NPC';
import LevelIntro from '../sceneoverlay/SceneOverlay';
import { globalAudioManager } from '../src/app';
import areCollisionBoxesColliding from '../utils/collisonBoxCollison';
import ObjectivesUIScene from './ObjectivesUIScene';

export default class LabScene extends Phaser.Scene {
  hero: Hero<{
    hasKey: boolean;
    hasTalkedToMainNPC: boolean;
    hasBattledVirus: boolean;
    hasDeliveredProbe: boolean;
    hasBattledSleepDeprivation: boolean;
  }>;
  isDialoguePlaying: boolean;
  activeInteractiveGameObject: InteractiveGameObject | null;
  isEventTriggered: boolean;
  dialogueController: DialogueController;
  hasLevelIntroPlayed: any;
  levelIntro: LevelIntro;
  foregroundLayer: Phaser.Tilemaps.TilemapLayer;
  wallLayer: Phaser.Tilemaps.TilemapLayer;
  transitionRect: any | object[];
  collisionLayer: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super({ key: 'LabScene' });
    this.activeInteractiveGameObject = null;
    this.isEventTriggered = false;
    this.isDialoguePlaying = false;
    this.dialogueController = new DialogueController(this);
  }

  preload() {
    this.setUpGameEvents();
  }

  create() {
    globalAudioManager.switchSoundTo('lofi');
    this.createTilemap();
    this.createInteractiveGameObjects();
    this.createHero();
    this.createCollisions();

    // Make the camera follow the hero
    this.cameras.main.startFollow(this.hero);
    const uiScene = this.scene.get('ObjectivesUIScene') as ObjectivesUIScene;
    uiScene.changeCurrentScene('LabScene');
    uiScene.addInitialObjective(
      'hasTalkedToMainNPC',
      'Talk to the people in the Lab and see if someone has work for you.',
    );
    this.scene.launch('ObjectivesUIScene');
    // this.playLevelIntroOnce();
  }

  /////////////////////////
  // UPDATE //
  /////////////////////////
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
        this.input.keyboard.addKey(child.dialogueIndicatorKey),
      )
    ) {
      console.log(child);
      child.updateDialogueNodeBasedOnPlayerState(this, child);

      this.activeInteractiveGameObject = child;
      this.hero.freeze = true;
      this.dialogueController.dialogueInProgress = true;
      this.dialogueController.isActiveNPCTalking = true;
      this.isEventTriggered = true;
      this.dialogueEvent(child.dialogueNodesObj.nodes);
    }
  }

  hideSpeechIndication(child: NPC | EventTrigger) {
    if (
      (child instanceof NPC || child instanceof EventTrigger) &&
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
    if (this.activeInteractiveGameObject instanceof NPC) {
      this.activeInteractiveGameObject.turnToHero(this.hero);
    }
    this.cameras.main.zoomTo(2, 300);
    this.activeInteractiveGameObject.hideSpeechIndication();
    this.dialogueController.dialogueField.show();
    this.dialogueController.initiateDialogueNodesArray(
      dialogue,
      this.activeInteractiveGameObject,
      this.hero,
    );
    this.dialogueController.typeText();
  }

  /////////////////////////
  // PRELOAD GAME EVENTS //
  /////////////////////////

  setUpGameEvents() {
    this.input.keyboard.on(
      'keydown-ENTER',
      this.dialogueController.playerPressesEnterEventListener,
    );
    this.events.on('dialogueEnded', () => {
      this.cameras.main.zoomTo(1, 300);
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
      // check if the ObjectivesUIScene is active
      if (this.scene.isActive('ObjectivesUIScene')) {
        // Emit the event in the ui scene
        this.scene.get('ObjectivesUIScene').events.emit('addObjective', data);
      }
    });
  }

  /////////////////////////
  // CREATE GAME OBJECTS AND COLLISIONS //
  /////////////////////////

  createHero() {
    this.hero = new Hero(
      this,
      800,
      170,
      'labHero',
      {
        hasKey: false,
        hasTalkedToMainNPC: false,
        hasBattledVirus: false,
        hasDeliveredProbe: false,
        hasBattledSleepDeprivation: false,
      },
      'lab',
      { x: 15, y: 16 },
      { x: 13, y: 22 },
    );
    this.hero.setScale(2);
    this.add.existing(this.hero);
  }

  createCollisions() {
    this.children.each((child) => {
      if (child instanceof InteractiveGameObject || Hero) {
        this.physics.add.collider(this.hero, child);
        this.physics.add.collider(this.collisionLayer, child);
      }
    });
    this.physics.add.collider(this.hero, this.foregroundLayer, () => {
      console.log('foreground collision');
    });
  }

  createTilemap() {
    const map = this.make.tilemap({ key: 'map' });
    // console.log(map);

    const tileset = map.addTilesetImage('labTileset', 'lab_tiles');
    // console.log(tileset);

    // CREATE LAYERS
    const groundLayer = map.createLayer('Floor', tileset, 0, 0);

    this.collisionLayer = map.createLayer('Collisions', tileset);
    this.collisionLayer.setVisible(false);
    this.collisionLayer.setCollisionByProperty({ collides: true });
    // make collisionlayer visible
    // this.collisionLayer.renderDebug(this.add.graphics().setDepth(1000), {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    // });

    this.wallLayer = map.createLayer('Walls', tileset);
    this.wallLayer.setDepth(2);

    const tableLayer = map.createLayer('Tables', tileset);

    const computerLayer = map.createLayer('Computers', tileset, 0, 0);
    const chairLayer = map.createLayer('Chairs', tileset, 0, 0);

    map.getLayer('Chairs').data.forEach((row) => {
      row.forEach((tile) => {
        if (tile.index === 0) {
          tile.setCollision(false, false, true, false);
        }
      });
    });

    const otherGameObjectsLayer = map.createLayer('OtherGameobjects', tileset);
    otherGameObjectsLayer.setDepth(2);

    this.foregroundLayer = map.createLayer('Foreground', tileset);
    this.foregroundLayer.setDepth(10000);

    const eventTriggerLayer = map.createLayer('FridgeKeyContainer', tileset);

    eventTriggerLayer.forEachTile((tile) => {
      if (tile.index !== -1) {
        // get the top left x and top left y
        const worldX = tile.getCenterX() + tile.width / 2;
        const worldY = tile.getCenterY() + tile.height / 2;

        // Create a new instance of your custom GameObject at the tile's coordinates
        const gameObject = new EventTrigger(
          this,
          worldX,
          worldY,
          'fridgeKeyContainer',
          'E',
          'Interact',
          eventTriggerData.fridgeKeyContainer.dialogueNodesObj,
          eventTriggerData.fridgeKeyContainer.triggerEventWhenDialogueEnds,
          eventTriggerData.fridgeKeyContainer.updateDialogueNodeBasedOnPlayerState,
        );
        this.add.existing(gameObject);
      }
    });
  }

  createInteractiveGameObjects() {
    // EVENT TRIGGERS
    // const fridgeKey = new EventTrigger(
    //   this,
    //   1512,
    //   575,
    //   'fridgeKeyContainer',
    //   'E',
    //   'Interact',
    //   eventTriggerData.fridgeKeyContainer.dialogueNodesObj,
    //   eventTriggerData.fridgeKeyContainer.triggerEventWhenDialogueEnds,
    //   eventTriggerData.fridgeKeyContainer.updateDialogueNodeBasedOnPlayerState,
    // );

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

    // NPCS
    const mainNPC = new NPC(
      this,
      900,
      645,
      'npc',
      'npc-idle-up',
      'E',
      'Talk',
      npcLabData.mainNPC.dialogueNodesObj,
      npcLabData.mainNPC.triggerEventWhenDialogueEnds,
      npcLabData.mainNPC.updateDialogueNodeBasedOnHeroState,
    );

    mainNPC.updateDialogueNodeBasedOnPlayerState =
      npcLabData.mainNPC.updateDialogueNodeBasedOnHeroState;
    mainNPC.triggerEventWhenDialogueEnds =
      npcLabData.mainNPC.triggerEventWhenDialogueEnds;

    mainNPC.setScale(2);

    const infoNPC = new NPC(
      this,
      800,
      100,
      'infoNpc',
      '',
      'E',
      'Talk',
      npcLabData.infoNpc.dialogueNodesObj,
      npcLabData.infoNpc.triggerEventWhenDialogueEnds,
      npcLabData.infoNpc.updateDialogueNodeBasedOnHeroState,
    );

    infoNPC.setBodySize(60, 50);
    infoNPC.setScale(2);
    infoNPC.turnToHero = () => {
      return;
    };
    infoNPC.shadow.alpha = 0;

    const labNPCA = new NPC(
      this,
      1100,
      645,
      'npcA',
      'npcA-idle-up',
      'E',
      'Talk',
      npcLabData.npcA.dialogueNodesObj,
      npcLabData.npcA.triggerEventWhenDialogueEnds,
      npcLabData.npcA.updateDialogueNodeBasedOnHeroState,
    );

    labNPCA.updateDialogueNodeBasedOnPlayerState =
      npcLabData.npcA.updateDialogueNodeBasedOnHeroState;
    labNPCA.triggerEventWhenDialogueEnds =
      npcLabData.npcA.triggerEventWhenDialogueEnds;

    labNPCA.setScale(2);

    const labNPCB = new NPC(
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

    const labNPCC = new NPC(
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

    // OTHER GAME OBJECTS
    const janus = new NonInteractiveGameObject(this, 870, 600, 'janus');
    janus.setScale(4);
    janus.playAfterDelay('janus-idle', 1000);
    janus.setBodySize(30, 15);
    janus.setOffset(1.5, 13);
    janus.setImmovable(true);

    const janus2 = new NonInteractiveGameObject(this, 1000, 600, 'janus');
    janus2.setScale(4);
    janus2.play('janus-idle');
    janus2.setBodySize(30, 15);
    janus2.setOffset(1.5, 13);
    janus2.setImmovable(true);

    const janus3 = new NonInteractiveGameObject(this, 1130, 600, 'janus');
    janus3.setScale(4);
    janus3.playAfterDelay('janus-idle', 2000);
    janus3.setBodySize(30, 15);
    janus3.setOffset(1.5, 13);
    janus3.setImmovable(true);
  }

  playLevelIntroOnce() {
    if (this.hasLevelIntroPlayed || !this.hero) {
      return;
    }
    this.hasLevelIntroPlayed = true;
    this.hero.freeze = true;
    this.levelIntro = new LevelIntro({
      topText: 1,
      bottomText: 'The Lab',
    });
    this.levelIntro.createHTML();
    setTimeout(() => {
      this.hero.freeze = false;
    }, 3000);
  }
}
