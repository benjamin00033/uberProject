<script setup lang="ts">
import { IonTextarea, IonItem, IonLabel } from "@ionic/vue";
import type { FormField } from "../../types";

const props = defineProps<{
  field: FormField;
  modelValue: string;
}>();

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <ion-item>
    <ion-label position="stacked">{{ field.label }}</ion-label>
    <!-- We use IonTextarea with auto-grow as a basic richtext placeholder 
         until a specialized rich text library like Quill is introduced -->
    <ion-textarea
      :placeholder="field.placeholder || 'Enter details...'"
      :value="modelValue"
      @ionInput="emit('update:modelValue', $event.target.value)"
      :auto-grow="true"
      :rows="4"
      v-bind="field.props"
    ></ion-textarea>
  </ion-item>
</template>
