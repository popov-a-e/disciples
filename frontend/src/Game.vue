<template>
  <div class="game" v-if="Object.keys(units).length > 0">
    <router-view />
  </div>

  <component v-if="popup" :is="popup.component" v-bind="popup.props" v-on="popup.listeners" />
</template>

<script lang="ts" setup>
  import { computed, markRaw, DefineComponent, ComponentOptionsBase } from 'vue'
  import { useUnitsStore } from '@/store/unitsStore'
  import UnitStackSelector from '@/components/UnitStackShop.vue'
  import { usePopupService } from '@/store/popupService'

  const popupService = usePopupService()
  const popup = computed(() => popupService.popup)
  const units = computed(() => useUnitsStore().units)
</script>

<style lang="scss">
  .game {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    --game-unit-face-height: 85px;
    --game-unit-face-width: 70px;
    --game-unit-face-gap: 10px;
    --game-unit-face-hp-height: 22px;
  }
</style>
