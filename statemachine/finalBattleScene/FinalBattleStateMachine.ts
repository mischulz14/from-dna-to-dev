import FinalBattleScene from '../../scenes/FinalBattleScene';
import ExplanationState from './ExplanationState';
import MinionPhaseState from './MinionPhaseState';

export default class FinalBattleSceneStateMachine {
  state: ExplanationState;
  // | MinionPhaseState | MinionPhaseState2 | ExplanationState;
  initialState: ExplanationState;
  states: {
    intro: ExplanationState;
    minionPhase: MinionPhaseState;
    // minionPhase2: MinionPhaseState2;
    // explanation: ExplanationState;
  };
  constructor(scene: FinalBattleScene) {
    this.states = {
      intro: new ExplanationState(scene),
      minionPhase: new MinionPhaseState(scene),
      // minionPhase2: new MinionPhaseState2(scene),
      // explanation: new ExplanationState(scene),
    };

    this.state = this.states.intro; // Set the initial state
    this.start();
  }

  start() {
    this.state = this.states.intro;
  }

  update() {
    this.state && this.state.update();
  }

  switchState(state: string) {
    this.state = this.states[state];
    this.state && this.state.enter();
  }

  getState() {
    return this.state;
  }
}
