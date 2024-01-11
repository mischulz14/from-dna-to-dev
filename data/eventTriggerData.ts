import DialogueNode from '../dialogue/DialogueNode';
import Hero from '../gameObjects/Hero';
import BootcampScene from '../scenes/BootcampScene';
import FinalBattleScene from '../scenes/FinalBattleScene';
import LabScene from '../scenes/LabScene';
import ObjectivesUIScene from '../scenes/ObjectivesUIScene';
import {
  fadeCameraIn,
  fadeCameraOut,
  transitionToDNASceneAndBack,
} from '../utils/sceneTransitions';
import { battleBackgroundSpriteNames } from './battleBackgroundSpriteNames';
import { enemyAttacks } from './enemyAttacks';
import { enemyBattleAnimationNames } from './enemyBattleAnimationNames';
import { enemySpriteNames } from './enemySpriteNames';
import { heroBattleAnimationNames } from './heroBattleAnimationNames';
import { heroBattleSpriteNames } from './heroBattleSpriteNames';
import { playerAttacks } from './playerAttacks';

export const eventTriggerData = {
  refrigerator: {
    dialogueNodesObj: {
      nodes: [
        new DialogueNode('The fridge is full of probes.'),
        new DialogueNode('But it is locked.'),
      ],
    },
    updateDialogueNodeBasedOnPlayerState: (scene, eventtrigger) => {
      if (
        scene.hero.booleanConditions.hasKey &&
        !scene.hero.booleanConditions.hasBattledVirus
      ) {
        eventtrigger.dialogueNodesObj = {
          nodes: [
            new DialogueNode('You open the refrigerator.'),
            new DialogueNode(
              'But one Probe is falling out of the fridge! Oh no!',
            ),
            new DialogueNode(
              'You have to catch it before it falls to the ground!',
            ),
            new DialogueNode('You feel your stress response kicking in!'),
            new DialogueNode(
              'I... I have to catch it! I have to catch it! I have to catch it!',
            ),
          ],
        };
      }

      if (
        scene.hero.booleanConditions.hasKey &&
        scene.hero.booleanConditions.hasBattledVirus
      ) {
        eventtrigger.dialogueNodesObj = {
          nodes: [
            new DialogueNode(
              'Phew, that was a lot of work for a simple probe...',
            ),
            new DialogueNode('The other probes seem to be fine.'),
          ],
        };
      }
    },
    triggerEventWhenDialogueEnds: (scene: any) => {
      const objectivesUI = scene.scene.get(
        'ObjectivesUIScene',
      ) as ObjectivesUIScene;
      if (
        !scene.hero.booleanConditions.hasKey ||
        scene.hero.booleanConditions.hasBattledVirus
      ) {
        return;
      }

      scene.scene.pause('ObjectivesUIScene');
      objectivesUI.hideUI();

      console.log('trigger computer event');

      scene.scene.pause('LabScene'); // Pause the LabScene
      scene.scene.launch('BattleScene', {
        heroBattleAnimationName: heroBattleAnimationNames.lab,
        enemyBattleAnimationName: enemyBattleAnimationNames.virus,
        enemyAttacks: enemyAttacks.virusBattle,
        playerAttacks: playerAttacks.virusBattle,
        backgroundImage: battleBackgroundSpriteNames.lab,
        battleHeroSpriteTexture: heroBattleSpriteNames.lab,
        enemyTexture: enemySpriteNames.virus,
        initialDialogue:
          'You are being attacked by a virus (Or at least that is what your stress response is telling you)! You chose to call it Mr.Virus.',
        endDialogue:
          'You defeat Mr.Virus and snap out of your stress response. You caught the probe!',
        enemyName: 'Mr. Virus',
        initialPlayerHealth: 130,
        initialEnemyHealth: 80,
        triggerEventsOnBattleEnd: (scene: any) => {
          const labScene = scene.scene.get('LabScene') as LabScene;

          labScene.isEventTriggered = false;

          labScene.hero.booleanConditions.hasBattledVirus = true;

          const objectivesUI = scene.scene.get(
            'ObjectivesUIScene',
          ) as ObjectivesUIScene;
          objectivesUI.hideUI();

          objectivesUI.events.emit('addObjective', {
            textBesidesCheckbox: 'Deliver the probe.',
            checkedCondition: 'hasDeliveredProbe',
          });

          transitionToDNASceneAndBack(
            scene,
            'LabScene',
            ['LabScene', 'ObjectivesUIScene'],
            1,
            2000,
          );

          scene.scene.stop('BattleScene');
        },
      }); // Launch the StartScene alongside LabScene
    },
  },
  fridgeKeyContainer: {
    dialogueNodesObj: {
      nodes: [new DialogueNode('It seems there is a key here!')],
    },
    triggerEventWhenDialogueEnds: (scene: any) => {
      if (!scene.hero.booleanConditions.hasTalkedToMainNPC) {
        console.log('triggerEventWhenDialogueEnds in fridgeKeyContainer');
        return;
      }

      if (
        scene.hero.booleanConditions.hasTalkedToMainNPC &&
        !scene.hero.booleanConditions.hasKey
      ) {
        scene.events.emit('addObjective', {
          textBesidesCheckbox: 'Get a probe from the fridge',
          checkedCondition: 'hasBattledVirus',
        });

        console.log(scene.hero.booleanConditions);

        scene.hero.booleanConditions.hasKey = true;
        return;
      }

      if (scene.hero.booleanConditions.hasKey) return;
    },
    updateDialogueNodeBasedOnPlayerState: (scene, eventtrigger) => {
      if (!scene.hero.booleanConditions.hasTalkedToMainNPC) {
        eventtrigger.dialogueNodesObj = {
          nodes: [
            new DialogueNode(
              'Theres a key in here, maybe I should ask someone about it?',
            ),
          ],
        };
      } else if (
        scene.hero.booleanConditions.hasTalkedToMainNPC &&
        !scene.hero.booleanConditions.hasKey
      ) {
        eventtrigger.dialogueNodesObj = {
          nodes: [
            new DialogueNode('There is a key in here!'),
            new DialogueNode('Maybe this opens the fridge! I should take it.'),
          ],
        };
      } else if (scene.hero.booleanConditions.hasKey) {
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
      if (scene.hero.booleanConditions.hasDeliveredProbe) {
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
      const objectivesUI = scene.scene.get(
        'ObjectivesUIScene',
      ) as ObjectivesUIScene;
      if (!scene.hero.booleanConditions.hasDeliveredProbe) {
        return;
      }

      scene.scene.pause('ObjectivesUIScene');
      objectivesUI.objectives.forEach((objective) => {
        objective.setVisible(false);
      });
      objectivesUI.hideUI();
      scene.scene.pause('LabScene'); // Pause the LabScene
      scene.scene.launch('BattleScene', {
        heroBattleAnimationName: heroBattleAnimationNames.lab,
        enemyBattleAnimationName: enemyBattleAnimationNames.sleepDeprivation,
        enemyAttacks: enemyAttacks.sleepDeprivationBattle,
        playerAttacks: playerAttacks.sleepDeprivationBattle,
        backgroundImage: battleBackgroundSpriteNames.lab,
        initialDialogue:
          'The sleep deprivation hits hard! Fight Mr.Sleepyhead!',
        endDialogue: 'You defeated Mr.Sleepyhead and your sleep deprived mind!',
        battleHeroSpriteTexture: heroBattleSpriteNames.lab,
        enemyTexture: enemySpriteNames.sleepDeprivation,
        enemyName: 'Mr. Sleepyhead',
        initialPlayerHealth: 140,
        initialEnemyHealth: 100,
        triggerEventsOnBattleEnd: (scene: any) => {
          scene.scene.stop('BattleScene');
          const objectivesUI = scene.scene.get(
            'ObjectivesUIScene',
          ) as ObjectivesUIScene;
          objectivesUI.hideUI();

          objectivesUI.events.emit('addObjective', {
            textBesidesCheckbox: 'Deliver the DNA results.',
            checkedCondition: 'hasDeliveredDNAResults',
          });
          // @ts-ignore
          scene.scene.get(
            'LabScene',
          ).hero.booleanConditions.hasBattledSleepDeprivation = true;

          transitionToDNASceneAndBack(
            scene,
            'LabScene',
            ['LabScene', 'ObjectivesUIScene'],
            2,
            2000,
          );
        },
      });
    },
  },
  michiSad: {
    dialogueNodesObj: {
      nodes: [
        new DialogueNode('Please I just need some coffee..'),
        new DialogueNode('Then we can talk...'),
      ],
    },
    updateDialogueNodeBasedOnPlayerState: (scene, eventtrigger) => {
      const hero = scene.hero as Hero;
      // if (!hero.booleanConditions.hasMadeCoffee) {
      //   eventtrigger.dialogueNodesObj = {
      //     nodes: [new DialogueNode('Did you already make coffee?')],
      //   };
      // }

      if (hero.booleanConditions.hasMadeCoffee) {
        eventtrigger.dialogueNodesObj = {
          nodes: [
            new DialogueNode('Wow... That coffee tastes great, thank you!'),
            new DialogueNode(
              'I will tell you what happened, but I still feel sooo desperate right now',
            ),
            new DialogueNode('I just got fired from my job without warning...'),
            new DialogueNode("I don't know what to do with my life anymore..."),
          ],
        };
      }
    },
    triggerEventWhenDialogueEnds: (scene: any) => {
      const hero = scene.hero as Hero;

      if (!hero.booleanConditions.hasMadeCoffee) {
        console.log('has not made coffee yet');
        return;
      }

      const objectivesUI = scene.scene.get(
        'ObjectivesUIScene',
      ) as ObjectivesUIScene;

      scene.scene.pause('ObjectivesUIScene');
      objectivesUI.objectives.forEach((objective) => {
        objective.setVisible(false);
      });
      objectivesUI.hideUI();
      scene.scene.pause('ApartmentScene'); // Pause the LabScene
      scene.scene.launch('BattleScene', {
        heroBattleAnimationName: heroBattleAnimationNames.apartment,
        enemyBattleAnimationName: enemyBattleAnimationNames.apartment,
        enemyAttacks: enemyAttacks.apartmentBattle,
        playerAttacks: playerAttacks.apartmentBattle,
        backgroundImage: battleBackgroundSpriteNames.apartment,
        initialDialogue:
          'Your Boyfriend is extremely sad! Fight his quarter life crisis!',
        endDialogue: 'You defeated his quarter life crisis! Nicely done!',
        battleHeroSpriteTexture: heroBattleSpriteNames.apartment,
        enemyTexture: enemySpriteNames.apartment,
        enemyName: 'Sad Boyfriend',
        initialPlayerHealth: 120,
        initialEnemyHealth: 80,
        triggerEventsOnBattleEnd: (scene: any) => {
          scene.scene.stop('BattleScene');
          const objectivesUI = scene.scene.get(
            'ObjectivesUIScene',
          ) as ObjectivesUIScene;
          objectivesUI.hideUI();

          transitionToDNASceneAndBack(
            scene,
            '',
            ['ProgressToBootcampScene'],
            3,
            2000,
            true,
          );
        },
      });
    },
  },

  coffeeMachine: {
    dialogueNodesObj: {
      nodes: [
        new DialogueNode('You can make coffee here.'),
        new DialogueNode('But it seems there is some water missing.'),
      ],
    },
    updateDialogueNodeBasedOnPlayerState: (scene, eventtrigger) => {
      const hero = scene.hero as Hero;

      if (hero.booleanConditions.hasFoundWater) {
        eventtrigger.dialogueNodesObj = {
          nodes: [
            new DialogueNode('You fill in the water into the coffee machine.'),
            new DialogueNode("Something doesn't sound right..."),
            new DialogueNode('Maybe this button does something?'),
            new DialogueNode(
              'It seems like you have to fix the coffee machine...',
            ),
            new DialogueNode('Let me just...'),
          ],
        };
      }

      if (hero.booleanConditions.hasMadeCoffee) {
        eventtrigger.dialogueNodesObj = {
          nodes: [
            new DialogueNode('You already fixed the machine and made coffee.'),
            new DialogueNode('You should bring it to your boyfriend.'),
          ],
        };
      }
    },
    triggerEventWhenDialogueEnds: (scene: any) => {
      const hero = scene.hero as Hero;
      if (hero.booleanConditions.hasMadeCoffee) return;
      if (!hero.booleanConditions.hasCheckedCoffeeMachine) {
        hero.booleanConditions.hasCheckedCoffeeMachine = true;
        scene.events.emit('addObjective', {
          textBesidesCheckbox: 'Find Water',
          checkedCondition: 'hasFoundWater',
        });
      }

      if (hero.booleanConditions.hasFoundWater) {
        // fadeCameraIn(scene, 1000);
        hero.booleanConditions.hasMadeCoffee = true;
        // fadeCameraOut(scene, 1000);
        setTimeout(() => {
          scene.activeInteractiveGameObject.hideSpeechIndication();
          const objectivesUI = scene.scene.get(
            'ObjectivesUIScene',
          ) as ObjectivesUIScene;
          objectivesUI.hideUI();
          scene.scene.pause('ApartmentScene');
          scene.scene.get('ApartmentScene').children.each((child) => {
            child.setVisible(false);
          });
          scene.scene.launch('FindErrorScene');
          scene.scene.bringToTop('FindErrorScene');
        }, 20);
      }
      return;
    },
  },
  wasserHahn: {
    dialogueNodesObj: {
      nodes: [new DialogueNode('That is a nice looking sink.')],
    },
    updateDialogueNodeBasedOnPlayerState: (scene, eventtrigger) => {
      const hero = scene.hero as Hero;

      if (!hero.booleanConditions.hasCheckedCoffeeMachine) return;

      if (
        hero.booleanConditions.hasCheckedCoffeeMachine &&
        !hero.booleanConditions.hasFoundWater
      ) {
        eventtrigger.dialogueNodesObj = {
          nodes: [
            new DialogueNode('Get some water from the sink?', [
              {
                text: 'Sure!',
                nextNodeIndex: 1,
                endDialogue: false,
              },
            ]),
            new DialogueNode('Nice, you got some water!'),
          ],
        };
      }

      if (hero.booleanConditions.hasFoundWater) {
        eventtrigger.dialogueNodesObj = {
          nodes: [
            new DialogueNode('You already have water.'),
            new DialogueNode('Try bringing it to the coffee machine.'),
          ],
        };
      }
    },
    triggerEventWhenDialogueEnds: (scene: any) => {
      const hero = scene.hero as Hero;

      if (
        hero.booleanConditions.hasCheckedCoffeeMachine &&
        !hero.booleanConditions.hasFoundWater
      ) {
        hero.booleanConditions.hasFoundWater = true;
        hero.booleanConditions.hasFoundWater = true;
        scene.events.emit('addObjective', {
          textBesidesCheckbox: 'Make Coffee',
          checkedCondition: 'hasMadeCoffee',
        });
      }
    },
  },
  laptop: {
    dialogueNodesObj: {
      nodes: [
        new DialogueNode('You start the final project'),
        new DialogueNode('You feel your stress response kicking in again!'),
        new DialogueNode('I am going to finish this.'),
      ],
    },
    updateDialogueNodeBasedOnPlayerState: (scene, eventtrigger) => {},
    triggerEventWhenDialogueEnds: (scene: BootcampScene) => {
      const UIScene = scene.scene.get('ObjectivesUIScene') as ObjectivesUIScene;
      UIScene.hideUI();

      const bootcampScene = scene.scene.get('BootcampScene') as BootcampScene;

      const finalBattleScene = scene.scene.get(
        'FinalBattleScene',
      ) as FinalBattleScene;

      // fadeCameraOut(scene, 1000);

      setTimeout(() => {
        finalBattleScene.scene.start('FinalBattleScene');
        bootcampScene.activeInteractiveGameObject.hideSpeechIndication();
        bootcampScene.scene.pause('BootcampScene');
      }, 1000);
    },
  },
};
