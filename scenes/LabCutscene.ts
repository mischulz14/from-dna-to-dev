import DialogueController from '../dialogue/DialogueController';
import DialogueNode from '../dialogue/DialogueNode';

export default class LabCutscene extends Phaser.Scene {
  dialogueController: DialogueController;
  transitionRect: Phaser.GameObjects.Rectangle;

  constructor() {
    super({ key: 'LabCutscene' });
    const dialogue = [
      new DialogueNode('After a long day of work, you look out of the window.'),
      new DialogueNode(
        'All this battling with viruses, all of those nightshifts and sleep deprivation is certainly taking a toll on me...',
      ),
      new DialogueNode(
        'This was not how I imagined it to be when I was studying to become a scientist...',
      ),
      new DialogueNode(
        'Is this really what I want to do for the rest of my life?',
      ),
      new DialogueNode(
        'I should probably take a vacation and maybe I will feel better afterwards...',
      ),
    ];
    this.dialogueController = new DialogueController(this);
    this.dialogueController.initiateDialogueNodesArray(dialogue);
  }

  preload() {
    this.dialogueController.dialogueField.show();

    this.load.spritesheet('LabCutsceneSprite', 'assets/labCutsceneSprite.png', {
      frameWidth: 100,
      frameHeight: 50,
    });

    this.input.keyboard.on(
      'keydown-ENTER',
      this.dialogueController.playerPressesEnterEventListener,
    );

    this.load.image('labCutscene', 'assets/labCutscene.png');
  }

  create() {
    this.dialogueController.dialogueField.show();
    this.dialogueController.typeText();

    this.anims.create({
      key: 'labCutsceneSprite',
      frames: this.anims.generateFrameNumbers('LabCutsceneSprite', {
        start: 0,
        end: 7,
      }),
      frameRate: 4,
      repeat: -1,
    });

    const sprite = this.add.sprite(0, 0, 'LabCutsceneSprite').setOrigin(0, 0);
    sprite.setScale(8.2);

    // Start the animation
    sprite.play('labCutsceneSprite');

    this.events.on('dialogueEnded', () => {
      this.input.keyboard.removeAllListeners('keydown-ENTER');
      this.dialogueController.dialogueField.hide();
      this.cutsceneTransitionNormal();

      setTimeout(() => {
        this.scene.stop('LabCutscene');
        this.scene.start('LabScene');
      }, 2000);
    });

    // rectangle for transitions
    this.transitionRect = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
      .setOrigin(0, 0);
    this.transitionRect.setAlpha(0); // Start with 0 opacity
  }

  progressDialogue() {
    this.dialogueController.progressDialogue();
  }

  cutsceneTransitionNormal() {
    this.tweens.add({
      targets: this.transitionRect,
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 1000,
      repeat: 0,
    });
  }

  cutsceneTransitionBlinking() {
    this.tweens.add({
      targets: this.transitionRect,
      alpha: { from: 0, to: 1 },
      ease: 'Linear',
      duration: 300,
      yoyo: true,
      repeat: 3,
    });
  }
}
