<template>
  <div
    :class="$style.tooltipWrapper"
    @mouseenter="show = true"
    @mouseleave="show = false"
  >
    <slot></slot>
    <transition name="fade">
      <div v-if="show" :class="[$style.tooltipContent, $style[`position-${position}`]]">
        {{ text }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import $style from "./BaseTooltip.module.scss";

withDefaults(defineProps<{
  text: string;
  position?: "top" | "bottom" | "left" | "right";
}>(), {
  position: "top"
});

const show = ref(false);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
