export default class HealthBar extends Phaser.GameObjects.DOMElement {
  bar: HTMLElement;
  healthText: HTMLElement;
  health: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    initialHealth: number,
  ) {
    super(scene, x, y, 'div');

    this.health = initialHealth;

    // set the health bar style
    this.setOrigin(0);
    this.setClassName('health-bar');
    this.setHTML(`
      <div class="bg">
        <div class="bar"></div>
      </div>
      <div class="outline"></div>
      <div class="health-text">${this.health}</div>
    `);

    // get the bar and health text elements
    this.bar = this.node.querySelector('.bar') as HTMLElement;
    this.healthText = this.node.querySelector('.health-text') as HTMLElement;

    scene.add.existing(this);
  }

  decrease(amount: number) {
    if (this.health === 0) {
      return;
    }
    const timer = this.scene.time.addEvent({
      delay: 50, // 50ms delay between each tick
      repeat: amount - 1, // subtract 1 to account for the initial run
      callback: () => {
        if (this.health === 0) {
          timer.destroy(); // destroy the timer if health is 0
          return;
        }
        // reduce health bar width and health points by 1 each tick
        const currentWidth = parseFloat(this.bar.style.width || '100');
        this.bar.style.width = `${currentWidth - 1}%`;
        this.health--;

        // update health text
        this.healthText.innerText = `${this.health}`;

        // ensure health bar and health points don't go negative
        if (parseFloat(this.bar.style.width) < 0) {
          this.bar.style.width = '0%';
          this.healthText.innerText = '0';
        }
      },
    });
  }
}
