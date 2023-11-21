import DialogueNode from '../dialogue/DialogueNode';
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
      if (
        !scene.hero.booleanConditions.hasKey ||
        scene.hero.booleanConditions.hasBattledVirus
      ) {
        return;
      }

      scene.scene.pause('UIScene');
      scene.scene.get('UIScene').objectives.forEach((objective) => {
        objective.setVisible(false);
      });

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
          'You are being attacked by a virus! You chose to call it Mr.Virus.',
        enemyName: 'Mr. Virus',
        triggerEventsOnBattleEnd: (scene: any) => {
          // @ts-ignore
          scene.scene.get('LabScene').isEventTriggered = false;
          // @ts-ignore
          scene.scene.get('LabScene').hero.booleanConditions.hasBattledVirus =
            true;
          // @ts-ignore
          scene.scene.get('UIScene').objectives.forEach((objective) => {
            if (!objective.visible) return;
            objective.setVisible(true);
          });

          scene.scene.get('UIScene').events.emit('addObjective', {
            textBesidesCheckbox: 'Deliver the probe.',
            checkedCondition: 'hasDeliveredProbe',
          });

          scene.scene.stop('BattleScene');
          scene.scene.resume('LabScene');
          scene.scene.resume('UIScene');
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
      if (!scene.hero.booleanConditions.hasDeliveredProbe) {
        return;
      }

      scene.scene.pause('UIScene');
      scene.scene.get('UIScene').objectives.forEach((objective) => {
        objective.setVisible(false);
      });
      scene.scene.pause('LabScene'); // Pause the LabScene
      scene.scene.launch('BattleScene', {
        heroBattleAnimationName: heroBattleAnimationNames.lab,
        enemyBattleAnimationName: enemyBattleAnimationNames.sleepDeprivation,
        enemyAttacks: enemyAttacks.sleepDeprivationBattle,
        playerAttacks: playerAttacks.sleepDeprivationBattle,
        backgroundImage: battleBackgroundSpriteNames.lab,
        initialDialogue:
          "You're being attack by sleep deprivation! Fight Mr.Sleepyhead!",
        battleHeroSpriteTexture: heroBattleSpriteNames.lab,
        enemyTexture: enemySpriteNames.sleepDeprivation,
        enemyName: 'Mr. Sleepyhead',
        triggerEventsOnBattleEnd: (scene: any) => {
          scene.scene.stop('BattleScene');
          scene.scene.resume('LabScene');
          scene.scene.resume('UIScene');

          // @ts-ignore
          scene.scene.get('UIScene').objectives.forEach((objective) => {
            if (!objective.visible) return;
            objective.setVisible(true);
          });

          scene.scene.get('UIScene').events.emit('addObjective', {
            textBesidesCheckbox: 'Deliver the DNA results.',
            checkedCondition: 'hasDeliveredDNAResults',
          });
          // @ts-ignore
          scene.scene.get(
            'LabScene',
          ).hero.booleanConditions.hasBattledSleepDeprivation = true;
        },
      });
    },
  },
};
