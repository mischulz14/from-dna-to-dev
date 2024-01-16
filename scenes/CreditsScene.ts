import Phaser from 'phaser';

import { isMobileScreen } from '../src/app';

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super('CreditsScene');
  }

  create() {
    let startY = this.cameras.main.height;

    let graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 0.7);
    graphics.fillRect(0, 0, this.scale.width, this.scale.height);

    const html = `
    <div style="font-size: 1.6rem; font-family: Rainyhearts; color: #fff; text-align: center; width: 100%">
      <p>
       Art by Michael Schulz
      </p>
      <p>
       Animations by Michael Schulz
      </p>
      <p>
        Programming by Michael Schulz
      </p>
      <p>
        Game Design by Michael Schulz
      </p>
      <p>
        Battle Inspiration:
        <p> Pokemon </p>
        <p> Heartbound </p>
      </p>
      <p>
        Music by FabienC@RustedMusicStudio
      </p>
    </div>
    `;

    const element = this.add
      .dom(this.cameras.main.centerX / 2 + 40, startY)
      .createFromHTML(html)
      .setOrigin(0);

    this.tweens.add({
      targets: element,
      y: 20,
      ease: 'Linear',
      duration: 10000,
      onComplete: () => {
        const text = this.add
          .text(
            330,
            460,
            isMobileScreen ? 'Tap to restart' : 'Press Space to restart',
            {
              fontSize: '1.3rem',
              fontFamily: 'Rainyhearts',
              color: '#fff',
            },
          )
          .setAlpha(0);

        this.tweens.add({
          targets: text,
          alpha: 1,
          duration: 1000,
          ease: 'Linear',
          repeat: -1,
          yoyo: true,
        });

        this.input.keyboard.on('keydown-SPACE', () => {
          window.location.reload();
        });

        this.input.on('pointerdown', () => {
          if (!isMobileScreen) return;
          window.location.reload();
        });
      },
    });
  }
}
