import { defineStore } from 'pinia'
import { ArmyState } from '@engine/Army/ArmyState'
import { objectMap } from '@engine/util/objectMap'
import { useUnitsStore } from '@/store/unitsStore'

export const useArmiesStore = defineStore('armies', {
  state: () => ({
    armiesId: 1 as number,
    armiesStates: {} as Record<string | number, ArmyState>,
  }),
  actions: {
    addArmy () {
      this.armiesStates[this.armiesId++] = []
    },
  },
  getters: {
    armies: state => objectMap(state.armiesStates, army => army.map(st => useUnitsStore().unitFactory.createFromState(st))),
  },
})