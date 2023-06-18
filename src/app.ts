import 'phaser';

import LabCutscene from '../scenes/LabCutscene';
import LabScene from '../scenes/LabScene';
import SleepDeprivationBattleScene from '../scenes/SleepDeprivationBattleScene';
import StartScene from '../scenes/StartScene';
import UIScene from '../scenes/UIScene';
import VirusBattleScene from '../scenes/VirusBattleScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  pixelArt: true,
  antialias: false,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 }, // Top down game, so no gravity
      debug: false, // Change this to true to see hitboxes
    },
  },
  width: 800,
  height: 500,
  parent: 'game',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  dom: {
    createContainer: true,
  },
  //  make background color transparent
  backgroundColor: '#e7e7e7',
  scene: [
    LabScene,
    StartScene,

    UIScene,
    SleepDeprivationBattleScene,
    VirusBattleScene,
    LabCutscene,
  ], // order of scenes does not matter
};

new Phaser.Game(config);
