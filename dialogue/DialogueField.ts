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
    dialogueField.style.display = 'none';
    dialogueField.style.position = 'absolute';
    dialogueField.style.bottom = '0';
    dialogueField.style.left = '0';
    dialogueField.style.width = 725 + 'px';
    dialogueField.style.height = '50px';
    dialogueField.style.fontWeight = 'bold';
    dialogueField.style.fontSize = '20px';
    dialogueField.style.letterSpacing = '2px';
    dialogueField.style.backgroundColor = '#efefef';
    dialogueField.style.borderRadius = '10px';
    dialogueField.style.border = '3px solid black';
    dialogueField.style.padding = '10px 10px';
    dialogueField.style.alignItems = 'start';
    dialogueField.style.justifyContent = 'start';
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
