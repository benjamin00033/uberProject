<template>
  <div :class="$style.inputWrapper">
    <ion-label v-if="label" :class="$style.label">{{ label }}</ion-label>
    <ion-item :class="$style.item" lines="none">
      <ion-input
        :value="modelValue"
        @ionInput="onInput"
        :placeholder="placeholder"
        :type="type"
        :clear-input="clearInput"
      ></ion-input>
    </ion-item>
    <ion-text v-if="displayError" color="danger" :class="$style.errorText">
      {{ displayError }}
    </ion-text>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { IonItem, IonLabel, IonInput, IonText } from "@ionic/vue";
import { z } from "zod";

const props = defineProps<{
  modelValue: string | number;
  label?: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number";
  error?: string;
  clearInput?: boolean;

  // Zod Validation Props
  required?: boolean;
  isNumber?: boolean;
  regex?: RegExp;
  trimValue?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | null | undefined): void;
}>();

const internalError = ref("");
const displayError = computed(() => props.error || internalError.value);

const onInput = (event: any) => {
  let value = event.target.value as string;

  if (props.trimValue) {
    value = value.trim();
  }

  let schema: z.ZodTypeAny;

  if (props.required) {
    schema = z.string().min(1, "此欄位為必填");
  } else {
    schema = z.string().optional().or(z.literal(""));
  }

  const refinedSchema = schema.superRefine((val, ctx) => {
    if (!val) return; // Skip if empty (and not required, as required fails above)

    if (props.isNumber || props.type === "number") {
      if (isNaN(Number(val))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "此欄位必須為數字",
        });
      }
    }

    if (props.regex) {
      if (!props.regex.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "格式不正確",
        });
      }
    }
  });

  try {
    refinedSchema.parse(value);
    internalError.value = "";
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      internalError.value = e.errors[0]?.message || "驗證失敗";
    }
  }

  emit("update:modelValue", value);
};
</script>

<style lang="scss" module src="./BaseInput.module.scss"></style>
