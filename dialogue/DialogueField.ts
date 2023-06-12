import * as Phaser from 'phaser';

export default class DialogueField {
  text: string;
  dialogueField: HTMLDivElement;
  constructor() {
    this.dialogueField = this.createHTML();
  }

  createHTML() {
    const canvas = document.getElementById('game');
    const dialogueField = document.createElement('div');
    dialogueField.classList.add('dialogue-field');
    dialogueField.innerHTML = `
      <div class="dialogue-field__content">
        <div class="dialogue-field__text"></div>
      </div>
    `;
    canvas.appendChild(dialogueField);

    return dialogueField;
  }

  show() {
    const dialogueField = document.querySelector('.dialogue-field');
    dialogueField?.classList.add('shown');
  }

  hide() {
    const dialogueField = document.querySelectorAll('.dialogue-field');
    dialogueField?.forEach((field) => field.classList.remove('shown'));
  }

  setText(text: string) {
    const dialogueFieldText = document.querySelector(
      '.dialogue-field__text',
    ) as HTMLElement;
    dialogueFieldText.textContent = text;
  }
}
