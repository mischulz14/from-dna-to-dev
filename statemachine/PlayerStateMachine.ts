import LabHeroTest from '../gameObjects/LabHeroTest';
import AttackState from './AttackState';
import EvadeState from './EvadeState';
import FollowUpAttackState from './FollowUpAttackState';
import IdleState from './IdleState';
import RunState from './RunState';

export default class PlayerStateMachine {
  state: any;
  idleState: IdleState;
  runState: RunState;
  states: {
    idle: IdleState;
    run: RunState;
    attack: AttackState;
    followUpAttack: FollowUpAttackState;
    evade: EvadeState;
  };
  attackState: AttackState;
  followUpAttackState: FollowUpAttackState;
  evadeState: EvadeState;
  constructor(hero: LabHeroTest) {
    this.idleState = new IdleState(hero);
    this.runState = new RunState(hero);
    this.attackState = new AttackState(hero);
    this.followUpAttackState = new FollowUpAttackState(hero);
    this.evadeState = new EvadeState(hero);
    this.states = {
      idle: this.idleState,
      run: this.runState,
      attack: this.attackState,
      followUpAttack: this.followUpAttackState,
      evade: this.evadeState,
    };
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
    this.state.enter() ?? this.state.enter();
  }

  getState() {
    return this.state;
  }
}
