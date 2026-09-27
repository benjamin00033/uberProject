<script setup lang="ts">
import { computed } from "vue";
import $styles from "./OptionsBuilder.module.scss";
import { IonItem, IonLabel, IonInput, IonButton, IonIcon, IonList } from "@ionic/vue";
import { add, trash } from "ionicons/icons";

const props = defineProps<{ modelValue: Record<string, any> }>();
const emit = defineEmits(["update:modelValue"]);

const fieldProps = computed({
  get: () => props.modelValue || {},
  set: (val) => emit("update:modelValue", val),
});

const options = computed(() => fieldProps.value.options || []);

const addOption = () => {
  const newOptions = [...options.value, { label: "New Option", value: `opt_${Date.now()}` }];
  fieldProps.value = { ...fieldProps.value, options: newOptions };
};

const removeOption = (index: number) => {
  const newOptions = [...options.value];
  newOptions.splice(index, 1);
  fieldProps.value = { ...fieldProps.value, options: newOptions };
};

const updateOptionLabel = (index: number, val: string) => {
  const newOptions = [...options.value];
  newOptions[index].label = val;
  fieldProps.value = { ...fieldProps.value, options: newOptions };
};

const updateOptionValue = (index: number, val: string) => {
  const newOptions = [...options.value];
  newOptions[index].value = val;
  fieldProps.value = { ...fieldProps.value, options: newOptions };
};
</script>

<template>
  <div>
    <ion-item lines="none">
      <ion-label>選項列表</ion-label>
      <ion-button slot="end" size="small" @click="addOption">
        <ion-icon slot="icon-only" :icon="add"></ion-icon>
      </ion-button>
    </ion-item>
    <ion-list>
      <ion-item v-for="(opt, index) in options" :key="index">
        <ion-input :value="typeof opt.label === 'string' ? opt.label : opt.label?.zh || opt.label?.en" @ionInput="updateOptionLabel(index, $event.target.value as string)" placeholder="顯示名稱" :class="$styles.inputLabel"></ion-input>
        <ion-input :value="opt.value" @ionInput="updateOptionValue(index, $event.target.value as string)" placeholder="Value"></ion-input>
        <ion-button slot="end" color="danger" fill="clear" @click="removeOption(index)">
          <ion-icon slot="icon-only" :icon="trash"></ion-icon>
        </ion-button>
      </ion-item>
    </ion-list>
  </div>
</template>
