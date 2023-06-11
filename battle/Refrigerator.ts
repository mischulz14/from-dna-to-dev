import { battleTriggerData } from '../data/battleTriggerData';
import BattleTrigger from './BattleTrigger';

export default class Refrigerator extends BattleTrigger {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(
      scene,
      x,
      y,
      'refrigeratorBattleTrigger',
      'I',
      'Interact',
      battleTriggerData.refrigerator.dialogueNodesObj,
    );
  }

  triggerEventWhenDialogueEnds = (scene: any) => {
    console.log('triggerEventWhenDialogueEnds');

    scene.scene.pause('LabScene'); // Pause the LabScene
    scene.scene.launch('VirusBattleScene'); // Launch the StartScene alongside LabScene
  };
}
