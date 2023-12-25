export const finalBattleSpriteInfos = {
  michi: {
    texture: 'final',
    spriteWidth: 50,
    spriteHeight: 50,
    src: '../assets/bootcamp-hero.png',
    animations: [
      {
        name: 'final-idle-left',
        start: 0,
        end: 4,
        frameRate: 7,
        repeat: -1,
      },
      {
        name: 'final-idle-right',
        start: 5,
        end: 9,
        frameRate: 7,
        repeat: -1,
      },
      {
        name: 'final-idle-center',
        start: 35,
        end: 39,
        frameRate: 7,
        repeat: -1,
      },
    ],
  },
  arrows: {
    texture: 'arrows',
    spriteWidth: 32,
    spriteHeight: 32,
    src: '../assets/arrows.png',
    animations: [
      {
        name: 'arrow-animation',
        start: 0,
        end: 5,
        frameRate: 6,
        repeat: -1,
      },
    ],
  },

  mouse: {
    texture: 'mouse',
    spriteWidth: 32,
    spriteHeight: 32,
    src: '../assets/mouse.png',
    animations: [
      {
        name: 'mouse-animation',
        start: 0,
        end: 6,
        frameRate: 6,
        repeat: -1,
      },
    ],
  },
};
