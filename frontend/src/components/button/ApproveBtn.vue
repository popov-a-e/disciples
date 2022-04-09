<template lang="html">
  <div
    class="approve-btn"
    :class="{
      'approve-btn__negative': props.negative
    }"
  >

  </div>
</template>

<script lang="ts" setup>
  import { defineProps, withDefaults } from 'vue'

  const props = withDefaults(defineProps<{
    negative?: boolean
  }>(), {
    negative: false,
  })
</script>

<style lang="scss">
  .approve-btn {
    height: 49px;
    width: 49px;
    padding-bottom: 45px;
    margin-bottom: -45px;
    cursor: pointer;

    background: url("~@assets/dialog/dialog_y.png");

    &:hover {
      background: url("~@assets/dialog/dialog_y_hover.png");
    }

    &:active {
      background: url("~@assets/dialog/dialog_y_active.png");
    }

    &__negative {
      background: url("~@assets/dialog/dialog_n.png");

      &:hover {
        background: url("~@assets/dialog/dialog_n_hover.png");
      }

      &:active {
        background: url("~@assets/dialog/dialog_n_active.png");
      }
    }

  }
</style>
