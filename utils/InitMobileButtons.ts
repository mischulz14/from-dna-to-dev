export default class InitMobileButtons {
  eButton: HTMLButtonElement | null;
  enterButton: HTMLButtonElement | null;
  isEButtonPressed: boolean;
  isEnterButtonPressed: boolean;

  constructor() {
    console.log('init mobile buttons');

    this.isEButtonPressed = false;
    this.isEnterButtonPressed = false;

    this.initButtons();
    this.initPointerDownEventsForButtonBooleans();
    this.initPointerUpEventsForButtonBooleans();
    console.log('enter button', this.enterButton);
  }

  getButtons() {
    return {
      e: {
        element: this.eButton,
        isDown: this.isEButtonPressed,
      },
      enter: {
        element: this.enterButton,
        isDown: this.isEnterButtonPressed,
      },
    };
  }

  initPointerDownEventsForButtonBooleans() {
    const buttons = this.getButtons();
    const buttonsArray = [buttons.e.element, buttons.enter.element];

    buttonsArray.forEach((button) => {
      button?.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.handlePointerDownEvent(button);
      });
    });
  }

  handlePointerDownEvent(button) {
    switch (button) {
      case this.eButton:
        this.isEButtonPressed = true;
      case this.enterButton:
        this.isEnterButtonPressed = true;
        break;
    }
  }

  initPointerUpEventsForButtonBooleans() {
    const buttons = this.getButtons();
    const buttonsArray = [buttons.e.element, buttons.enter.element];

    buttonsArray.forEach((button) => {
      button?.addEventListener('pointerup', (e) => {
        e.preventDefault();
        this.handlePointerUpEvent(button);
      });
    });
  }

  handlePointerUpEvent(button) {
    switch (button) {
      case this.eButton:
        this.isEButtonPressed = false;
      case this.enterButton:
        this.isEnterButtonPressed = false;
        break;
    }
  }

  initButtons() {
    this.eButton = document.querySelector('.mobile__button--e');
    this.enterButton = document.querySelector('.mobile__button--enter');

    if (!this.eButton || !this.enterButton) {
      throw new Error('Could not find mobile e and enter buttons.');
    }
  }
}
