<template>
  <div :class="$style.baseSwitchWrapper">
    <ion-toggle
      :checked="modelValue"
      @ionChange="$emit('update:modelValue', $event.detail.checked)"
      :disabled="disabled"
      :color="color"
      :class="$style.toggle"
    >
      <span v-if="label" :class="$style.label">{{ label }}</span>
    </ion-toggle>
  </div>
</template>

<script setup lang="ts">
import { IonToggle } from "@ionic/vue";
import $style from "./BaseSwitch.module.scss";

withDefaults(defineProps<{
  modelValue: boolean;
  label?: string;
  color?: string;
  disabled?: boolean;
}>(), {
  color: "primary"
});

defineEmits(["update:modelValue"]);
</script>
