export default class StateMachine {
  private currentState: string;
  private blocked: boolean;

  constructor(initialState: string) {
    this.currentState = initialState;
    this.blocked = false;
  }

  transition(event: string) {
    if (this.blocked) return;

    switch (this.currentState) {
      case 'idle':
        if (event === 'run') this.currentState = 'running';
        else if (event === 'attack') this.currentState = 'attacking';
        break;
      case 'running':
        if (event === 'stop') this.currentState = 'idle';
        else if (event === 'attack') this.currentState = 'attacking';
        else if (event === 'evade') this.currentState = 'evading';
        break;
      case 'attacking':
        if (event === 'stopAttack') this.currentState = 'idle';
        break;
      case 'evading':
        if (event === 'stopEvade') this.currentState = 'idle';
        break;
    }
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
