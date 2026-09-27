<template>
  <div :class="$style.checkboxWrapper">
    <ion-item lines="none" :class="$style.item">
      <ion-checkbox
        :checked="modelValue"
        :disabled="disabled"
        @ionChange="onChange"
        justify="start"
      >
        <span :class="$style.label" v-if="label">{{ label }}</span>
      </ion-checkbox>
    </ion-item>
    <ion-text v-if="displayError" color="danger" :class="$style.errorText">
      {{ displayError }}
    </ion-text>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { IonItem, IonCheckbox, IonText } from "@ionic/vue";
import { z } from "zod";

const props = defineProps<{
  modelValue: boolean;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const internalError = ref("");
const displayError = computed(() => props.error || internalError.value);

const onChange = (event: any) => {
  const isChecked = event.detail.checked;
  
  if (props.required) {
    const schema = z.literal(true, {
      errorMap: () => ({ message: "此欄位為必填" }),
    });
    try {
      schema.parse(isChecked);
      internalError.value = "";
    } catch (e: any) {
      if (e instanceof z.ZodError) {
        internalError.value = e.errors[0]?.message || "驗證失敗";
      }
    }
  } else {
    internalError.value = "";
  }

  emit("update:modelValue", isChecked);
};
</script>

<style lang="scss" module src="./BaseCheckbox.module.scss"></style>
