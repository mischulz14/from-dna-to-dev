import DialogueNode from '../dialogue/DialogueNode';

export const npcLabData = {
  npcA: {
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
      console.log('hero has key', scene.hero.hasKey);
      // @ts-ignore
      const player = scene.hero as LabHero;
      if (
        player.hasKey &&
        !player.hasBattledVirus &&
        !player.hasBattledSleepDeprivation
      ) {
        npc.dialogueNodesObj = {
          nodes: [
            new DialogueNode('You have the key!'),
            new DialogueNode('You can now open the door!'),
          ],
        };
      }

      if (
        player.hasBattledVirus &&
        player.hasKey &&
        !player.hasBattledSleepDeprivation
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
        player.hasBattledSleepDeprivation &&
        player.hasKey &&
        player.hasBattledVirus
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
    triggerEventWhenDialogueEnds: (scene, npc) => {
      console.log('triggerEventWhenDialogueEnds in labnpc');
      if (
        !scene.hero.hasBattledVirus &&
        !scene.hero.hasKey &&
        !scene.hero.hasBattledSleepDeprivation &&
        !scene.hero.hasTalkedToMainNPC
      ) {
        scene.hero.hasTalkedToMainNPC = true;

        scene.events.emit('addObjective', {
          textBesidesCheckbox: 'Find the key to the fridge',
          checkedCondition: 'hasKey',
        });
      }

      if (scene.hero.hasKey && !scene.hero.hasBattledVirus) {
        return;
      }

      if (
        scene.hero.hasKey &&
        scene.hero.hasBattledVirus &&
        !scene.hero.hasBattledSleepDeprivation
      ) {
        scene.events.emit('addObjective', {
          textBesidesCheckbox: 'Evaluate DNA sequences',
          checkedCondition: 'hasBattledSleepDeprivation',
        });
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
          "If you're wondering: Yes, he learned it from scratch and it took him a while. (;",
        ),
        new DialogueNode(
          'He made this to tell the story of how he got into coding, but in a fun and engaging way.',
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
};
