import * as Phaser from 'phaser';

export default class TestEnemy extends Phaser.Physics.Arcade.Sprite {
  target: Phaser.Physics.Arcade.Sprite;
  speed: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    target: Phaser.Physics.Arcade.Sprite,
  ) {
    super(scene, x, y, null); // We will use a null texture for a simple rectangle representation

    // Add this instance to the scene's display list and update list
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(20, 20); // Size of the rectangle

    // Set target (hero) and movement speed
    this.target = target;
    this.speed = 50;
  }

  update() {
    // Simple AI to move towards the target (hero)
    const direction = new Phaser.Math.Vector2(
      this.target.x - this.x,
      this.target.y - this.y,
    ).normalize();
    this.setVelocity(direction.x * this.speed, direction.y * this.speed);
  }

  // Draw a rectangle for visual representation of the enemy
  preRender() {
    this.clear();
    this.fillStyle(0xff0000); // Set rectangle color to red
    this.fillRect(-10, -10, 20, 20); // Draw rectangle centered on the sprite's position
  }
}
