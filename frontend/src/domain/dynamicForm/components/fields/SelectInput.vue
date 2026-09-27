<script setup lang="ts">
import { IonSelect, IonSelectOption, IonItem, IonLabel } from "@ionic/vue";
import type { FormField } from "../../types";

const props = defineProps<{
  field: FormField;
  modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <ion-item>
    <ion-label position="stacked">{{ field.label }}</ion-label>
    <ion-select
      :value="modelValue"
      @ionChange="emit('update:modelValue', $event.detail.value)"
      :placeholder="field.placeholder"
      v-bind="field.props"
    >
      <ion-select-option
        v-for="option in field.props?.options || []"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </ion-select-option>
    </ion-select>
  </ion-item>
</template>
