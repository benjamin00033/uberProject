<script setup lang="ts">
import {
  IonRadioGroup,
  IonRadio,
  IonItem,
  IonLabel,
  IonListHeader,
} from "@ionic/vue";
import type { FormField } from "../../types";

const props = defineProps<{
  field: FormField;
  modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <ion-radio-group
    :value="modelValue"
    @ionChange="emit('update:modelValue', $event.detail.value)"
    v-bind="field.props"
  >
    <ion-list-header>
      <ion-label>{{ field.label }}</ion-label>
    </ion-list-header>
    <ion-item v-for="option in field.props?.options || []" :key="option.value">
      <ion-radio :value="option.value" label-placement="end">{{
        option.label
      }}</ion-radio>
    </ion-item>
  </ion-radio-group>
</template>
