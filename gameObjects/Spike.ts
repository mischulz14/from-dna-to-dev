import MinionHealthBar from '../battle/MinionHealthBar';
import Enemy from './Enemy';

export default class Spike extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.shadow = scene.add.graphics({
      fillStyle: { color: 0x000000, alpha: 0.1 },
    });
    this.damage = 10;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(20, 35);

    this.body.immovable = true;
  }

  update() {
    if (this === undefined) return;
  }
}
