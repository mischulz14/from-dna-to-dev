import { DOM, Game } from 'phaser';

import DialogueController from '../dialogue/DialogueController';
import DialogueNode from '../dialogue/DialogueNode';
import Fist from '../gameObjects/Fist';
import LabHeroTest from '../gameObjects/LabHeroTest';
import TestEnemy from '../gameObjects/TestEnemy';

export default class TestScene extends Phaser.Scene {
  hero: LabHeroTest;
  fist: Fist;
  enemy: TestEnemy;
  enemies: TestEnemy[];
  virus: Phaser.GameObjects.Sprite;
  wave: number;
  dialogueController: DialogueController;
  dialogueNode: DialogueNode;
  gameEvents: Phaser.Events.EventEmitter;
  freezeGame: boolean;

  // private npc: Phaser.GameObjects.Sprite;
  constructor() {
    super({ key: 'TestScene' });
    this.enemies = [];
    this.wave = 1;
    this.gameEvents = new Phaser.Events.EventEmitter();
    this.dialogueController = new DialogueController(this);
  }

  preload() {
    this.loadSpriteSheetsImagesAndTileMaps();
    this.input.keyboard.on('keydown-ENTER', () => {
      console.log('enter pressed');
      this.dialogueController.playerPressesEnterEventListener();
    });
  }

  create() {
    this.createAnimations(this);

    // ADD HERO
    this.hero = new LabHeroTest(this, 50, 50, 'labHeroTest');
    this.hero.setScale(2);
    this.hero.setDepth(2);
    this.add.existing(this.hero);

    this.virus = this.add
      .sprite(400, 80, 'virus')
      .setScale(3)
      .setDepth(1)
      .play('virus-idle');

    this.virus.body = new Phaser.Physics.Arcade.Body(
      this.physics.world,
      this.virus,
    );

    // ADD ENEMIES

    // create array of enemies
    for (let i = 0; i < 1; i++) {
      this.enemies.push(
        //  randomize the x and y coordinates of the enemies
        new TestEnemy(
          this,
          Math.floor(Math.random() * 800),
          Math.floor(Math.random() * 500),
          this.hero,
          'testenemy',
        ),
      );
    }

    this.enemies.forEach((enemy) => {
      this.physics.add.overlap(this.hero, enemy, this.enemyOverlap, null, this);
      enemy.setCollideWorldBounds(true);
      enemy.setDepth(1);
    });

    // set world bounds for hero
    this.hero.setCollideWorldBounds(true);

    this.events.on('dialogueEnded', () => {
      this.freezeGame = false;
      this.dialogueController.dialogue = null;
    });

    // game events
    this.gameEvents.on('startWave2', () => {
      console.log('wave 2');
      this.dialogueController.dialogueField.show();
      this.dialogueController.dialogueField.setText('There is another wave!');

      this.time.delayedCall(2000, () => {
        this.dialogueController.dialogueField.hide();
        for (let i = 0; i < 3; i++) {
          this.enemies.push(
            //  randomize the x and y coordinates of the enemies
            new TestEnemy(
              this,
              Math.floor(Math.random() * 800),
              Math.floor(Math.random() * 500),
              this.hero,
              'testenemy',
            ),
          );
        }
        this.enemies.forEach((enemy) => {
          this.physics.add.overlap(
            this.hero,
            enemy,
            this.enemyOverlap,
            null,
            this,
          );
          enemy.setCollideWorldBounds(true);
        });
      });
    });

    // this.scene.pause();

    this.dialogueController.dialogueField.show();
    this.dialogueController.isDialogueInCutscene = true;
    this.dialogueController.initiateDialogueNodesArray(
      [
        new DialogueNode(
          'Oh no, the probes fell out of the fridge! (Or at least thats what you think)',
        ),
        new DialogueNode('Now the Virus is trying to infect you!'),
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

  update(time: number, delta: number) {
    if (this.freezeGame) return;
    if (this.wave === 1 && this.enemies.length === 0) {
      console.log('enemies', this.enemies);
      this.wave++;
      this.gameEvents.emit('startWave2');
      console.log('wave 2');
    }
    this.sortGameObjectsByYCoordinate();
    this.hero.update();
    // this.fist.update();
    this.enemies.forEach((enemy) => {
      enemy.update();
    });
  }

  enemyOverlap(hero: LabHeroTest, enemy) {
    console.log(hero.isEvading);
    if (hero.isEvading) {
      return;
    }
    if (!hero.isTakingDamage) {
      hero.health -= 20;
      hero.isTakingDamage = true;
      hero.healthBar.decrease(20);
      hero.damageAnimation();
      hero.freeze = true;
      setTimeout(() => {
        hero.freeze = false;
      }, 300);
      // console.log('Hero health: ', hero.health); // log the new health value

      setTimeout(() => {
        hero.isTakingDamage = false;
      }, 2000);
    }
  }

  virusCollision(hero: LabHeroTest, virus: Phaser.GameObjects.Sprite) {
    if (hero.isEvading) {
      return;
    }
    // if hero collides with the virus, decrease hero health
    if (!hero.isTakingDamage) {
      hero.health -= 20;
      hero.isTakingDamage = true;
      hero.healthBar.decrease(20);
      hero.damageAnimation();
      hero.freeze = true;
      setTimeout(() => {
        hero.freeze = false;
      }, 300);
      // console.log('Hero health: ', hero.health); // log the new health value

      setTimeout(() => {
        hero.isTakingDamage = false;
      }, 2000);
    }
  }

  loadSpriteSheetsImagesAndTileMaps() {
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
  }

  createAnimations(scene: Phaser.Scene) {
    this.anims.create({
      key: 'idle-down',
      frames: this.anims.generateFrameNumbers('labHeroTest', {
        start: 29,
        end: 33,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'run-down',
      frames: this.anims.generateFrameNumbers('labHeroTest', {
        start: 34,
        end: 41,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'idle-up',
      frames: this.anims.generateFrameNumbers('labHeroTest', {
        start: 42,
        end: 46,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'run-up',
      frames: this.anims.generateFrameNumbers('labHeroTest', {
        start: 47,
        end: 54,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'idle-left',
      frames: this.anims.generateFrameNumbers('labHeroTest', {
        start: 16,
        end: 20,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'run-left',
      frames: this.anims.generateFrameNumbers('labHeroTest', {
        start: 0,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'idle-right',
      frames: this.anims.generateFrameNumbers('labHeroTest', {
        start: 21,
        end: 25,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'run-right',
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
  }

  sortGameObjectsByYCoordinate() {
    this.children.each((child) => {
      if (child instanceof Phaser.GameObjects.Sprite) child.setDepth(child.y);
    });
  }
}
