<template>
  <div :class="$style.radioWrapper">
    <ion-label v-if="label" :class="$style.mainLabel">{{ label }}</ion-label>
    <ion-radio-group :value="modelValue" @ionChange="onChange">
      <ion-item v-for="option in options" :key="option.value" lines="none" :class="$style.item">
        <ion-radio :value="option.value" :disabled="disabled || option.disabled" justify="start">
          <span :class="$style.label">{{ option.label }}</span>
        </ion-radio>
      </ion-item>
    </ion-radio-group>
    <ion-text v-if="displayError" color="danger" :class="$style.errorText">
      {{ displayError }}
    </ion-text>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { IonItem, IonLabel, IonRadio, IonRadioGroup, IonText } from "@ionic/vue";
import { z } from "zod";

export interface RadioOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

const props = defineProps<{
  modelValue: string | number | null;
  options: RadioOption[];
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
}>();

const internalError = ref("");
const displayError = computed(() => props.error || internalError.value);

const onChange = (event: any) => {
  const value = event.detail.value;
  
  if (props.required) {
    const schema = z.union([z.string(), z.number()]).refine((val) => val !== null && val !== undefined && val !== "", {
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

<style lang="scss" module src="./BaseRadio.module.scss"></style>
