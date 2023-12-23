export default class SceneOverlay {
  topText: number | string;
  bottomText: string;
  constructor(config: { topText: number | string; bottomText: string }) {
    this.topText = config.topText;
    this.bottomText = config.bottomText;
  }

  createHTML() {
    const sceneOverlay = document.createElement('div');
    sceneOverlay.classList.add('scene-overlay');
    sceneOverlay.innerHTML = `
      <div class="scene-overlay">
        <div class="scene-overlay__title"> ${this.topText}</div>
      </div>
    `;
    document.getElementById('game')?.appendChild(sceneOverlay);

    setTimeout(() => {
      const bottomTextElement = document.createElement('div');
      bottomTextElement.classList.add('scene-overlay__name');
      bottomTextElement.textContent = this.bottomText;

      (sceneOverlay.querySelector('.scene-overlay') as HTMLElement).appendChild(
        bottomTextElement,
      );
      (bottomTextElement as HTMLElement).style.opacity = '1';
      (
        sceneOverlay.querySelector('.scene-overlay__title') as HTMLElement
      ).style.transform = 'translateY(-50%)';
    }, 3000);

    setTimeout(() => {
      sceneOverlay.classList.add('fade-out');

      setTimeout(() => {
        sceneOverlay.remove();
      }, 2000); // The duration of the fade-out transition
    }, 6000);
  }
}
