<template>
  <ion-avatar :class="[$style.avatar, customClass]">
    <img v-if="src" :src="src" :alt="alt" />
    <div v-else :class="$style.fallback">
      {{ initials }}
    </div>
  </ion-avatar>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IonAvatar } from "@ionic/vue";

const props = defineProps<{
  /** 圖片來源 URL */
  src?: string;
  /** 圖片 alt 文字 */
  alt?: string;
  /** 無圖片時顯示的縮寫文字 */
  text?: string;
  /** 自訂 class */
  customClass?: string;
}>();

const initials = computed(() => {
  if (!props.text) return "";
  return props.text.substring(0, 2).toUpperCase();
});
</script>

<style lang="scss" module src="./BaseAvatar.module.scss"></style>
