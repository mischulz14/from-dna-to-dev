import Phaser from 'phaser';

import DNAScene from '../scenes/DNAScene';

/**
 * Transitions to a new scene by fading out a rectangle
 * The rectangle has to be created in the scene that calls this function
 * an optional onCompleteFunction can be passed to this function
 * @param scene
 * @param transitionRect
 * @param onCompleteFunction
 */

export function cutsceneTransitionReverse(
  scene: Phaser.Scene,
  transitionRect: Phaser.GameObjects.Rectangle,
  onCompleteFunction?: () => void,
) {
  scene.tweens.add({
    targets: transitionRect,
    alpha: { from: 1, to: 0 },
    ease: 'Linear',
    duration: 3000,
    repeat: 0,
    onComplete: function () {
      onCompleteFunction ? onCompleteFunction() : null;
    },
  });
}

export function fadeCameraIn(scene: Phaser.Scene, duration: number) {
  scene.cameras.main.fadeIn(duration);

  return duration;
}

export function fadeCameraOut(scene: Phaser.Scene, duration: number) {
  scene.cameras.main.fadeOut(duration);

  return duration;
}

export function transitionToDNASceneAndBack(
  scene: Phaser.Scene,
  sceneThatIsSentToBack: string,
  scenesToResume: string[],
  levelThatIsRevealed: number,
  levelRevealDelay: number,
  startNextScene: boolean = false,
) {
  // scene.scene.sendToBack(sceneThatIsSentToBack);
  const DNAScene = scene.scene.get('DNAScene') as DNAScene;
  DNAScene.startNextScene = startNextScene ? startNextScene : false;
  scene.scene.resume('DNAScene');
  DNAScene.nextScenes = scenesToResume;

  setTimeout(() => {
    DNAScene.revealLevel(levelThatIsRevealed);
  }, levelRevealDelay);
}
