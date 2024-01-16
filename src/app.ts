import 'phaser';

import GlobalAudioManager from '../global/GlobalAudioManager';
import ApartmentScene from '../scenes/ApartmentScene';
import VirusBattleScene from '../scenes/BattleScene';
import BootcampScene from '../scenes/BootcampScene';
import CreditsScene from '../scenes/CreditsScene';
import DNAScene from '../scenes/DNAScene';
import EndGameScene from '../scenes/EndGameScene';
import FinalBattleScene from '../scenes/FinalBattleScene';
import FindErrorScene from '../scenes/FindErrorScene';
import GameOverScene from '../scenes/GameOverScene';
import LabCutscene from '../scenes/LabCutscene';
import LabScene from '../scenes/LabScene';
import ObjectivesUIScene from '../scenes/ObjectivesUIScene';
import PreloaderScene from '../scenes/PreloaderScene';
import ProgressToBootcampScene from '../scenes/ProgressToBootcampScene';
import StartScene from '../scenes/StartScene';
import WohnungsIntroScene from '../scenes/WohnungsIntroScene';
import InitMobileArrows from '../utils/InitMobileArrows';
import InitMobileButtons from '../utils/InitMobileButtons';

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
  backgroundColor: '#000',
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
    FinalBattleScene,
    EndGameScene,
    CreditsScene,
    GameOverScene,
    ProgressToBootcampScene,
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

export let mostRecentScene = 'LabScene';

export function setMostRecentScene(sceneName: string) {
  mostRecentScene = sceneName;
}

// create mobile arrows
export const mobileArrows = new InitMobileArrows();
export const mobileButtons = new InitMobileButtons();

export let isMobileScreen = document.body.clientWidth < 500;

window.addEventListener('resize', () => {
  isMobileScreen = document.body.clientWidth < 500;
});

function checkWidthAndThrow() {
  // make it visbile as a warning
  const warningElement = document.createElement('div');
  warningElement.style.position = 'absolute';
  warningElement.style.top = '0';
  warningElement.style.left = '0';
  warningElement.style.width = '100%';
  warningElement.style.height = '100px';
  warningElement.style.backgroundColor = 'red';
  warningElement.style.color = 'white';
  warningElement.style.fontSize = '2rem';
  warningElement.style.textAlign = 'center';
  warningElement.style.paddingTop = '2rem';
  warningElement.textContent = `Window too narrow: ${document.documentElement.clientWidth}px`;
  document.body.appendChild(warningElement);
}

// checkWidthAndThrow();
