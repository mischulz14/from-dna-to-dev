import { DOM, Game } from 'phaser';

import DialogueController from '../dialogue/DialogueController';
import DialogueNode from '../dialogue/DialogueNode';
import TestEnemy from '../gameObjects/Enemy';
import Fist from '../gameObjects/Fist';
import LabHeroTest from '../gameObjects/LabHeroTest';
import Minion from '../gameObjects/Minion';
import Spike from '../gameObjects/Spike';
import Virus from '../gameObjects/Virus';
import { cutsceneTransitionReverse } from '../utils/sceneTransitions';

export default class TestScene extends Phaser.Scene {
  hero: LabHeroTest;
  fist: Fist;
  enemies: Minion[];
  spikes: Spike[];
  boss: Virus;
  wave: number;
  dialogueController: DialogueController;
  dialogueNode: DialogueNode;
  gameEvents: Phaser.Events.EventEmitter;
  freezeGame: boolean;
  collisionLayer: Phaser.Tilemaps.TilemapLayer;
  transitionRect: Phaser.GameObjects.Rectangle;
  // private npc: Phaser.GameObjects.Sprite;
  constructor() {
    super({ key: 'TestScene' });
    this.enemies = [];
    this.spikes = [];
    this.wave = 1;
    this.freezeGame = true;
    this.gameEvents = new Phaser.Events.EventEmitter();
    this.dialogueController = new DialogueController(this);
  }

  preload() {
    this.loadSpriteSheetsImagesAndTileMaps();

    this.input.keyboard.on('keydown-ENTER', () => {
      this.dialogueController.playerPressesEnterEventListener();
    });

    this.setUpGameEvents();

    this.transitionRect = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
      .setOrigin(0, 0);
    this.transitionRect.setDepth(1000);
  }

  create() {
    this.createAnimations();
    this.createHero();
    this.createBoss();
    this.createSpikes();
    this.spawnMinions(3);
    this.configureHero();
    this.transitionToScene();
    this.createLayers();
  }

  update(time: number, delta: number) {
    if (this.freezeGame) return;
    if (this.wave === 1 && this.enemies.length === 0) {
      this.wave = 2;
      this.events.emit('startWave2');
      console.log('wave 2');
      return;
    }
    if (this.wave === 2 && this.enemies.length === 0) {
      this.wave = 3;
      this.events.emit('startWave3');
      console.log('wave 3');
      return;
    }
    this.sortGameObjectsByYCoordinate();
    this.hero.update();
    this.boss.update();
    // this.fist.update();
    this.enemies.forEach((enemy) => {
      enemy.update();
    });

    // boss death
    if (this.boss.healthBar.health <= 0) {
      this.boss.die();
      this.events.emit('bossDeath');
    }
  }

  /////////////////////////
  /// PRELOADING ASSETS ///
  /////////////////////////

  setUpGameEvents() {
    // EVENTS FOR DIALOGUE
    this.events.on('dialogueEnded', () => {
      this.freezeGame = false;
      this.dialogueController.dialogue = null;
      this.hero.speed = 200;

      if (this.wave === 2) {
        this.spawnMinions(1);
        this.boss.healthBar.decrease(50);
      }

      if (this.wave === 3) {
        this.boss.freed = true;
        this.boss.healthBar.decrease(50);
        this.spikes.forEach((spike) => {
          spike.anims.play('spike-disappear');

          spike.on('animationcomplete', () => {
            spike.destroy();
          });
        });
      }

      if (this.wave === 4) {
        this.tweens.add({
          targets: this.transitionRect,
          alpha: { from: 1, to: 0 },
          ease: 'EaseInOut',
          duration: 2000,
          repeat: 0,
          onComplete: () => {
            this.scene.stop('TestScene');
            // @ts-ignore
            this.scene.get('LabScene').isEventTriggered = false;
            // @ts-ignore
            this.scene.get('LabScene').hero.hasBattledVirus = true;

            // @ts-ignore
            this.scene.get('UIScene').objectives.forEach((objective) => {
              if (!objective.visible) return;
              objective.setVisible(true);
            });

            this.scene.get('UIScene').events.emit('addObjective', {
              textBesidesCheckbox: 'Deliver the probe.',
              checkedCondition: 'hasDeliveredProbe',
            });

            this.scene.resume('LabScene');
            this.scene.get('LabScene').events.emit('resumeGame');
            this.scene.resume('UIScene');
          },
        });
      }
    });

    // EVENTS FOR WAVES
    this.events.on('startWave2', () => {
      this.hero.setVelocity(0, 0);
      this.hero.stateMachine.transition('idle');
      console.log('wave 2');
      this.dialogueController.dialogueField.show();
      this.dialogueController.isDialogueInCutscene = true;
      this.dialogueController.initiateDialogueNodesArray(
        [
          new DialogueNode("You've weakend the Virus!"),
          new DialogueNode('More virus particles are coming to protect it!'),
        ],
        null,
        null,
      );
      this.dialogueController.typeText();
      this.freezeGame = true;
    });

    this.events.on('startWave3', () => {
      this.hero.setVelocity(0, 0);
      this.hero.stateMachine.transition('idle');
      console.log('wave 3');
      this.dialogueController.dialogueField.show();
      this.dialogueController.isDialogueInCutscene = true;
      this.dialogueController.initiateDialogueNodesArray(
        [
          new DialogueNode(
            'The Virus is getting very angry without all of its particles.',
          ),
          new DialogueNode('Defeat it before it infects you!'),
        ],
        null,
        null,
      );
      this.dialogueController.typeText();
      this.freezeGame = true;
    });

    // EVENTS FOR BOSS DEATH
    this.events.on('bossDeath', () => {
      this.wave = 4;
      this.hero.setVelocity(0, 0);
      this.hero.stateMachine.transition('idle');
      this.dialogueController.dialogueField.show();
      this.dialogueController.isDialogueInCutscene = true;
      this.dialogueController.initiateDialogueNodesArray(
        [
          new DialogueNode('You defeated the Virus!'),
          new DialogueNode('You saved the world!'),
        ],
        null,
        null,
      );
      this.dialogueController.typeText();
      this.freezeGame = true;
    });
  }

