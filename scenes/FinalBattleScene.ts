import Phaser from 'phaser';

import { finalBattleSpriteInfos } from '../data/finalBattleSpriteInfos';
import FinalBattleHero from '../gameObjects/FinalBattleHero';

export default class FinalBattleScene extends Phaser.Scene {
  keys: Phaser.Types.Input.Keyboard.CursorKeys;
  hero: FinalBattleHero;
  constructor() {
    super({ key: 'FinalBattleScene' });
  }
  preload() {
    // Preload assets here
  }

  create() {
    let graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 0.5); // Change 0.5 to whatever opacity you want
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);

    this.keys = this.input.keyboard.createCursorKeys();
    this.hero = new FinalBattleHero(
      this,
      this.scale.width / 2,
      440,
      'final',
      'final-idle-center',
      '',
      this.keys,
    )
      .setScale(3)
      .play('final-idle-center')
      .setDepth(10000);
  }

  update() {
    // Update game logic here
    this.hero.update();
  }

  setUpGameEvents() {}
}
