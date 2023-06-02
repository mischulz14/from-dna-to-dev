/*
  DialogueNode class
  This class represents a node in a dialogue tree. It contains the text that is shown to the player and the options that the player can choose from.
  The options are represented as an array of objects. Each object has the following properties:
  - text: the text that is shown to the player
  - nextNodeIndex: the index of the next node in the dialogue tree
  - endDialogue: a boolean that indicates whether the dialogue ends after the player chooses this option
  */

export default class DialogueNode {
  text: string;
  options: {
    text: string;
    nextNodeIndex: number;
    endDialogue?: boolean;
  }[];
  isCompleted: boolean;
  currentlySelectedOption: {
    text: string;
    nextNodeIndex: number;
    endDialogue?: boolean;
  };
  alreadyShownOptions: boolean;

  constructor(
    text: string,
    options?: {
      text: string;
      nextNodeIndex: number;
      endDialogue?: boolean;
    }[],
  ) {
    this.text = text;
    this.options = options || [];
    this.isCompleted = false;
    this.currentlySelectedOption = null;
    this.alreadyShownOptions = false;

    // this.chooseOptionWithUpAndDownArrowsEventListener();
  }

  showOptions() {
    if (this.options[0].text !== '') {
      document.querySelector('.dialogue-field__options').classList.add('shown');

      // focus on first option
      if (this.alreadyShownOptions) return;
      this.addHTMLOptionsToDialogueField();
      const firstOption = document.querySelector(
        '.dialogue-field__option',
      ) as HTMLInputElement;

      firstOption.focus();

      this.alreadyShownOptions = true;
    }
    console.log('no text');
  }

  hideOptions() {
    document
      .querySelector('.dialogue-field__options')
      .classList.remove('shown');
    this.removeHTMLOptionsFromDialogueField();
    this.currentlySelectedOption = null;
  }

  addHTMLOptionsToDialogueField() {
    const optionsContainer = document.querySelector('.dialogue-field__options');

    this.options.forEach((option) => {
      const optionElement = document.createElement('button');
      optionElement.classList.add('dialogue-field__option');
      optionElement.textContent = option.text;
      optionElement.tabIndex = 0;
      optionsContainer.appendChild(optionElement);

      // Create a copy of option because otherwise the event listener will always use the last option in the loop (because of closure)
      const optionCopy = { ...option };

      // add event listener for click
      optionElement.addEventListener('click', () => {
        this.currentlySelectedOption = optionCopy;
        optionElement.focus();
      });

      // add keydown event listener to each option
      this.addSelectNextOptionWithArrowKeysEventListener(
        optionElement,
        optionCopy,
      );
    });
  }

  removeHTMLOptionsFromDialogueField() {
    const optionsContainer = document.querySelector('.dialogue-field__options');
    optionsContainer.innerHTML = '';
  }

  addSelectNextOptionWithArrowKeysEventListener(option, optionCopy) {
    option.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        const nextOption = document.activeElement?.nextElementSibling;
        if (nextOption) {
          (nextOption as HTMLInputElement).focus();
          this.currentlySelectedOption = optionCopy;
        }
      }
      if (event.key === 'ArrowUp') {
        const previousOption = document.activeElement?.previousElementSibling;
        if (previousOption) {
          (previousOption as HTMLInputElement).focus();
          this.currentlySelectedOption = optionCopy;
        }
      }
      if (event.key === 'Enter') {
        this.currentlySelectedOption = optionCopy;
      }
    });
  }
}
