import 'phaser';

import GlobalAudioManager from '../global/GlobalAudioManager';
import ApartmentScene from '../scenes/ApartmentScene';
import VirusBattleScene from '../scenes/BattleScene';
import BootcampScene from '../scenes/BootcampScene';
import DNAScene from '../scenes/DNAScene';
import FindErrorScene from '../scenes/FindErrorScene';
import LabCutscene from '../scenes/LabCutscene';
import LabScene from '../scenes/LabScene';
import ObjectivesUIScene from '../scenes/ObjectivesUIScene';
import PreloaderScene from '../scenes/PreloaderScene';
import StartScene from '../scenes/StartScene';
import WohnungsIntroScene from '../scenes/WohnungsIntroScene';

export const config: Phaser.Types.Core.GameConfig = {
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
  backgroundColor: '#545454',
  scene: [
    PreloaderScene, // PreloaderScene loads assets and then starts
    StartScene,
    LabScene,
    ApartmentScene,
    BootcampScene,
    FindErrorScene,
    ObjectivesUIScene,
    VirusBattleScene,
    LabCutscene,
    WohnungsIntroScene,
    DNAScene,
  ],
};

const game = new Phaser.Game(config);

// accessing global audio manager
export const globalAudioManager = GlobalAudioManager.getInstance();
globalAudioManager.initialize(game);

// add event listener to audio button and toggle sound on click
document.addEventListener('DOMContentLoaded', () => {
  const audioButton = document.getElementById('audio-button');
  if (audioButton) {
    audioButton.addEventListener('click', () => {
      globalAudioManager.toggleSound();
    });
  }
});

// create a new audio context because of autoplay policy
document.addEventListener('DOMContentLoaded', () => {
  globalAudioManager.audioContext = new AudioContext();
});
