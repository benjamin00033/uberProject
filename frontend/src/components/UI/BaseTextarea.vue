<template>
  <div :class="$style.inputWrapper">
    <ion-label v-if="label" :class="$style.label">{{ label }}</ion-label>
    <ion-item :class="$style.item" lines="none">
      <ion-textarea
        :value="modelValue"
        @ionInput="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :rows="rows"
        :auto-grow="autoGrow"
      ></ion-textarea>
    </ion-item>
    <ion-text v-if="error" color="danger" :class="$style.errorText">
      {{ error }}
    </ion-text>
  </div>
</template>

<script setup lang="ts">
import { IonItem, IonLabel, IonTextarea, IonText } from '@ionic/vue';

withDefaults(defineProps<{
  modelValue: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  autoGrow?: boolean;
  error?: string;
}>(), {
  rows: 4,
  autoGrow: false
});

defineEmits<{
  (e: 'update:modelValue', value: string | null | undefined): void;
}>();
</script>

<style lang="scss" module src="./BaseTextarea.module.scss"></style>
