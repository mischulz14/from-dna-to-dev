export const cutSceneSpriteNames = {
  wohnung: 'wohnungCutsceneIntroSprite',
  lab: 'LabCutsceneSprite',
  intro: 'introCutsceneSprite',
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
        repeat: 2,
      },
      {
        name: 'phonePingAnim',
        start: 12,
        end: 20,
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
};
