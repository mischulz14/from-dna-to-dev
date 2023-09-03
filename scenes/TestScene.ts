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
    this.input.keyboard.on('keydown-ENTER', () => {
      this.dialogueController.playerPressesEnterEventListener();
    });

    this.setUpGameEvents();
  }

  create() {
    this.transitionRect = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
      .setOrigin(0, 0);
    this.transitionRect.setDepth(1000);
    const worldWidth = this.cameras.main.width * 0.98;
    const worldHeight = this.cameras.main.height * 0.95;
    const worldX = (this.cameras.main.width - worldWidth) / 2;
    const worldY = (this.cameras.main.height - worldHeight) / 2;

    this.physics.world.setBounds(worldX, worldY, worldWidth, worldHeight);

    // Visualize the world bounds
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0xff0000);
    graphics.strokeRect(
      this.physics.world.bounds.x,
      this.physics.world.bounds.y,
      this.physics.world.bounds.width,
      this.physics.world.bounds.height,
    );
    this.createHero();
    this.createBoss();
    this.createSpikes();
    this.createLayers();
    this.spawnMinions(3);
    this.configureHero();
    this.initScene();
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
  /// SET UP GAME EVENTS ///
  /////////////////////////

  setUpGameEvents() {
    // EVENTS FOR DIALOGUE
    this.events.on('dialogueEnded', () => {
      this.freezeGame = false;
      this.dialogueController.dialogue = null;
      this.hero.speed = 200;

      if (this.wave === 2) {
        this.spawnMinions(5);
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
    });

    // EVENTS FOR WAVES
    this.events.on('startWave2', () => {
      this.hero.setVelocity(0, 0);
      this.hero.playerStateMachine.switchState('idle');
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
      this.hero.playerStateMachine.switchState('idle');
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
      this.freezeGame = true;
      this.hero.setVisible(false);
      this.hero.healthBar.setVisible(false);
      this.hero.shadow.setVisible(false);

      this.tweens.add({
        targets: this.transitionRect,
        alpha: { from: 0, to: 1 },
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
    });
  }

  /////////////////////////
  /// CREATING GAMEOBJECTS ///
  ///////////////////////

  createLayers() {
    const map = this.make.tilemap({ key: 'battlemap' });
    // console.log(map);

    const tileset = map.addTilesetImage('labTileset', 'lab_tiles_battle');
    // console.log(tileset);

    // CREATE LAYERS
    map.createLayer('Floor', tileset, 0, 0);

    // this.collisionLayer = map.createLayer('Collisions', tileset);
    // this.collisionLayer.setVisible(false);
    // this.collisionLayer.setCollisionByProperty({ collides: true });

    // const wallLayer = map.createLayer('Walls', tileset);

    // add collision with collision layer and each child of the scene
    this.children.each((child) => {
      if (child instanceof Phaser.GameObjects.Sprite && child !== this.hero) {
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
      this.physics.add.overlap(this.hero, spike, () => {
        // if hero overlaps, push him back based on direction
        switch (this.hero.lastDirection) {
          case 'up':
            this.hero.y += 100;
            break;
          case 'down':
            this.hero.y -= 100;
            break;
          case 'left':
            this.hero.x += 100;
            break;
          case 'right':
            this.hero.x -= 100;
            break;
          default:
            break;
        }
      });
    });
  }

  configureHero() {
    this.hero.setCollideWorldBounds(true);

    // console.log world bounds
    console.log(this.physics.world.bounds);
  }

  initiateGameDialogue() {
    this.dialogueController.dialogueField.show();
    this.dialogueController.isDialogueInCutscene = true;
    this.dialogueController.initiateDialogueNodesArray(
      [
        new DialogueNode(
          'The probe that fell out of the fridge contained a Virus that wants to infect you!',
        ),
        new DialogueNode('(Or at least thats what you think...)'),
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

  sortGameObjectsByYCoordinate() {
    this.children.each((child) => {
      if (child instanceof Minion) return;
      // @ts-ignore
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

  initScene() {
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
