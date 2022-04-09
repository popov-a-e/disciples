import { ArmyLine } from '@engine/Army/ArmyLine'

export enum BattleFieldSide {
  ALLY = 'ALLY',
  ENEMY = 'ENEMY',
}

export const invertBattleFieldSide = (side: BattleFieldSide): BattleFieldSide =>
  ({
    [BattleFieldSide.ALLY]: BattleFieldSide.ENEMY,
    [BattleFieldSide.ENEMY]: BattleFieldSide.ALLY
  }[side])