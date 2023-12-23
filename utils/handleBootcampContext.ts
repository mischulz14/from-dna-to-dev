import EventTrigger from '../gameObjects/EventTrigger';
import InteractiveGameObject from '../gameObjects/InteractiveGameObject';
import NPC from '../gameObjects/NPC';
import BootcampScene from '../scenes/BootcampScene';
import ObjectivesUIScene from '../scenes/ObjectivesUIScene';
import { fadeCameraIn, fadeCameraOut } from './sceneTransitions';

export function handleContextChange(scene: BootcampScene) {
  if (!scene.hero.booleanConditions.hasTalkedToJose) return;
  const timeout = 1500;
  scene.hero.freeze = true;
  fadeCameraOut(scene, timeout);
  const UI = scene.scene.get('ObjectivesUIScene') as ObjectivesUIScene;
  UI.removeAllObjectives();
  // UI.objectives.forEach((objective) => objective.setVisible(true));

  setTimeout(() => {
    scene.playSceneOverlay('A few weeks later...', 'You learned a lot!');
    scene.hero.x = 180;
    scene.hero.y = 100;
    scene.hero.freeze = false;
    scene.hero.booleanConditions.hasProgressedToNextPhase = true;
    scene.hero.booleanConditions.hasTalkedToEveryone = false;
    scene.hero.booleanConditions.hasTalkedToJose = false;
    fadeCameraIn(scene, timeout);
    scene.NPCsPlayerHasTalkedTo = [];

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
  if (scene.NPCsPlayerHasTalkedTo.includes(npc)) return;
  scene.NPCsPlayerHasTalkedTo.push(npc);

  if (scene.NPCsPlayerHasTalkedTo.length === 4) {
    scene.hero.booleanConditions.hasTalkedToEveryone = true;
    console.log('hasTalkedToEveryone');
  }
  console.log(scene.NPCsPlayerHasTalkedTo);
}

export function handleFirstBootcampPhase(scene: BootcampScene, npc: NPC) {
  if (!scene.hero.booleanConditions.hasProgressedToNextPhase) {
    handleNPCInteraction(scene, npc);
    if (!scene.hero.booleanConditions.hasTalkedToEveryone) return;
    handleContextChange(scene);
  }
  return;
}

export function handleSecondBootcampPhase(scene: BootcampScene, npc: NPC) {
  if (scene.hero.booleanConditions.isReadyForBattle) return;
  if (scene.hero.booleanConditions.hasProgressedToNextPhase) {
    handleNPCInteraction(scene, npc);
    if (!scene.hero.booleanConditions.hasTalkedToEveryone) return;
    handlePrepareNextScene(scene);
  }
  return;
}

export function handlePrepareNextScene(scene: BootcampScene) {
  const timeout = 1500;
  scene.hero.freeze = true;
  scene.hero.booleanConditions.isReadyForBattle = true;
  const UI = scene.scene.get('ObjectivesUIScene') as ObjectivesUIScene;
  UI.removeAllObjectives();
  fadeCameraOut(scene, timeout);
  const interactive = new EventTrigger(
    scene,
    525,
    450,
    'empty',
    'E',
    'Start the final project',
    { nodes: [] },
    () => {},
    () => {},
  ).setImmovable(true);
  interactive.setScale(0.5);

  setTimeout(() => {
    fadeCameraIn(scene, timeout);
    scene.events.emit('addObjective', {
      textBesidesCheckbox: 'Start the final project',
      checkedCondition: 'hasStartedFinalProject',
    });
    scene.hero.freeze = false;
    scene.hero.x = 180;
    scene.hero.y = 100;
  }, timeout);

  return;
}
