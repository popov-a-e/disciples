import { defineStore } from 'pinia'
import { Unit } from '@engine/Unit/Unit'
import { UnitFactory } from '@engine/Unit/UnitFactory'
import { ArmyState } from '@engine/Army/ArmyState'
import { ArmyPosition } from '@engine/Army/ArmyPosition'

export const useUnitsStore = defineStore('units', {
  state: () => ({
    incrementalId: 1,
    units: {} as Record<string, new () => Unit>,
  }),
  actions: {
    setUnits (units: Record<string, new () => Unit>) {
      this.units = units
    },
    addToArmy (unit: Unit, army: ArmyState, position: ArmyPosition) {

      unit.addToArmy(army, this.incrementalId ++, position)
    }
  },
  getters: {
    unitFactory: state => new UnitFactory(state.units),
  }
})