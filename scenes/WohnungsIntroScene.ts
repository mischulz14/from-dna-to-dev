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
  fadeCameraOut,
} from '../utils/sceneTransitions';
import { textAppears, textDisappears } from '../utils/textEffects';

export default class WohnungsIntroScene extends Phaser.Scene {
  transitionRect: Phaser.GameObjects.Rectangle;
  sprite: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: 'WohnungsIntroScene' });
  }

  create() {
    globalAudioManager.switchSoundTo(audioNames.lofiCutscene);
    this.sprite = this.add
      .sprite(20, 0, cutSceneSpriteNames.wohnung)
      .setOrigin(0, 0);

    this.sprite.setScale(6);

    // rectangle for transitions
    this.transitionRect = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
      .setOrigin(0, 0);
    this.transitionRect.setAlpha(0); // Start with 0 opacity

    fadeCameraIn(this, 2200);

    // this.time.delayedCall(1000, () => {
    //   this.sound.play(cutSceneAudioNames.wohnung);
    // });

    this.revealText();
  }
  revealText() {
    let { text1, text2, text3, text4, text5, text6 } = getCutSceneText();

    this.time.delayedCall(2000, () => {
      this.sprite.play(cutSceneAnimsInfo.wohnung.anims[0].name);
      text1 = textAppears(text1, '1.6rem', 'Rainyhearts', 1000, 10, 400, this);
    });

    this.time.delayedCall(8500, () => {
      const anim = this.sprite.play(cutSceneAnimsInfo.wohnung.anims[1].name);
      this.time.delayedCall(2000, () => {
        this.sprite.play(cutSceneAnimsInfo.wohnung.anims[0].name);
      });

      textDisappears(text1, 800, this);
      text2 = textAppears(text2, '1.6rem', 'Rainyhearts', 1000, 10, 400, this);
    });

    this.time.delayedCall(26200, () => {
      this.sprite.play(cutSceneAnimsInfo.wohnung.anims[2].name);

      textDisappears(text2, 800, this);
      text3 = textAppears(text3, '1.6rem', 'Rainyhearts', 1000, 10, 400, this);
    });

    this.time.delayedCall(31800, () => {
      this.sprite.play(cutSceneAnimsInfo.wohnung.anims[3].name);

      textDisappears(text3, 800, this);
      text4 = textAppears(text4, '1.6rem', 'Rainyhearts', 1000, 10, 400, this);
    });

    this.time.delayedCall(37000, () => {
      this.sprite.play(cutSceneAnimsInfo.wohnung.anims[4].name);
      textDisappears(text4, 800, this);
      text5 = textAppears(text5, '1.6rem', 'Rainyhearts', 1000, 10, 400, this);
    });

    this.time.delayedCall(41000, () => {
      this.sprite.play(cutSceneAnimsInfo.wohnung.anims[5].name);
      textDisappears(text5, 800, this);
      text6 = textAppears(text6, '1.6rem', 'Rainyhearts', 1000, 10, 400, this);
    });

    this.time.delayedCall(45000, () => {
      textDisappears(text6, 800, this);
      fadeCameraOut(this, 2200);
      this.time.delayedCall(3000, () => {
        this.scene.start('ApartmentScene');
      });
    });
  }

  cutsceneTransitionNormal() {
    this.tweens.add({
      targets: this.transitionRect,
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 3000,
      repeat: 0,
    });
  }

  cutsceneTransitionBlinking() {
    this.tweens.add({
      targets: this.transitionRect,
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 300,
      yoyo: true,
      repeat: 3,
    });
  }
}

function getCutSceneText() {
  const text1 =
    "You decided to take a vacation with your girlfriend in Spain. \n You're laying in bed, relaxing, scrolling on your phone." as unknown as Phaser.GameObjects.Text;

  const text2 =
    "But wait! What is that? An email pops up ... Hmmm... \n 'Dear Employee, you where just a number for us so we have to let you go,  \n along with all the other employees we didn't care about." as unknown as Phaser.GameObjects.Text;

  const text3 =
    "WHAT?! They can't just fire me out of the blue \n without even speaking to me first!" as unknown as Phaser.GameObjects.Text;

  const text4 =
    'Your exasperated gasp seems to have caught the attention of your girlfriend. ' as unknown as Phaser.GameObjects.Text;

  const text5 =
    "'What is it?' she asks, while entering the room." as unknown as Phaser.GameObjects.Text;

  const text6 =
    "You just answer 'Can I tell you after I drank some coffee?\n And I'll need a strong one for that explanation...'" as unknown as Phaser.GameObjects.Text;

  return { text1, text2, text3, text4, text5, text6 };
}
