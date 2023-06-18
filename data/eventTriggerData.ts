import DialogueNode from '../dialogue/DialogueNode';

export const eventTriggerData = {
  refrigerator: {
    dialogueNodesObj: {
      nodes: [
        new DialogueNode('The fridge is full of probes.'),
        new DialogueNode('But it is locked.'),
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
      scene.scene.get('UIScene').objectives.forEach((objective) => {
        objective.setVisible(false);
      });

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

      if (scene.hero.hasTalkedToMainNPC && !scene.hero.hasKey) {
        scene.events.emit('addObjective', {
          textBesidesCheckbox: 'Get a probe from the fridge',
          checkedCondition: 'hasBattledVirus',
        });

        scene.hero.hasKey = true;
        return;
      }

      if (scene.hero.hasKey) return;
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
      } else if (scene.hero.hasKey) {
        eventtrigger.dialogueNodesObj = {
          nodes: [new DialogueNode('That key was hidden well!')],
        };
      }
    },
  },
  computer: {
    dialogueNodesObj: {
      nodes: [
        new DialogueNode('There is a DNA test running on here.'),
        new DialogueNode(
          "It's not finished yet, but if it is some has to take a look at it.",
        ),
      ],
    },
    updateDialogueNodeBasedOnPlayerState: (scene, eventtrigger) => {
      if (scene.hero.hasDeliveredProbe) {
        eventtrigger.dialogueNodesObj = {
          nodes: [
            new DialogueNode('You take a look at the DNA test.'),
            new DialogueNode('Looks interesting, let me just ...'),
            new DialogueNode('I feel so sleepy...'),
            new DialogueNode("I can't..."),
            new DialogueNode('keep...'),
            new DialogueNode('my eyes...'),
            new DialogueNode('open...'),
          ],
        };
      }
    },
    triggerEventWhenDialogueEnds: (scene: any) => {
      if (!scene.hero.hasDeliveredProbe) {
        return;
      }

      scene.scene.pause('UIScene');
      scene.scene.get('UIScene').objectives.forEach((objective) => {
        objective.setVisible(false);
      });
      scene.scene.pause('LabScene'); // Pause the LabScene
      scene.scene.launch('SleepDeprivationBattleScene'); // Launch the StartScene alongside LabScene
    },
  },
};
