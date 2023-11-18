import LabHero from '../gameObjects/LabHero';
import Laia from '../gameObjects/Laia';
import IdleState from './IdleState';
import RunState from './RunState';

export default class PlayerFiniteStateMachine {
  state: IdleState | RunState;
  idleState: IdleState;
  states: {
    idle: IdleState;
    run: RunState;
  };
  constructor(hero: LabHero | Laia) {
    this.idleState = new IdleState(hero);
    this.start();
    this.states = {
      idle: new IdleState(hero),
      run: new RunState(hero),
    };
  }

  start() {
    this.state = this.idleState;
  }

  update() {
    this.state.update();
  }

  switchState(state: string) {
    this.state = this.states[state];
    this.state ?? this.state.enter();
  }

  getState() {
    return this.state;
  }
}
