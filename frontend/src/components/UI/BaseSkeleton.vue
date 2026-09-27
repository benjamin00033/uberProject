<template>
  <ion-skeleton-text 
    :animated="animated" 
    :class="[$style.skeleton, variantClass]"
    :style="{ width, height }"
  ></ion-skeleton-text>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IonSkeletonText } from "@ionic/vue";
import $style from "./BaseSkeleton.module.scss";

const props = withDefaults(defineProps<{
  animated?: boolean;
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
}>(), {
  animated: true,
  variant: "text",
  width: "100%",
});

const variantClass = computed(() => {
  return $style[`variant-${props.variant}`];
});
</script>
