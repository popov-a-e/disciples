<template>
  <div class="unit-stack-shop">
    <unit-stack
      :army="armies[armyKey]"
      draggable
      @drop="position =>  unitShuffleStore.drop(armyKey, position)"
    />
    <unit-stack
      :army="armies.city"
      @drop="position => unitShuffleStore.drop('city', position)"
      draggable mirrored buyable
      @buy="position => buyUnit(position)"
    />

    <router-link to="/lobby">Back to lobby</router-link>

    <div
      class="unit-stack-shop__delete"
      v-show="unitShuffleStore.draggedUnit !== null"
      v-dropzone="{
        ondrop: unitShuffleStore.delete
      }"
    >Trash</div>
  </div>
</template>

<script lang="ts">
  import VueRouter from 'vue-router'
  import { useArmiesStore } from '@/store/armiesStore'

  export default {
    beforeRouteEnter: ((to, from, next) =>  {
      const armyKey = to.params.key as string

      if (!armyKey || !useArmiesStore().armiesStates[armyKey]) {
        next('/')
      } else {
        next()
      }
    }) as VueRouter.NavigationGuard,
  }
</script>

<script lang="ts" setup>
  import { computed, Ref, ref, watch } from 'vue'
  import { ArmyState } from '@engine/Army/ArmyState'
  import { useUnitsStore } from '@/store/unitsStore'
  import UnitStack from '@/components/UnitStack.vue'
  import { useUnitShuffleStore } from '@/store/unitShuffleStore'
  import { ArmyPosition } from '@engine/Army/ArmyPosition'
  import { usePopupService } from '@/store/popupService'
  import { objectMap } from '@engine/util/objectMap'
  import { useRoute} from 'vue-router'
  import { useArmiesStore } from '@/store/armiesStore'

  const route = useRoute()

  const cityArmy: Ref<ArmyState> = ref([])
  const armiesStore = useArmiesStore()
  const armyKey: string = route.params.key as string

  const armiesState =  computed(() => ({
    [armyKey]: armiesStore.armies[armyKey],
    city: cityArmy.value,
  }))

  const unitsStore = useUnitsStore()
  const unitShuffleStore = useUnitShuffleStore()

  unitShuffleStore.armies = armiesState.value

  watch(() => unitShuffleStore.armies, armies => {
    armiesStore.armiesStates[armyKey] = armies[armyKey]
    cityArmy.value = armies.city
  })

  const armies = computed(() => objectMap(
    armiesState.value,
    army => army.map(state => unitsStore.unitFactory.createFromState(state))
  ))

  const popupService = usePopupService()

  const buyUnit = async (position: ArmyPosition) => {
    const unitType = await popupService.selectUnit()

    if (unitType) {
      const unit = unitsStore.unitFactory.createFromType(unitType)

      if (unit.isBig && armies.value.city.some(state => state.position.some(pos => pos[1] === position[1]))) {
        alert('Can\'t select big creature here');

        return
      }

      unitsStore.addToArmy(unit, armiesState.value.city, position)
    }
  }
</script>

<style lang="scss">
  .unit-stack-shop {
    position: absolute;
    top: 100px;
    left: 100px;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;

    &__delete {
      width: 100px;
      height: 100px;
      display: flex;
      background: orangered;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      font-weight: 600;
      cursor: pointer;
    }
  }
</style>
