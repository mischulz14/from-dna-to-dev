import DialogueNode from '../dialogue/DialogueNode';

export const eventTriggerData = {
  refrigerator: {
    dialogueNodesObj: {
      nodes: [
        new DialogueNode('The fridge is locked.'),
        new DialogueNode('Maybe there is a key around here somewhere?'),
      ],
    },
    updateDialogueNodeBasedOnPlayerState: (scene, eventtrigger) => {
      if (scene.hero.hasKey) {
        eventtrigger.dialogueNodesObj = {
          nodes: [
            new DialogueNode('You open the refrigerator.'),
            new DialogueNode('Wait... what is that?'),
            new DialogueNode(
              'Something jumps out of the darkness and attacks!',
            ),
          ],
        };
      }
    },
    triggerEventWhenDialogueEnds: (scene: any) => {
      if (!scene.hero.hasKey) {
        return;
      }

      scene.scene.pause('UIScene');
      scene.scene.pause('LabScene'); // Pause the LabScene
      scene.scene.launch('VirusBattleScene'); // Launch the StartScene alongside LabScene
    },
  },
  fridgeKeyContainer: {
    dialogueNodesObj: {
      nodes: [new DialogueNode('It seems there is a key here!')],
    },
    triggerEventWhenDialogueEnds: (scene: any) => {
      if (!scene.hero.hasTalkedToMainNPC) {
        console.log('triggerEventWhenDialogueEnds in fridgeKeyContainer');
        return;
      }
      if (scene.hero.hasKey) return;
      scene.hero.hasKey = true;
      console.log('scene.hero.hasKey', scene.hero.hasKey);
    },
    updateDialogueNodeBasedOnPlayerState: (scene, eventtrigger) => {
      if (!scene.hero.hasTalkedToMainNPC) {
        eventtrigger.dialogueNodesObj = {
          nodes: [
            new DialogueNode(
              'Theres a key in here, maybe I should ask someone about it?',
            ),
          ],
        };
      } else if (scene.hero.hasTalkedToMainNPC && !scene.hero.hasKey) {
        eventtrigger.dialogueNodesObj = {
          nodes: [
            new DialogueNode('There is a key in here!'),
            new DialogueNode('Maybe this opens the fridge! I should take it.'),
          ],
        };
        scene.events.emit('addObjective', {
          textBesidesCheckbox: 'Get a probe from the fridge',
          checkedCondition: 'hasBattledVirus',
        });
      } else if (scene.hero.hasKey) {
        eventtrigger.dialogueNodesObj = {
          nodes: [new DialogueNode('That key was hidden well!')],
        };
      }
    },
  },
};
