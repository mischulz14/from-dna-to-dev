import DialogueNode from '../dialogue/DialogueNode';
import InteractiveGameObject from '../gameObjects/InteractiveGameObject';

export default class BattleTrigger extends InteractiveGameObject {
  dialogueNodesObj: { nodes: DialogueNode[] };
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    dialogueIndictaorKey: string,
    dialogueIndictaorText: string,
    dialogueNodesObj: { nodes: DialogueNode[] },
  ) {
    super(scene, x, y, texture, dialogueIndictaorKey, dialogueIndictaorText);
    this.setImmovable(true);

    this.dialogueNodesObj = dialogueNodesObj;
  }

  turnToHero() {
    return;
  }

  createDialogueNodes = (): DialogueNode[] => {
    const dialogueNodes = [new DialogueNode('Activate Battle!!')];

    return dialogueNodes;
  };

  triggerEventWhenDialogueEnds = (scene: any) => {};
}
