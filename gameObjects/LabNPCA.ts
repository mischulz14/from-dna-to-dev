import DialogueNode from '../dialogue/DialogueNode';
import LabHero from './LabHero';
import LabNPC from './LabNPC';

export default class LabNPCA extends LabNPC {
  hasPlayerKey: boolean;
  talkingCount: number;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    dialogueIndictaorKey: string,
    dialogueIndictaorText: string,
  ) {
    super(scene, x, y, texture, dialogueIndictaorKey, dialogueIndictaorText);
    this.scene = scene;
    console.log('this.scene', this.scene);
    this.dialogueNodes = this.createDialogueNodes();
    this.body?.setSize(17, 15);
    this.body?.setOffset(8, 22);
    this.talkingCount = 0;

    // make body immovable so it doesn't get pushed around upon collision
    this.body!.immovable = true;
  }

  update(): void {
    this.checkIfPlayerHasKey();
  }

  updateDialogueNodeBasedOnPlayerState = (player: LabHero) => {};

  createDialogueNodes = (): DialogueNode[] => {
    const dialogueNodes = [
      new DialogueNode('Hi! I am LabNPCA!'),
      new DialogueNode('I am a test NPC!'),
    ];

    return dialogueNodes;
  };

  checkIfPlayerHasKey = () => {
    // @ts-ignore
    const player = this.scene.hero as LabHero;
    if (player.hasKey) {
      this.dialogueNodes = [
        new DialogueNode('You have the key!'),
        new DialogueNode('You can now open the door!'),
      ];
    }
  };

  incrementTalkingCount = () => {
    this.talkingCount += 1;
  };

  moveAnotherNPC = () => {
    // @ts-ignore
    const npcB = this.scene.children.list[8] as LabNPC;
    // npcB.x = 200;
  };

  // triggerEventWhenDialogueEnds = (scene: any) => {
  //   // this.moveAnotherNPC();
  //   // @ts-ignore
  //   // this.incrementTalkingCount();
  //   // if (this.talkingCount === 1) {
  //   //   this.dialogueNodes = [new DialogueNode('You talked once!')];
  //   // }
  //   // if (this.talkingCount === 2) {
  //   //   this.dialogueNodes = [new DialogueNode('You talked twice!')];
  //   // }
  //   // if (this.talkingCount === 3) {
  //   //   this.dialogueNodes = [new DialogueNode('This is too much')];
  //   // }
  //   // if (this.talkingCount >= 4) {
  //   //   this.dialogueNodes = [new DialogueNode('I am done talking')];
  //   // }
  // };
}
