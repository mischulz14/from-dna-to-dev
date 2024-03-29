/**
 * Singleton class that manages the audio pausing or resuming for the entire game.
 * it is initialized in app.ts where it gets passed the game object, which means that it persists scene changes.
 * this in combination with the html button in the DOM allows us to pause and resume the audio at will, no matter which scene we are in.
 */

export default class GlobalAudioManager {
  private static instance: GlobalAudioManager;
  private game: Phaser.Game | null = null;
  public isSoundPaused: boolean = false;
  private audioButton: HTMLElement | null =
    document.getElementById('audio-button');
  private audioOnSvg: string;
  public audioContext: AudioContext = new AudioContext();
  private audioOffSvg: string;
  private currentSound: string;

  private constructor() {}

  public static getInstance(): GlobalAudioManager {
    if (!GlobalAudioManager.instance) {
      GlobalAudioManager.instance = new GlobalAudioManager();
    }
    return GlobalAudioManager.instance;
  }

  public initialize(game: Phaser.Game): void {
    this.game = game;
    this.isSoundPaused = true;
    this.currentSound = '';
    // this.game.sound.resumeAll();
  }

  public pauseAll(): void {
    if (this.game) {
      this.isSoundPaused = true;
      this.game.sound.pauseAll();
    }
  }

  public resumeAll(): void {
    if (this.game) {
      this.game.sound.resumeAll();
      this.isSoundPaused = false;
    }
  }

  public switchSoundTo(soundKey: string): void {
    if (this.game) {
      this.game.sound.stopAll();
      this.currentSound = soundKey;
      this.isSoundPaused
        ? null
        : this.game.sound.play(soundKey, { loop: true });
    }
  }

  public toggleSound(): void {
    this.isSoundPaused = !this.isSoundPaused;

    this.audioButton = document.getElementById('audio-button');

    this.audioOffSvg =
      '<svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" stroke-width="1.5" class="w-6 h-6"><path  stroke="black" stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" /></svg>';

    this.audioOnSvg =
      ' <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"/></svg>';

    if (this.isSoundPaused) {
      console.log('pause');
      this.audioButton!.innerHTML = this.audioOffSvg;
      this.pauseAll();
    }
    if (!this.isSoundPaused) {
      console.log('resume');
      this.audioButton!.innerHTML = this.audioOnSvg;
      this.game.sound.play(this.currentSound, { loop: true });
    }
  }
}
