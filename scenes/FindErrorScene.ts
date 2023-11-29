import { interactiveGameObjectAnimInfo } from '../data/interactiveGameObjectAnimInfo';
import DialogueController from '../dialogue/DialogueController';
import DialogueNode from '../dialogue/DialogueNode';
import ErrorRectangle from '../gameObjects/ErrorRectangle';
import Hero from '../gameObjects/Hero';
import { fadeCameraIn, fadeCameraOut } from '../utils/sceneTransitions';

export default class FindErrorScene extends Phaser.Scene {
  dialogueController: DialogueController;
  hero: Hero;
  errorRectangles: ErrorRectangle[];
  foundErrorRectangles: string[];
  isOverlappingWithError: boolean;
  overlappingRect: ErrorRectangle | null;
  initiatedFadeOut: boolean;

  constructor() {
    super({ key: 'FindErrorScene' });
    this.errorRectangles = [];
    this.foundErrorRectangles = [];
    this.isOverlappingWithError = false;
    this.overlappingRect = null;
    this.initiatedFadeOut = false;
    const dialogue = [
      new DialogueNode(
        'Before you there are two pictures of a coffee machine.',
      ),
      new DialogueNode(
        'The left one functions as it should, but the right one has different errors.',
      ),
      new DialogueNode(
        'Find the errors by running over them and clicking E when standing on them.',
      ),
    ];
    this.dialogueController = new DialogueController(this);
    this.dialogueController.initiateDialogueNodesArray(dialogue, null, null);
  }

  preload() {
    this.dialogueController.dialogueField.show();
    this.dialogueController.isDialogueInCutscene = true;
    this.input.keyboard.on(
      'keydown-ENTER',
      this.dialogueController.playerPressesEnterEventListener,
    );
  }

  create() {
    this.addCoffeeMachines();
    this.createHero();
    this.createErrorRectangles();
    this.createOverlaps();
    this.dialogueController.dialogueField.show();
    this.dialogueController.typeText();

    // const sprite = this.add.sprite(0, 0, 'LabCutsceneSprite').setOrigin(0, 0);
    // sprite.setScale(8.2);

    // Start the animation
    // sprite.play('labCutsceneSprite');
    this.handleHasFoundAllErrors();
    // make event listener for the 'E' key
    this.input?.keyboard?.on('keydown-E', () => {
      this.events.emit('playerPressedE');
    });

    this.events.on('playerPressedE', () => {
      // console.log('player pressed E', this.isOverlappingWithError);

      const hasErrorAlreadyBeenFound = this.foundErrorRectangles.includes(
        this.overlappingRect.id,
      );

      if (!this.isOverlappingWithError || hasErrorAlreadyBeenFound) {
        return;
      }
      this.overlappingRect.revealRectangle();
      this.foundErrorRectangles.push(this.overlappingRect.id);
      // console.log('added error', this.foundErrorRectangles);
    });

    this.events.on('dialogueEnded', () => {
      // console.log('dialogue ended');
      this.hero.freeze = false;
      this.dialogueController.dialogueField.hide();
      this.dialogueController.isDialogueInCutscene = false;
    });

    fadeCameraIn(this, 3000);
  }

  update(time: number, delta: number): void {
    this.hero.update();
    if (this.initiatedFadeOut) {
      return;
    }
    const hasFoundAllErrors =
      this.foundErrorRectangles.length === this.errorRectangles.length;

    if (hasFoundAllErrors) {
      // console.log('has found all errors');
      this.events.emit('hasFoundAllErrors');
      return;
    }

    // Check if the hero is overlapping with any rectangle
    let isCurrentlyOverlapping = this.errorRectangles.some((rect) =>
      this.physics.world.overlap(this.hero, rect),
    );

    // If not overlapping with any rectangle, reset the flags and ID
    if (this.isOverlappingWithError && !isCurrentlyOverlapping) {
      this.isOverlappingWithError = false;
      this.overlappingRect = null;
      // console.log('Sprites not overlapping anymore');
    }

    // make for loop instead of forEach to be able to break out of it
  }

  progressDialogue() {
    this.dialogueController.progressDialogue();
  }

  createHero() {
    this.hero = new Hero(
      this,
      430,
      140,
      'laiaHero',
      {},
      'laia',
      { x: 15, y: 16 },
      { x: 9.2, y: 19.5 },
    )
      .setScale(2)
      .setDepth(4);
    this.hero.freeze = true;
    this.cameras.main.startFollow(this.hero);
  }

  createErrorRectangles() {
    const rect1 = new ErrorRectangle(this, 610, 90, 'empty', 'rect1').setDepth(
      3,
    );
    this.errorRectangles.push(rect1);
    const rect2 = new ErrorRectangle(this, 720, 40, 'empty', 'rect2').setDepth(
      3,
    );
    this.errorRectangles.push(rect2);

    const rect3 = new ErrorRectangle(this, 750, -90, 'empty', 'rect3').setDepth(
      3,
    );
    this.errorRectangles.push(rect3);

    const rect4 = new ErrorRectangle(this, 505, -30, 'empty', 'rect4').setDepth(
      3,
    );
    this.errorRectangles.push(rect4);

    const rect5 = new ErrorRectangle(this, 625, 160, 'empty', 'rect5').setDepth(
      3,
    );
    this.errorRectangles.push(rect5);
  }

  createOverlaps() {
    this.errorRectangles.forEach((errorRectangle) => {
      this.physics.add.overlap(this.hero, errorRectangle, () => {
        // console.log('overlap between:', this.hero.texture, errorRectangle.id);
        this.isOverlappingWithError = true;
        this.overlappingRect = errorRectangle;
      });
    });
  }

  addCoffeeMachines() {
    const coffeeMachineSprite = this.add.sprite(
      210,
      100,
      interactiveGameObjectAnimInfo.coffeeMachine.key,
    );
    coffeeMachineSprite.scale = 8;
    coffeeMachineSprite.setDepth(0);

    const coffeeMachineWithErrorsSprite = this.add.sprite(
      650,
      100,
      interactiveGameObjectAnimInfo.coffeeMachineWithErrors.key,
    );
    coffeeMachineWithErrorsSprite.scale = 8;
    coffeeMachineWithErrorsSprite.setDepth(0);
  }

  handleHasFoundAllErrors() {
    this.events.on('hasFoundAllErrors', () => {
      this.hero.freeze = true;
      this.hero.stateMachine.switchState('idle');
      this.initiatedFadeOut = true;
      // this.input.keyboard.removeAllListeners('keydown-ENTER');
      // this.dialogueController.dialogueField.hide();
      // this.dialogueController.isDialogueInCutscene = true;

      // this.cutsceneTransitionNormal();
      fadeCameraOut(this, 3000);

      setTimeout(() => {
        this.scene.bringToTop('UIScene');
        // @ts-ignore
        this.scene.get('UIScene').showObjectivesButton();
        this.scene.stop('FindErrorScene');
        this.scene.get('ApartmentScene').children.each((child) => {
          // @ts-ignore
          child.setVisible(true);
        });
        this.scene.resume('ApartmentScene');
      }, 3000);
    });
  }
}
