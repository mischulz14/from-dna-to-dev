import Phaser from 'phaser';

import { finalBattleSpriteInfos } from '../data/finalBattleSpriteInfos';
import DialogueController from '../dialogue/DialogueController';
import DialogueNode from '../dialogue/DialogueNode';
import FinalBattleHero from '../gameObjects/FinalBattleHero';
import FinalBattleSceneStateMachine from '../statemachine/finalBattleScene/FinalBattleSceneStateMachine';

export default class FinalBattleScene extends Phaser.Scene {
  keys: Phaser.Types.Input.Keyboard.CursorKeys;
  hero: FinalBattleHero;
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
      new DialogueNode('After a long day of work, you look out of the window.'),
      new DialogueNode(
        'All this battling with stress, all of those nightshifts and sleep deprivation is certainly taking a toll on you...',
      ),
      new DialogueNode(
        'This was not how you imagined it to be when you were studying to become a scientist...',
      ),
    ];
    this.dialogueController = new DialogueController(this);
    this.dialogueController.initiateDialogue(dialogue, null, null);
  }

  preload() {
    this.dialogueController.dialogueField.show();
    this.dialogueController.isDialogueInCutscene = true;
  }

  create() {
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
        text: 'Your final project is going to throw bugs at you!\nEvade them by using the left and right arrow keys.',
        nextPhase: 'MinionPhase',
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
    graphics.fillStyle(0x000000, 0.5); // Change 0.5 to whatever opacity you want
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);

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
  }

  update() {
    // Update game logic here
    this.stateMachine && this.stateMachine.update();
    this.hero.update();
  }

  setUpGameEvents() {}
}
