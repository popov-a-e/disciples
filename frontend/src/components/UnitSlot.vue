<template lang="html">
  <div
    class="unit_slot"
    :class="{
      unit_slot__big: unit.isBig,
    }"
    @click="performAttack"
  >
    <div
      class="unit_slot__dropzone"
      :class="{'unit_slot__dropzone--active': unitDragStore.draggedUnit !== null || isActive}"
      :style="draggedZoneStyle"
    >
      <div class="unit_slot__dropzone__dmg-indicator"></div>
      <img
        v-drag="props.dragOptions"
        class="unit_slot__img"
        :class="{'unit_slot__img--mirrored': mirrored}"
        :src="require(`@assets/faces/${toSnakeCase(unit.type)}.png`)"
        alt=""
        draggable="false"
      />
    </div>

    <div class="unit_slot__hp">
      {{ unit.health }}/{{ unit.baseHealth }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, defineProps, ref, withDefaults } from 'vue'
  import { Unit } from '@engine/Unit/Unit'
  import { useUnitShuffleStore } from '@/store/unitShuffleStore'
  import type { DraggableOptions } from '@interactjs/types'
  import { toSnakeCase } from '@engine/util/toSnakeCase'

  const props = withDefaults(defineProps<{
    unit: Unit,
    mirrored: boolean,
    dragOptions: DraggableOptions | null
  }>(), {
    mirrored: false,
    dragOptions: null
  })

  const unit = computed(() => props.unit)

  const unitDragStore = useUnitShuffleStore()
  const isDragged = computed(() => unitDragStore.draggedUnit?.id === props.unit.id)
  const currentTurn = ref(0)

  if (unit.value.isOnBattleField) {
    currentTurn.value = unit.value.bf.currentTurn!
    unit.value.bf.on('turn-changed', turnOwnerUnitId => currentTurn.value = turnOwnerUnitId)
  }

  const isActive = computed(() => currentTurn.value === unit.value.id)

  const performAttack = () => {
    const c = unit.value

    if (!c.isOnBattleField) {
      return
    }

    unit.value.bf.attack(c.bfPosition)
  }

  const draggedZoneStyle = computed(() => ({
    '--dmg': 1 - (unit.value.health / unit.value.baseHealth),
    ...(unitDragStore.draggedUnit !== null ? {zIndex: isDragged ? 200 : 101} : { })
  }))
</script>

<style lang="scss">
  .unit_slot {
    position: static;
    top: 0;
    left: 0;
    height: calc(var(--game-unit-face-hp-height) + var(--game-unit-face-height));
    width: 70px;
    $root: &;

    --unit-slot-width: var(--game-unit-face-width);

    &__big {
      --unit-slot-width: calc(2 * var(--game-unit-face-width) + var(--game-unit-face-gap));
    }


    &__hp {
      position: static;
      top: var(--game-unit-face-height);
      left: 0;
      height: var(--game-unit-face-hp-height);
      line-height: var(--game-unit-face-hp-height);
      font-size: 15px;
      text-align: center;
      width: var(--unit-slot-width);
      font-weight: 600;
      background: url("~@assets/unit_hp_bar.png");
    }

    &__dropzone {
      height: var(--game-unit-face-height);
      left: 0;
      top: 0;
      position: static;
      width: var(--unit-slot-width);

      &--active {
        outline: 2px yellow solid;
      }

      img, &__dmg-indicator {
        position: absolute;
        left: 0;
        width: var(--unit-slot-width);
      }

      img {
        top: 0;
        height: var(--game-unit-face-height);
        z-index: 1;
      }

      &__dmg-indicator {
        z-index: 3;
        bottom: 20px;
        height: calc(var(--dmg) *  var(--game-unit-face-height));
        pointer-events: none;
        background: red;
        opacity: 0.6;
      }
    }

    &__img--mirrored {
      transform: scaleX(-1);
    }
  }
</style>
