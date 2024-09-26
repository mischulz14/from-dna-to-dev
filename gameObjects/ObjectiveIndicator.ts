import * as Phaser from 'phaser';

import Hero from './Hero';

export default class ObjectiveIndicator extends Phaser.GameObjects.Container {
  checkboxEmptyCircle: any;
  checkboxCheckedCircle: any;
  textBesidesCheckbox: Phaser.GameObjects.DOMElement;
  checkedCondition: string;
  checkboxId: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    checkedCondition: string,
    textBesidesCheckbox: string,
    checkboxId: number,
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.checkedCondition = checkedCondition;

    this.checkboxId = checkboxId;

    // Add text besides checkbox as dom element
    this.textBesidesCheckbox = this.scene.add
      .dom(
        30,
        -8,
        'div',
        `color: #000; background-color: #fff; padding:6px; box-shadow: -6px -6px 0px rgba(0, 0, 0); border:1px solid black; font-size: 20px; font-family: Rainyhearts;`,
        textBesidesCheckbox,
      )
      .setOrigin(0, 0)
      .setClassName(`checkbox-text-${this.checkboxId}`);

    // Add checkbox images
    this.checkboxEmptyCircle = this.scene.add.circle(0, 0, 10, 0xffffff);
    // this.checkboxCheckedCircle = this.scene.add.circle(0, 0, 10, 0xffffff);
    // this.checkboxCheckedCircle.setVisible(false);

    this.add([this.checkboxEmptyCircle, this.textBesidesCheckbox]);
  }

  update(hero: Hero) {
    if (hero.booleanConditions[this.checkedCondition]) {
      const checkboxText = document.querySelector(
        `.checkbox-text-${this.checkboxId}`,
      );

      if (checkboxText) {
        checkboxText.classList.add('line-through');
      }
    }
  }
}
