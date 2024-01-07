export default class HealthBar extends Phaser.GameObjects.DOMElement {
  bar: HTMLElement;
  healthText: HTMLElement;
  health: number;
  initialHealth: number;
  leftPosition: number;
  bottomPosition: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    initialHealth: number,
    leftPosition: number,
    bottomPosition: number,
    className: string,
    name?: string,
  ) {
    super(scene, x, y, 'div');
    this.initialHealth = initialHealth;
    this.health = initialHealth;
    this.leftPosition = leftPosition;
    this.bottomPosition = bottomPosition;

    // set the health bar style using class properties
    this.setOrigin(0);
    this.setHTML(`
      <div class="${className}" style="position: relative; width: 150px; height: 30px; left: ${
      this.leftPosition
    }px; bottom: ${this.bottomPosition}px;">
        <div class="${className}-bar" style="background-color: rgb(233, 80, 80); width: 100%; height: 100%; border: 3px solid white;"></div>
      </div>
      <div class="name">${name ? name : ''}</div>
      <div class="outline"></div>
      <div class="${className}-text" style="font-size: 28px; position: absolute; left: ${
      this.leftPosition + 6
    }px; bottom: ${this.bottomPosition - 2}px; color: white;">${
      this.health
    }</div>
    `);

    // get the bar and health text elements
    this.bar = this.node.querySelector(`.${className}-bar`) as HTMLElement;
    this.healthText = this.node.querySelector(
      `.${className}-text`,
    ) as HTMLElement;

    const healthBar = this.node.querySelector(`.${className}`) as HTMLElement;
    healthBar.style.position = 'relative';

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
