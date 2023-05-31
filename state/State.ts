import Hero from '../gameObjects/Hero';

export class State {
  enter() {
    // This method is called when the state is entered
  }

  execute() {
    // This method is called on each update while the state is active
  }

  exit() {
    // This method is called when the state is exited
  }
}

export class StateMachine {
  currentState: State | null;

  constructor() {
    this.currentState = null;
  }

  transitionTo(state: State) {
    this.currentState?.exit();
    this.currentState = state;
    this.currentState.enter();
  }

  update() {
    this.currentState?.execute();
  }
}

export class WalkingState extends State {
  hero: Hero;

  constructor(hero: Hero) {
    super();
    this.hero = hero;
  }

  enter() {
    this.hero.anims.play('run-' + this.hero.lastDirection, true);
  }

  execute() {
    // Update the hero's velocity based on input
  }
}

export class IdleState extends State {
  hero: Hero;

  constructor(hero: Hero) {
    super();
    this.hero = hero;
  }

  enter() {
    this.hero.anims.play('idle-' + this.hero.lastDirection, true);
  }
}
