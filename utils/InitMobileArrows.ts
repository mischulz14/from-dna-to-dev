export default class InitMobileArrows {
  upButton: HTMLButtonElement | null;
  downButton: HTMLButtonElement | null;
  leftButton: HTMLButtonElement | null;
  rightButton: HTMLButtonElement | null;
  isUpButtonPressed: boolean;
  isDownButtonPressed: boolean;
  isLeftButtonPressed: boolean;
  isRightButtonPressed: boolean;

  constructor() {
    console.log('init mobile cursor');

    this.isUpButtonPressed = false;
    this.isDownButtonPressed = false;
    this.isLeftButtonPressed = false;
    this.isRightButtonPressed = false;

    this.initButtons();
    this.initPointerDownEventsForButtonBooleans();
    this.initPointerUpEventsForButtonBooleans();
  }

  getButtons() {
    return {
      up: {
        element: this.upButton,
        isDown: this.isUpButtonPressed,
      },
      down: {
        element: this.downButton,
        isDown: this.isDownButtonPressed,
      },
      left: {
        element: this.leftButton,
        isDown: this.isLeftButtonPressed,
      },
      right: {
        element: this.rightButton,
        isDown: this.isRightButtonPressed,
      },
    };
  }

  initPointerDownEventsForButtonBooleans() {
    const buttons = this.getButtons();
    const buttonsArray = [
      buttons.up.element,
      buttons.down.element,
      buttons.left.element,
      buttons.right.element,
    ];

    buttonsArray.forEach((button) => {
      button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.handlePointerDownEvent(button);
      });
    });
  }

  handlePointerDownEvent(button) {
    switch (button) {
      case this.upButton:
        this.isUpButtonPressed = true;
        console.log('this.isUpButtonPressed', this.isUpButtonPressed);
        break;
      case this.downButton:
        this.isDownButtonPressed = true;
        console.log('this.isDownButtonPressed', this.isDownButtonPressed);
        break;
      case this.leftButton:
        this.isLeftButtonPressed = true;
        console.log('this.isLeftButtonPressed', this.isLeftButtonPressed);
        break;
      case this.rightButton:
        this.isRightButtonPressed = true;
        console.log('this.isRightButtonPressed', this.isRightButtonPressed);
        break;
    }
  }

  initPointerUpEventsForButtonBooleans() {
    const buttons = this.getButtons();
    const buttonsArray = [
      buttons.up.element,
      buttons.down.element,
      buttons.left.element,
      buttons.right.element,
    ];

    buttonsArray.forEach((button) => {
      button.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.handlePointerUpEvent(button);
      });
    });
  }

  handlePointerUpEvent(button) {
    switch (button) {
      case this.upButton:
        this.isUpButtonPressed = false;
        break;
      case this.downButton:
        this.isDownButtonPressed = false;
        break;
      case this.leftButton:
        this.isLeftButtonPressed = false;
        break;
      case this.rightButton:
        this.isRightButtonPressed = false;
        break;
    }
  }

  initButtons() {
    this.upButton = document.querySelector('.mobile__button--up');
    this.downButton = document.querySelector('.mobile__button--down');
    this.leftButton = document.querySelector('.mobile__button--left');
    this.rightButton = document.querySelector('.mobile__button--right');

    console.log('this.upButton', this.upButton);
    if (
      !this.upButton ||
      !this.downButton ||
      !this.leftButton ||
      !this.rightButton
    ) {
      throw new Error('Could not find mobile arrow buttons.');
    }
  }
}
