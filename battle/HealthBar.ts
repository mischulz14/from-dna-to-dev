export default class HealthBar extends Phaser.GameObjects.DOMElement {
  bar: HTMLElement;
  healthText: HTMLElement;
  health: number;
  initialHealth: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    initialHealth: number,
    className: string,
    name?: string,
  ) {
    super(scene, x, y, 'div');
    this.initialHealth = initialHealth;
    this.health = initialHealth;

    // set the health bar style
    this.setOrigin(0);
    this.setClassName(className);
    this.setHTML(`
      <div class="bg">
        <div class="bar"></div>
      </div>
      <div class="name">${name ? name : ''}</div>
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
      delay: 25, // 50ms delay between each tick
      repeat: amount - 1, // subtract 1 to account for the initial run
      callback: () => {
        if (this.health === 0) {
          timer.destroy(); // destroy the timer if health is 0
          return;
        }

        // reduce health points by amount each tick
        this.health--;
        this.healthText.innerHTML = `${this.health}`;

        // calculate the new width based on the updated health percentage
        const newWidth = (this.health / this.initialHealth) * 100;
        this.bar.style.width = `${newWidth}%`;

        // update health text

        // ensure health bar and health points don't go negative
        if (newWidth < 0) {
          this.bar.style.width = '0%';
          this.healthText.innerHTML = '0';
        }
      },
    });
  }

  hideHealthBar() {
    this.setVisible(false);
  }
}
