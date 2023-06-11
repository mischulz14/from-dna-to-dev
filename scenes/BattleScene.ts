import Phaser, { Events } from 'phaser';

import AttackOptions from '../battle/AttackOptions';
import DialogueField from '../dialogue/DialogueField';

export default class BattleScene extends Phaser.Scene {
  player: any;
  enemy: any;
  playerAttackOptions: any;
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

  constructor() {
    super({ key: 'BattleScene' });
    this.playerHealth = 100;
    this.enemyHealth = 100;
    this.enemyAttacks = [
      { name: 'Attack 1', damage: 10, damageText: 'Nice!' },
      { name: 'Attack 2', damage: 20, damageText: 'Ouch!' },
      { name: 'Attack 3', damage: 30, damageText: 'Oof!' },
      { name: 'Attack 4', damage: 15, damageText: 'Au!' },
    ];
    this.gameEvents = new Events.EventEmitter();
    const options = [
      {
        text: 'Attack 1',
        damage: 30,
        damageText: 'Nice!',
      },
      {
        text: 'Attack 2',
        damage: 5,
        damageText: 'Ouch!',
      },
      {
        text: 'Attack 3',
        damage: 10,
        damageText: 'Oof!',
      },
      {
        text: 'Attack 4',
        damage: 10,
        damageText: 'Au!',
      },
    ];
    this.playerAttackOptions = new AttackOptions(options);
    this.gameEvents.on('battleStart', this.startBattle, this);
    this.gameEvents.on('showAttackOptions', this.showAttackOptions, this);
    this.gameEvents.on('playerAttackChosen', this.playerAttackChosen, this);
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
  }
  preload() {
    this.load.image('battleBackground', 'assets/labBattleBackground.png');
  }

  create() {
    this.add.image(0, 0, 'battleBackground').setOrigin(0, 0);

    // add two rectangles for the player and enemy as placeholders
    this.player = this.add.rectangle(-10, 300, 100, 100, 0x00ff00);
    this.enemy = this.add.rectangle(900, 100, 100, 100, 0xff0000);

    this.gameEvents.emit('battleStart');
    this.addPlayerHealthBar();
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
    this.dialogueField.show();
  }

  startBattle() {
    this.addDialogueField();
    this.typeWriterEffect('You are being attacked!');
    this.gameObjectsEnterTheScene();

    this.input.keyboard.on('keydown', (event: any) => {
      if (this.deactivateKeydown) return;
      if (event.key === 'Enter') {
        if (!this.isTextFullyRevealed) {
          this.dialogueField.setText(this.fullText);
          this.isTextFullyRevealed = true;
          this.typeWriteEvent.remove();
        } else {
          this.gameEvents.emit('showAttackOptions');
        }
      }
    });
  }

  showAttackOptions() {
    this.typeWriterEffect('Choose an attack!');
    this.playerAttackOptions.showOptions();
    // The 'playerAttack' event is emitted when the player chooses an option
    this.input.keyboard.on('keydown', (event: any) => {
      if (this.deactivateKeydown) return;
      if (event.key === 'Enter') {
        this.gameEvents.emit('playerAttackChosen');
        this.playerAttackOptions.hideOptions();
      }
    });
    // this.gameEvents.emit('playerAttackChosen');
  }

  playerAttackChosen() {
    // this.playerAttackOptions.hideOptions();
    this.typeWriterEffect(
      `You chose ${this.playerAttackOptions.currentlySelectedOption.text}!`,
    );

    // Play attack animation, then emit 'reduceEnemyHealth' event
    this.gameEvents.emit('playPlayerAttackAnimation');
  }

  playPlayerAttackAnimation() {
    // Play attack animation, then emit 'reduceEnemyHealth' event
    this.tweens.add({
      targets: this.player,
      x: '+=50',
      ease: 'Power1',
      duration: 300,
      yoyo: true,
    });

    this.deactivateKeydown = true;

    setTimeout(() => {
      this.gameEvents.emit('playDamageAnimation', this.enemy);
      this.gameEvents.emit('reduceEnemyHealth');
    }, 1000);
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
    // Reduce enemy health, play damage animation, then emit 'checkBattleEnd' event
    this.enemyHealth -= this.playerAttackOptions.currentlySelectedOption.damage;
    this.updateEnemyHealthBar();
    this.typeWriterEffect(
      this.playerAttackOptions.currentlySelectedOption.damageText,
    );

    setTimeout(() => {
      this.checkBattleEnd('enemyAttackChosen');
    }, 3000);
  }

  enemyAttackChosen() {
    // Play attack animation, then emit 'reducePlayerHealth' event
    // randomly choose an attack from the enemyAttacks array
    this.randomEnemyAttack =
      this.enemyAttacks[Math.floor(Math.random() * this.enemyAttacks.length)];
    this.typeWriterEffect(`Enemy chose ${this.randomEnemyAttack.name}!`);

    setTimeout(() => {
      this.gameEvents.emit('playEnemyAttackAnimation');
    }, 2000);
  }

  playEnemyAttackAnimation() {
    console.log('playEnemyAttackAnimation');
    // Play attack animation, then emit 'reducePlayerHealth' event
    this.tweens.add({
      targets: this.enemy,
      x: '-=50',
      ease: 'Power1',
      duration: 300,
      yoyo: true,
    });

    this.deactivateKeydown = true;

    setTimeout(() => {
      this.gameEvents.emit('playDamageAnimation', this.player);
      this.gameEvents.emit('reducePlayerHealth');
    }, 1000);
  }

  reducePlayerHealth() {
    // Similar to reduceEnemyHealth, but for the player
    // Emit 'checkBattleEnd' event when done
    this.playerHealth -= this.randomEnemyAttack.damage;
    this.updatePlayerHealthBar();
    this.typeWriterEffect(this.randomEnemyAttack.damageText);

    setTimeout(() => {
      this.checkBattleEnd('showAttackOptions');
      this.deactivateKeydown = false;
    }, 3000);
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
    this.add.rectangle(70, 150, 160, 50, 0x000000).setOrigin(0, 0);
    this.playerHealthBar = this.add.rectangle(90, 180, 120, 10, 0x00ff00);
    this.playerHealthBar.setOrigin(0, 0);
    // this.playerHealthBar.setDisplaySize(this.playerHealth, 20);
  }

  addEnemyHealthBar() {
    this.add.rectangle(430, 40, 160, 50, 0x000000).setOrigin(0, 0);
    this.enemyHealthBar = this.add.rectangle(450, 70, 120, 10, 0xff0000);
    this.enemyHealthBar.setOrigin(0, 0);
    // this.enemyHealthBar.setDisplaySize(this.enemyHealth, 20);
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
    if (this.enemyHealth <= 0) {
      this.typeWriterEffect('Battle over!');
      // Stop the scene, etc.
      setTimeout(() => {
        this.scene.stop('BattleScene');
        this.scene.resume('LabScene');
        // @ts-ignore
        this.scene.get('LabScene').isEventTriggered = false;
        this.dialogueField.hide();
      }, 3000);
    } else {
      this.gameEvents.emit(emittedEventAfterCheck);
    }
  }
}
