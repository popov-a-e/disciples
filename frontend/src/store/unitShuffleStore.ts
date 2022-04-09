import { defineStore } from 'pinia'
import { UnitState } from '@engine/Unit'
import type { InteractEvent } from '@interactjs/types'
import { ArmyPosition, columnAtPosition } from '@engine/Army/ArmyPosition'
import { ArmyState, atPositions } from '@engine/Army/ArmyState'
import { invertArmyLine } from '@engine/Army/ArmyLine'
import { objectMap } from '@engine/util/objectMap'

export const useUnitShuffleStore = defineStore('unitShuffle', {
  state: () => ({
    armies: {} as Record<string | number, ArmyState>,
    draggedUnit: null as UnitState | null,
  }),
  actions: {
    startDragging (unitState: UnitState) {
      this.draggedUnit = unitState
    },
    stopDragging (event: InteractEvent) {
      event.target.style.top = '0'
      event.target.style.left = '0'
      event.target.style.zIndex = null as any

      this.draggedUnit = null
    },
    move (event: InteractEvent) {
      event.target.style.top = (event.pageY - event.y0) + 'px'
      event.target.style.left = (event.pageX - event.x0) + 'px'
      event.target.style.zIndex = '100'
    },
    drop (targetArmyKey: string | number, position: ArmyPosition) {
      const draggedUnit = this.draggedUnit!

      const oldPosition = draggedUnit.position
      const isSourceUnitBig = draggedUnit.position.length > 1
      const newPosition = isSourceUnitBig ? columnAtPosition(position) : [position]

      const sourceArmyKey = this.armiesArray.find(
        ([_, army]) => army.find(unit => draggedUnit.id === unit.id)
      )![0]

      const unitsToReplace = atPositions(this.armies[targetArmyKey], newPosition)

      const isTargetUnitBig = unitsToReplace.some(unit => unit.position.length > 1)

      const replacedUnits = atPositions(this.armies[sourceArmyKey], isTargetUnitBig ? columnAtPosition(oldPosition[0]) : oldPosition)

      if (isSourceUnitBig || isTargetUnitBig) {
        unitsToReplace.forEach(unit => {
          unit.position = unit.position.map(pos => [pos[0], oldPosition[0][1]])
        })

        replacedUnits.forEach(unit => {
          unit.position = unit.position.map(pos => [pos[0], newPosition[0][1]])
        })

        draggedUnit.position = newPosition
        replacedUnits.filter(unit => unit.id !== draggedUnit.id).forEach(unit => {
          unit.position = unit.position.map(pos => [invertArmyLine(newPosition[0][0]), newPosition[0][1]])
        })
      } else {
        unitsToReplace.forEach(unit => {
          unit.position = oldPosition
        })

        replacedUnits.forEach(unit => {
          unit.position = newPosition
        })
      }

      if (sourceArmyKey !== targetArmyKey) {
        this.armies = {
          ...this.armies,
          [sourceArmyKey]: this.armies[sourceArmyKey]
            .filter(unit => !replacedUnits.some(c => c.id === unit.id))
            .concat(unitsToReplace),
          [targetArmyKey]: this.armies[targetArmyKey]
            .filter(unit => !unitsToReplace.some(c => c.id === unit.id))
            .concat(replacedUnits)
        }
      }
    },
    delete() {
      console.log(1)
      this.armies = objectMap(this.armies, army => army.filter(unit => unit.id !== this.draggedUnit?.id))

    }
  },
  getters: {
    armiesArray: state => Object.entries(state.armies)
  }
})