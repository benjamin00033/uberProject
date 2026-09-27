<template>
  <div :class="$style.datePickerWrapper">
    <ion-label v-if="label" :class="$style.label">{{ label }}</ion-label>
    <div :class="$style.datetimeContainer">
      <ion-datetime
        :value="modelValue"
        @ionChange="onChange"
        :presentation="presentation"
        :disabled="disabled"
        :min="min"
        :max="max"
      ></ion-datetime>
    </div>
    <ion-text v-if="displayError" color="danger" :class="$style.errorText">
      {{ displayError }}
    </ion-text>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { IonLabel, IonDatetime, IonText } from "@ionic/vue";
import { z } from "zod";

const props = withDefaults(defineProps<{
  modelValue: string | string[] | null;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  presentation?: "date" | "date-time" | "month" | "month-year" | "time" | "time-date" | "year";
  min?: string;
  max?: string;
}>(), {
  presentation: "date",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[]): void;
}>();

const internalError = ref("");
const displayError = computed(() => props.error || internalError.value);

const onChange = (event: any) => {
  const value = event.detail.value;
  
  if (props.required) {
    const schema = z.any().refine((val) => {
      if (Array.isArray(val)) return val.length > 0;
      return val !== null && val !== undefined && val !== "";
    }, {
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

<style lang="scss" module src="./BaseDatePicker.module.scss"></style>
