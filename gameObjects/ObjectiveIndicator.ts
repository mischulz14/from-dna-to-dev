import * as Phaser from 'phaser';

export default class ObjectiveIndicator extends Phaser.GameObjects.Container {
  checkboxEmptyImage: Phaser.GameObjects.Image;
  checkboxCheckedImage: Phaser.GameObjects.Image;
  textBesidesCheckbox: Phaser.GameObjects.Text;
  checkedCondition: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    checkedCondition: string,
    textBesidesCheckbox: string,
    checkBoxEmptyKey: string,
    checkBoxCheckedKey: string,
  ) {
    super(scene, x, y);
    scene.add.existing(this);

    this.checkedCondition = checkedCondition;

    // add rectangles to make it more readable

    // Add text besides checkbox
    this.textBesidesCheckbox = this.scene.add.text(
      20,
      -8,
      textBesidesCheckbox,
      {
        fontFamily: 'Minecraft',
        fontSize: 16,
        color: '#000000',
      },
    );

    // Add checkbox images
    this.checkboxEmptyImage = this.scene.add.image(0, 0, checkBoxEmptyKey);
    this.checkboxCheckedImage = this.scene.add.image(0, 0, checkBoxCheckedKey);
    this.checkboxCheckedImage.setVisible(false);

    this.add([
      this.checkboxEmptyImage,
      this.checkboxCheckedImage,
      this.textBesidesCheckbox,
    ]);
  }

  update(hero: any) {
    if (hero[this.checkedCondition]) {
      this.checkboxEmptyImage.setVisible(false);
      this.checkboxCheckedImage.setVisible(true);
    } else {
      this.checkboxEmptyImage.setVisible(true);
      this.checkboxCheckedImage.setVisible(false);
    }
  }
}
