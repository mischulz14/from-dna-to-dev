import DialogueManager from '../dialogue/DialogueManager';
import Hero from '../gameObjects/Hero';
import NPC from '../gameObjects/NPC';
import TestNPC from '../gameObjects/TestNPC';
import areCollisionBoxesColliding from '../utils/collisonBoxCollison';

export default class LabScene extends Phaser.Scene {
  private hero: Hero;
  private isDialoguePlaying: boolean;
  dialogueProgressNumber: number;
  isSpeakingTriggerDown: boolean;
  dialogueManager: DialogueManager;
  activeNPC: NPC | TestNPC | null;

  // private npc: Phaser.GameObjects.Sprite;
  constructor() {
    super({ key: 'LabScene' });
    // this.dialogueManager = new DialogueManager(this);
    this.dialogueProgressNumber = 0;
    this.activeNPC = null;
  }

  preload() {
    // load the hero spritesheet
    this.load.spritesheet('hero', 'assets/labHeroSpriteSheet.png', {
      frameWidth: 32,
      frameHeight: 36,
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && this.activeNPC) {
        this.dialogueProgressNumber += 1;
        console.log(this.dialogueProgressNumber);
      }
    });

    // load the npc spritesheet
    this.load.spritesheet('npc', 'assets/LabNPC.png', {
      frameWidth: 32,
      frameHeight: 38,
    });

    // Load the Tiled JSON file
    this.load.tilemapTiledJSON('map', 'assets/labMapJson.json');

    // Load the tileset image
    this.load.image('lab_tiles', 'assets/labTileset.png');
  }

  create() {
    const hero = this.hero;
    const map = this.make.tilemap({ key: 'map' });
    // console.log(map);

    const tileset = map.addTilesetImage('labTileset', 'lab_tiles');
    // console.log(tileset);

    // Create layers, add objects, etc.
    const groundLayer = map.createLayer('Floor', tileset, 0, 0);

    groundLayer.setScale(1);

    this.hero = new Hero(
      this,
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'hero',
    );
    this.hero.setScale(2);
    this.add.existing(this.hero);

    // Make the camera follow the hero
    this.cameras.main.startFollow(this.hero);

    // Create the NPC
    const npc = new NPC(this, 150, 100, 'npc');
    npc.setScale(2);
    this.add.existing(npc);

    const npc2 = new NPC(this, 300, 100, 'npc');
    npc2.play('npc-idle-left');
    npc2.setScale(2);
    this.add.existing(npc2);

    const testNPC = new TestNPC(
      this,
      300,
      300,
      'npc',
      ['Hello!', 'How are you?'],
      'E',
      'Talk',
    );
    testNPC.play('npc-idle-left');
    testNPC.setScale(2);
    this.add.existing(testNPC);

    // Set up collisions between the player and the NPC
    this.children.each((child) => {
      if (child instanceof NPC || child instanceof TestNPC) {
        this.physics.add.collider(this.hero, child);
      }
    });

    // const collisionLayer = map.createLayer('Collisions', tileset);
    // collisionLayer.setScale(3);
    // collisionLayer.setVisible(false);
    // // Set up collisions with the specified tile
    // collisionLayer.setCollisionByProperty({ collides: true });

    // const wallLayer = map.createLayer('Walls', tileset);
    // wallLayer.setScale(3);

    // // Set up collisions between the player and the specified tile
    // this.physics.add.collider(this.hero, collisionLayer);
  }

  update(time: number, delta: number) {
    // IF THE PLAYER IS TALKING TO AN NPC
    if (this.isDialoguePlaying) {
      this.hero.freeze = true;
      // if the player is talking to an NPC, the dialogue is played
      this.activeNPC?.turnToHero(this.hero);
      this.activeNPC?.talkToHero(this.dialogueProgressNumber);

      if (this.activeNPC?.dialogueEnded) {
        this.hero.freeze = false;
        // this.activeNPC?.turnBackToOriginalAnimation();
        this.dialogueProgressNumber = 0;
        this.isDialoguePlaying = false;
        this.activeNPC = null;
      }
    }

    // Sort game objects by their y-coordinate
    this.children.sort('y');

    this.children.each(async (child) => {
      child.update();

      // CHECK FOR NPC COLLISION
      if (
        child instanceof TestNPC &&
        areCollisionBoxesColliding(this.hero, child)
      ) {
        child.showSpeechIndication(true);
        // CHECK FOR DIALOGUE TRIGGER
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('E'))) {
          this.activeNPC = child;
          this.isDialoguePlaying = true;
        }
      }
      if (
        child instanceof TestNPC &&
        !Phaser.Geom.Intersects.RectangleToRectangle(
          this.hero.getBounds(),
          child.getBounds(),
        )
      ) {
        child.showSpeechIndication(false);
      }
    });
  }
}
