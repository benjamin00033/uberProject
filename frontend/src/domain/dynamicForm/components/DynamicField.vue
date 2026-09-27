<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import type { FormField, I18nString } from "../../pages/types";
import TextInput from "./fields/TextInput.vue";
import SelectInput from "./fields/SelectInput.vue";
import CheckboxInput from "./fields/CheckboxInput.vue";
import RadioInput from "./fields/RadioInput.vue";
import DatepickerInput from "./fields/DatepickerInput.vue";
import RichtextInput from "./fields/RichtextInput.vue";
import MultiSelectInput from "./fields/MultiSelectInput.vue";

const props = defineProps<{
  field: FormField;
  modelValue: any;
}>();

const emit = defineEmits(["update:modelValue", "register:label"]);

onMounted(() => {
  emit("register:label", { id: props.field.id, label: props.field.label });
});
const { locale, t } = useI18n();

// Map string types to their respective Vue components.
const componentMap: Record<string, any> = {
  text: TextInput,
  select: SelectInput,
  checkbox: CheckboxInput,
  radio: RadioInput,
  datepicker: DatepickerInput,
  richtext: RichtextInput,
  "multi-select": MultiSelectInput,
};

const currentComponent = computed(() => {
  return componentMap[props.field.type] || TextInput; // Fallback to text input
});

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// 解析多語系字串 (支援字串或物件形式)
const resolveI18n = (val?: I18nString): string => {
  if (!val) return "";
  if (typeof val === "string") {
    // 支援直接套用 vue-i18n 的全域翻譯 key (如果找不到預設回傳原字串)
    const translated = t(val);
    return translated !== val ? translated : val[locale.value];
  }
  // 支援 { 'en': 'Username', 'zh': '使用者名稱' } 的物件資料結構
  return val[locale.value] || val["en"];
};

// 動態轉換整個 field 的文字內容，當語系切換時自動觸發更新
const translatedField = computed<FormField>(() => {
  const newField = { ...props.field };
  newField.label = resolveI18n(props.field.label);
  if (props.field.placeholder) {
    newField.placeholder = resolveI18n(props.field.placeholder);
  }

  // 處理選項清單內的多語系
  if (newField.props && Array.isArray(newField.props.options)) {
    newField.props = {
      ...newField.props,
      options: newField.props.options.map((opt: any) => ({
        ...opt,
        label: resolveI18n(opt.label),
      })),
    };
  }

  return newField;
});
</script>

<template>
  <component :is="currentComponent" :field="translatedField" v-model="value" />
</template>
