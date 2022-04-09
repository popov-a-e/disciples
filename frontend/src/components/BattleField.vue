<template>
  <div class="battle_container">
    <army-grid
      :army="bf.armies.ALLY"
      :draggable="false"
    />
    <army-grid
      :army="bf.armies.ENEMY"
      :draggable="false"
      mirrored
    />
  </div>
</template>

<script lang="ts">
  import VueRouter from 'vue-router'
  import { useArmiesStore } from '@/store/armiesStore'

  export default {
    beforeRouteEnter: ((to, from, next) =>  {
      const { ally, enemy } = to.params as Record<string, string>

      if (!ally || !enemy || !useArmiesStore().armiesStates[ally] || !useArmiesStore().armiesStates[enemy]) {
        next('/')
      } else {
        next()
      }
    }) as VueRouter.NavigationGuard,
  }
</script>

<script lang="ts" setup>
  import { BattleFieldSide } from '@engine/BattleField/BattleFieldSide'
  import { ArmyLine } from '@engine/Army/ArmyLine'
  import { BattleField } from '@engine/BattleField/BattleField'
  import { keyBy } from '@engine/util/keyBy'
  import { Ref, ref, computed, onUnmounted } from 'vue'
  import { ArmyOrder } from '@engine/Army/ArmyOrder'
  import { useUnitsStore } from '@/store/unitsStore'
  import ArmyGrid from '@/components/UnitStack.vue'
  import { useRoute } from 'vue-router'
  import { useArmiesStore } from '@/store/armiesStore'

  const {ally, enemy} = useRoute().params as Record<string, string>
  const armiesStore = useArmiesStore()

  const armiesState = computed(() => ({
    [BattleFieldSide.ALLY]: armiesStore.armiesStates[ally],
    [BattleFieldSide.ENEMY]: armiesStore.armiesStates[enemy],
  }))

  const unitFactory = useUnitsStore().unitFactory
  const bf = new BattleField()

  bf.setArmies(keyBy(
    [BattleFieldSide.ALLY, BattleFieldSide.ENEMY],
    side => armiesState.value[side].map(unitState => unitFactory.createFromState(unitState))
  ))

  const currentTurn: Ref<number | null> = ref(bf.currentTurn)

  // bf.on('state-changed', state => armiesState.value = state)
  bf.on('turn-changed', turnOwnerUnitId => currentTurn.value = turnOwnerUnitId)

  bf.initBattle()

  const map = keyBy(
    [BattleFieldSide.ALLY, BattleFieldSide.ENEMY],
    side => keyBy(
      [ArmyLine.REARGUARD, ArmyLine.VANGUARD],
      line => keyBy(
        [ArmyOrder.TOP, ArmyOrder.MIDDLE, ArmyOrder.BOTTOM],
        position => bf.armies[side].find(
          unit => unit.position.find(pos => pos[0] === line && pos[1] === position)
        ) ?? null,
      ),
    ),
  )

  onUnmounted (() => bf.units.forEach(unit => unit.leaveBattleField()))
</script>

<style lang="scss">
  .battle_container {
    position: absolute;
    top: 100px;
    left: 100px;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
  }
</style>
