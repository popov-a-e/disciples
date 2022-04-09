import { BattleFieldSide } from '@engine/BattleField/BattleFieldSide'
import { ArmyState } from '@engine/Army/ArmyState'
import { UnitId } from '@engine/Unit/UnitId'

export type BattleFieldState = Record<BattleFieldSide, ArmyState> & {
  turnOrder: UnitId[]
  currentTurn: UnitId | null,
}