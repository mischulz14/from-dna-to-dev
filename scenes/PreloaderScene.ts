import Phaser from 'phaser';

import introAudioFile from '../assets/audio/LabIntro.mp3';
import wohnungsAudioFile from '../assets/audio/WohnungsCutscene.mp3';
import fridgeKeyContainerImage from '../assets/fridgeKeyContainer.png';
import labBattleBackgroundImage from '../assets/labBattleBackground.png';
import labCutsceneSprite from '../assets/labCutsceneSprite.png';
import labHeroPng from '../assets/labHero.png';
import labMapJson from '../assets/labMapJson.json';
import labTilesImage from '../assets/labTileset.png';
import wohnungsCutsceneSprite from '../assets/wohnungCutsceneSprite.png';
import { battleBackgroundSpriteNames } from '../data/battleBackgroundSpriteNames';
import {
  cutSceneAnimsInfo,
  cutSceneAudioNames,
  cutSceneSpriteNames,
} from '../data/cutSceneSprites';
import { enemyBattleAnimationNames } from '../data/enemyBattleAnimationNames';
import { enemySpriteNames } from '../data/enemySpriteNames';
import { heroBattleAnimationNames } from '../data/heroBattleAnimationNames';
import { heroBattleSpriteNames } from '../data/heroBattleSpriteNames';
import heroSpriteNames from '../data/heroSpriteName';

export default class PreloadScene extends Phaser.Scene {
  canProceed: any;
  constructor() {
    super({ key: 'PreloadScene' });
    this.canProceed = false;

    // this.add.text(20, 20, 'Loading game...');
  }

  preload() {
    this.addProgressBar();
    this.preloadCutsceneSprites();
    this.preloadHeroSprites();
    this.preloadLabSprites();
    this.preloadLabBattleSprites();
    this.preloadAudio();
    // this.preloadEnemySprites();
    this.preloadTilesets();
  }

  create() {
    this.createLabAnimations();
    this.createLabBattleAnimations();
    this.createCutSceneAnimations();

    this.scene.start('StartScene');
  }

  addProgressBar() {
    // Create a progress bar here...
    let progressBar = this.add.graphics();
    let progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    let width = this.cameras.main.width;
    let height = this.cameras.main.height;
    let loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    // Update progress bar based on the progress of the asset loader
    this.load.on('progress', function (value) {
      // console.log(value);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });
  }

  preloadAudio() {
    this.load.audio(cutSceneAudioNames.intro, introAudioFile);
    this.load.audio(cutSceneAudioNames.wohnung, wohnungsAudioFile);
  }

  preloadCutsceneSprites() {
    this.load.spritesheet(cutSceneSpriteNames.lab, labCutsceneSprite, {
      frameWidth: 100,
      frameHeight: 50,
    });

    this.load.spritesheet(cutSceneSpriteNames.wohnung, wohnungsCutsceneSprite, {
      frameWidth: cutSceneAnimsInfo.wohnung.spriteWidth,
      frameHeight: cutSceneAnimsInfo.wohnung.spriteHeight,
    });
  }

  preloadHeroSprites() {
    // load the hero spritesheet
    this.load.spritesheet(heroSpriteNames.lab, labHeroPng, {
      frameWidth: 40,
      frameHeight: 40,
    });
  }

  preloadLabSprites() {
    this.load.spritesheet('npc', 'assets/LabNPC.png', {
      frameWidth: 32,
      frameHeight: 38,
    });

    this.load.spritesheet('infoNpc', 'assets/LabNPCInfoGuy.png', {
      frameWidth: 96,
      frameHeight: 64,
    });

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

    this.load.spritesheet('fridgeKeyContainer', fridgeKeyContainerImage, {
      frameHeight: 64,
      frameWidth: 64,
    });

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

  preloadLabBattleSprites() {
    this.load.image(battleBackgroundSpriteNames.lab, labBattleBackgroundImage);
    this.load.spritesheet(
      heroBattleSpriteNames.lab,
      'assets/virusBattleHero.png',
      {
        frameWidth: 50,
        frameHeight: 50,
      },
    );

    this.load.spritesheet(
      enemySpriteNames.virus,
      'assets/VirusBattleSprite.png',
      {
        frameWidth: 64,
        frameHeight: 64,
      },
    );

    this.load.spritesheet(
      enemySpriteNames.sleepDeprivation,
      'assets/sleepDeprivationEnemy.png',
      {
        frameWidth: 64,
        frameHeight: 64,
      },
    );
  }

  preloadTilesets() {
    // LABSCENE
    this.load.tilemapTiledJSON('map', labMapJson);
    this.load.image('lab_tiles', labTilesImage);
  }

  createCutSceneAnimations() {
    cutSceneAnimsInfo.wohnung.anims.forEach((animInfo) => {
      this.anims.create({
        key: animInfo.name,
        frames: this.anims.generateFrameNumbers(cutSceneSpriteNames.wohnung, {
          start: animInfo.start,
          end: animInfo.end,
        }),
        frameRate: 6,
        repeat: animInfo.repeat ? animInfo.repeat : 0,
      });
    });
  }

  createLabAnimations() {
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

  createLabBattleAnimations() {
    this.anims.create({
      key: heroBattleAnimationNames.lab,
      frames: this.anims.generateFrameNumbers(heroBattleSpriteNames.lab, {
        start: 0,
        end: 3,
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.anims.create({
      key: enemyBattleAnimationNames.virus,
      frames: this.anims.generateFrameNumbers(enemySpriteNames.virus, {
        start: 0,
        end: 3,
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.anims.create({
      key: enemyBattleAnimationNames.sleepDeprivation,
      frames: this.anims.generateFrameNumbers(
        enemySpriteNames.sleepDeprivation,
        {
          start: 0,
          end: 3,
        },
      ),
      frameRate: 4,
      repeat: -1,
    });
  }
}
