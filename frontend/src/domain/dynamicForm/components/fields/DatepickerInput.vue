<script setup lang="ts">
import {
  IonDatetime,
  IonItem,
  IonLabel,
  IonDatetimeButton,
  IonModal,
} from "@ionic/vue";
import type { FormField } from "../../types";

const props = defineProps<{
  field: FormField;
  modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <ion-item>
    <ion-label>{{ field.label }}</ion-label>
    <ion-datetime-button :datetime="field.id"></ion-datetime-button>

    <ion-modal :keep-contents-mounted="true">
      <ion-datetime
        :id="field.id"
        :value="modelValue"
        @ionChange="emit('update:modelValue', $event.detail.value)"
        presentation="date"
        v-bind="field.props"
      ></ion-datetime>
    </ion-modal>
  </ion-item>
</template>
