import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });

    // this.add.text(20, 20, 'Loading game...');
  }

  preload() {
    this.addProgressBar();

    this.preloadBackgrounds();
    this.preloadCutsceneSprites();
    this.preloadHeroSprites();
    this.preloadLabSprites();
    this.preloadLabBattleSprites();
    // this.preloadEnemySprites();
    this.preloadTilesets();
    // this.preloadAudio()
  }

  create() {
    this.createLabAnimations();
    this.createLabBattleAnimations();
    // pass control to the start scene
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
      console.log(value);
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

  preloadBackgrounds() {}

  preloadCutsceneSprites() {
    this.load.spritesheet('LabCutsceneSprite', 'assets/labCutsceneSprite.png', {
      frameWidth: 100,
      frameHeight: 50,
    });
  }

  preloadHeroSprites() {
    // load the hero spritesheet
    this.load.spritesheet('labHero', 'assets/labHeroSpriteSheet.png', {
      frameWidth: 32,
      frameHeight: 36,
    });

    this.load.spritesheet('labHeroTest', 'assets/labHeroSpriteSheetTest.png', {
      frameWidth: 80,
      frameHeight: 128,
    });
  }

  preloadLabSprites() {
    this.load.spritesheet('npc', 'assets/LabNPC.png', {
      frameWidth: 32,
      frameHeight: 38,
    });

    this.load.spritesheet('infoNpc', 'assets/LabNPCInfoGuy.png', {
      frameWidth: 50,
      frameHeight: 45,
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

    this.load.spritesheet(
      'fridgeKeyContainer',
      'assets/fridgeKeyContainer.png',
      {
        frameHeight: 32,
        frameWidth: 32,
      },
    );

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

  preloadTilesets() {
    // LABSCENE
    this.load.tilemapTiledJSON('map', 'assets/labMapJson.json');

    this.load.image('lab_tiles', 'assets/labTileset.png');

    this.load.tilemapTiledJSON('battlemap', 'assets/labBattleBackground.json');

    // LAB BATTLE SCENES
    this.load.image('lab_tiles_battle', 'assets/labTileset.png');
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
      key: 'attack-right',
      frames: this.anims.generateFrameNumbers('punchrighttest', {
        start: 1,
        end: 8,
      }),
      frameRate: 13,
      duration: 500,
    });

    this.anims.create({
      key: 'attack-left',
      frames: this.anims.generateFrameNumbers('punchrighttest', {
        start: 10,
        end: 17,
      }),
      frameRate: 13,
      duration: 500,
    });

    this.anims.create({
      key: 'attack-down',
      frames: this.anims.generateFrameNumbers('punchdown', {
        start: 1,
        end: 8,
      }),
      frameRate: 12,
      duration: 500,
    });

    this.anims.create({
      key: 'attack-up',
      frames: this.anims.generateFrameNumbers('punchdown', {
        start: 10,
        end: 17,
      }),
      frameRate: 12,
      duration: 500,
    });

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
}
