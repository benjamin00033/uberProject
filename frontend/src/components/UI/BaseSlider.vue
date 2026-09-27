<template>
  <div :class="$style.sliderWrapper">
    <ion-label v-if="label" :class="$style.label">{{ label }}</ion-label>
    <ion-item lines="none" :class="$style.item">
      <ion-range
        :value="modelValue"
        @ionChange="onChange"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :pin="pin"
        :snaps="snaps"
        :ticks="ticks"
      >
        <div slot="start" v-if="startLabel">{{ startLabel }}</div>
        <div slot="end" v-if="endLabel">{{ endLabel }}</div>
      </ion-range>
    </ion-item>
    <ion-text v-if="displayError" color="danger" :class="$style.errorText">
      {{ displayError }}
    </ion-text>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { IonItem, IonLabel, IonRange, IonText } from "@ionic/vue";
import { z } from "zod";

const props = withDefaults(defineProps<{
  modelValue: number | { lower: number; upper: number };
  label?: string;
  error?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  pin?: boolean;
  snaps?: boolean;
  ticks?: boolean;
  startLabel?: string;
  endLabel?: string;
  required?: boolean;
}>(), {
  min: 0,
  max: 100,
  step: 1,
  pin: true,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: number | { lower: number; upper: number }): void;
}>();

const internalError = ref("");
const displayError = computed(() => props.error || internalError.value);

const onChange = (event: any) => {
  const value = event.detail.value;
  
  if (props.required) {
    const schema = z.any().refine((val) => val !== null && val !== undefined, {
      message: "此欄位為必填",
    });
    try {
      schema.parse(value);
      internalError.value = "";
    } catch (e: any) {
      if (e instanceof z.ZodError) {
        internalError.value = e.errors[0]?.message || "驗證失敗";
      }
    }
  } else {
    internalError.value = "";
  }

  emit("update:modelValue", value);
};
</script>

<style lang="scss" module src="./BaseSlider.module.scss"></style>
