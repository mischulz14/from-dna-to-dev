import Phaser from 'phaser';

import { audioNames } from '../data/audioNames';
import { finalBattleSpriteInfos } from '../data/finalBattleSpriteInfos';
import DialogueController from '../dialogue/DialogueController';
import DialogueNode from '../dialogue/DialogueNode';
import FinalBattleBoss from '../gameObjects/FinalBattleBoss';
import FinalBattleHero from '../gameObjects/FinalBattleHero';
import { globalAudioManager, isMobileScreen } from '../src/app';
import FinalBattleSceneStateMachine from '../statemachine/finalBattleScene/FinalBattleStateMachine';
import { fadeCameraIn, fadeCameraOut } from '../utils/sceneTransitions';

export default class FinalBattleScene extends Phaser.Scene {
  keys: Phaser.Types.Input.Keyboard.CursorKeys;
  hero: FinalBattleHero;
  finalBoss: FinalBattleBoss;
  dialogueController: DialogueController;
  stateMachine: FinalBattleSceneStateMachine;
  gameOver: boolean;
  arrows: Phaser.GameObjects.Sprite;
  mouse: Phaser.GameObjects.Sprite;
  phases: {
    name: string;
    animationTarget: Phaser.GameObjects.Sprite;
    animation: string;
    text: string;
    nextPhase: string;
  }[];
  currentPhase = 0;
  rectangle: Phaser.GameObjects.Rectangle;
  text: Phaser.GameObjects.Text;
  text2: Phaser.GameObjects.Text;
  enterMobileButton: HTMLDivElement;
  enterMobileFunction: () => void;
  canProgress: boolean;

  constructor() {
    super({ key: 'FinalBattleScene' });

    const dialogue = [
      new DialogueNode('You are almost a fullstack developer'),
      new DialogueNode(
        'You can feel the power of the code flowing through your veins...',
      ),
      new DialogueNode('You just have to overcome this one final challenge.'),
      new DialogueNode("You're ready."),
    ];
    this.dialogueController = new DialogueController(this);
    this.dialogueController.initiateDialogue(dialogue, null, null);
    this.gameOver = false;
    this.enterMobileButton = document.querySelector('.mobile__button--enter');
    this.enterMobileFunction = () => {
      this.dialogueController.playerPressesEnterEventListener();
    };
    this.canProgress = false;
  }

  init() {
    const dialogue = [
      new DialogueNode('You are almost a fullstack developer'),
      new DialogueNode(
        'You can feel the power of the code flowing through your veins...',
      ),
      new DialogueNode('You just have to overcome this one final challenge.'),
      new DialogueNode("You're ready."),
    ];
    this.dialogueController = new DialogueController(this);
    this.dialogueController.initiateDialogue(dialogue, null, null);
    this.gameOver = false;
    this.currentPhase = 0;
  }

  preload() {
    this.dialogueController.dialogueField.show();
    this.dialogueController.isDialogueInCutscene = true;
    globalAudioManager.switchSoundTo(audioNames.battle);
  }

