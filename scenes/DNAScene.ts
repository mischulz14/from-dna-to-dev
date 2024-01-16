import { audioNames } from '../data/audioNames';
import {
  cutSceneAnimsInfo,
  cutSceneAudioNames,
  cutSceneSpriteNames,
} from '../data/cutSceneSprites';
import { globalAudioManager, isMobileScreen } from '../src/app';
import {
  cutsceneTransitionReverse,
  fadeCameraIn,
} from '../utils/sceneTransitions';
import { textAppears, textDisappears } from '../utils/textEffects';
import ObjectivesUIScene from './ObjectivesUIScene';

export default class DNAScene extends Phaser.Scene {
  sprite: Phaser.GameObjects.Sprite;
  level: number;
  canProgressToNextScene: boolean;
  nextScenes: string[];
  startNextScene: boolean;
  headerText: Phaser.GameObjects.Text;
  headerTextContent: string;
  continueText: Phaser.GameObjects.Text;
  anim: Phaser.Tweens.Tween;

  constructor() {
    super({ key: 'DNAScene' });
    this.canProgressToNextScene = false;
    this.nextScenes = ['LabScene'];
    this.level = 1;
    this.startNextScene = true;
  }

  init() {
    setTimeout(() => {
      this.canProgressToNextScene = true;
    }, 2000);
  }

  create() {
    let graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 0.7);
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);
    globalAudioManager.switchSoundTo(audioNames.lofiCutscene);
    this.sprite = this.add
      .sprite(0, 80, cutSceneSpriteNames.dna)
      .setOrigin(0, 0)
      .setDepth(999999);

    this.sprite.setScale(6);

    this.events.on('resume', () => {
      this.handleResume();
    });

    this.input.keyboard.on('keydown-SPACE', () => {
      if (!this.canProgressToNextScene) return;
      this.handleContinueToNextScene();
    });

    this.input.on('pointerdown', () => {
      if (!isMobileScreen) return;
      if (!this.canProgressToNextScene) return;
      this.handleContinueToNextScene();
    });

    this.createInitialInterface();
  }

  revealLevel(level: number) {
    this.headerTextContent = this.getHeaderText()[`text${level}`];
    this.scene.bringToTop();
    const timeOut = 1000;
    let y = 300;
    if (level % 2 === 0) {
      y = 120;
    }
    this.anims.play(cutSceneAnimsInfo.dna.anims[level - 1].name, this.sprite);
    textAppears(
      this.getAchievementText()[`text${level}`],
      '1.2rem',
      'Rainyhearts',
      timeOut,
      (this.scale.width - 130) * (0.25 * level) - 100,
      y,
      this,
    );

    this.headerText = textAppears(
      this.headerTextContent,
      '1.2rem',
      'Rainyhearts',
      2000,
      150,
      30,
      this,
    );
  }

  setNextScene(scenes: string[]) {
    this.nextScenes = scenes;
  }

  handleContinueToNextScene() {
    console.log('continuing to next scene from dna scene');
    this.headerText.destroy();
    this.continueText.setAlpha(0);
    this.anim.stop();
    this.scene.sendToBack('DNAScene');
    this.scene.pause('DNAScene');
    this.scene.setVisible(false);
    if (this.canProgressToNextScene) {
      console.log('progressing from DNA Scene to next scene');
      this.nextScenes.forEach((scene) => {
        console.log('scene', scene);
        if (scene.includes('UIScene')) {
          const UIScene = this.scene.get(scene) as ObjectivesUIScene;
          UIScene.showUI();
        }
        this.startNextScene
          ? this.scene.launch(scene)
          : this.scene.resume(scene);
      });
      this.canProgressToNextScene = false;
    }
  }

  createInitialInterface() {
    this.headerTextContent =
      'This is your DNA right now. \n As you manage to beat the curveballs life throws at you, \n your DNA will change.';
    this.headerText = textAppears(
      this.headerTextContent,
      '1.2rem',
      'Rainyhearts',
      2000,
      150,
      50,
      this,
    );

    setTimeout(() => {
      this.continueText = this.add.text(
        300,
        400,
        isMobileScreen ? 'Tap to continue' : 'Press Space to continue',
        {
          fontSize: '1.2rem',
          fontFamily: 'Rainyhearts',
          color: '#fff',
        },
      );

      this.continueText.setAlpha(1);

      this.anim = this.tweens.add({
        targets: this.continueText.alpha === 1 ? this.continueText : null,
        alpha: 0,
        duration: 1000,
        ease: 'Linear',
        repeat: -1,
        yoyo: true,
      });

      this.canProgressToNextScene = true;
    }, 3000);
  }

  handleResume() {
    fadeCameraIn(this, 1500);
    this.input.keyboard.enabled = true;
    this.scene.setVisible(true);
    console.log('Current Scene Stacking Order:');
    setTimeout(() => {
      this.canProgressToNextScene = true;
      this.continueText.setAlpha(1);
      this.anim = this.tweens.add({
        targets: this.continueText.alpha === 1 ? this.continueText : null,
        alpha: 0,
        duration: 1000,
        ease: 'Linear',
        repeat: -1,
        yoyo: true,
      });
    }, 3000);
    this.scene.bringToTop('DNAScene');
    console.log("Yoooo, DNA Scene just got resumed! Let's investigate 🧐");
  }

  getAchievementText() {
    const text1 = 'Quick Stress Response';
    // 'This is your DNA right now. \n As you manage to beat the curveballs life throws at you, \n your DNA will change.';

    const text2 = "Sleep deprivation,\nwhat's that?";
    const text3 = 'Quarter Life Crisis\ndrowned with Coffee\nand Love';
    const text4 = 'You did it!\nYou are a Developer now!';

    return { text1, text2, text3, text4 };
  }

  getHeaderText() {
    const text1 =
      'You have unlocked a new DNA strand!\nKeep up with the quick stress response!';
    const text2 =
      'New DNA strand unlocked!\nSleep deprivation is your friend!\nTry getting enough sleep though...';
    const text3 = 'New DNA strand unlocked!\nCoffee and love is all you need!';
    const text4 =
      'The final DNA strand is unlocked!\nYour DNA found your new calling';

    return { text1, text2, text3, text4 };
  }
}
