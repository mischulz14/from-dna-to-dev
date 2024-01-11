import FinalBattleScene from '../../scenes/FinalBattleScene';
import ExplanationState from './ExplanationState';
import MinionPhaseState from './MinionPhaseState';
import MinionPhaseState2 from './MinionPhaseState2';

export default class FinalBattleSceneStateMachine {
  state: ExplanationState;
  // | MinionPhaseState | MinionPhaseState2 | ExplanationState;
  initialState: ExplanationState;
  states: {
    minionPhase: MinionPhaseState;
    minionPhase2: MinionPhaseState2;
    explanation: ExplanationState;
  };
  constructor(scene: FinalBattleScene) {
    this.states = {
      minionPhase: new MinionPhaseState(scene),
      minionPhase2: new MinionPhaseState2(scene),
      explanation: new ExplanationState(scene),
    };

    this.state = this.states.explanation; // Set the initial state
    this.start();
  }

  start() {
    this.state = this.states.explanation;
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

  destroy() {
    // Reset the states and current state reference
    this.states = null;
    this.state = null;
  }
}