  create() {
    fadeCameraIn(this, 1000);
    this.arrows = this.add
      .sprite(335, 220, finalBattleSpriteInfos.arrows.texture)
      .setOrigin(0, 0)
      .setDepth(10000)
      .setScale(4)
      .play(finalBattleSpriteInfos.arrows.animations[0].name)
      .setAlpha(0);
    this.mouse = this.add
      .sprite(350, 220, finalBattleSpriteInfos.mouse.texture)
      .setOrigin(0, 0)
      .setScale(4)
      .setDepth(10000)
      .play(finalBattleSpriteInfos.mouse.animations[0].name)
      .setAlpha(0);

    this.phases = [
      {
        name: 'intro',
        animationTarget: this.arrows,
        animation: finalBattleSpriteInfos.arrows.animations[0].name,
        text: 'Your final project is going to throw HTML, CSS and React bugs at you! Evade them by using the left and right arrow keys.',
        nextPhase: 'minionPhase',
      },
      {
        name: 'postgres',
        animationTarget: this.mouse,
        animation: finalBattleSpriteInfos.mouse.animations[0].name,
        text: 'Now Postgres Bugs are trying to trample down your database! Click on them to destroy them.',
        nextPhase: 'minionPhase2',
      },
      {
        name: 'moreMinions',
        animationTarget: this.arrows,
        animation: finalBattleSpriteInfos.arrows.animations[0].name,
        text: 'Your Computer is even angrier and is throwing more fast-pace bugs at you! Evade them by using the left and right arrow keys.',
        nextPhase: 'minionPhase',
      },
      {
        name: 'postgres',
        animationTarget: this.mouse,
        animation: finalBattleSpriteInfos.mouse.animations[0].name,
        text: 'More Postgres Bugs are trying to trample down your database! Click on them to destroy them.',
        nextPhase: 'minionPhase2',
      },
      {
        name: 'moreMinions',
        animationTarget: this.arrows,
        animation: finalBattleSpriteInfos.arrows.animations[0].name,
        text: 'In a last ditch effort, your computer is throwing even more bugs at you as fast as it can! Evade them by using the left and right arrow keys.',
        nextPhase: 'minionPhase',
      },
    ];
    this.dialogueController.typeText();
    this.input.keyboard.on(
      'keydown-ENTER',
      this.dialogueController.playerPressesEnterEventListener,
    );
    if (isMobileScreen) {
      this.enterMobileButton.addEventListener(
        'pointerdown',
        this.enterMobileFunction,
      );
    }

    this.events.on('dialogueEnded', () => {
      if (this.gameOver) return;
      this.stateMachine = new FinalBattleSceneStateMachine(this);
      this.stateMachine.switchState('explanation');
    });

    this.input.on('pointerdown', () => {
      if (!isMobileScreen) return;
      this.canProgress = true;
      setTimeout(() => {
        this.canProgress = false;
      }, 200);
    });

    this.events.on('shutdown', this.shutdown);

    const bgRect1 = this.add
      .rectangle(this.scale.width, this.scale.height, 0, 0, 0x000000)
      .setOrigin(0, 0)
      .setAlpha(0.7);

    let graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 0.7);
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);

    const bgRect2 = this.add
      .rectangle(
        this.scale.width / 2 / 2 - 5,
        +10,
        this.scale.width / 2 + 10,
        this.scale.height - 20,
        0xffffff,
      )
      .setOrigin(0, 0);

    const bgRect = this.add
      .rectangle(
        this.scale.width / 2 / 2,
        +15,
        this.scale.width / 2,
        this.scale.height - 30,
        0x000000,
      )
      .setOrigin(0, 0);

    this.keys = this.input.keyboard.createCursorKeys();
    this.hero = new FinalBattleHero(
      this,
      this.scale.width / 2,
      500,
      'final',
      'final-idle-center',
      '',
      this.keys,
    )
      .setScale(3)
      // .play('final-idle-center')
      .setAlpha(0)
      .setDepth(10000);

    this.finalBoss = new FinalBattleBoss(
      this,
      this.scale.width / 2,
      0,
      finalBattleSpriteInfos.finalBoss.texture,
    )
      .setScale(3)
      .setDepth(10000)
      .setAlpha(0);
  }

  update() {
    if (this.hero.healthBar.health <= 0) {
      if (this.gameOver) return;
      this.hero.stateMachine.switchState('idleCenter');
      this.gameOver = true;
      const fadeOut = fadeCameraOut(this, 3000);

      this.dialogueController.initiateDialogue(
        [new DialogueNode('The bugs defeated you, you give up...')],
        null,
        null,
      );
      this.dialogueController.dialogueField.show();
      this.dialogueController.typeText();
      setTimeout(() => {
        this.stateMachine.destroy();
        this.scene.start('GameOverScene');
        this.scene.stop('FinalBattleScene');

        this.dialogueController.dialogueField.hide();
      }, fadeOut);

      return;
    }

    this.stateMachine && this.stateMachine.update();
    this.hero.update();
  }

  shutdown() {
    this.enterMobileButton &&
      this.enterMobileButton.removeEventListener(
        'pointerdown',
        this.enterMobileFunction,
      );
  }
}
