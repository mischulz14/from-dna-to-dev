import { DOM, Game } from 'phaser';

import { eventTriggerData } from '../data/eventTriggerData';
import { interactiveGameObjectAnimInfo } from '../data/interactiveGameObjectAnimInfo';
import { npcLabData } from '../data/npcData';
import DialogueController from '../dialogue/DialogueController';
import DialogueNode from '../dialogue/DialogueNode';
import EventTrigger from '../gameObjects/EventTrigger';
import Hero from '../gameObjects/Hero';
import InteractiveGameObject from '../gameObjects/InteractiveGameObject';
import NPC from '../gameObjects/NPC';
import ObjectiveIndicator from '../gameObjects/ObjectiveIndicator';
import LevelIntro from '../levelIntro/LevelIntro';
import areCollisionBoxesColliding from '../utils/collisonBoxCollison';
import UIScene from './UIScene';

export default class ApartmentScene extends Phaser.Scene {
  hero: Hero;
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
    super({ key: 'ApartmentScene' });
    this.activeInteractiveGameObject = null;
    this.isEventTriggered = false;
    this.isDialoguePlaying = false;
    this.dialogueController = new DialogueController(this);
  }

  preload() {
    this.setUpGameEvents();
  }

  create() {
    this.createInteractiveGameObjects();

    this.createTilemap();
    this.createHero();
    this.createCollisions();

    // Make the camera follow the hero
    this.cameras.main.startFollow(this.hero);
    // this.scene.get('UIScene').removeAllObjectives();
    const uiScene = this.scene.get('UIScene') as UIScene;
    uiScene.changeCurrentScene('ApartmentScene');
    uiScene.addInitialObjective(
      'isTested',
      'Talk to the people in the Lab and see if someone has work for you.',
    );
    this.scene.launch('UIScene');

    // this.scene.bringToTop('ApartmentScene');
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
        // Emit the event in the ui scene
        this.scene.get('UIScene').events.emit('addObjective', data);
      }
    });
  }

  /////////////////////////
  // CREATE GAME OBJECTS AND COLLISIONS //
  /////////////////////////

  createHero() {
    this.hero = new Hero(
      this,
      430,
      140,
      'laiaHero',
      { hasMadeCoffee: false },
      'laia',
      { x: 15, y: 16 },
      { x: 9.2, y: 19.5 },
    );
    this.hero.setScale(2);
    this.add.existing(this.hero);
  }

  createCollisions() {
    // ADHD REMINDER: You have to set the specific tile in Tiled to "collides:true" for this to work, not just the Collision layer!!
    this.collisionLayer.setCollisionByProperty({ collides: true });

    this.children.each((child) => {
      if (child instanceof InteractiveGameObject || child instanceof Hero) {
        this.physics.add.collider(this.hero, child);
        this.physics.add.collider(this.collisionLayer, child);
      }
    });
  }

  createTilemap() {
    const map = this.make.tilemap({ key: 'apartmentMap' });
    // console.log(map);

    const tileset = map.addTilesetImage('apartmentTileset', 'apartmentTileset');
    console.log(tileset);

    // CREATE LAYERS
    const groundLayer = map.createLayer('Floor', tileset, 0, 0);

    this.collisionLayer = map.createLayer('Collisions', tileset);
    console.log('collisions', this.collisionLayer);
    this.collisionLayer.setVisible(false);

    this.wallLayer = map.createLayer('Walls', tileset);
    this.wallLayer.setDepth(2);

    const otherGameObjectsLayer = map.createLayer('OtherGameObjects', tileset);
    otherGameObjectsLayer.setDepth(2);

    const kitchenStuffLayer = map.createLayer('KitchenStuff', tileset);
    kitchenStuffLayer.setDepth(2);

    this.foregroundLayer = map.createLayer('Foreground', tileset);
    this.foregroundLayer.setDepth(10000);
  }

  createInteractiveGameObjects() {
    const michiSad = new EventTrigger(
      this,
      400,
      100,
      interactiveGameObjectAnimInfo.michiSad.key,
      'E',
      'Talk',
      eventTriggerData.michiSad.dialogueNodesObj,
      eventTriggerData.michiSad.triggerEventWhenDialogueEnds,
      eventTriggerData.michiSad.updateDialogueNodeBasedOnPlayerState,
    );

    michiSad.scale = 2;
    michiSad.play(interactiveGameObjectAnimInfo.michiSad.key);
  }

  playLevelIntroOnce() {
    if (this.hasLevelIntroPlayed || !this.hero) {
      return;
    }
    this.hasLevelIntroPlayed = true;
    this.hero.freeze = true;
    this.levelIntro = new LevelIntro({
      levelNr: 2,
      levelName: 'The Quarter Life Crisis',
    });
    this.levelIntro.createHTML();
    setTimeout(() => {
      this.hero.freeze = false;
    }, 3000);
  }
}
