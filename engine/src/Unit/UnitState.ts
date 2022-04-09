import { UnitId } from '@engine/Unit/UnitId'
import { ArmyPosition } from '@engine/Army/ArmyPosition'

export type UnitState = {
  readonly id: UnitId,
  readonly type: string,
  position: ArmyPosition[],

  health: number,
  initiative: number,
}