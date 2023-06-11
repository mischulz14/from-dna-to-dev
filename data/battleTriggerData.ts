import DialogueNode from '../dialogue/DialogueNode';

export const battleTriggerData = {
  refrigerator: {
    dialogueNodesObj: {
      nodes: [
        new DialogueNode('You open the refrigerator.'),
        new DialogueNode('Wait... what is that?'),
        new DialogueNode('Something jumps out of the darkness and attacks!'),
      ],
    },
    monster: 'a Corona Virus Mutation',
    playerAttackOptions: [
      {
        text: 'test',
        damage: 10,
        damageText: 'You did 10 damage!',
      },
    ],
  },
};
