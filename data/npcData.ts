import DialogueNode from '../dialogue/DialogueNode';
import LabScene from '../scenes/LabScene';
import { fadeCameraOut } from '../utils/sceneTransitions';

export const npcLabData = {
  mainNPC: {
    dialogueNodesObj: {
      nodes: [
        new DialogueNode('Hey there!'),
        new DialogueNode(
          'Do you mind getting a probe of the virus from the fridge for me?',
        ),
        new DialogueNode('I need it for my research.'),
        new DialogueNode(
          'The fridge is locked, but I think I saw a key around here somewhere. Maybe you can find it?',
        ),
      ],
    },
    updateDialogueNodeBasedOnHeroState: (scene, npc) => {
      console.log('hero has key', scene.hero.booleanConditions.hasKey);
      // @ts-ignore
      const player = scene.hero as Hero;
      if (
        player.booleanConditions.hasKey &&
        !player.booleanConditions.hasBattledVirus &&
        !player.booleanConditions.hasBattledSleepDeprivation
      ) {
        npc.dialogueNodesObj = {
          nodes: [
            new DialogueNode('You have the key!'),
            new DialogueNode('You can now open the door!'),
          ],
        };
      }

      if (
        player.booleanConditions.hasBattledVirus &&
        player.booleanConditions.hasKey &&
        !player.booleanConditions.hasBattledSleepDeprivation
      ) {
        npc.dialogueNodesObj = {
          nodes: [
            new DialogueNode('You have retrieved the probe, thank you!'),
            new DialogueNode('I hope it was not too much trouble!'),
            new DialogueNode('I will now be able to continue my research.'),
            new DialogueNode('But I need a new favor now.'),
            new DialogueNode(
              'I need you to evaluate some DNA sequences for me.',
            ),
            new DialogueNode(
              'Please go to the computer room and report the results to me.',
            ),
          ],
        };
      }

      if (
        player.booleanConditions.hasBattledSleepDeprivation &&
        player.booleanConditions.hasKey &&
        player.booleanConditions.hasBattledVirus
      ) {
        npc.dialogueNodesObj = {
          nodes: [
            new DialogueNode(
              'You have evaluated the DNA sequences, thank you!',
            ),
            new DialogueNode('I hope it was not too much trouble!'),
          ],
        };
      }
    },
    triggerEventWhenDialogueEnds: (scene: LabScene, npc) => {
      console.log('triggerEventWhenDialogueEnds in labnpc');
      if (
        !scene.hero.booleanConditions.hasBattledVirus &&
        !scene.hero.booleanConditions.hasKey &&
        !scene.hero.booleanConditions.hasBattledSleepDeprivation &&
        !scene.hero.booleanConditions.hasTalkedToMainNPC
      ) {
        scene.hero.booleanConditions.hasTalkedToMainNPC = true;

        scene.events.emit('addObjective', {
          textBesidesCheckbox: 'Find the key to the fridge',
          checkedCondition: 'hasKey',
        });

        return;
      }

      if (
        scene.hero.booleanConditions.hasKey &&
        !scene.hero.booleanConditions.hasBattledVirus
      ) {
        return;
      }

      if (
        scene.hero.booleanConditions.hasKey &&
        scene.hero.booleanConditions.hasBattledVirus &&
        !scene.hero.booleanConditions.hasBattledSleepDeprivation
      ) {
        scene.events.emit('addObjective', {
          textBesidesCheckbox: 'Evaluate DNA sequences',
          checkedCondition: 'hasBattledSleepDeprivation',
        });

        scene.hero.booleanConditions.hasDeliveredProbe = true;
      }

      if (
        scene.hero.booleanConditions.hasKey &&
        scene.hero.booleanConditions.hasBattledVirus &&
        scene.hero.booleanConditions.hasBattledSleepDeprivation
      ) {
        fadeCameraOut(scene, 1500);
        setTimeout(() => {
          scene.scene.stop('LabScene');
          scene.scene.stop('ObjectivesUIScene');
          scene.scene.start('LabCutscene');
        }, 1500);
      }
    },
  },
  infoNpc: {
    dialogueNodesObj: {
      nodes: [
        new DialogueNode('Hey, Do you need anything?', [
          {
            text: 'Where am I?',
            nextNodeIndex: 3,
            endDialogue: false,
          },
          {
            text: 'Who made this game?',
            nextNodeIndex: 4,
            endDialogue: false,
          },
          {
            text: 'What do I have to do?',
            nextNodeIndex: 1,
            endDialogue: false,
          },
          {
            text: 'No, I am good.',
            nextNodeIndex: null,
            endDialogue: true,
          },
        ]),
        new DialogueNode(
          'Do you see that button over there in the top left corner?',
        ),
        new DialogueNode(
          'If you click on it, you will see your current objectives.',
          [
            {
              text: 'Ok thanks!',
              nextNodeIndex: null,
              endDialogue: true,
            },
          ],
        ),
        new DialogueNode(
          "You're in a lab, you should know that! You're the one who works here!",
          [
            {
              text: 'Ok ...',
              nextNodeIndex: null,
              endDialogue: true,
            },
          ],
        ),
        new DialogueNode(
          'This game was made by Michael, a fullstack webdeveloper from Vienna who is also a coding enthusiast.',
        ),
        new DialogueNode(
          'He learned how to draw pixel art game assets, how to draw character animations and how to design and code game levels.',
        ),
        new DialogueNode(
          'He made this to tell the story of how he transitioned from life sciences to coding, but in a fun and engaging way.',
        ),
      ],
    },
    updateDialogueNodeBasedOnHeroState: (scene, npc) => {
      return;
    },
    triggerEventWhenDialogueEnds: (scene, npc) => {
      return;
    },
  },
  npcA: {
    dialogueNodesObj: {
      nodes: [
        new DialogueNode('Can I tell you a secret?'),
        new DialogueNode('This company treats you like a number.'),
        new DialogueNode(
          'I am just waiting to finish my masters degree and then I am out of here.',
        ),
      ],
    },
    updateDialogueNodeBasedOnHeroState: (scene, npc) => {
      return;
    },
    triggerEventWhenDialogueEnds: (scene, npc) => {
      return;
    },
  },
  npcB: {
    dialogueNodesObj: {
      nodes: [
        new DialogueNode('I am so tired.'),
        new DialogueNode('I have been working for 12 hours straight.'),
        new DialogueNode('I need a coffee.'),
      ],
    },
    updateDialogueNodeBasedOnHeroState: (scene, npc) => {
      return;
    },
    triggerEventWhenDialogueEnds: (scene, npc) => {
      return;
    },
  },
  npcC: {
    dialogueNodesObj: {
      nodes: [new DialogueNode('I AM NOT STARING AT A WALL, YOU ARE!')],
    },
    updateDialogueNodeBasedOnHeroState: (scene, npc) => {
      if (npc.talkCount === 1) {
        npc.dialogueNodesObj = {
          nodes: [new DialogueNode('I just like staring at walls, ok?')],
        };
      }

      if (npc.talkCount > 1) {
        npc.dialogueNodesObj = {
          nodes: [new DialogueNode('Those nightshifts are killing me.')],
        };
      }
    },
    triggerEventWhenDialogueEnds: (scene, npc) => {
      npc.talkCount++;
      return;
    },
  },
};
