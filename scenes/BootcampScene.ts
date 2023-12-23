import { DOM, Game } from 'phaser';

import { audioNames } from '../data/audioNames';
import { eventTriggerData } from '../data/eventTriggerData';
import { interactiveGameObjectAnimInfo } from '../data/interactiveGameObjectAnimInfo';
import { npcBootcampData } from '../data/npcData';
import DialogueController from '../dialogue/DialogueController';
import DialogueNode from '../dialogue/DialogueNode';
import EventTrigger from '../gameObjects/EventTrigger';
import Hero from '../gameObjects/Hero';
import InteractiveGameObject from '../gameObjects/InteractiveGameObject';
import NPC from '../gameObjects/NPC';
import ObjectiveIndicator from '../gameObjects/ObjectiveIndicator';
import LevelIntro from '../sceneoverlay/SceneOverlay';
import { globalAudioManager } from '../src/app';
import areCollisionBoxesColliding from '../utils/collisonBoxCollison';
import { placeGameObjectBasedOnLayer } from '../utils/placeGameObjectsBasedOnLayer';
import ObjectivesUIScene from './ObjectivesUIScene';

export default class BootcampScene extends Phaser.Scene {
  hero: Hero<{
    hasTalkedToJose: boolean;
    hasTalkedToEveryone: boolean;
    hasProgressedToNextPhase: boolean;
    isReadyForBattle: boolean;
  }>;
  NPCsPlayerHasTalkedTo: NPC[];
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
    super({ key: 'BootcampScene' });
    this.activeInteractiveGameObject = null;
    this.isEventTriggered = false;
    this.isDialoguePlaying = false;
    this.dialogueController = new DialogueController(this);
    this.NPCsPlayerHasTalkedTo = [];
  }

  preload() {
    this.setUpGameEvents();
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
    uiScene.changeCurrentScene('BootcampScene');
    uiScene.removeAllObjectives();
    uiScene.addInitialObjective(
      'hasTalkedToJose',
      'Talk to one of your Tutors standing besides the big screen',
    );
    this.scene.launch('ObjectivesUIScene');

    // this.scene.bringToTop('BootcampScene');
    // this.playSceneOverlay(3, 'The Bootcamp starts');
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
      child.updateDialogueNodeBasedOnPlayerState ??
        child.updateDialogueNodeBasedOnPlayerState(this, child);

      this.activeInteractiveGameObject = child;
      this.hero.freeze = true;
      this.dialogueController.dialogueInProgress = true;
      this.dialogueController.isActiveNPCTalking = true;
      this.isEventTriggered = true;
      this.dialogueEvent(child.dialogueNodesObj.nodes);
    }
  }

  hideSpeechIndication(child: InteractiveGameObject | EventTrigger) {
    if (
      child instanceof InteractiveGameObject &&
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

    this.events.on('changeContext', () => {});
  }

  /////////////////////////
  // CREATE GAME OBJECTS AND COLLISIONS //
  /////////////////////////

  createHero() {
    this.hero = new Hero(
      this,
      230,
      140,
      'bootcampHero',
      {
        hasTalkedToJose: false,
        hasTalkedToEveryone: false,
        hasProgressedToNextPhase: false,
        isReadyForBattle: false,
      },
      'bootcamp',
      { x: 11, y: 12 },
      { x: 14, y: 22 },
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
    const map = this.make.tilemap({ key: 'bootcampMap' });
    console.log(map);

    const tileset = map.addTilesetImage('bootcampTileset', 'bootcampTileset');
    console.log(tileset);

    map.layers.forEach((layer) => {
      const layerName = layer.name;
      if (layerName === 'Collisions') {
        this.collisionLayer = map.createLayer(
          layerName,
          tileset,
          0,
          0,
        ) as Phaser.Tilemaps.TilemapLayer;
        this.collisionLayer.setDepth(1);
        this.collisionLayer.setVisible(false);
        return;
      }
      if (layerName === 'Foreground') {
        this.foregroundLayer = map.createLayer(
          layerName,
          tileset,
          0,
          0,
        ) as Phaser.Tilemaps.TilemapLayer;
        this.foregroundLayer.setDepth(10000);
        map.createLayer(layerName, tileset, 0, 0);
        return;
      }

      map.createLayer(layerName, tileset, 0, 0);
    });
  }

  createInteractiveGameObjects() {
    Object.entries(npcBootcampData).forEach(([key, value]) => {
      const npc = new NPC(
        this,
        value.position.x,
        value.position.y,
        value.texture,
        value.initialAnimation,
        'E',
        'Talk',
        value.dialogueNodesObj,
        value.triggerEventWhenDialogueEnds,
        value.updateDialogueNodeBasedOnHeroState,
      );
      npc.setScale(2);
      this.add.existing(npc);
    });
  }

  playSceneOverlay(levelNumber: string | number, bottomText: string) {
    const timeout = 3000;
    if (this.hasLevelIntroPlayed || !this.hero) {
      return;
    }
    this.hasLevelIntroPlayed = true;
    this.hero.freeze = true;
    this.levelIntro = new LevelIntro({
      topText: levelNumber || null,
      bottomText: bottomText,
    });
    this.levelIntro.createHTML();
    setTimeout(() => {
      this.hero.freeze = false;
      this.hasLevelIntroPlayed = false;
    }, timeout);

    return timeout;
  }
}
