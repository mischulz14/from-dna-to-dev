import Hero from '../gameObjects/Hero';
import ObjectiveIndicator from '../gameObjects/ObjectiveIndicator';
import ApartmentScene from './ApartmentScene';
import LabScene from './LabScene';

export default class UIScene extends Phaser.Scene {
  objectives: ObjectiveIndicator[];
  currentScene: string;
  checkedCondition: string;
  currentHero: Hero;
  buttonText: Phaser.GameObjects.Text;
  button: Phaser.GameObjects.Rectangle;
  rectangles: Phaser.GameObjects.Rectangle[];

  currentPosition: {
    x: number;
    y: number;
  };
  constructor() {
    super({ key: 'UIScene' });
    this.objectives = [];
    this.currentPosition = {
      x: 60,
      y: 100,
    };
  }

  create() {
    const rect1 = this.add.rectangle(12, 10, 185, 40, 0x000).setOrigin(0, 0);
    const rect2 = this.add.rectangle(19, 17, 187, 42, 0x000).setOrigin(0, 0);
    this.rectangles = [rect1, rect2];

    // white color: 0xffffff
    this.button = this.add.rectangle(20, 18, 185, 40, 0xffffff).setOrigin(0, 0);
    this.button.setInteractive();
    this.button.on('pointerdown', () => {
      // set button text to 'Hide Objectives' if objectives are visible
      if (this.objectives[0].visible) {
        this.buttonText.setText('Show Objectives');
      } else {
        this.buttonText.setText('Hide Objectives');
      }

      if (this.objectives.length < 1) return;

      this.objectives.forEach((objective) => {
        objective.setVisible(!objective.visible);
      });
    });

    this.buttonText = this.add.text(32, 26, 'Show Objectives', {
      fontSize: '1.5rem',
      fontFamily: 'Rainyhearts',
      color: '#000',
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
    // Add the objective to your UI
    let objectiveIndicator = new ObjectiveIndicator(
      this,
      this.currentPosition.x,
      this.currentPosition.y,
      data.checkedCondition,
      data.textBesidesCheckbox,
    );

    if (!this.objectives[0].visible) {
      objectiveIndicator.setVisible(false);
    }

    this.currentPosition.y += 60;

    this.add.existing(objectiveIndicator);

    this.objectives.push(objectiveIndicator);

    this.add.existing(objectiveIndicator);
  }

  addInitialObjective(checkedCondition: string, textBesidesCheckbox: string) {
    let objectiveIndicator = new ObjectiveIndicator(
      this,
      this.currentPosition.x,
      this.currentPosition.y,
      checkedCondition,
      textBesidesCheckbox,
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

  hideObjectivesButton() {
    this.buttonText.setVisible(false);
    this.button.setVisible(false);
    this.rectangles.forEach((rectangle) => {
      rectangle.setVisible(false);
    });
  }

  showObjectivesButton() {
    this.buttonText.setVisible(true);
    this.button.setVisible(true);
    this.rectangles.forEach((rectangle) => {
      rectangle.setVisible(true);
    });
  }
}
