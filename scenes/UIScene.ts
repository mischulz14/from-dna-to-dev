import ObjectiveIndicator from '../gameObjects/ObjectiveIndicator';

export default class UIScene extends Phaser.Scene {
  objectives: ObjectiveIndicator[];
  currentScene: Phaser.Scene;
  checkedCondition: string;
  currentHero: any;
  buttonText: Phaser.GameObjects.Text;

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

  preload() {
    this.load.image('checkBoxEmpty', 'assets/checkBoxEmpty.png');
    this.load.image('checkBoxChecked', 'assets/checkBoxChecked.png');
  }

  create() {
    this.add.rectangle(12, 10, 185, 40, 0x000).setOrigin(0, 0);
    // white color: 0xffffff
    let button = this.add.rectangle(20, 18, 185, 40, 0xffffff).setOrigin(0, 0);
    button.setInteractive();
    button.on('pointerdown', () => {
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

    this.currentScene = this.scene.get('LabScene');

    this.addInitialObjective();
    // set objectives invisible at first
    this.objectives.forEach((objective) => {
      objective.setVisible(false);
    });
  }

  update(time: number, delta: number): void {
    // @ts-ignore
    this.currentHero = this.currentScene.hero;
    // Update your UI here
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
      'checkBoxEmpty',
      'checkBoxChecked',
    );

    if (!this.objectives[0].visible) {
      objectiveIndicator.setVisible(false);
    }

    this.currentPosition.y += 60;

    this.add.existing(objectiveIndicator);

    this.objectives.push(objectiveIndicator);

    this.add.existing(objectiveIndicator);
  }

  addInitialObjective() {
    let objectiveIndicator = new ObjectiveIndicator(
      this,
      this.currentPosition.x,
      this.currentPosition.y,
      'hasTalkedToMainNPC',
      'Talk to the people in the Lab and see if someone has work for you.',
      'checkBoxEmpty',
      'checkBoxChecked',
    );

    this.currentPosition.y += 60;

    this.add.existing(objectiveIndicator);

    this.objectives.push(objectiveIndicator);

    this.add.existing(objectiveIndicator);
  }
}
