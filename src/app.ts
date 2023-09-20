import 'phaser';

import VirusBattleScene from '../scenes/BattleScene';
import LabCutscene from '../scenes/LabCutscene';
import LabScene from '../scenes/LabScene';
import PreloaderScene from '../scenes/PreloaderScene';
import SleepDeprivationBattleScene from '../scenes/SleepDeprivationBattleScene';
import StartScene from '../scenes/StartScene';
import UIScene from '../scenes/UIScene';
import WohnungsIntroScene from '../scenes/WohnungsIntroScene';

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
  height: 512,
  parent: 'game',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  dom: {
    createContainer: true,
  },
  //  make background color transparent
  backgroundColor: '#000',
  scene: [
    PreloaderScene, // PreloaderScene loads assets and then starts StartScene
    StartScene,
    LabScene,
    UIScene,
    VirusBattleScene,
    LabCutscene,
    WohnungsIntroScene,
  ], // order of scenes does not matter
};

new Phaser.Game(config);
