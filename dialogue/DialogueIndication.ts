export default class DialogueIndication {
  indication: HTMLDivElement;
  indicationKey: string;
  indicationText: string;

  constructor(indicationKey, indicationText) {
    this.indication = this.createSpeechIndication(
      indicationKey,
      indicationText,
    );
    this.indicationKey = indicationKey;
    this.indicationText = indicationText;
  }

  createSpeechIndication(indicationKey, indicationText) {
    const indication = document.createElement('div');

    indication.innerHTML = `
    <div class="dialogue-indicator">
      <div class="dialogue-indicator__key">
      ${indicationKey}
      </div>
      <div class="dialogue-indicator__text">
      ${indicationText}
      </div>
      </div>`;

    return indication;
  }
}
