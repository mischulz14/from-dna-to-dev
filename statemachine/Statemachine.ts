export default class StateMachine {
  private initialState: string;
  private currentState: string;
  private blocked: boolean;
  private possibleStates: any;

  constructor(initialState: string, possibleStates: any) {
    this.initialState = initialState;
    this.currentState = initialState;
    this.blocked = false;
    this.possibleStates = possibleStates;
  }

  transition(event: string) {
    if (this.blocked) return;

    const newState = this.possibleStates[this.currentState][event];

    if (!newState) {
      this.currentState = this.initialState;
      return;
    }

    if (!newState) {
      throw new Error(`Invalid transition event: ${event}`);
    }

    if (newState === this.currentState) {
      return;
    }

    if (newState === 'stopAttacking' || newState === 'stopEvading') {
      this.currentState = this.possibleStates[this.currentState][event];
      return;
    }

    this.currentState = newState;
  }

  getState() {
    return this.currentState;
  }

  blockState() {
    this.blocked = true;
  }

  unblock() {
    this.blocked = false;
  }
}
