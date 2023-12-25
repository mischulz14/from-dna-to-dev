import FinalBattleHero from '../../gameObjects/FinalBattleHero';
import IdleCenterState from './IdleCenterState';
import IdleLeftState from './IdleLeftState';
import IdleRightState from './IdleRightState';

export default class FinalBattleHeroFiniteStateMachine {
  state: IdleLeftState | IdleCenterState | IdleRightState;
  idleState: IdleLeftState | IdleCenterState | IdleRightState;
  states: {
    idleLeft: IdleLeftState;
    idleCenter: IdleCenterState;
    idleRight: IdleRightState;
  };
  constructor(hero: FinalBattleHero) {
    this.states = {
      idleLeft: new IdleLeftState(hero),
      idleCenter: new IdleCenterState(hero),
      idleRight: new IdleRightState(hero),
    };
    this.idleState = new IdleCenterState(hero);
    this.start();
  }

  start() {
    this.state = this.idleState;
  }

  update() {
    this.state.update();
  }

  switchState(state: string) {
    this.state = this.states[state];
    this.state.enter();
  }

  getState() {
    return this.state;
  }
}
