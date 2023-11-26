import DialogueNode from '../dialogue/DialogueNode';
import EventTrigger from '../gameObjects/EventTrigger';
import InteractiveGameObject from '../gameObjects/InteractiveGameObject';

export interface IEventTriggerData {
  dialogueNodesObj: { nodes: DialogueNode[] };
  triggerEventWhenDialogueEnds: (scene: Phaser.Scene) => void;
  updateDialogueNodeBasedOnPlayerState: (
    scene: Phaser.Scene,
    eventtrigger: InteractiveGameObject | EventTrigger,
  ) => void;
}
