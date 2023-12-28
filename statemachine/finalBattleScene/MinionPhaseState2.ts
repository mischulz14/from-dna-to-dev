import { State } from '../../api/state';
import Bug from '../../gameObjects/Bug';
import FinalBattleScene from '../../scenes/FinalBattleScene';

export default class MinionPhaseState2 implements State {
  animationOptions: string[];
  currentMinions: Bug[];
  currentAnimation: string;
  scene: FinalBattleScene;
  continueBehavior: boolean = true;

  constructor(scene: any) {}

  async update() {}

  enter() {}
}
