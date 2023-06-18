import DialogueNode from '../dialogue/DialogueNode';

export const interactiveGameObjectData = {
  janus: {
    dialogueNodesObj: {
      nodes: [new DialogueNode('These things cost a fortune.')],
    },
    updateDialogueNodeBasedOnPlayerState: (scene, eventtrigger) => {
      return;
    },
    triggerEventWhenDialogueEnds: (scene: any) => {
      return;
    },
  },
};
