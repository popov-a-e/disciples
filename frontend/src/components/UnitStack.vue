<template lang="html">
  <div
    class="unit_stack"
    :class="{
      unit_stack__mirrored: mirrored,
      unit_stack__dragging: unitDragStore.draggedUnit !== null,
      unit_stack__buyable: props.buyable
    }"
  >
    <img :src="require(`@assets/stack_bg_${mirrored ? 'right' : 'left'}.png`)" alt="" draggable="false" />

    <template v-for="order in orders">
      <div
        v-for="line in lines"
        class="unit_stack__slot"
        :class="[`line__${line.toLowerCase()}`, `order__${order}`]"
      >
        <unit-slot
          v-if="map[line][order]"
          :unit="map[line][order]"
          :mirrored="mirrored"
          :style="{
            pointerEvents: unitDragStore.draggedUnit !== null ? 'none' : null
          }"
          :drag-options="props.draggable ? {
            onstart: () => unitDragStore.startDragging(map[line][order].state),
            onmove: event => unitDragStore.move(event),
            onend: unitDragStore.stopDragging,
            cursor: false,
          } : null"
        />
        <div
          class="unit_stack__dropzone"
          :class="{
            'unit_stack__dropzone--active': isDropZoneHighlighted([line, order]),
          }"
          v-dropzone="{
            ondrop: () => emit('drop', [line, order]),
          }"
          @click="props.buyable ? emit('buy', [line, order]) : null"
        >
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed, defineEmits, defineProps } from 'vue'
  import type { Army } from '@engine/Army/Army'
  import { ArmyLine, invertArmyLine } from '@engine/Army/ArmyLine'
  import { ArmyOrder } from '@engine/Army/ArmyOrder'
  import { keyBy } from '@engine/util/keyBy'
  import UnitSlot from '@/components/UnitSlot.vue'
  import { useUnitShuffleStore } from '@/store/unitShuffleStore'
  import type { ArmyPosition } from '@engine/Army/ArmyPosition'

  const lines = [ArmyLine.REARGUARD, ArmyLine.VANGUARD]
  const orders = [ArmyOrder.TOP, ArmyOrder.MIDDLE, ArmyOrder.BOTTOM]

  const emit = defineEmits<{
    (e: 'drop', position: ArmyPosition): void
    (e: 'buy', position: ArmyPosition): void
  }>()
  const unitDragStore = useUnitShuffleStore()

  const isDropZoneHighlighted = (position: ArmyPosition): boolean => {
    const [line, order] = position

    const unitOnPosition = map.value[line][order]
    const adjacentUnit = map.value[invertArmyLine(line)][order]

    return unitDragStore.draggedUnit !== null && (
      !unitOnPosition && (
        !adjacentUnit
        || !adjacentUnit.isBig
      )
    )
  }

  const props = defineProps<{
    army ?: Army,
    buyable ?: boolean,
    mirrored ?: boolean,
    draggable ?: boolean,
  }>()

  const army = computed(() => props.army)

  const map = computed(() => keyBy(lines,
    line => keyBy(orders,
      order => army.value?.find(
        unit => (unit.isBig && (line === (props.mirrored ? ArmyLine.REARGUARD : ArmyLine.VANGUARD))) ? null : unit.position.find(pos => pos[0] === line && pos[1] === order),
      ) ?? null,
    ),
  ))
</script>

<style lang="scss">
  .unit_stack {
    display: grid;
    grid-template-columns: 70px 70px;
    grid-template-rows: 105px 105px 105px;
    grid-column-gap: 10px;
    grid-row-gap: 0;
    grid-auto-flow: dense;
    width: 150px;
    height: 315px;
    position: relative;
    margin: 20px;

    > img {
      position: absolute;
      top: -73px;
      left: -7px;
    }

    &__mirrored > img {
      left: -16px;
    }

    &__slot {
      position: relative;

      @for $i from 1 through 3 {
        &.order__#{$i} {
          grid-row: $i + 1;
        }
      }
    }

    &:not(&__dragging):is(&__buyable) &__dropzone {
      background: url("~@assets/stack_unit_recruit.png") no-repeat center center;
      cursor: pointer;
    }

    &__dropzone {
      height: 85px;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;

      &--active {
        background: none;
        outline: 2px yellow solid;
      }
    }

    .line__vanguard {
      grid-column: 2;
    }

    .line__rearguard {
      grid-column: 1;
    }

    &__mirrored {
      .line__vanguard {
        grid-column: 1;
      }

      .line__rearguard {
        grid-column: 2;
      }
    }
  }
</style>
