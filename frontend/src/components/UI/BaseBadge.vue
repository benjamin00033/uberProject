<template>
  <ion-badge :color="color" :class="[$style.badge, customClass]">
    <slot>{{ text }}</slot>
  </ion-badge>
</template>

<script setup lang="ts">
import { IonBadge } from "@ionic/vue";

defineProps<{
  /** 徽章文字 */
  text?: string;
  /** Ionic 顏色主題 */
  color?: "primary" | "secondary" | "success" | "warning" | "danger" | "light" | "medium" | "dark";
  /** 自訂 class */
  customClass?: string;
}>();
</script>

<style lang="scss" module src="./BaseBadge.module.scss"></style>
