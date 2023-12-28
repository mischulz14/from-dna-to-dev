import Phaser from 'phaser';

import { finalBattleSpriteInfos } from '../data/finalBattleSpriteInfos';
import DialogueController from '../dialogue/DialogueController';
import DialogueNode from '../dialogue/DialogueNode';
import FinalBattleBoss from '../gameObjects/FinalBattleBoss';
import FinalBattleHero from '../gameObjects/FinalBattleHero';
import FinalBattleSceneStateMachine from '../statemachine/finalBattleScene/FinalBattleStateMachine';
import { fadeCameraIn } from '../utils/sceneTransitions';

export default class FinalBattleScene extends Phaser.Scene {
  keys: Phaser.Types.Input.Keyboard.CursorKeys;
  hero: FinalBattleHero;
  finalBoss: Phaser.GameObjects.Sprite;
  dialogueController: DialogueController;
  stateMachine: FinalBattleSceneStateMachine;
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

  constructor() {
    super({ key: 'FinalBattleScene' });

    const dialogue = [
      // new DialogueNode('You are almost a fullstack developer'),
      // new DialogueNode(
      //   'You can feel the power of the code flowing through your veins...',
      // ),
      // new DialogueNode(
      //   'You just have to overcome this one final challenge.',
      // ),
      new DialogueNode("You're ready."),
    ];
    this.dialogueController = new DialogueController(this);
    this.dialogueController.initiateDialogue(dialogue, null, null);
  }

  preload() {
    this.dialogueController.dialogueField.show();
    this.dialogueController.isDialogueInCutscene = true;
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
        name: 'intro',
        animationTarget: this.arrows,
        animation: finalBattleSpriteInfos.arrows.animations[0].name,
        text: 'Your final project is going to throw HTML, CSS and React bugs at you! Evade them by using the left and right arrow keys.',
        nextPhase: 'minionPhase',
      },
    ];
    this.dialogueController.typeText();
    this.input.keyboard.on(
      'keydown-ENTER',
      this.dialogueController.playerPressesEnterEventListener,
    );

    this.events.on('dialogueEnded', () => {
      this.stateMachine = new FinalBattleSceneStateMachine(this);
      this.stateMachine.switchState('intro');
    });

    let graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 0.4);
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
    // Update game logic here
    this.stateMachine && this.stateMachine.update();
    this.hero.update();
  }

  setUpGameEvents() {}
}
