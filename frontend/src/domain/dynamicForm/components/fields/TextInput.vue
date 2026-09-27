<script setup lang="ts">
import { IonInput, IonItem, IonLabel } from "@ionic/vue";
import type { FormField } from "../../types";

const props = defineProps<{
  field: FormField;
  modelValue: string | number;
}>();

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <ion-item>
    <ion-label position="stacked">{{ field.label }}</ion-label>
    <ion-input
      :placeholder="field.placeholder"
      :value="modelValue"
      @ionInput="emit('update:modelValue', $event.target.value)"
      v-bind="field.props"
    ></ion-input>
  </ion-item>
</template>
