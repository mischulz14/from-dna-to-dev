import Phaser, { Events } from 'phaser';

import AttackOptions from '../battle/AttackOptions';
import DialogueField from '../dialogue/DialogueField';

export default class SleepDeprivationBattleScene extends Phaser.Scene {
  player: any;
  enemy: any;
  playerAttackOptions: AttackOptions;
  enemyAttackOptions: any;
  playerHealth: any;
  playerHealthBar: Phaser.GameObjects.Rectangle;
  enemyHealth: any;
  enemyAttacks: any;
  randomEnemyAttack: any;
  enemyHealthBar: Phaser.GameObjects.Rectangle;
  attackOptionsContainer: any;
  dialogueField: DialogueField;
  hasShownBattleStartingDialogue: boolean = false;
  hasPlayerChosenAttack: boolean = false;
  hasPlayerAttacked: boolean = false;
  gameEvents: Events.EventEmitter;
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
  playerAttacks: { text: string; damage: number; damageText: string }[];

  constructor() {
    super({ key: 'SleepDeprivationBattleScene' });

    this.playerHealth = 100;
    this.enemyHealth = 100;
    this.enemyAttacks = [
      {
        name: 'Anxiety Surge',
        damage: 25,
        damageText: 'Uff, that anxiety hits like a truck...',
      },
      {
        name: 'Immunity Drop',
        damage: 5,
        damageText: 'Hmpf, I handled worse things in my life.',
      },
      {
        name: 'Cognitive Fog',
        damage: 20,
        damageText: 'What.. was... I... doing... again?',
      },
      {
        name: 'Fatigue Wave',
        damage: 20,
        damageText: "I'm just gonna lie down for a second..",
      },
    ];
    this.gameEvents = new Events.EventEmitter();
    this.playerAttacks = [
      {
        text: 'Caffeine Boost',
        damage: 30,
        damageText: 'TANTRUUUUUM! (If you get this reference, I like you.)',
      },
      {
        text: 'Sleep on Time',
        damage: 5,
        damageText: "Let's be real, this never happens.",
      },
      {
        text: 'Mindfulness Meditate',
        damage: 5,
        damageText:
          'Meditation relaxes you even further! Why would you relaxed when you are being attacked?!',
      },
      {
        text: 'Late Night Snack',
        damage: 15,
        damageText:
          "I won't say no to a late snacking session. This should keep me awake for a while.",
      },
    ];
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
  preload() {
    this.load.image('battleBackground', 'assets/labBattleBackground.png');
    this.load.spritesheet('virusBattleHero', 'assets/virusBattleHero.png', {
      frameWidth: 50,
      frameHeight: 50,
    });

    this.load.spritesheet('sleepDeprivation', 'assets/sleepDeprivation.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.playerAttackOptions = new AttackOptions(
      this.playerAttacks,
      this,
      this.gameEvents,
    );
    this.add.image(0, 0, 'battleBackground').setOrigin(0, 0);

    this.player = this.add.sprite(0, 280, 'virusBattleHero');
    this.enemy = this.add.sprite(0, 100, 'sleepDeprivation');

    //  scale player and enemy sprites
    this.player.setScale(6);
    this.enemy.setScale(4);

    this.anims.create({
      key: 'virusBattleHeroIdle',
      frames: this.anims.generateFrameNumbers('virusBattleHero', {
        start: 0,
        end: 3,
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.anims.create({
      key: 'sleepDeprivationIdle',
      frames: this.anims.generateFrameNumbers('sleepDeprivation', {
        start: 0,
        end: 7,
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.transitionRect = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
      .setOrigin(0, 0)
      .setDepth(1000);
    this.transitionRect.setAlpha(0); // Start with 0 opacity

    this.cutsceneTransitionReverse();
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
    this.anims.play('virusBattleHeroIdle', this.player);
    this.anims.play('sleepDeprivationIdle', this.enemy);
    this.addDialogueField();
    this.typeWriterEffect(
      'You are being attacked by sleep deprivation! No wonder when you have to do five night shifts in a row...',
    );
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
    this.enemyHealth -= this.playerAttackOptions.currentlySelectedOption.damage;
    this.updateEnemyHealthBar();

    this.waitForUserConfirmation().then(() => {
      this.showPlayerAttackMessage();
    });
  }

  showPlayerAttackMessage() {
    this.playDamageAnimation(this.enemy);
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
      `Sleep deprivation uses ${this.randomEnemyAttack.name}!`,
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

  reducePlayerHealth() {
    this.playerHealth -= this.randomEnemyAttack.damage;
    this.updatePlayerHealthBar();
    this.typeWriterEffect(this.randomEnemyAttack.damageText);

    this.waitForUserConfirmation().then(() => {
      this.checkBattleEnd('showAttackOptions');
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
      x: 650,
      ease: 'Power1',
      duration: 3000,
    });
  }

  addPlayerHealthBar() {
    const rect1 = this.add.rectangle(50, 110, 160, 30, 0x0000).setOrigin(0, 0);
    const rect2 = this.add
      .rectangle(60, 120, 160, 30, 0xf3f3f3)
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

    this.enemyHealthBar = this.add.rectangle(430, 50, 120, 10, 0x45a47d);
    this.enemyHealthBar.setOrigin(0, 0);
  }

  updatePlayerHealthBar() {
    // if player health is smaller than 0, set it to 0
    if (this.playerHealth < 0) this.playerHealth = 0;
    this.playerHealthBar.setDisplaySize(this.playerHealth, 10);
  }

  updateEnemyHealthBar() {
    // if enemy health is smaller than 0, set it to 0
    if (this.enemyHealth < 0) this.enemyHealth = 0;
    this.enemyHealthBar.setDisplaySize(this.enemyHealth, 10);
  }

  checkBattleEnd(emittedEventAfterCheck: string) {
    console.log('checkBattleEnd');
    if (this.enemyHealth <= 0) {
      this.typeWriterEffect(
        'You battled of the urge to take a nap! (for now...)',
      );
      this.enemyDestroyedAnimation();

      this.waitForUserConfirmation().then(() => {
        this.cutsceneTransitionNormal();
        setTimeout(() => {
          this.scene.stop('SleepDeprivationBattleScene');
          this.scene.resume('LabScene');
          this.scene.resume('UIScene');

          // @ts-ignore
          this.scene.get('UIScene').objectives.forEach((objective) => {
            if (!objective.visible) return;
            objective.setVisible(true);
          });

          this.scene.get('UIScene').events.emit('addObjective', {
            textBesidesCheckbox: 'Deliver the DNA results.',
            checkedCondition: 'hasDeliveredDNAResults',
          });
          // @ts-ignore
          this.scene.get('LabScene').hero.hasBattledSleepDeprivation = true;
        }, 2000);
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

  cutsceneTransitionNormal() {
    this.tweens.add({
      targets: this.transitionRect,
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 1000,
      repeat: 0,
      onComplete: () => {
        // remove all rectangles and sprites
        this.dialogueField.hide();
        this.player.destroy();
        this.enemyHealthBar.destroy();
        this.playerHealthBar.destroy();
        this.playerHealthBarBackground.forEach((rect) => rect.destroy());
        this.enemyHealthBarBackground.forEach((rect) => rect.destroy());
      },
    });
  }

  cutsceneTransitionReverse() {
    this.tweens.add({
      targets: this.transitionRect,
      alpha: { from: 1, to: 0 },
      ease: 'Linear',
      duration: 3000,
      repeat: 0,
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
}
