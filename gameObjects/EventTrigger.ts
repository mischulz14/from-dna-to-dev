import DialogueNode from '../dialogue/DialogueNode';
import InteractiveGameObject from './InteractiveGameObject';

export default class EventTrigger extends InteractiveGameObject {
  dialogueNodesObj: { nodes: DialogueNode[] };
  updateDialogueNodeBasedOnPlayerState: (
    scene: Phaser.Scene,
    trigger: EventTrigger,
  ) => void;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    dialogueIndictaorKey: string,
    dialogueIndictaorText: string,
    dialogueNodesObj: { nodes: DialogueNode[] },
    triggerEventWhenDialogueEnds: (scene: Phaser.Scene) => void,
    updateDialogueNodeBasedOnPlayerState: (
      scene: Phaser.Scene,
      trigger: InteractiveGameObject,
    ) => void,
  ) {
    super(scene, x, y, texture, dialogueIndictaorKey, dialogueIndictaorText);
    this.setImmovable(true);

    this.dialogueNodesObj = dialogueNodesObj;
    this.triggerEventWhenDialogueEnds = triggerEventWhenDialogueEnds;
    this.updateDialogueNodeBasedOnPlayerState =
      updateDialogueNodeBasedOnPlayerState;
  }

  turnToHero() {
    return;
  }
}
