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

    this.chooseOptionWithUpAndDownArrowsEventListener();
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
  }

  hideOptions() {
    document
      .querySelector('.dialogue-field__options')
      .classList.remove('shown');
    this.removeHTMLOptionsFromDialogueField();
    this.currentlySelectedOption = null;
  }

  chooseOptionWithUpAndDownArrowsEventListener() {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        const nextOption = document.activeElement?.nextElementSibling;
        if (nextOption) {
          (nextOption as HTMLInputElement).focus();
        }
      }
      if (event.key === 'ArrowUp') {
        const previousOption = document.activeElement?.previousElementSibling;
        if (previousOption) {
          (previousOption as HTMLInputElement).focus();
        }
      }
    });
  }

  addHTMLOptionsToDialogueField() {
    const optionsContainer = document.querySelector('.dialogue-field__options');

    // zindex
    this.options.forEach((option) => {
      const optionElement = document.createElement('button');
      // optionElement.type = 'button';
      optionElement.classList.add('dialogue-field__option');
      optionElement.textContent = option.text;
      optionElement.tabIndex = 0;
      optionsContainer.appendChild(optionElement);

      // add event listener for click
      optionElement.addEventListener('click', () => {
        this.currentlySelectedOption = option;
        // focus on that option
        optionElement.focus();
      });

      // add event listener for focus
      optionElement.addEventListener('focus', () => {
        this.currentlySelectedOption = option;
        optionElement.focus();
      });
    });
  }

  removeHTMLOptionsFromDialogueField() {
    const optionsContainer = document.querySelector('.dialogue-field__options');
    optionsContainer.innerHTML = '';
  }
}
