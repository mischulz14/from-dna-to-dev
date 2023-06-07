import DialogueNode from '../dialogue/DialogueNode';
import InteractiveGameObject from '../gameObjects/InteractiveGameObject';

export default class BattleTrigger extends InteractiveGameObject {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    dialogueIndictaorKey: string,
    dialogueIndictaorText: string,
  ) {
    super(scene, x, y, texture, dialogueIndictaorKey, dialogueIndictaorText);
    this.setImmovable(true);
    this.body?.setSize(17, 15);
    this.body?.setOffset(8, 22);

    this.dialogueNodes = this.createDialogueNodes();
  }

  turnToHero() {
    return;
  }

  createDialogueNodes = (): DialogueNode[] => {
    const dialogueNodes = [new DialogueNode('Activate Battle!!')];

    return dialogueNodes;
  };

  triggerEventWhenDialogueEnds = (scene: any) => {
    // this.showSpeechIndication();
    scene.scene.pause('LabScene'); // Pause the LabScene
    scene.scene.launch('BattleScene'); // Launch the StartScene alongside LabScene
  };
}
