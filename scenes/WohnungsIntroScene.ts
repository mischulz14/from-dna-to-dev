import { audioNames } from '../data/audioNames';
import {
  cutSceneAnimsInfo,
  cutSceneAudioNames,
  cutSceneSpriteNames,
} from '../data/cutSceneSprites';
import DialogueController from '../dialogue/DialogueController';
import DialogueNode from '../dialogue/DialogueNode';
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
  progressCounter = 0;
  dialogueController: DialogueController;

  constructor() {
    super({ key: 'WohnungsIntroScene' });

    let { text1, text2, text3, text4, text5, text6, text7 } = getCutSceneText();

    const dialogue = [
      new DialogueNode(text1),
      new DialogueNode(text2),
      new DialogueNode(text3),
      new DialogueNode(text4),
      new DialogueNode(text5),
      new DialogueNode(text6),
      new DialogueNode(text7),
    ];
    this.dialogueController = new DialogueController(this);
    this.dialogueController.initiateDialogue(dialogue, null, null);
  }

  preload() {
    this.dialogueController.dialogueField.show();

    this.input.keyboard.on(
      'keydown-ENTER',
      this.dialogueController.playerPressesEnterEventListener,
    );
  }

  create() {
    globalAudioManager.switchSoundTo(audioNames.lofiCutscene);
    this.sprite = this.add
      .sprite(20, 0, cutSceneSpriteNames.wohnung)
      .setOrigin(0, 0);

    this.sprite.setScale(6);

    this.dialogueController.typeText();
    this.dialogueController.isDialogueInCutscene = true;

    fadeCameraIn(this, 2200);

    this.sprite.play(cutSceneAnimsInfo.wohnung.anims[0].name);

    this.events.on('dialogueProgressed', () => {
      this.progressCounter++;
      console.log(this.progressCounter);
      this.revealText(this.progressCounter);
    });

    this.events.on('dialogueEnded', () => {
      fadeCameraOut(this, 2200);
      this.time.delayedCall(3000, () => {
        this.scene.start('ApartmentScene');
      });
    });
  }

  revealText(progressCounter = this.progressCounter) {
    if (progressCounter === 1 || progressCounter === 2) {
      this.sprite.play(cutSceneAnimsInfo.wohnung.anims[1].name);
    }

    if (progressCounter === 3) {
      this.sprite.play(cutSceneAnimsInfo.wohnung.anims[2].name);
    }

    if (progressCounter === 4) {
      this.sprite.play(cutSceneAnimsInfo.wohnung.anims[3].name);
    }

    if (progressCounter === 5) {
      this.sprite
        .play(cutSceneAnimsInfo.wohnung.anims[4].name)
        .once('animationcomplete', () => {
          this.sprite.play(cutSceneAnimsInfo.wohnung.anims[5].name);
        });
    }
    // const anim = this.sprite.play(cutSceneAnimsInfo.wohnung.anims[1].name);
    //   this.sprite.play(cutSceneAnimsInfo.wohnung.anims[0].name);
    // this.sprite.play(cutSceneAnimsInfo.wohnung.anims[2].name);
    // this.sprite.play(cutSceneAnimsInfo.wohnung.anims[3].name);
    // this.sprite.play(cutSceneAnimsInfo.wohnung.anims[4].name);
    // this.sprite.play(cutSceneAnimsInfo.wohnung.anims[5].name);
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
    "You decided visit your girlfriend to relax. You're sitting in bed, scrolling on your phone.";

  const text2 = 'But wait! What is that? An email pops up ... Hmmm... ';

  const text3 =
    "'Dear Employee, unfortunately we have to let you go, along with all the other employees.'";

  const text4 =
    "WHAT?! They can't just fire me out of the blue without even speaking to me first!";

  const text5 =
    'Your exasperated gasp seems to have caught the attention of your girlfriend. ';

  const text6 = "'What is it?' she asks, while entering the room.";

  const text7 =
    "You just answer 'Can I tell you after I drank some coffee And I'll need a strong one for that explanation...'";

  return { text1, text2, text3, text4, text5, text6, text7 };
}
