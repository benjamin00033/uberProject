<script setup lang="ts">
import { computed } from "vue";
import $styles from "./DynamicFieldBuilder.module.scss";
import {
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import type { FormField } from "../../types";
import TextInputBuilder from "./TextInputBuilder.vue";
import OptionsBuilder from "./OptionsBuilder.vue";
import { add, trash } from "ionicons/icons";
import { IonButton, IonIcon } from "@ionic/vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{ modelValue: FormField }>();
const emit = defineEmits(["update:modelValue"]);

const field = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const builderComponent = computed(() => {
  switch (field.value.type) {
    case "text":
      return TextInputBuilder;
    case "select":
    case "radio":
    case "multi-select":
      return OptionsBuilder;
    default:
      return null;
  }
});

// 初始化 props
if (!field.value.props) {
  field.value.props = {};
}

const addChildField = () => {
  if (!field.value.children) {
    field.value.children = [];
  }
  field.value.children.push({
    id: crypto.randomUUID(),
    label: "新增子欄位",
    type: "text",
    defaultValue: "",
    props: {},
  });
};

const removeChildField = (index: number) => {
  if (field.value.children) {
    field.value.children.splice(index, 1);
  }
};

const addItemSchemaField = () => {
  if (!field.value.itemSchema) {
    field.value.itemSchema = [];
  }
  if (!Array.isArray(field.value.itemSchema)) {
    field.value.itemSchema = [field.value.itemSchema];
  }
  field.value.itemSchema.push({
    id: crypto.randomUUID(),
    label: "新增陣列子欄位",
    type: "text",
    defaultValue: "",
    props: {},
  });
};

const removeItemSchemaField = (index: number) => {
  if (Array.isArray(field.value.itemSchema)) {
    field.value.itemSchema.splice(index, 1);
  }
};
</script>

<template>
  <div :class="$styles.fieldContainer">
    <ion-item>
      <ion-label position="stacked">欄位 ID (Key)</ion-label>
      <ion-input v-model="field.id" placeholder="如: username"></ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">欄位名稱 (Label)</ion-label>
      <ion-input
        v-model="field.label as unknown as string"
        placeholder="顯示名稱"
      ></ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">欄位型別</ion-label>
      <ion-select v-model="field.type">
        <ion-select-option value="text">單行文字 (text)</ion-select-option>
        <ion-select-option value="number">{{ t('dynamicForm.builder.typeNumber') }}</ion-select-option>
        <ion-select-option value="select">下拉選單 (select)</ion-select-option>
        <ion-select-option value="checkbox">核取方塊 (checkbox)</ion-select-option>
        <ion-select-option value="radio">單選按鈕 (radio)</ion-select-option>
        <ion-select-option value="datepicker">日期選擇 (datepicker)</ion-select-option>
        <ion-select-option value="slider">{{ t('dynamicForm.builder.typeSlider') }}</ion-select-option>
        <ion-select-option value="group">{{ t('dynamicForm.builder.typeGroup') }}</ion-select-option>
        <ion-select-option value="accordion">{{ t('dynamicForm.builder.typeAccordion') }}</ion-select-option>
        <ion-select-option value="array">{{ t('dynamicForm.builder.typeArray') }}</ion-select-option>
      </ion-select>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">預設值 (Default Value)</ion-label>
      <ion-input v-model="field.defaultValue"></ion-input>
    </ion-item>

    <ion-item>
      <ion-label position="stacked">提示文字 (Placeholder)</ion-label>
      <ion-input v-model="field.placeholder as unknown as string"></ion-input>
    </ion-item>

    <div
      v-if="builderComponent"
      :class="['ion-margin-top', $styles.propsSection]"
    >
      <ion-label
        color="medium"
        :class="$styles.propsTitle"
        >型別專屬設定 (Props)</ion-label
      >
      <component :is="builderComponent" v-model="field.props" />
    </div>

    <!-- 巢狀結構 (Tree) 子欄位設定 -->
    <div v-if="['group', 'accordion', 'object'].includes(field.type)" :class="['ion-margin-top', $styles.groupConfig]">
      <ion-label color="primary"><strong>{{ t('dynamicForm.builder.childrenConfig') }}</strong></ion-label>
      
      <div v-for="(child, idx) in field.children || []" :key="child.id || idx" :class="$styles.childField">
        <DynamicFieldBuilder v-model="field.children![idx]" />
        <ion-button color="danger" size="small" fill="clear" @click="removeChildField(idx)">
          <ion-icon slot="start" :icon="trash"></ion-icon>
          {{ t('dynamicForm.builder.removeChild') }}
        </ion-button>
      </div>

      <ion-button size="small" fill="outline" @click="addChildField" class="ion-margin-top">
        <ion-icon slot="start" :icon="add"></ion-icon>
        {{ t('dynamicForm.builder.addChild') }}
      </ion-button>
    </div>

    <!-- 動態陣列 (Array) 子欄位設定 -->
    <div v-if="field.type === 'array'" :class="['ion-margin-top', $styles.arrayConfig]">
      <ion-label color="tertiary"><strong>{{ t('dynamicForm.builder.itemSchemaConfig') }}</strong></ion-label>
      
      <div v-for="(itemSchema, idx) in (Array.isArray(field.itemSchema) ? field.itemSchema : [])" :key="itemSchema.id || idx" :class="$styles.itemSchemaField">
        <!-- We use type assertion since we checked it is an array in the loop -->
        <DynamicFieldBuilder v-model="(field.itemSchema as any)[idx]" />
        <ion-button color="danger" size="small" fill="clear" @click="removeItemSchemaField(idx)">
          <ion-icon slot="start" :icon="trash"></ion-icon>
          {{ t('dynamicForm.builder.removeItemSchema') }}
        </ion-button>
      </div>

      <ion-button size="small" fill="outline" @click="addItemSchemaField" class="ion-margin-top">
        <ion-icon slot="start" :icon="add"></ion-icon>
        {{ t('dynamicForm.builder.addItemSchema') }}
      </ion-button>
    </div>
  </div>
</template>
