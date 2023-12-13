import Phaser from 'phaser';

import { audioNames } from '../data/audioNames';
import { battleBackgroundSpriteNames } from '../data/battleBackgroundSpriteNames';
import {
  cutSceneAnimsInfo,
  cutSceneAudioNames,
  cutSceneSpriteNames,
} from '../data/cutSceneSprites';
import { enemyBattleAnimationNames } from '../data/enemyBattleAnimationNames';
import { enemySpriteNames } from '../data/enemySpriteNames';
import { labHeroAnimInfo, laiaHeroAnimInfo } from '../data/heroAnimInfo';
import { heroBattleAnimationNames } from '../data/heroBattleAnimationNames';
import { heroBattleSpriteNames } from '../data/heroBattleSpriteNames';
import { interactiveGameObjectAnimInfo } from '../data/interactiveGameObjectAnimInfo';
import { UISpritesData } from '../data/UISpritesData';
import { addProgressBar } from '../utils/progressBar';

export default class PreloadScene extends Phaser.Scene {
  canProceed: any;
  constructor() {
    super({ key: 'PreloadScene' });
    this.canProceed = false;

    // this.add.text(20, 20, 'Loading game...');
  }

  preload() {
    addProgressBar(this);
    this.preloadCutsceneSprites();
    this.preloadHeroSprites();
    this.preloadLabSprites();
    this.preloadLabBattleSprites();
    this.preloadAudio();
    this.preloadApartmentSprites();
    // this.preloadEnemySprites();
    this.preloadTilesets();
  }

  create() {
    this.createLabAnimations();
    this.createLabBattleAnimations();
    this.createCutSceneAnimations();
    this.createHeroAnimations();
    this.createApartmentSceneAnimations();
    this.scene.start('StartScene');
  }

  preloadAudio() {
    this.load.audio(audioNames.battle, 'assets/audio/BattleMusic.mp3');
    this.load.audio(audioNames.lofi, 'assets/audio/lofi.mp3');
    this.load.audio(audioNames.lofiCutscene, 'assets/audio/lofiCutscene.mp3');
  }

  preloadCutsceneSprites() {
    this.load.spritesheet(
      'LabCutsceneSprite',
      '../assets/labCutsceneSprite.png',
      {
        frameWidth: 100,
        frameHeight: 50,
      },
    );

    this.load.spritesheet(
      cutSceneSpriteNames.wohnung,
      '../assets/wohnungCutsceneSprite.png',
      {
        frameWidth: cutSceneAnimsInfo.wohnung.spriteWidth,
        frameHeight: cutSceneAnimsInfo.wohnung.spriteHeight,
      },
    );
    this.load.spritesheet(
      cutSceneSpriteNames.dna,
      '../assets/DNAFillAnim.png',
      {
        frameWidth: 128,
        frameHeight: 48,
      },
    );
  }

  preloadHeroSprites() {
    // load the hero spritesheet
    this.load.spritesheet('labHero', '../assets/labHero.png', {
      frameWidth: 40,
      frameHeight: 40,
    });

    this.load.spritesheet('laiaHero', '../assets/LaiaHeroSprite.png', {
      frameWidth: 32,
      frameHeight: 36,
    });
  }

  preloadLabSprites() {
    this.load.spritesheet('npc', '../assets/LabNPC.png', {
      frameWidth: 32,
      frameHeight: 38,
    });

    this.load.spritesheet('infoNpc', '../assets/LabNPCInfoGuy.png', {
      frameWidth: 96,
      frameHeight: 64,
    });

    this.load.spritesheet(
      'refrigerator',
      '../assets/refrigeratorBattleTrigger.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      },
    );

    this.load.spritesheet(
      'computerBattleTrigger',
      '../assets/computerBattleTrigger.png',
      {
        frameHeight: 32,
        frameWidth: 32,
      },
    );

    this.load.spritesheet(
      'fridgeKeyContainer',
      '../assets/fridgeKeyContainer.png',
      {
        frameHeight: 64,
        frameWidth: 64,
      },
    );

    this.load.spritesheet('janus', '../assets/janus.png', {
      frameHeight: 32,
      frameWidth: 32,
    });

    this.load.spritesheet('npcA', '../assets/labNPCA.png', {
      frameHeight: 38,
      frameWidth: 32,
    });

    this.load.spritesheet('npcB', '../assets/labNpcB.png', {
      frameHeight: 38,
      frameWidth: 32,
    });

    this.load.spritesheet('npcC', '../assets/labNpcC.png', {
      frameHeight: 38,
      frameWidth: 32,
    });
  }

  preloadLabBattleSprites() {
    this.load.image(
      battleBackgroundSpriteNames.lab,
      '../assets/labBattleBackground.png',
    );
    this.load.spritesheet(
      heroBattleSpriteNames.lab,
      '../assets/virusBattleHero.png',
      {
        frameWidth: 50,
        frameHeight: 50,
      },
    );

    this.load.spritesheet(
      enemySpriteNames.virus,
      '../assets/VirusBattleSprite.png',
      {
        frameWidth: 64,
        frameHeight: 64,
      },
    );

    this.load.spritesheet(
      enemySpriteNames.sleepDeprivation,
      '../assets/sleepDeprivationEnemy.png',
      {
        frameWidth: 64,
        frameHeight: 64,
      },
    );
  }

