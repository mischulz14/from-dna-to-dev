import { audioNames } from '../data/audioNames';
import {
  cutSceneAnimsInfo,
  cutSceneAudioNames,
  cutSceneSpriteNames,
} from '../data/cutSceneSprites';
import { globalAudioManager } from '../src/app';
import {
  cutsceneTransitionReverse,
  fadeCameraIn,
} from '../utils/sceneTransitions';
import { textAppears, textDisappears } from '../utils/textEffects';

export default class DNAScene extends Phaser.Scene {
  sprite: Phaser.GameObjects.Sprite;
  level: number;
  canProgressToNextScene: boolean;
  nextScenes: string[];
  startNextScene: boolean;
  continueText: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'DNAScene' });
    this.canProgressToNextScene = true;
    this.nextScenes = ['LabScene'];
    this.level = 1;
    this.startNextScene = true;
  }

  create() {
    this.add.rectangle(0, 0, 800, 512, 0x545454).setOrigin(0, 0);
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
      this.handleContinueToNextScene();
    });

    this.createInitialInterface();
  }

  revealLevel(level: number) {
    this.scene.bringToTop();
    const timeOut = 1000;
    let y = 300;
    if (level % 2 === 0) {
      y = 120;
    }
    this.anims.play(cutSceneAnimsInfo.dna.anims[level - 1].name, this.sprite);
    textAppears(
      this.getCutSceneText()[`text${level}`],
      '1.2rem',
      'Rainyhearts',
      timeOut,
      (this.scale.width - 130) * (0.25 * level) - 100,
      y,
      this,
    );
  }

  setNextScene(scenes: string[]) {
    this.nextScenes = scenes;
  }

  handleContinueToNextScene() {
    this.continueText.setAlpha(0);
    this.scene.sendToBack('DNAScene');
    this.scene.pause('DNAScene');
    this.scene.setVisible(false);
    if (this.canProgressToNextScene) {
      this.nextScenes.forEach((scene) => {
        this.startNextScene
          ? this.scene.launch(scene)
          : this.scene.resume(scene);
      });
      this.canProgressToNextScene = false;
    }
  }

  createInitialInterface() {
    textAppears(
      'This is your DNA right now. \n As you manage to beat the curveballs life throws at you, \n your DNA will change.',
      '1.2rem',
      'Rainyhearts',
      1000,
      150,
      50,
      this,
    );

    setTimeout(() => {
      this.continueText = this.add.text(300, 400, 'Press Space to continue', {
        fontSize: '1.2rem',
        fontFamily: 'Rainyhearts',
        color: '#fff',
      });

      this.continueText.setAlpha(1).setDepth(999999);

      this.tweens.add({
        targets: this.continueText,
        alpha: 0,
        duration: 1000,
        ease: 'Linear',
        repeat: -1,
        yoyo: true,
      });
    }, 2000);
  }

  handleResume() {
    this.input.keyboard.enabled = true;
    this.scene.setVisible(true);
    console.log('Current Scene Stacking Order:');
    setTimeout(() => {
      this.canProgressToNextScene = true;
      this.continueText.setAlpha(1);
    }, 2000);
    this.scene.bringToTop('DNAScene');
    console.log("Yoooo, DNA Scene just got resumed! Let's investigate 🧐");
  }

  getCutSceneText() {
    const text1 = 'Quick Stress Response \n and Sleepdeprivation';
    // 'This is your DNA right now. \n As you manage to beat the curveballs life throws at you, \n your DNA will change.';

    const text2 = 'Love For Coffee';

    const text3 = 'Quarter Life Crisis';

    const text4 = '';

    return { text1, text2, text3, text4 };
  }
}
