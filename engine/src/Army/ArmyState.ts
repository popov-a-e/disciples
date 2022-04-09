import { UnitState } from '@engine/Unit/UnitState'
import { ArmyPosition } from '@engine/Army/ArmyPosition'

export type ArmyState = UnitState[]

export const atPositions = (state: ArmyState, positions: ArmyPosition[]) => state.filter(
  unit => unit.position.some(pos => positions.some(p => p[0] === pos[0] && p[1] === pos[1]))
)