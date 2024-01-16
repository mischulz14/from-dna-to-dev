import Phaser, { Events } from 'phaser';

import AttackOptions from '../battle/AttackOptions';
import { audioNames } from '../data/audioNames';
import { heroBattleAnimationNames } from '../data/heroBattleAnimationNames';
import DialogueField from '../dialogue/DialogueField';
import { globalAudioManager } from '../src/app';
import {
  cutsceneTransitionReverse,
  fadeCameraOut,
} from '../utils/sceneTransitions';
import ObjectivesUIScene from './ObjectivesUIScene';

export type Attacks = { text: string; damage: number; damageText: string }[];

export default class VirusBattleScene extends Phaser.Scene {
  player: any;
  enemy: any;
  playerAttackOptions: AttackOptions;
  enemyAttackOptions: any;
  playerHealth: number;
  initialPlayerHealth: number;
  playerHealthBar: Phaser.GameObjects.Rectangle;
  enemyHealth: number;
  initialEnemyHealth: number;
  enemyAttacks: Attacks;
  enemyName: string;
  randomEnemyAttack: any;
  heroBattleAnimationName: string;
  enemyBattleAnimationName: string;
  enemyHealthBar: Phaser.GameObjects.Rectangle;
  attackOptionsContainer: any;
  dialogueField: DialogueField;
  hasShownBattleStartingDialogue: boolean = false;
  hasPlayerChosenAttack: boolean = false;
  hasPlayerAttacked: boolean = false;
  gameEvents: Events.EventEmitter;
  initialDialogue: string = '';
  endDialogue: string = '';
  deactivateKeydown: boolean = false;
  dialogueText: string = '';
  fullText: string = '';
  isTextFullyRevealed: boolean = true;
  typeWriteEvent: Phaser.Time.TimerEvent;
  keyboardInput: Phaser.Input.Keyboard.KeyboardPlugin;
  resolveInput: Function; // This will be used to resolve the promise when the player presses Enter
  transitionRect: Phaser.GameObjects.Rectangle;
  playerHealthBarBackground: Phaser.GameObjects.Rectangle[];
  enemyHealthBarBackground: Phaser.GameObjects.Rectangle[];
  playerAttacks: Attacks;
  backgroundImage: string;
  battleHeroSpriteTexture: string;
  enemyTexture: string;
  triggerEventsOnBattleEnd: Function;
  playerHealthNumber: Phaser.GameObjects.Text;
  enemyHealthBarNumber: Phaser.GameObjects.Text;
  gameOver: boolean = false;
  enterMobileButton: HTMLDivElement;
  enterMobileFunction: () => void;

  constructor() {
    super({ key: 'BattleScene' });

    // this.initialPlayerHealth = 130;
    // this.playerHealth = this.initialPlayerHealth;
    // this.initialEnemyHealth = 100;
    // this.enemyHealth = this.initialEnemyHealth;
    this.gameEvents = new Events.EventEmitter();
    this.setUpGameEvents();
    this.gameOver = false;

    this.enterMobileFunction = () => {
      console.log('progressOnMobile');
      if (this.resolveInput && this.isTextFullyRevealed) {
        // If there's a resolver function, call it and clear it
        const resolve = this.resolveInput;
        this.resolveInput = null;
        resolve();
      } else {
        // reveal the full text
        this.dialogueText = this.fullText;
        this.dialogueField.setText(this.dialogueText);
      }
    };
  }

  init(data: {
    enemyAttacks: Attacks;
    playerAttacks: Attacks;
    backgroundImage: string;
    battleHeroSpriteTexture: string;
    enemyTexture: string;
    enemyName: string;
    initialDialogue: string;
    endDialogue: string;
    triggerEventsOnBattleEnd: Function;
    heroBattleAnimationName: string;
    enemyBattleAnimationName: string;
    initialPlayerHealth: number;
    initialEnemyHealth: number;
  }) {
    this.enemyAttacks = [];
    this.playerAttacks = [];
    this.enemyAttacks = data.enemyAttacks;
    this.playerAttacks = data.playerAttacks;
    this.backgroundImage = data.backgroundImage;
    this.battleHeroSpriteTexture = data.battleHeroSpriteTexture;
    this.enemyTexture = data.enemyTexture;
    this.enemyName = data.enemyName;
    this.initialDialogue = data.initialDialogue;
    this.endDialogue = data.endDialogue;
    this.triggerEventsOnBattleEnd = data.triggerEventsOnBattleEnd;
    this.heroBattleAnimationName = data.heroBattleAnimationName;
    this.enemyBattleAnimationName = data.enemyBattleAnimationName;
    this.initialPlayerHealth = data.initialPlayerHealth;
    this.initialEnemyHealth = data.initialEnemyHealth;
    this.playerHealth = this.initialPlayerHealth;
    this.enemyHealth = this.initialEnemyHealth;
    this.gameOver = false;
    this.enterMobileButton = document.querySelector('.mobile__button--enter');
    this.enterMobileButton.addEventListener(
      'pointerdown',
      this.enterMobileFunction,
    );
  }

