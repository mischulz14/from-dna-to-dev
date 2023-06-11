export default class AttackOptions {
  options: any[];
  optionsHTML: any;
  currentPosition: number;
  currentlySelectedOption: any;
  alreadyShownOptions: boolean;
  hasPlayerChosenAttack: boolean;
  scene: Phaser.Scene;
  gameEvents: Phaser.Events.EventEmitter;
  constructor(
    options: any[],
    scene: Phaser.Scene,
    gameEvents: Phaser.Events.EventEmitter,
  ) {
    this.currentPosition = 0;
    this.scene = scene;
    this.options = options;
    this.currentlySelectedOption = this.options[0];
    this.alreadyShownOptions = false;

    // Change the handlePickOptionWithArrowKeys method to emit an event when Enter is pressed
    window.addEventListener(
      'keydown',
      this.handlePickOptionWithArrowKeysAndEnter.bind(this),
    );

    this.hasPlayerChosenAttack = false;

    this.addHTMLOptionsToDialogueField();
  }

  handlePickOptionWithArrowKeysAndEnter(event) {
    // Remove active class from current option
    const optionsHTML = Array.from(
      document.querySelectorAll('.attack-options__option'),
    );
    // Use a switch statement to handle the arrow key inputs
    switch (event.key) {
      case 'ArrowDown':
        // Move down by adding 2 to the current position
        this.currentPosition = (this.currentPosition + 2) % optionsHTML.length;

        break;
      case 'ArrowUp':
        // Move up by subtracting 2 from the current position
        this.currentPosition =
          (this.currentPosition - 2 + optionsHTML.length) % optionsHTML.length;

        break;
      case 'ArrowRight':
        // Move right by adding 1 to the current position
        this.currentPosition = (this.currentPosition + 1) % optionsHTML.length;

        break;
      case 'ArrowLeft':
        // Move left by subtracting 1 from the current position
        this.currentPosition =
          (this.currentPosition - 1 + optionsHTML.length) % optionsHTML.length;

        break;
    }

    // Add active class to the new current option
    this.currentlySelectedOption = this.options[this.currentPosition];

    // @ts-ignore
    optionsHTML[this.currentPosition].focus();
  }

  addHTMLOptionsToDialogueField() {
    const optionsContainer = document.querySelector('.attack-options');

    this.options.forEach((option, index) => {
      const optionElement = document.createElement('button');
      optionElement.classList.add('attack-options__option');
      optionElement.textContent = option.text;
      optionsContainer.appendChild(optionElement);

      // add event listener for click
      optionElement.addEventListener('click', () => {
        this.currentlySelectedOption = option;

        // update current position
        this.currentPosition = index;

        optionElement.focus();
      });
    });
  }

  showOptions() {
    document.querySelector('.attack-options').classList.add('show-grid');

    // select currently selected option in the html structure and focus on it
    const optionsHTML = Array.from(
      document.querySelectorAll('.attack-options__option'),
    ) as HTMLElement[];

    optionsHTML[this.currentPosition].focus();
  }

  hideOptions() {
    document.querySelector('.attack-options').classList.remove('show-grid');
  }
}
