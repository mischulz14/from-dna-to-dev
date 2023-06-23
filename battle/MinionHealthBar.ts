export default class MinionHealthBarHealthBar extends Phaser.GameObjects
  .DOMElement {
  bar: HTMLElement;
  healthText: HTMLElement;
  health: number;
  initialHealth: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    initialHealth: number,
  ) {
    super(scene, x, y, 'div');
    this.initialHealth = initialHealth;
    this.health = initialHealth;

    // set the health bar style
    this.setOrigin(0);
    this.setClassName('minion-health-bar');
    this.setHTML(`
      <div class="bg">
        <div class="bar"></div>
      </div>
      <div class="outline"></div>

    `);

    // get the bar and health text elements
    this.bar = this.node.querySelector('.bar') as HTMLElement;
    this.healthText = this.node.querySelector('.health-text') as HTMLElement;

    scene.add.existing(this);
    this.setVisible(false);
  }

  decrease(amount: number) {
    if (this.health === 0) {
      return;
    }

    const healthPercentageToRemove = (100 / this.health) * amount;

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

        // calculate the new width based on the updated health percentage
        const newWidth = (this.health / this.initialHealth) * 100;
        this.bar.style.width = `${newWidth}%`;

        // update health text

        // ensure health bar and health points don't go negative
        if (newWidth < 0) {
          this.bar.style.width = '0%';
        }
      },
    });
  }

  showHealthBar() {
    this.setVisible(true);
  }

  hideHealthBar() {
    this.setVisible(false);
  }
}
