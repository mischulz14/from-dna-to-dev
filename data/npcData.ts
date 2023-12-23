import DialogueNode from '../dialogue/DialogueNode';
import BootcampScene from '../scenes/BootcampScene';
import LabScene from '../scenes/LabScene';
import {
  handleContextChange,
  handleFirstBootcampPhase,
  handleNPCInteraction,
  handleSecondBootcampPhase,
} from '../utils/handleBootcampContext';
import { fadeCameraOut } from '../utils/sceneTransitions';

interface NpcData {
  position?: { x: number; y: number };
  dialogueNodesObj: { nodes: DialogueNode[] };
  updateDialogueNodeBasedOnHeroState: (scene: LabScene, npc: any) => void;
  triggerEventWhenDialogueEnds: (scene: LabScene, npc: any) => void;
}

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

export const npcBootcampData = {
  timon: {
    texture: 'timon',
    position: { x: 170, y: 340 },
    initialAnimation: 'timon-idle-up',
    dialogueNodesObj: {
      nodes: [
        new DialogueNode('Hey there! My name is Timon.'),
        new DialogueNode('Before going to this bootcamp I was a doctor.'),
        new DialogueNode('Is there anything else you would like to know?', [
          {
            text: 'Why did you change careers?',
            nextNodeIndex: 3,
            endDialogue: false,
          },
          {
            text: 'What do you do in your free time?',
            nextNodeIndex: 4,
            endDialogue: false,
          },
          {
            text: 'No, I am good.',
            nextNodeIndex: null,
            endDialogue: true,
          },
        ]),
        new DialogueNode(
          'That is waaay to long to answer... Long story short, I was not happy with my job.',
          [
            {
              text: 'Ok thanks!',
              nextNodeIndex: null,
              endDialogue: true,
            },
          ],
        ),
        new DialogueNode(
          'I like photography, I like to play video games and I like metal concerts (:',
          [
            {
              text: 'Nice!',
              nextNodeIndex: null,
              endDialogue: true,
            },
          ],
        ),
      ],
    },
    updateDialogueNodeBasedOnHeroState: (scene: BootcampScene, npc) => {
      if (scene.hero.booleanConditions.hasProgressedToNextPhase) {
        npc.dialogueNodesObj = {
          nodes: [
            new DialogueNode('Hey there!'),
            new DialogueNode(
              'Did you know a linear search algorithm has a time complexity of O(n)?',
              [
                {
                  text: 'Eerrr no?',
                  nextNodeIndex: 2,
                  endDialogue: false,
                },
                {
                  text: 'No, but do you have any other tips?',
                  nextNodeIndex: 3,
                  endDialogue: false,
                },
              ],
            ),
            new DialogueNode(
              'No worries, I only know that, because I am lowkey a genius.',
              [
                {
                  text: 'Ok, I will note that down!',
                  nextNodeIndex: null,
                  endDialogue: true,
                },
              ],
            ),
            new DialogueNode(
              'Try contributing to open source projects, it will help you learn a lot!',
              [
                {
                  text: 'Thanks!',
                  nextNodeIndex: null,
                  endDialogue: true,
                },
              ],
            ),
          ],
        };
      }
      return;
    },
    triggerEventWhenDialogueEnds: (scene: BootcampScene, npc) => {
      handleFirstBootcampPhase(scene, npc);
      handleSecondBootcampPhase(scene, npc);
      return;
    },
  },
  jose: {
    texture: 'jose',
    position: { x: 490, y: 100 },
    initialAnimation: 'jose-idle-left',
    dialogueNodesObj: {
      nodes: [
        new DialogueNode('Eeey my friend what is up?'),
        new DialogueNode(
          'This is the good vibes zone here. Coding and good vibes is all you need.',
        ),
        new DialogueNode('Feel free to ask anything', [
          {
            text: 'What type of bootcamp is this? What will we learn here?',
            nextNodeIndex: 3,
            endDialogue: false,
          },
          {
            text: 'What should I do on my first day?',
            nextNodeIndex: 4,
            endDialogue: false,
          },
        ]),
        new DialogueNode(
          'This is a fullstack web development bootcamp, my friend. You will learn how to build websites and web applications from scratch.',
          [
            {
              text: 'Sounds great!',
              nextNodeIndex: null,
              endDialogue: true,
            },
          ],
        ),
        new DialogueNode(
          'You should get to know the people here, amigo, and then you should start coding.',
          [
            {
              text: 'Will do!',
              nextNodeIndex: null,
              endDialogue: true,
            },
          ],
        ),
      ],
    },
    updateDialogueNodeBasedOnHeroState: (scene: BootcampScene, npc) => {
      if (
        scene.hero.booleanConditions.hasProgressedToNextPhase &&
        !scene.hero.booleanConditions.isReadyForBattle
      ) {
        npc.dialogueNodesObj = {
          nodes: [
            new DialogueNode(
              'Eeey my friend good for you pushing through until now?',
            ),
            new DialogueNode(
              "Don't forget the good vibes, no matter how many bugs you encounter.",
            ),
            new DialogueNode('What do you want to know', [
              {
                text: 'What Technologies have we learned so far?',
                nextNodeIndex: 3,
                endDialogue: false,
              },
              {
                text: 'What should I do now?',
                nextNodeIndex: 4,
                endDialogue: false,
              },
            ]),
            new DialogueNode(
              'We have learned HTML, CSS, JavaScript, React, Node.js, Express.js, PostrgreSQL, TypeScript, GitHub, and much more!',
              [
                {
                  text: 'Wow everything I need to build cool stuff!',
                  nextNodeIndex: null,
                  endDialogue: true,
                },
              ],
            ),
            new DialogueNode(
              'Try learning from your colleagues, amigo, and then you should start coding your final project.',
              [
                {
                  text: 'Will do!',
                  nextNodeIndex: null,
                  endDialogue: true,
                },
              ],
            ),
          ],
        };
      }

      if (scene.hero.booleanConditions.isReadyForBattle) {
        npc.dialogueNodesObj = {
          nodes: [
            new DialogueNode('Start your final project amigo!'),
            new DialogueNode('Find your laptop and start coding!'),
          ],
        };
      }
      return;
    },
    triggerEventWhenDialogueEnds: (scene: BootcampScene, npc) => {
      scene.hero.booleanConditions.hasTalkedToJose = true;

      if (!scene.hero.booleanConditions.hasProgressedToNextPhase) {
        scene.events.emit('addObjective', {
          textBesidesCheckbox: 'Talk to the other bootcamp participants',
          checkedCondition: 'hasTalkedToEveryone',
        });
        return;
      }
      scene.events.emit('addObjective', {
        textBesidesCheckbox: 'Ask for tips from your colleagues',
        checkedCondition: 'hasTalkedToEveryone',
      });

      return;
    },
  },
  ute: {
    texture: 'ute',
    position: { x: 340, y: 460 },
    initialAnimation: 'ute-idle-up',
    dialogueNodesObj: {
      nodes: [
        new DialogueNode(
          "Hey there, my name is Ute but some call me 'the machine'",
        ),
        new DialogueNode(
          'What do you want to know about me? I am an open book.',
          [
            {
              text: 'Why do they call you the machine?',
              nextNodeIndex: 2,
              endDialogue: false,
            },
            {
              text: 'Anything else you would like to share?',
              nextNodeIndex: 4,
              endDialogue: false,
            },
          ],
        ),
        new DialogueNode(
          "Because I'm always doing something, be it working, studying or working out.",
        ),
        new DialogueNode("I don't even know what 'resting' means, my guy.", [
          {
            text: 'You really are a machine!',
            nextNodeIndex: null,
            endDialogue: true,
          },
        ]),
        new DialogueNode(
          "Sure, my passion is and always will be food. Don't be surprised if you see me open a café one day!",
        ),
      ],
    },
    updateDialogueNodeBasedOnHeroState: (scene: BootcampScene, npc) => {
      if (scene.hero.booleanConditions.hasProgressedToNextPhase) {
        npc.dialogueNodesObj = {
          nodes: [
            new DialogueNode('Hey there, you need anything?'),
            new DialogueNode('Just ask', [
              {
                text: 'Can you explain cookies to me like a five year old?',
                nextNodeIndex: 2,
                endDialogue: false,
              },
              {
                text: 'Any fonts that you recommend?',
                nextNodeIndex: 4,
                endDialogue: false,
              },
            ]),
            new DialogueNode(
              "Sure, a cookie is a small piece of data stored on the user's computer by the web browser while browsing a website.",
            ),
            new DialogueNode(
              "And don't forget to tell the user that you're using cookies!",
              [
                {
                  text: 'Thanks machine!',
                  nextNodeIndex: null,
                  endDialogue: true,
                },
              ],
            ),
            new DialogueNode(
              "I like the font 'Roboto' a lot, it's very clean and easy to read.",
            ),
          ],
        };
      }
      return;
    },
    triggerEventWhenDialogueEnds: (scene: BootcampScene, npc) => {
      handleFirstBootcampPhase(scene, npc);
      handleSecondBootcampPhase(scene, npc);
      return;
    },
  },
  judy: {
    texture: 'judy',
    position: { x: 335, y: 740 },
    initialAnimation: 'judy-idle-right',
    dialogueNodesObj: {
      nodes: [
        new DialogueNode("Hi, I'm Judy!"),
        new DialogueNode('Do you need anything?', [
          {
            text: 'You seem a bit tense, is everything alright?',
            nextNodeIndex: 2,
            endDialogue: false,
          },
          {
            text: 'Why did you decide to do this bootcamp?',
            nextNodeIndex: 4,
            endDialogue: false,
          },
        ]),
        new DialogueNode(
          "Yeah, don't worry, my husband just forgot to wash the dishes AGAIN.",
        ),
        new DialogueNode(
          "But of course, I'm also nervous starting this bootcamp",
          [
            {
              text: 'I get it. I am also nervous.',
              nextNodeIndex: null,
              endDialogue: true,
            },
          ],
        ),
        new DialogueNode(
          "I worked at an airline for some time, but that won't lead to any career growth in my life, so I quit!",
        ),
      ],
    },
    updateDialogueNodeBasedOnHeroState: (scene: BootcampScene, npc) => {
      if (scene.hero.booleanConditions.hasProgressedToNextPhase) {
        npc.dialogueNodesObj = {
          nodes: [
            new DialogueNode('Hi there!'),
            new DialogueNode('Do you need anything?', [
              {
                text: 'Can you motivate me?',
                nextNodeIndex: 2,
                endDialogue: false,
              },
              {
                text: 'Do you have any snacks?',
                nextNodeIndex: 4,
                endDialogue: false,
              },
            ]),
            new DialogueNode(
              "Of course! Just think about how far you've come already and how far we have come as a team!",
            ),
            new DialogueNode(
              'If we can make that much progress in a few months think about how much progress you can make in a few years!',
              [
                {
                  text: 'That helped, thanks!',
                  nextNodeIndex: null,
                  endDialogue: true,
                },
              ],
            ),
            new DialogueNode(
              'Sure, I even cooked a few things for you! Here you go!',
              [
                {
                  text: 'Thanks Mom! EEErrr I mean Judy! (how embarrassing)',
                  nextNodeIndex: null,
                  endDialogue: true,
                },
              ],
            ),
          ],
        };
      }
      return;
    },
    triggerEventWhenDialogueEnds: (scene: BootcampScene, npc) => {
      handleFirstBootcampPhase(scene, npc);
      handleSecondBootcampPhase(scene, npc);
      return;
    },
  },
  julia: {
    texture: 'julia',
    position: { x: 550, y: 740 },
    initialAnimation: 'julia-idle-left',
    dialogueNodesObj: {
      nodes: [
        new DialogueNode("Hi, I'm Julia!"),
        new DialogueNode('Can I help you?', [
          {
            text: 'What did you do before coming here?',
            nextNodeIndex: 2,
            endDialogue: false,
          },
          {
            text: 'Why did you decide to do this bootcamp?',
            nextNodeIndex: 4,
            endDialogue: false,
          },
        ]),
        new DialogueNode('Oh I first studied graphic design!'),
        new DialogueNode(
          'But then I started worked at the same airline company as Judy and we quit together!',
          [
            {
              text: "That's what I call friendship",
              nextNodeIndex: null,
              endDialogue: true,
            },
          ],
        ),
        new DialogueNode('Ask Judy, she can give you the details'),
      ],
    },
    updateDialogueNodeBasedOnHeroState: (scene: BootcampScene, npc) => {
      if (scene.hero.booleanConditions.hasProgressedToNextPhase) {
        npc.dialogueNodesObj = {
          nodes: [
            new DialogueNode('Hi there!'),
            new DialogueNode('Can I help you?', [
              {
                text: 'You said you studied graphical design, any tips?',
                nextNodeIndex: 2,
                endDialogue: false,
              },
              {
                text: 'Any more tips?',
                nextNodeIndex: 4,
                endDialogue: false,
              },
            ]),
            new DialogueNode(
              'It is simple really: Less is more. Try to keep your designs simple and clean.',
            ),
            new DialogueNode(
              'Oh and also try making it look good on mobile devices!',
              [
                {
                  text: 'Will do!',
                  nextNodeIndex: null,
                  endDialogue: true,
                },
              ],
            ),
            new DialogueNode(
              'Yeah, try chosing a color palette and stick to it. Also try to use a maximum of 3 fonts.',
            ),
          ],
        };
      }
      return;
    },
    triggerEventWhenDialogueEnds: (scene: BootcampScene, npc) => {
      handleFirstBootcampPhase(scene, npc);
      handleSecondBootcampPhase(scene, npc);
      return;
    },
  },
};
