import { isMobileScreen } from '../src/app';

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
  finalBoss: {
    texture: 'finalBoss',
    spriteWidth: 64,
    spriteHeight: 64,
    src: isMobileScreen
      ? '../assets/finalBossCompressed.png'
      : '../assets/finalBoss.png',
    animations: [
      {
        name: 'finalBoss-idle',
        start: 0,
        end: 3,
        frameRate: 6,
        repeat: -1,
      },
      {
        name: 'finalBoss-punch-left',
        start: 4,
        end: 14,
        frameRate: 7,
        repeat: 0,
      },
      {
        name: 'finalBoss-punch-right',
        start: 15,
        end: 25,
        frameRate: 7,
        repeat: 0,
      },
      {
        name: 'finalBoss-punch-middle',
        start: 37,
        end: 46,
        frameRate: 7,
        repeat: 0,
      },
      {
        name: 'finalBoss-punch-both',
        start: 26,
        end: 36,
        frameRate: 7,
        repeat: 0,
      },
      {
        name: 'finalBoss-punch-middle-left',
        start: 47,
        end: 57,
        frameRate: 7,
        repeat: 0,
      },
      {
        name: 'finalBoss-punch-middle-right',
        start: 58,
        end: 68,
        frameRate: 7,
        repeat: 0,
      },
    ],
  },
  postgresElephant: {
    texture: 'postgresElephant',
    spriteWidth: 32,
    spriteHeight: 32,
    src: '../assets/postgreselephant.png',
    animations: [
      {
        name: 'postgres-run',
        start: 0,
        end: 5,
        frameRate: 6,
        repeat: -1,
      },
    ],
  },
};
