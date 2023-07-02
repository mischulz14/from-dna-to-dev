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
  collisionLayer: Phaser.Tilemaps.TilemapLayer;

  // private npc: Phaser.GameObjects.Sprite;
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
    this.createTilemap();
    this.createInteractiveGameObjects();
    this.createHero();
    this.createCollisions();

    // Make the camera follow the hero
    this.cameras.main.startFollow(this.hero);
    this.scene.launch('UIScene');
    this.playLevelIntroOnce();
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

  /////////////////////////
  // PRELOAD GAME EVENTS //
  /////////////////////////

  setUpGameEvents() {
    this.input.keyboard.on(
      'keydown-ENTER',
      this.dialogueController.playerPressesEnterEventListener,
    );
    this.events.on('resumeGame', () => {
      console.log('resumeGame event got triggered');
      this.cutsceneTransitionReverse();
    });

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
  }

  /////////////////////////
  // CREATE GAME OBJECTS AND COLLISIONS //
  /////////////////////////

  createHero() {
    this.hero = new LabHero(this, 800, 170, 'labHero');
    this.hero.setScale(2);
    this.hero.shadow.setDepth(1);
    this.add.existing(this.hero);
  }

  createCollisions() {
    this.children.each((child) => {
      if (child instanceof InteractiveGameObject || LabHero) {
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

    this.wallLayer = map.createLayer('Walls', tileset);
    this.wallLayer.setDepth(2);

    const tableLayer = map.createLayer('Tables', tileset);

    const computerLayer = map.createLayer('Computers', tileset, 0, 0);
    const chairLayer = map.createLayer('Chairs', tileset, 0, 0);

    const otherGameObjectsLayer = map.createLayer('OtherGameobjects', tileset);
    otherGameObjectsLayer.setDepth(2);

    this.foregroundLayer = map.createLayer('Foreground', tileset);
    this.foregroundLayer.setDepth(10000);
  }

  createInteractiveGameObjects() {
    // EVENT TRIGGERS
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

    // NPCS
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

    // OTHER GAME OBJECTS
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
  }

  playLevelIntroOnce() {
    if (this.hasLevelIntroPlayed || !this.hero) {
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
