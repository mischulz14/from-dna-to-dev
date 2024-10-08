import { DOM, Game } from 'phaser';

import { audioNames } from '../data/audioNames';
import { eventTriggerData } from '../data/eventTriggerData';
import { interactiveGameObjectAnimInfo } from '../data/interactiveGameObjectAnimInfo';
import { npcLabData } from '../data/npcData';
import DialogueController from '../dialogue/DialogueController';
import DialogueNode from '../dialogue/DialogueNode';
import EventTrigger from '../gameObjects/EventTrigger';
import Hero from '../gameObjects/Hero';
import InteractiveGameObject from '../gameObjects/InteractiveGameObject';
import NPC from '../gameObjects/NPC';
import LevelIntro from '../sceneoverlay/SceneOverlay';
import { globalAudioManager, setMostRecentScene } from '../src/app';
import areCollisionBoxesColliding from '../utils/collisonBoxCollison';
import { placeGameObjectBasedOnLayer } from '../utils/placeGameObjectsBasedOnLayer';
import ObjectivesUIScene from './ObjectivesUIScene';

export default class ApartmentScene extends Phaser.Scene {
  hero: Hero<{
    hasCheckedCoffeeMachine: boolean;
    hasFoundWater: boolean;
    hasMadeCoffee: boolean;
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
  interactiveGameObjects: InteractiveGameObject[];

  constructor() {
    super({ key: 'ApartmentScene' });
    this.activeInteractiveGameObject = null;
    this.isEventTriggered = false;
    this.isDialoguePlaying = false;
    this.dialogueController = new DialogueController(this);
  }

  preload() {
    this.setUpGameEvents();
    setMostRecentScene('ApartmentScene');
  }

  create() {
    globalAudioManager.switchSoundTo(audioNames.lofi);
    this.createInteractiveGameObjects();

    this.createTilemap();
    this.createHero();
    this.createCollisions();

    // Make the camera follow the hero
    this.cameras.main.startFollow(this.hero);
    // this.scene.get('ObjectivesUIScene').removeAllObjectives();
    const uiScene = this.scene.get('ObjectivesUIScene') as ObjectivesUIScene;
    uiScene.changeCurrentScene('ApartmentScene');
    uiScene.removeAllObjectives();
    uiScene.addInitialObjective(
      'hasCheckedCoffeeMachine',
      'Find the coffee machine and try making some coffee',
    );
    this.scene.launch('ObjectivesUIScene');

    // this.scene.bringToTop('ApartmentScene');
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
    // this.cameras.main.zoomTo(2, 300);
    this.activeInteractiveGameObject.hideSpeechIndication();
    this.dialogueController.dialogueField.show();
    this.dialogueController.initiateDialogue(
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
    this.events.on('shutdown', this.shutdown, this);
    this.input.keyboard.on(
      'keydown-ENTER',
      this.dialogueController.playerPressesEnterEventListener,
    );
    this.events.on('dialogueEnded', () => {
      // this.cameras.main.zoomTo(1, 300);
      this.activeInteractiveGameObject.triggerEventWhenDialogueEnds(
        this,
        this.activeInteractiveGameObject,
      );
      this.isEventTriggered = true;
      this.dialogueController.isActiveNPCTalking = false;
      // console.log(
      //   'current npc',
      //   this.activeInteractiveGameObject.triggerEventWhenDialogueEnds,
      // );
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
      430,
      140,
      'laiaHero',
      {
        hasCheckedCoffeeMachine: false,
        hasFoundWater: false,
        hasMadeCoffee: false,
      },
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
    // console.log(tileset);

    // CREATE LAYERS
    const groundLayer = map.createLayer('Floor', tileset, 0, 0);
    groundLayer.setDepth(0);

    this.collisionLayer = map.createLayer('Collisions', tileset);
    // console.log('collisions', this.collisionLayer);
    this.collisionLayer.setVisible(false);

    this.wallLayer = map.createLayer('Walls', tileset);
    this.wallLayer.setDepth(0);

    let firstTileIsPainted = false;
    const coffeeMachine = map.createLayer('coffeeMachine', tileset);
    placeGameObjectBasedOnLayer(
      this,
      coffeeMachine,
      EventTrigger,
      interactiveGameObjectAnimInfo.coffeeMachine.key,
      eventTriggerData.coffeeMachine,
      42,
      38,
      true,
    );
    const wasserHahn = map.createLayer('WasserHahn', tileset);
    placeGameObjectBasedOnLayer(
      this,
      wasserHahn,
      EventTrigger,
      'empty',
      eventTriggerData.wasserHahn,
      42,
      38,
      true,
    );
    const otherGameObjectsLayer = map.createLayer('OtherGameObjects', tileset);
    otherGameObjectsLayer.setDepth(2);

    const WindowsLayer = map.createLayer('Windows', tileset);
    WindowsLayer.setDepth(0);

    const kitchenStuffLayer = map.createLayer('KitchenStuff', tileset);
    // kitchenStuffLayer.setDepth(2);

    const TVLayer = map.createLayer('TV', tileset);
    // TVLayer.setDepth(2);

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
      topText: 2,
      bottomText: 'The Quarter Life Crisis',
    });
    this.levelIntro.createHTML();
    setTimeout(() => {
      this.hero.freeze = false;
    }, 3000);
  }

  shutdown() {
    this.input.keyboard.off(
      'keydown-ENTER',
      this.dialogueController.playerPressesEnterEventListener,
    );
    this.events.off('dialogueEnded');
    this.events.off('addObjective');
  }
}
