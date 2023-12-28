import { eventTriggerData } from '../data/eventTriggerData';
import EventTrigger from '../gameObjects/EventTrigger';
import InteractiveGameObject from '../gameObjects/InteractiveGameObject';
import NPC from '../gameObjects/NPC';
import BootcampScene from '../scenes/BootcampScene';
import ObjectivesUIScene from '../scenes/ObjectivesUIScene';
import { fadeCameraIn, fadeCameraOut } from './sceneTransitions';

export function handleContextChange(scene: BootcampScene) {
  scene.hero.booleanConditions.isInFirstPhase = false;
  scene.hero.booleanConditions.isInSecondPhase = true;

  if (!scene.hero.booleanConditions.hasTalkedToJose) return;
  scene.hero.booleanConditions.hasTalkedToEveryone = false;
  scene.hero.booleanConditions.hasTalkedToJose = false;
  scene.NPCsPlayerHasTalkedTo = [];
  const timeout = 1500;
  scene.hero.freeze = true;
  fadeCameraOut(scene, timeout);
  const UI = scene.scene.get('ObjectivesUIScene') as ObjectivesUIScene;
  UI.removeAllObjectives();
  // UI.objectives.forEach((objective) => objective.setVisible(true));

  setTimeout(() => {
    scene.playSceneOverlay('A few weeks later...', 'You learned a lot!');
    scene.hero.x = 200;
    scene.hero.y = 100;
    scene.hero.freeze = false;
    fadeCameraIn(scene, timeout);

    setTimeout(() => {
      scene.events.emit('addObjective', {
        textBesidesCheckbox: 'Check what Jose has to say',
        checkedCondition: 'hasTalkedToJose',
      });

      setTimeout(() => {
        UI.objectives.forEach((objective) => objective.setVisible(false));
      }, timeout);
    }, timeout);
  }, timeout);
}

export function handleNPCInteraction(scene: BootcampScene, npc: NPC) {
  if (scene.hero.booleanConditions.isInThirdPhase) return;
  if (scene.NPCsPlayerHasTalkedTo.length === 4) {
    scene.hero.booleanConditions.hasTalkedToEveryone = true;
    console.log('hasTalkedToEveryone');
    return;
  }

  if (scene.NPCsPlayerHasTalkedTo.includes(npc)) return;
  scene.NPCsPlayerHasTalkedTo.push(npc);

  console.log(scene.NPCsPlayerHasTalkedTo);
}

export function handleFirstBootcampPhase(scene: BootcampScene, npc: NPC) {
  handleNPCInteraction(scene, npc);
  if (!scene.hero.booleanConditions.hasTalkedToEveryone) return;
  handleContextChange(scene);
  return;
}

export function handleSecondBootcampPhase(scene: BootcampScene, npc: NPC) {
  handleNPCInteraction(scene, npc);
  if (!scene.hero.booleanConditions.hasTalkedToEveryone) return;
  handlePrepareNextScene(scene);
  return;
}

export function handlePrepareNextScene(scene: BootcampScene) {
  const timeout = 1500;
  scene.hero.freeze = true;
  scene.hero.booleanConditions.isInSecondPhase = false;
  scene.hero.booleanConditions.isInThirdPhase = true;
  scene.hero.booleanConditions.hasTalkedToEveryone = false;

  const UI = scene.scene.get('ObjectivesUIScene') as ObjectivesUIScene;
  UI.removeAllObjectives();
  UI.objectives.forEach((objective) => objective.setVisible(false));
  fadeCameraOut(scene, timeout);
  const interactive = new EventTrigger(
    scene,
    525,
    450,
    'empty',
    'E',
    'Start the final project',
    eventTriggerData.laptop.dialogueNodesObj,
    eventTriggerData.laptop.triggerEventWhenDialogueEnds,
    () => {},
  ).setImmovable(true);
  interactive.setScale(0.5);

  setTimeout(() => {
    fadeCameraIn(scene, timeout);
    scene.events.emit('addObjective', {
      textBesidesCheckbox: 'Start the final project',
      checkedCondition: 'hasStartedFinalProject',
    });
    UI.objectives.forEach((objective) => objective.setVisible(false));
    scene.hero.freeze = false;
    scene.hero.x = 200;
    scene.hero.y = 100;
  }, timeout);

  return;
}