  loadSpriteSheetsImagesAndTileMaps() {
    this.load.tilemapTiledJSON('battlemap', 'assets/labBattleBackground.json');

    // Load the tileset image
    this.load.image('lab_tiles_battle', 'assets/labTileset.png');

    // load the hero spritesheet
    this.load.spritesheet('labHeroTest', 'assets/labHeroSpriteSheetTest.png', {
      frameWidth: 80,
      frameHeight: 128,
    });

    this.load.spritesheet('punchrighttest', 'assets/punchright1test.png', {
      frameWidth: 80,
      frameHeight: 128,
    });

    this.load.spritesheet('punchdown', 'assets/attack-down.png', {
      frameWidth: 80,
      frameHeight: 128,
    });

    this.load.spritesheet('fistattack', 'assets/fistattack.png', {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet('testenemy', 'assets/testEnemy.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('evade', 'assets/evadeSprites.png', {
      frameWidth: 80,
      frameHeight: 128,
    });

    this.load.spritesheet('virus', 'assets/VirusBattleSprite.png', {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet('spike', 'assets/spike-animation.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  /////////////////////////
  /// CREATING ASSETS ///
  ///////////////////////

  createLayers() {
    const map = this.make.tilemap({ key: 'battlemap' });
    // console.log(map);

    const tileset = map.addTilesetImage('labTileset', 'lab_tiles_battle');
    // console.log(tileset);

    // CREATE LAYERS
    map.createLayer('Floor', tileset, 0, 0);

    this.collisionLayer = map.createLayer('Collisions', tileset);
    this.collisionLayer.setVisible(false);
    this.collisionLayer.setCollisionByProperty({ collides: true });

    const wallLayer = map.createLayer('Walls', tileset);

    // add collision with collision layer and each child of the scene
    this.children.each((child) => {
      if (child instanceof Phaser.GameObjects.Sprite) {
        this.physics.add.collider(child, this.collisionLayer);
      }
    });
  }

  createHero() {
    this.hero = this.physics.add
      .existing(new LabHeroTest(this, 400, 250, 'labHeroTest'))
      .setOrigin(0.5, 0.5);
    this.hero.setScale(2);
    this.hero.setDepth(2);
    this.add.existing(this.hero);
    this.hero.play('battle-idle-down');
  }

  createBoss() {
    this.boss = new Virus(this, 400, 80, this.hero, 'virus');
    this.boss.setScale(2);
    this.boss.setDepth(2);
    this.physics.add.overlap(this.hero, this.boss, this.boss.virusCollision);
    this.physics.add.collider(this.hero, this.boss);
  }

  createSpikes() {
    this.spikes = [
      new Spike(this, 310, 50, 'spike'),
      new Spike(this, 300, 100, 'spike'),
      new Spike(this, 340, 150, 'spike'),
      new Spike(this, 410, 160, 'spike'),
      new Spike(this, 480, 140, 'spike'),
      new Spike(this, 500, 100, 'spike'),
      new Spike(this, 480, 50, 'spike'),
    ];

    this.spikes.forEach((spike) => {
      this.add.existing(spike);
      spike.setScale(2);
      this.physics.add.collider(this.hero, spike);
      spike.setDepth(spike.y);
    });
  }

  configureHero() {
    this.hero.setCollideWorldBounds(true);
  }

  initiateGameDialogue() {
    this.dialogueController.dialogueField.show();
    this.dialogueController.isDialogueInCutscene = true;
    this.dialogueController.initiateDialogueNodesArray(
      [
        new DialogueNode(
          'Oh no, the probes fell out of the fridge! (Or at least thats what you think)',
        ),
        new DialogueNode(
          'The probes contained a Virus that wants to infect you!',
        ),
        new DialogueNode(
          'Fight off the virus particles so you dont get infected!',
        ),
      ],
      null,
      null,
    );
    this.dialogueController.typeText();
    this.freezeGame = true;
  }

  createAnimations() {
    this.anims.create({
      key: 'battle-idle-down',
      frames: this.anims.generateFrameNumbers('labHeroTest', {
        start: 29,
        end: 33,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'battle-run-down',
      frames: this.anims.generateFrameNumbers('labHeroTest', {
        start: 34,
        end: 41,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'battle-idle-up',
      frames: this.anims.generateFrameNumbers('labHeroTest', {
        start: 42,
        end: 46,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'battle-run-up',
      frames: this.anims.generateFrameNumbers('labHeroTest', {
        start: 47,
        end: 54,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'battle-idle-left',
      frames: this.anims.generateFrameNumbers('labHeroTest', {
        start: 16,
        end: 20,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'battle-run-left',
      frames: this.anims.generateFrameNumbers('labHeroTest', {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'battle-idle-right',
      frames: this.anims.generateFrameNumbers('labHeroTest', {
        start: 21,
        end: 25,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'battle-run-right',
      frames: this.anims.generateFrameNumbers('labHeroTest', {
        start: 8,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'fistattack-attack',
      frames: this.anims.generateFrameNumbers('fistattack', {
        start: 0,
        end: 9,
      }),
      frameRate: 13,
      duration: 1000,
      showOnStart: true,
      hideOnComplete: true,
    });

    this.anims.create({
      key: 'enemy-idle',
      frames: this.anims.generateFrameNumbers('testenemy', {
        start: 0,
        end: 4,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'evade-left',
      frames: this.anims.generateFrameNumbers('evade', {
        start: 0,
        end: 6,
      }),
      frameRate: 20,
      duration: 100,
    });

    this.anims.create({
      key: 'evade-right',
      frames: this.anims.generateFrameNumbers('evade', {
        start: 7,
        end: 13,
      }),
      frameRate: 20,
      duration: 100,
    });

    this.anims.create({
      key: 'evade-down',
      frames: this.anims.generateFrameNumbers('evade', {
        start: 14,
        end: 20,
      }),
      frameRate: 20,
      duration: 100,
    });

    this.anims.create({
      key: 'evade-up',
      frames: this.anims.generateFrameNumbers('evade', {
        start: 21,
        end: 27,
      }),
      frameRate: 20,
      duration: 100,
    });

    this.anims.create({
      key: 'virus-idle',
      frames: this.anims.generateFrameNumbers('virus', {
        start: 0,
        end: 3,
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.anims.create({
      key: 'spike-disappear',
      frames: this.anims.generateFrameNumbers('spike', {
        start: 0,
        end: 16,
      }),
      frameRate: 13,
      duration: 1000,
      showOnStart: true,
      hideOnComplete: true,
    });
  }

  sortGameObjectsByYCoordinate() {
    this.children.each((child) => {
      if (child instanceof Minion) return;
      child.setDepth(child.y);
    });
  }

  spawnMinions(numberOfMinions: number) {
    for (let i = 0; i < numberOfMinions; i++) {
      let x = Math.floor(Math.random() * (700 - 100 + 1)) + 100; // random number between 100 and 700
      let y = Math.floor(Math.random() * (400 - 100 + 1)) + 100; // random number between 100 and 400

      // check if the x or y coordinates are too close to the hero
      // if they are, randomize the coordinates again
      while (Math.abs(x - this.hero.x) < 100) {
        x = Math.floor(Math.random() * (700 - 100 + 1)) + 100; // random number between 100 and 700
      }
      while (Math.abs(y - this.hero.y) < 100) {
        y = Math.floor(Math.random() * (400 - 100 + 1)) + 100;
      }

      // for each spike in the spikes group, check if the x or y coordinates are too close to the spike
      // if they are, randomize the coordinates again
      this.spikes.forEach((spike) => {
        while (Math.abs(x - spike.x) < 100) {
          x = Math.floor(Math.random() * (700 - 100 + 1)) + 100; // random number between 100 and 700
        }

        while (Math.abs(y - spike.y) < 100) {
          y = Math.floor(Math.random() * (400 - 100 + 1)) + 100;
        }
      });

      this.enemies.push(new Minion(this, x, y, this.hero, 'testenemy'));
    }

    // add physics overlap between hero and each enemy
    this.enemies.forEach((enemy: Minion) => {
      this.physics.add.overlap(this.hero, enemy, enemy.heroOverlap, null, this);
      enemy.setCollideWorldBounds(true);
      enemy.setDepth(1);
    });

    // add physics collider between each enemy so they don't overlap and look like one enemy
    this.physics.add.collider(this.enemies, this.enemies);

    // add physics collider between each enemy and each spike
    this.physics.add.collider(this.enemies, this.spikes);
  }

  transitionToScene() {
    document.querySelector('.health-bar').classList.add('hide');
    document.querySelector('.boss-health-bar').classList.add('hide');

    this.tweens.add({
      targets: this.transitionRect,
      alpha: { from: 1, to: 0 },
      ease: 'EaseInOut',
      duration: 2000,
      repeat: 0,
      onComplete: () => {
        this.initiateGameDialogue();
        document.querySelector('.health-bar').classList.remove('hide');
        document.querySelector('.boss-health-bar').classList.remove('hide');
      },
    });
  }
}
