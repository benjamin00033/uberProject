<template>
  <div :class="$style.baseSelectWrapper">
    <div v-if="label" :class="$style.label">{{ label }}</div>
    <ion-select
      :value="modelValue"
      @ionChange="$emit('update:modelValue', $event.detail.value)"
      :placeholder="placeholder"
      :interface="interface"
      :class="[$style.select, error ? $style.hasError : '']"
      :disabled="disabled"
    >
      <ion-select-option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </ion-select-option>
    </ion-select>
    <div v-if="error" :class="$style.errorText">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { IonSelect, IonSelectOption } from "@ionic/vue";
import $style from "./BaseSelect.module.scss";

interface Option {
  label: string;
  value: string | number;
}

withDefaults(defineProps<{
  modelValue: string | number | null;
  options: Option[];
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  interface?: "popover" | "action-sheet" | "alert";
}>(), {
  interface: "alert"
});

defineEmits(["update:modelValue"]);
</script>
