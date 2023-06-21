import { DOM, Game } from 'phaser';

import DialogueController from '../dialogue/DialogueController';
import DialogueNode from '../dialogue/DialogueNode';
import Fist from '../gameObjects/Fist';
import LabHeroTest from '../gameObjects/LabHeroTest';
import LabNPC from '../gameObjects/LabNPC';
import TestEnemy from '../gameObjects/TestEnemy';
import areCollisionBoxesColliding from '../utils/collisonBoxCollison';

export default class TestScene extends Phaser.Scene {
  hero: LabHeroTest;
  fist: Fist;

  // private npc: Phaser.GameObjects.Sprite;
  constructor() {
    super({ key: 'TestScene' });
  }

  preload() {
    this.loadSpriteSheetsImagesAndTileMaps();
  }

  create() {
    this.createAnimations(this);

    // ADD HERO
    this.hero = new LabHeroTest(this, 50, 50, 'labHeroTest');
    this.hero.setScale(2);
    // this.hero.shadow.setDepth(1);
    this.add.existing(this.hero);
    // this.hero.play('rightattack', true);
    // ADD ENEMY
    let enemy = new TestEnemy(this, 100, 100, this.hero);
    this.add.existing(enemy);

    // set world bounds for hero
    // this.hero.setCollideWorldBounds(true);

    this.fist = new Fist(
      this,
      this.hero.x + 20,
      this.hero.y + 20,
      'fistattack',
    );

    this.fist.scale = 2;

    // Make the camera follow the hero
    // this.cameras.main.startFollow(this.hero);
  }

  update(time: number, delta: number) {
    this.sortGameObjectsByYCoordinate();
    this.hero.update();
    this.fist.update();
  }

  loadSpriteSheetsImagesAndTileMaps() {
    // load the hero spritesheet
    this.load.spritesheet('labHeroTest', 'assets/labHeroSpriteSheetTest.png', {
      frameWidth: 80,
      frameHeight: 38,
    });

    this.load.spritesheet('punchrighttest', 'assets/punchright1test.png', {
      frameWidth: 80,
      frameHeight: 38,
    });

    this.load.spritesheet('punchdown', 'assets/attack-down.png', {
      frameWidth: 80,
      frameHeight: 128,
    });

    this.load.spritesheet('fistattack', 'assets/fistattack.png', {
      frameWidth: 32,
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
      key: 'attack-right',
      frames: this.anims.generateFrameNumbers('punchrighttest', {
        start: 1,
        end: 7,
      }),
      frameRate: 10,
      duration: 1000,
    });

    this.anims.create({
      key: 'attack-left',
      frames: this.anims.generateFrameNumbers('punchrighttest', {
        start: 9,
        end: 15,
      }),
      frameRate: 10,
      duration: 1000,
    });

    this.anims.create({
      key: 'attack-down',
      frames: this.anims.generateFrameNumbers('punchdown', {
        start: 1,
        end: 7,
      }),
      frameRate: 10,
      duration: 1000,
    });
  }

  sortGameObjectsByYCoordinate() {
    this.children.each((child) => {
      if (child instanceof Phaser.GameObjects.Sprite) child.setDepth(child.y);
    });
  }
}
