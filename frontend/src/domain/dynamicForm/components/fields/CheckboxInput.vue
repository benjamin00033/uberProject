<script setup lang="ts">
import { IonCheckbox, IonItem } from "@ionic/vue";
import type { FormField } from "../../types";

const props = defineProps<{
  field: FormField;
  modelValue: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <ion-item>
    <ion-checkbox
      :checked="modelValue"
      @ionChange="emit('update:modelValue', $event.detail.checked)"
      v-bind="field.props"
    >
      {{ field.label }}
    </ion-checkbox>
  </ion-item>
</template>