  create() {
    this.events.on('shutdown', this.shutdown, this);
    globalAudioManager.switchSoundTo(audioNames.battle);
    this.add.image(0, 0, this.backgroundImage).setOrigin(0, 0);

    this.playerAttackOptions = new AttackOptions(
      this.playerAttacks,
      this,
      this.gameEvents,
    );

    this.player = this.add.sprite(100, 280, this.battleHeroSpriteTexture);
    this.enemy = this.add.sprite(400, 100, this.enemyTexture);

    //  scale player and enemy sprites
    this.player.setScale(6);
    this.enemy.setScale(4);

    this.anims.create({
      key: 'BattleEnemyIdle',
      frames: this.anims.generateFrameNumbers(this.enemyTexture, {
        start: 0,
        end: 3,
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.cameras.main.fadeIn(3000, 0, 0, 0);
    this.startBattle();

    //triggers when the player presses enter.
    //used to resolve the promise and progress the battle.
    this.input.keyboard.on('keydown', (event: any) => {
      if (event.key === 'Enter') {
        if (this.resolveInput && this.isTextFullyRevealed) {
          // If there's a resolver function, call it and clear it
          const resolve = this.resolveInput;
          this.resolveInput = null;
          resolve();
        } else {
          // reveal the full text
          this.dialogueText = this.fullText;
          this.dialogueField.setText(this.dialogueText);
        }
      }
    });
  }

  typeWriterEffect(text: string, delay: number = 50) {
    this.isTextFullyRevealed = false;
    this.fullText = text;
    this.dialogueText = '';

    if (this.typeWriteEvent) {
      this.typeWriteEvent.remove();
    }

    this.typeWriteEvent = this.time.addEvent({
      delay: delay,
      callback: () => {
        if (this.dialogueText.length < this.fullText.length) {
          this.dialogueText += this.fullText[this.dialogueText.length];
          this.dialogueField.setText(this.dialogueText);
        } else {
          this.isTextFullyRevealed = true;
          this.typeWriteEvent.remove();
        }
      },
      callbackScope: this,
      loop: true,
    });
  }

  update() {}

  addDialogueField() {
    this.dialogueField = new DialogueField();
    setTimeout(() => {
      this.dialogueField.show();
    }, 400);
  }

  async startBattle() {
    this.anims.play(this.heroBattleAnimationName, this.player);
    this.anims.play(this.enemyBattleAnimationName, this.enemy);
    this.addDialogueField();
    this.typeWriterEffect(this.initialDialogue);
    this.gameObjectsEnterTheScene();
    await this.waitForUserConfirmation();
    this.showAttackOptions();
  }

  async showAttackOptions() {
    this.dialogueField.setText('Choose your attack!');
    this.playerAttackOptions.showOptions();
    await this.waitForUserConfirmation();
    this.playerAttackChosen();
  }

  async playerAttackChosen() {
    this.playerAttackOptions.hideOptions();
    this.typeWriterEffect(
      `You chose to utilize ${this.playerAttackOptions.currentlySelectedOption.text}!`,
    );

    await this.waitForUserConfirmation();
    this.playPlayerAttackAnimation();
    this.reduceEnemyHealth();
  }

  playPlayerAttackAnimation() {
    this.deactivateKeydown = true;
    console.log('playPlayerAttackAnimation');
    this.tweens.add({
      targets: this.player,
      x: '+=50',
      ease: 'Power1',
      duration: 300,
      yoyo: true,
    });
  }

  playDamageAnimation(target) {
    this.tweens.add({
      targets: target,
      x: '-=10',
      ease: 'Power1',
      duration: 50,
      yoyo: true,
      repeat: 3,
    });
  }

  reduceEnemyHealth() {
    this.playDamageAnimation(this.enemy);
    this.updateHealthBar(
      this.enemyHealth,
      this.initialEnemyHealth,
      this.enemyHealthBar,
      this.enemyHealthBarNumber,
      this.playerAttackOptions.currentlySelectedOption,
      false,
    );

    this.waitForUserConfirmation().then(() => {
      this.showPlayerAttackMessage();
    });
  }

  showPlayerAttackMessage() {
    this.typeWriterEffect(
      this.playerAttackOptions.currentlySelectedOption.damageText,
    );

    this.waitForUserConfirmation().then(() => {
      this.checkBattleEnd('enemyAttackChosen');
    });
  }

  async enemyAttackChosen() {
    this.randomEnemyAttack =
      this.enemyAttacks[Math.floor(Math.random() * this.enemyAttacks.length)];
    this.typeWriterEffect(
      `${this.enemyName} uses ${this.randomEnemyAttack.name}!`,
    );

    await this.waitForUserConfirmation();
    this.playEnemyAttackAnimation();
    await this.waitForUserConfirmation();
    this.playDamageAnimation(this.player);
    this.reducePlayerHealth();
  }

  playEnemyAttackAnimation() {
    console.log('playEnemyAttackAnimation');
    this.tweens.add({
      targets: this.enemy,
      x: '-=50',
      ease: 'Power1',
      duration: 300,
      yoyo: true,
    });
  }

  gameObjectsEnterTheScene() {
    this.addPlayerHealthBar();
    this.addEnemyHealthBar();
    // transition player from left to right
    this.tweens.add({
      targets: this.player,
      x: 200,
      ease: 'Power1',
      duration: 3000,
    });

    // transition enemy from right to left
    this.tweens.add({
      targets: this.enemy,
      x: 700,
      ease: 'Power1',
      duration: 3000,
    });
  }

  addPlayerHealthBar() {
    const rect1 = this.add.rectangle(50, 110, 160, 30, 0x0000).setOrigin(0, 0);
    const rect2 = this.add
      .rectangle(60, 120, 160, 30, 0xf3f3f3)
      .setOrigin(0, 0);
    this.playerHealthNumber = this.add
      .text(50, 75, JSON.stringify(this.playerHealth), {
        fontSize: '2rem',
        fontFamily: 'Rainyhearts',
        color: '#000',
      })
      .setOrigin(0, 0);

    this.playerHealthBarBackground = [rect1, rect2];

    this.playerHealthBar = this.add.rectangle(80, 130, 120, 10, 0x45a47d);
    this.playerHealthBar.setOrigin(0, 0);
  }

  addEnemyHealthBar() {
    const rect1 = this.add.rectangle(400, 30, 160, 30, 0x0000).setOrigin(0, 0);
    const rect2 = this.add
      .rectangle(410, 40, 160, 30, 0xf3f3f3)
      .setOrigin(0, 0);
    this.enemyHealthBarBackground = [rect1, rect2];
    this.enemyHealthBarNumber = this.add.text(
      520,
      75,
      JSON.stringify(this.enemyHealth),
      {
        fontSize: '2rem',
        fontFamily: 'Rainyhearts',
        color: '#000',
      },
    );

    this.enemyHealthBar = this.add.rectangle(430, 50, 120, 10, 0x45a47d);
    this.enemyHealthBar.setOrigin(0, 0);
  }

  reducePlayerHealth() {
    this.updateHealthBar(
      this.playerHealth,
      this.initialPlayerHealth,
      this.playerHealthBar,
      this.playerHealthNumber,
      this.randomEnemyAttack,
    );
    this.typeWriterEffect(this.randomEnemyAttack.damageText);

    this.waitForUserConfirmation().then(() => {
      this.checkBattleEnd('showAttackOptions');
    });
  }

  updateHealthBar(
    entityHealth,
    initialEntityHealth,
    entityHealthBar,
    entityHealthNumber,
    randomAttack,
    isPlayer = true,
  ) {
    // if player health is smaller than 0, set it to 0
    if (entityHealth < 0) entityHealth = 0;

    if (entityHealth === 0) {
      return;
    }

    const timer = this.scene.scene.time.addEvent({
      delay: 50,
      repeat: randomAttack.damage - 1, // subtract 1 to account for the initial run
      callback: () => {
        if (entityHealth === 0) {
          timer.destroy(); // destroy the timer if health is 0
          return;
        }

        // reduce health points by amount each tick
        entityHealth--;
        entityHealthNumber.setText(JSON.stringify(entityHealth));

        // calculate the new width based on the updated health percentage
        const newWidth = (entityHealth / initialEntityHealth) * 100;

        console.log(entityHealthBar.width);
        console.log('newWidth', newWidth);

        entityHealthBar.setDisplaySize(newWidth, entityHealthBar.height);

        if (isPlayer) {
          this.playerHealth = entityHealth;
        } else {
          this.enemyHealth = entityHealth;
        }

        // ensure health bar and health points don't go negative
        // if (newWidth < 0) {
        //   this.bar.style.width = '0%';
        //   this.healthText.innerHTML = '0';
        // }
      },
    });
    return entityHealth;
  }

  checkBattleEnd(emittedEventAfterCheck: string) {
    console.log('checkBattleEnd');
    if (this.enemyHealth <= 0) {
      this.playerAttackOptions.destroy();
      this.typeWriterEffect(this.endDialogue);
      this.enemyDestroyedAnimation();

      this.waitForUserConfirmation().then(() => {
        fadeCameraOut(this, 2000);
        setTimeout(() => {
          this.triggerEventsOnBattleEnd(this);
          this.dialogueField.hide();
          this.player.destroy();
          this.enemyHealthBar.destroy();
          this.playerHealthBar.destroy();
          this.playerHealthBarBackground.forEach((rect) => rect.destroy());
          this.enemyHealthBarBackground.forEach((rect) => rect.destroy());
          globalAudioManager.switchSoundTo(audioNames.lofi);
        }, 2200);
      });
    } else if (this.playerHealth <= 0) {
      this.typeWriterEffect('You lost the battle...');
      this.playerDestroyedAnimation();

      this.waitForUserConfirmation().then(() => {
        this.playerAttackOptions.destroy();

        fadeCameraOut(this, 2000);
        setTimeout(() => {
          const objectivesUI = this.scene.get(
            'ObjectivesUIScene',
          ) as ObjectivesUIScene;

          objectivesUI && objectivesUI.hideUI();
          this.resetEverything();
          this.scene.stop('BattleScene');
          this.scene.stop();
          this.scene.start('GameOverScene');
          this.dialogueField.hide();
          this.player.destroy();
          this.enemyHealthBar.destroy();
          this.playerHealthBar.destroy();
          this.playerHealthBarBackground.forEach((rect) => rect.destroy());
          this.enemyHealthBarBackground.forEach((rect) => rect.destroy());
          globalAudioManager.switchSoundTo(audioNames.lofi);
        }, 2200);
      });
    } else if (emittedEventAfterCheck === 'showAttackOptions') {
      this.showAttackOptions();
    } else if (emittedEventAfterCheck === 'enemyAttackChosen') {
      this.enemyAttackChosen();
    }
  }

  waitForUserConfirmation() {
    return new Promise((resolve) => {
      this.resolveInput = resolve;
    });
  }

  enemyDestroyedAnimation() {
    // enemy goes down and it's alpha goes to 0
    this.tweens.add({
      targets: this.enemy,
      y: '+=100',
      alpha: { from: 1, to: 0 },
      ease: 'Linear',
      duration: 1000,
      repeat: 0,
    });
  }

  playerDestroyedAnimation() {
    // player goes down and it's alpha goes to 0
    this.tweens.add({
      targets: this.player,
      y: '+=100',
      alpha: { from: 1, to: 0 },
      ease: 'Linear',
      duration: 1000,
      repeat: 0,
    });
  }

  setUpGameEvents() {
    this.gameEvents.on('battleStart', this.startBattle, this);
    this.gameEvents.on('showAttackOptions', this.showAttackOptions, this);
    this.gameEvents.on('playerAttackChosen', this.playerAttackChosen, this);
    this.gameEvents.on(
      'showPlayerAttackMessage',
      this.showPlayerAttackMessage,
      this,
    );
    this.gameEvents.on(
      'playPlayerAttackAnimation',
      this.playPlayerAttackAnimation,
      this,
    );
    this.gameEvents.on(
      'playEnemyAttackAnimation',
      this.playEnemyAttackAnimation,
      this,
    );
    this.gameEvents.on('playDamageAnimation', this.playDamageAnimation, this);
    this.gameEvents.on('reduceEnemyHealth', this.reduceEnemyHealth, this);
    this.gameEvents.on('enemyAttackChosen', this.enemyAttackChosen, this);
    this.gameEvents.on('reducePlayerHealth', this.reducePlayerHealth, this);
    this.gameEvents.on('checkBattleEnd', this.checkBattleEnd, this);
  }

  resetEverything() {
    this.enemyAttacks = [];
    this.playerAttacks = [];
    this.backgroundImage = '';
    this.battleHeroSpriteTexture = '';
    this.enemyTexture = '';
    this.enemyName = '';
    this.initialDialogue = '';
    this.endDialogue = '';
    this.triggerEventsOnBattleEnd = null;
    this.heroBattleAnimationName = '';
    this.enemyBattleAnimationName = '';
    this.initialPlayerHealth = 0;
    this.initialEnemyHealth = 0;
    this.playerHealth = this.initialPlayerHealth;
    this.enemyHealth = this.initialEnemyHealth;
    this.gameOver = false;
    this.enterMobileButton.removeEventListener(
      'pointerdown',
      this.enterMobileFunction,
    );
  }

  shutdown() {
    this.gameEvents.removeAllListeners();
    // this.enterMobileButton = this.enterMobileButton
    //   .cloneNode(true)
    //   .parentNode.replaceChild(
    //     this.enterMobileButton.cloneNode(true),
    //     this.enterMobileButton,
    //   );
    this.resetEverything();
  }
}