  preloadApartmentSprites() {
    this.load.spritesheet('XAnim', '../assets/X-anim.png', {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet(
      interactiveGameObjectAnimInfo.michiSad.key,
      '../assets/MichiSadSprite.png',
      {
        frameWidth: interactiveGameObjectAnimInfo.michiSad.frameWidth,
        frameHeight: interactiveGameObjectAnimInfo.michiSad.frameHeight,
      },
    );

    this.load.spritesheet(
      interactiveGameObjectAnimInfo.coffeeMachine.key,
      '../assets/coffeeMachine.png',
      {
        frameWidth: interactiveGameObjectAnimInfo.coffeeMachine.frameWidth,
        frameHeight: interactiveGameObjectAnimInfo.coffeeMachine.frameHeight,
      },
    );

    this.load.spritesheet(
      interactiveGameObjectAnimInfo.coffeeMachineWithErrors.key,
      '../assets/CoffeeMachineWithErrors.png',
      {
        frameWidth:
          interactiveGameObjectAnimInfo.coffeeMachineWithErrors.frameWidth,
        frameHeight:
          interactiveGameObjectAnimInfo.coffeeMachineWithErrors.frameHeight,
      },
    );

    this.load.spritesheet('empty', '../assets/emptySprite.png', {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet(UISpritesData.heart.name, UISpritesData.heart.src, {
      frameWidth: UISpritesData.heart.frameWidth,
      frameHeight: UISpritesData.heart.frameHeight,
    });

    this.load.spritesheet(
      heroBattleSpriteNames.apartment,
      '../assets/LaiaBattle.png',
      {
        frameWidth: 50,
        frameHeight: 50,
      },
    );

    this.load.spritesheet(
      enemySpriteNames.apartment,
      '../assets/DepressedMichiEnemy.png',
      {
        frameWidth: 50,
        frameHeight: 50,
      },
    );

    this.load.spritesheet(
      battleBackgroundSpriteNames.apartment,
      '../assets/ApartmentBattleBackground.png',
      {
        frameWidth: 800,
        frameHeight: 600,
      },
    );
  }

  preloadTilesets() {
    // LABSCENE
    this.load.tilemapTiledJSON('map', '../assets/labMapJson.json');

    this.load.image('lab_tiles', '../assets/labTileset.png');

    // LAB BATTLE SCENES
    this.load.tilemapTiledJSON(
      'battlemap',
      '../assets/labBattleBackground.json',
    );
    this.load.image('lab_tiles_battle', '../assets/labTileset.png');

    // APARTMENT SCENE
    this.load.tilemapTiledJSON('apartmentMap', '../assets/apartmentMap.json');

    this.load.image('apartmentTileset', '../assets/apartmentTileset.png');
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

    cutSceneAnimsInfo.dna.anims.forEach((animInfo) => {
      this.anims.create({
        key: animInfo.name,
        frames: this.anims.generateFrameNumbers(cutSceneSpriteNames.dna, {
          start: animInfo.start,
          end: animInfo.end,
        }),
        frameRate: 13,
        repeat: animInfo.repeat ? animInfo.repeat : 0,
      });
    });
  }

  createHeroAnimations() {
    labHeroAnimInfo.forEach((animInfo) => {
      this.anims.create({
        key: animInfo.key,
        frames: this.anims.generateFrameNumbers(animInfo.textureName, {
          start: animInfo.startFrame,
          end: animInfo.endFrame,
        }),
        frameRate: animInfo.frameRate,
        repeat: animInfo.repeat,
      });
    });

    laiaHeroAnimInfo.forEach((animInfo) => {
      this.anims.create({
        key: animInfo.key,
        frames: this.anims.generateFrameNumbers(animInfo.textureName, {
          start: animInfo.startFrame,
          end: animInfo.endFrame,
        }),
        frameRate: animInfo.frameRate,
        repeat: animInfo.repeat,
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
        end: 6,
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

  createApartmentSceneAnimations() {
    this.anims.create({
      key: interactiveGameObjectAnimInfo.michiSad.key,
      frames: this.anims.generateFrameNumbers(
        interactiveGameObjectAnimInfo.michiSad.key,
        {
          start: interactiveGameObjectAnimInfo.michiSad.startFrame,
          end: interactiveGameObjectAnimInfo.michiSad.endFrame,
        },
      ),
      frameRate: interactiveGameObjectAnimInfo.michiSad.frameRate,
      repeat: interactiveGameObjectAnimInfo.michiSad.repeat,
    });

    this.anims.create({
      key: 'XAnim',
      frames: this.anims.generateFrameNumbers('XAnim', {
        start: 0,
        end: 20,
      }),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: UISpritesData.heart.name,
      frames: this.anims.generateFrameNumbers(UISpritesData.heart.name, {
        start: UISpritesData.heart.startFrame,
        end: UISpritesData.heart.endFrame,
      }),
      frameRate: 25,
      repeat: UISpritesData.heart.repeat,
    });

    this.anims.create({
      key: heroBattleAnimationNames.apartment,
      frames: this.anims.generateFrameNumbers(heroBattleSpriteNames.apartment, {
        start: 0,
        end: 4,
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.anims.create({
      key: enemyBattleAnimationNames.apartment,
      frames: this.anims.generateFrameNumbers(enemySpriteNames.apartment, {
        start: 0,
        end: 4,
      }),
      frameRate: 4,
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
