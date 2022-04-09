<template lang="html">
  <div class="unit_select_popup">
    <div class="unit_select_popup__unit-list">
      <div
        class="unit_select_popup__unit"
        :class="{'unit_select_popup__unit--selected': unit === unitSelected}"
        v-for="unit in units"
        :key="unit.type"
        @click="unitSelected = unit"
      >
        <img
          :src="require(`@assets/faces/${toSnakeCase(unit.type)}.png`)"
          alt=""
        />

        <div class="unit_select_popup__unit--text">
          {{ unit.name }}
        </div>
      </div>
    </div>
    <div class="unit_select_popup__controls">
      <approve-btn @click="selectUnit(unitSelected.type)"/>
      <approve-btn @click="closeDialog" negative/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ApproveBtn from '@/components/button/ApproveBtn.vue'
  import { computed, ref, markRaw } from 'vue'
  import type { Ref } from 'vue'
  import { useUnitsStore } from '@/store/unitsStore'
  import { objectMap } from '@engine/util/objectMap'
  import { toSnakeCase } from '@engine/util/toSnakeCase'
  import { Unit } from '@engine/Unit'
  import { usePopupService } from '@/store/popupService'

  const popupService = usePopupService()
  const unitsStore = useUnitsStore()
  const units = computed(() => objectMap(unitsStore.units, unit => markRaw(new unit())))

  const unitSelected: Ref<Unit> = ref(markRaw(Object.values(units.value)[0] as any))

  const emit = defineEmits<{
    (e: 'input', value: string | null): void
  }>()

  const selectUnit = (unit: string | null) => {
    emit('input', unit)
    popupService.close()
  }

  const closeDialog = () => selectUnit(null)
</script>

<style lang="scss">
  .unit_select_popup {
    position: fixed;
    top: 8px;
    left: 100px;
    width: 491px;
    height: 527px;
    z-index: 9000;
    background: url("~@assets/dialog/dialog_bg.png");

    &__controls {
      position: absolute;
      bottom: 11px;
      right: 85px;
      display: flex;
      flex-direction: row;
    }

    &__unit {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin: 10px 0;
      cursor: pointer;

      &--selected {
        outline: 1px solid black;
      }

      &--text {
        width: 95px;
        display: flex;
        align-items: center;
      }

      &-list {
        margin: -10px 0;
        padding: 0 1px;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 95px;
        bottom: 95px;
        right: 118px;
        left: 118px;
        overflow: auto;
        scrollbar-width: none;

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }
</style>
