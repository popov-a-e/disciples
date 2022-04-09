import { Unit } from '@engine/Unit/Unit'
import { UnitState } from '@engine/Unit/UnitState'

export class UnitFactory {
  constructor (
    private unitMap: Record<string, new () => Unit>
  ) {}

  createFromState (state: UnitState): Unit {
    return (new this.unitMap[state.type]).setState(state)
  }

  createFromType (type: string): Unit {
    return (new this.unitMap[type])
  }
}