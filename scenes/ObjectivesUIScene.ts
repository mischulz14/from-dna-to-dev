import Hero from '../gameObjects/Hero';
import ObjectiveIndicator from '../gameObjects/ObjectiveIndicator';
import ApartmentScene from './ApartmentScene';
import LabScene from './LabScene';

export default class ObjectivesUIScene extends Phaser.Scene {
  objectives: ObjectiveIndicator[];
  currentScene: string;
  checkedCondition: string;
  currentHero: Hero<any>;
  button: Phaser.GameObjects.DOMElement;
  areObjectivesVisible: boolean;
  objectiveAddingInProgress: boolean;

  currentPosition: {
    x: number;
    y: number;
  };
  constructor() {
    super({ key: 'ObjectivesUIScene' });
    this.objectives = [];
    this.currentPosition = {
      x: 60,
      y: 100,
    };
    this.areObjectivesVisible = false;
    this.objectiveAddingInProgress = false;
  }

  create() {
    const button = document.createElement('div');
    button.classList.add('objectives-button');

    // white color: 0xffffff
    this.button = this.add
      .dom(0, 0, button, 'color: #000', 'Show Objectives')
      .setOrigin(0, 0);

    button.addEventListener('click', () => {
      // set button text to 'Hide Objectives' if objectives are visible
      if (this.objectives[0].visible) {
        button.innerText = 'Show Objectives';
        this.areObjectivesVisible = true;
      } else {
        button.innerText = 'Hide Objectives';
        this.areObjectivesVisible = false;
      }

      if (this.objectives.length < 1) return;

      this.objectives.forEach((objective) => {
        objective.setVisible(!objective.visible);
      });
    });

    // Listen for the 'objectiveMet' event
    this.scene
      .get('LabScene')
      .events.on('objectiveMet', this.handleObjectiveMet, this);

    // Listen for the 'addObjective' event
    this.events.on('addObjective', this.handleAddObjective, this);

    // @ts-ignore
    this.currentHero = this.scene.get(this.currentScene).hero;

    // set objectives invisible at first
    this.objectives.forEach((objective) => {
      objective.setVisible(false);
    });
  }

  update(time: number, delta: number): void {
    // @ts-ignore
    this.objectives.forEach((objective) => {
      objective.update(this.currentHero);
    });
  }

  handleObjectiveMet(data) {
    // Update your UI based on the objective that was met
    console.log('Objective met:', data.objectiveId);
  }

  handleAddObjective(data) {
    console.log('objective added');
    if (this.objectiveAddingInProgress) return;
    this.objectiveAddingInProgress = true;
    // Add the objective to your UI
    let objectiveIndicator = new ObjectiveIndicator(
      this,
      this.currentPosition.x,
      this.currentPosition.y,
      data.checkedCondition,
      data.textBesidesCheckbox,
      this.objectives.length,
    );

    if (this.objectives[0] && !this.objectives[0].visible) {
      objectiveIndicator.setVisible(false);
    }

    this.currentPosition.y += 60;

    this.add.existing(objectiveIndicator);

    this.objectives.push(objectiveIndicator);

    this.add.existing(objectiveIndicator);

    const button = document.querySelector('.objectives-button');
    button.classList.add('objectives-animation');
    setTimeout(() => {
      button.classList.remove('objectives-animation');
      this.objectiveAddingInProgress = false;
    }, 2000);
  }

  addInitialObjective(checkedCondition: string, textBesidesCheckbox: string) {
    let objectiveIndicator = new ObjectiveIndicator(
      this,
      this.currentPosition.x,
      this.currentPosition.y,
      checkedCondition,
      textBesidesCheckbox,
      this.objectives.length,
    );

    this.currentPosition.y += 60;

    this.add.existing(objectiveIndicator);

    this.objectives.push(objectiveIndicator);

    this.add.existing(objectiveIndicator);
  }

  removeAllObjectives() {
    this.objectives.forEach((objective) => {
      objective.destroy();
    });
    this.objectives = [];
    this.currentPosition = {
      x: 60,
      y: 100,
    };
  }

  changeCurrentScene(scene: string) {
    this.currentScene = scene;
  }

  hideUI() {
    this.button.setVisible(false);
    this.objectives.forEach((objective) => {
      objective.setVisible(false);
    });
  }

  showUI() {
    this.button.setVisible(true);
  }
}
