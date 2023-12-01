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
  headerText: Phaser.GameObjects.Text;
  headerTextContent: string;
  continueText: Phaser.GameObjects.Text;
  anim: Phaser.Tweens.Tween;

  constructor() {
    super({ key: 'DNAScene' });
    setTimeout(() => {
      this.canProgressToNextScene = true;
    }, 3000);
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
    this.headerText.destroy();
    this.continueText.setAlpha(0);
    this.anim.stop();
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
      this.continueText = this.add.text(300, 400, 'Press Space to continue', {
        fontSize: '1.2rem',
        fontFamily: 'Rainyhearts',
        color: '#fff',
      });

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

    const text2 = "Sleep deprivation,\n what's that?";
    const text3 = 'Quarter Life Crisis\n drowned with Coffee';
    const text4 = '';

    return { text1, text2, text3, text4 };
  }

  getHeaderText() {
    const text1 =
      'You have unlocked a new DNA strand! \n Keep up with the quick stress response!';
    const text2 =
      'New DNA strand unlocked! \n Sleep deprivation is your friend! \n Try getting enough sleep though...';
    const text3 = 'You have unlocked the following DNA:';
    const text4 = 'You have unlocked the following DNA:';

    return { text1, text2, text3, text4 };
  }
}
