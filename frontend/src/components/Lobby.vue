<template lang="html">
  <div class="lobby">
    <div class="lobby__player" v-for="(army, key) in armiesStore.armies">
      <unit-stack
        :army="army"
        :draggable="false"
        :mirrored="key !== '1'"
      />

      <router-link :to="`/shop/${key}`">Shop</router-link>
    </div>
    <div class="lobby__add-player" @click="armiesStore.addArmy()" v-if="Object.values(armiesStore.armies).length < 2">
      +
    </div>
    <div
      class="lobby__fight"
      v-if="armiesCanFight"
      @click="goToFight"
    >
      Fight
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import UnitStack from '@/components/UnitStack.vue'
  import { useArmiesStore } from '@/store/armiesStore'
  import { useRouter } from 'vue-router'

  const armiesStore = useArmiesStore()

  const armiesCanFight = computed(() => Object.values(armiesStore.armies).length === 2 && Object.values(armiesStore.armies).every(army => army.length > 0))
  const router = useRouter()

  const goToFight = () => {
    const [ally, enemy] = Object.keys(armiesStore.armiesStates)
    router.push({name: 'fight', params: {ally, enemy}})
  }
</script>

<style lang="scss">
  .lobby {
    position: absolute;
    top: 100px;
    left: 100px;
    display: flex;
    flex-direction: row;

    &__player {
      .unit_stack {
        margin-bottom:120px;
      }
    }

    &__add-player, &__fight {
      width: 150px;
      height: 300px;
      font-size: 32px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background: aliceblue;
    }
  }
</style>
