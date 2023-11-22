// import * as Phaser from 'phaser';

// import PlayerFiniteStateMachine from '../statemachine/PlayerFiniteStateMachine';
// import Hero from './Hero';

// export default class Laia extends Hero implements Phaser.Physics.Arcade.Sprite {
//   cursors: Phaser.Types.Input.Keyboard.CursorKeys;
//   lastDirection: string;
//   speed: number;
//   freeze: boolean;
//   heroBounds: Phaser.Geom.Rectangle;
//   stateMachine: PlayerFiniteStateMachine;
//   animPrefix: string;
//   isTested: boolean = false;

//   constructor(
//     scene: Phaser.Scene,
//     x: number,
//     y: number,
//     texture: string,
//     frame?: string | number,
//   ) {
//     super(scene, x, y, texture, {}, frame);
//     // this.stateMachine = new StateMachine();
//     this.freeze = false;
//     this.heroBounds = this.getBounds();
//     this.animPrefix = 'laia';
//     this.stateMachine = new PlayerFiniteStateMachine(this);
//     // Add this instance to the scene's display list and update list

//     scene.add.existing(this);
//     scene.physics.add.existing(this);

//     this.body.setSize(15, 16);
//     this.body.setOffset(9.2, 19.5);

//     // Initialize the cursors object and the lastDirection string
//     this.cursors = this.scene.input.keyboard.createCursorKeys();
//     this.lastDirection = 'down';
//     this.speed = 200;
//   }
// }
