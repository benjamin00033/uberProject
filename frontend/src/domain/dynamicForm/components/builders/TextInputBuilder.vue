<script setup lang="ts">
import { computed } from "vue";
import { IonItem, IonLabel, IonToggle } from "@ionic/vue";

const props = defineProps<{ modelValue: Record<string, any> }>();
const emit = defineEmits(["update:modelValue"]);

const fieldProps = computed({
  get: () => props.modelValue || {},
  set: (val) => emit("update:modelValue", val),
});

const updateProp = (key: string, value: any) => {
  fieldProps.value = { ...fieldProps.value, [key]: value };
};
</script>

<template>
  <div>
    <ion-item>
      <ion-label>Clear Input 按鈕</ion-label>
      <ion-toggle :checked="fieldProps.clearInput" @ionChange="updateProp('clearInput', $event.detail.checked)"></ion-toggle>
    </ion-item>
  </div>
</template>
