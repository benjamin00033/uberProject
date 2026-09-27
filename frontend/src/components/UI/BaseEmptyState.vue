<template>
  <div :class="[$style.emptyState, customClass]">
    <div v-if="icon" :class="$style.iconWrapper">
      <ion-icon :icon="icon" :class="$style.icon"></ion-icon>
    </div>
    <h3 v-if="title" :class="$style.title">{{ title }}</h3>
    <p v-if="description" :class="$style.description">{{ description }}</p>
    <div v-if="$slots.action" :class="$style.actionWrapper">
      <slot name="action"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from "@ionic/vue";

defineProps<{
  /** 顯示的 Icon 名稱 (Ionicons) */
  icon?: string;
  /** 空白狀態的標題 */
  title?: string;
  /** 空白狀態的描述文字 */
  description?: string;
  /** 自訂 class */
  customClass?: string;
}>();
</script>

<style lang="scss" module src="./BaseEmptyState.module.scss"></style>
