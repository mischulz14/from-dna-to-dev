export const cutSceneSpriteNames = {
  wohnung: 'wohnungCutsceneIntroSprite',
  lab: 'LabCutsceneSprite',
  intro: 'introCutsceneSprite',
  dna: 'DNACutsceneSprite',
};

export const cutSceneAudioNames = {
  intro: 'IntroScene',
  wohnung: 'WohnungCutscene',
};

export const cutSceneAnimsInfo = {
  wohnung: {
    spriteHeight: 64,
    spriteWidth: 128,
    anims: [
      {
        name: 'layingAnScrollingAnim',
        start: 0,
        end: 11,
        repeat: -1,
      },
      {
        name: 'phonePingAnim',
        start: 12,
        end: 20,
        repeat: -1,
      },
      {
        name: 'lookingAtPhoneAnim',
        start: 21,
        end: 23,
      },
      {
        name: 'puttingPhoneDownAnim',
        start: 24,
        end: 32,
      },
      {
        name: 'laiaEntersAnim',
        start: 33,
        end: 36,
      },
      {
        name: 'whatsWrongAnim',
        start: 37,
        end: 44,
      },
    ],
  },
  dna: {
    spriteHeight: 48,
    spriteWidth: 128,
    anims: [
      {
        name: 'level1',
        start: 0,
        end: 21,
        repeat: 0,
      },
      {
        name: 'level2',
        start: 22,
        end: 41,
        repeat: 0,
      },
      {
        name: 'level3',
        start: 42,
        end: 61,
        repeat: 0,
      },
      {
        name: 'level4',
        start: 62,
        end: 81,
        repeat: 0,
      },
    ],
  },
};
