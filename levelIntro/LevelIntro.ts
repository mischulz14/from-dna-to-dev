export default class LevelIntro {
  levelNr: number;
  levelName: string;
  constructor(config: { levelNr: number; levelName: string }) {
    this.levelNr = config.levelNr;
    this.levelName = config.levelName;
  }

  createHTML() {
    const levelIntro = document.createElement('div');
    levelIntro.classList.add('level-intro');
    levelIntro.innerHTML = `
      <div class="level-intro">
        <div class="level-intro__title"> ${this.levelNr}</div>
      </div>
    `;
    document.body.appendChild(levelIntro);

    setTimeout(() => {
      const levelNameElement = document.createElement('div');
      levelNameElement.classList.add('level-intro__name');
      levelNameElement.textContent = this.levelName;

      (levelIntro.querySelector('.level-intro') as HTMLElement).appendChild(
        levelNameElement,
      );

      // Add this line to apply the opacity transition to the level name
      (levelNameElement as HTMLElement).style.opacity = '1';

      // Add this line to apply the transform transition to the level title
      (
        levelIntro.querySelector('.level-intro__title') as HTMLElement
      ).style.transform = 'translateY(-50%)';
    }, 3000);

    setTimeout(() => {
      levelIntro.classList.add('fade-out');

      setTimeout(() => {
        levelIntro.remove();
      }, 2000); // The duration of the fade-out transition
    }, 6000);
  }
}
