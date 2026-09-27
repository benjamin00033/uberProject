<template>
  <ion-modal
    :is-open="isOpen"
    :breakpoints="breakpoints"
    :initial-breakpoint="initialBreakpoint"
    @didDismiss="handleDismiss"
    :class="$style.drawerModal"
  >
    <ion-content :class="$style.content">
      <slot></slot>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonContent } from '@ionic/vue';

/**
 * Props for Drawer component
 */
const props = withDefaults(defineProps<{
  isOpen: boolean;
  breakpoints?: number[];
  initialBreakpoint?: number;
}>(), {
  breakpoints: () => [0, 0.5, 0.75, 1],
  initialBreakpoint: 0.5,
});

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void;
}>();

const handleDismiss = () => {
  emit('update:isOpen', false);
};
</script>

<style module lang="scss" src="./BaseDrawer.module.scss"></style>
