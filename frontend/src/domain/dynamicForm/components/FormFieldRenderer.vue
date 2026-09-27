<script setup lang="ts">
import { computed } from "vue";
import type { FormField } from "../types";
import { useI18n } from "vue-i18n";
import BaseInput from "@/components/UI/BaseInput.vue";
import BaseSelect from "@/components/UI/BaseSelect.vue";
import BaseCheckbox from "@/components/UI/BaseCheckbox.vue";
import BaseDatePicker from "@/components/UI/BaseDatePicker.vue";
import BaseSlider from "@/components/UI/BaseSlider.vue";
import BaseAccordion from "@/components/UI/BaseAccordion/BaseAccordion.vue";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon } from "@ionic/vue";
import { add, trash } from "ionicons/icons";

defineOptions({
  name: 'FormFieldRenderer'
});

const props = defineProps<{
  fields: FormField[];
  modelValue: Record<string, any>;
}>();

const emit = defineEmits(["update:modelValue"]);

const { locale, t } = useI18n();

const resolveI18n = (val: any): string => {
  if (!val) return "";
  if (typeof val === "string") {
    const translated = t(val);
    return translated !== val ? translated : val;
  }
  return val[locale.value] || val["en"] || "";
};

const updateField = (id: string, value: any) => {
  const newValue = { ...props.modelValue, [id]: value };
  emit("update:modelValue", newValue);
};

const addArrayItem = (id: string, itemSchema: FormField | FormField[]) => {
  const arr = Array.isArray(props.modelValue[id]) ? [...props.modelValue[id]] : [];
  arr.push({}); // Insert empty object, child renderer will populate defaults
  updateField(id, arr);
};

const removeArrayItem = (id: string, index: number) => {
  const arr = [...props.modelValue[id]];
  arr.splice(index, 1);
  updateField(id, arr);
};
</script>

<template>
  <div v-for="field in fields" :key="field.id" :class="$style.fieldWrapper">
    <!-- Group / Object Nested Structure -->
    <template v-if="field.type === 'group' || field.type === 'object'">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ resolveI18n(field.label) }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <FormFieldRenderer
            v-if="field.children"
            :fields="field.children"
            :modelValue="modelValue[field.id] || {}"
            @update:modelValue="updateField(field.id, $event)"
          />
        </ion-card-content>
      </ion-card>
    </template>

    <!-- Accordion Group Nested Structure -->
    <template v-else-if="field.type === 'accordion'">
      <BaseAccordion :title="resolveI18n(field.label)">
         <div class="ion-padding">
          <FormFieldRenderer
            v-if="field.children"
            :fields="field.children"
            :modelValue="modelValue[field.id] || {}"
            @update:modelValue="updateField(field.id, $event)"
          />
         </div>
      </BaseAccordion>
    </template>

    <!-- Array / List Multi-task Dynamic Forms -->
    <template v-else-if="field.type === 'array'">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ resolveI18n(field.label) }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div v-for="(item, index) in (modelValue[field.id] || [])" :key="index" :class="$style.arrayItem">
            <FormFieldRenderer
              v-if="field.itemSchema"
              :fields="Array.isArray(field.itemSchema) ? field.itemSchema : [field.itemSchema]"
              :modelValue="item"
              @update:modelValue="(newVal) => { const arr = [...(modelValue[field.id] || [])]; arr[index] = newVal; updateField(field.id, arr); }"
            />
            <ion-button color="danger" fill="clear" @click="removeArrayItem(field.id, index)">
              <ion-icon slot="start" :icon="trash"></ion-icon>
              {{ t('dynamicForm.renderer.remove', { label: resolveI18n(field.label) }) }}
            </ion-button>
          </div>
          <ion-button fill="outline" @click="addArrayItem(field.id, field.itemSchema!)">
            <ion-icon slot="start" :icon="add"></ion-icon>
            {{ t('dynamicForm.renderer.add', { label: resolveI18n(field.label) }) }}
          </ion-button>
        </ion-card-content>
      </ion-card>
    </template>

    <!-- Leaf Nodes (Base UI Components) -->
    <template v-else>
      <BaseInput
        v-if="field.type === 'text' || field.type === 'number'"
        :label="resolveI18n(field.label)"
        :placeholder="resolveI18n(field.placeholder)"
        :type="field.type as 'text' | 'number'"
        :modelValue="modelValue[field.id] !== undefined ? modelValue[field.id] : field.defaultValue"
        @update:modelValue="updateField(field.id, $event)"
        v-bind="field.props"
      />
      
      <BaseSelect
        v-else-if="field.type === 'select'"
        :label="resolveI18n(field.label)"
        :placeholder="resolveI18n(field.placeholder)"
        :options="field.props?.options || []"
        :modelValue="modelValue[field.id] !== undefined ? modelValue[field.id] : field.defaultValue"
        @update:modelValue="updateField(field.id, $event)"
        v-bind="field.props"
      />

      <BaseCheckbox
        v-else-if="field.type === 'checkbox'"
        :label="resolveI18n(field.label)"
        :modelValue="modelValue[field.id] !== undefined ? modelValue[field.id] : field.defaultValue"
        @update:modelValue="updateField(field.id, $event)"
        v-bind="field.props"
      />

      <BaseDatePicker
        v-else-if="field.type === 'datepicker'"
        :label="resolveI18n(field.label)"
        :modelValue="modelValue[field.id] !== undefined ? modelValue[field.id] : field.defaultValue"
        @update:modelValue="updateField(field.id, $event)"
        v-bind="field.props"
      />

      <BaseSlider
        v-else-if="field.type === 'slider'"
        :label="resolveI18n(field.label)"
        :modelValue="modelValue[field.id] !== undefined ? modelValue[field.id] : field.defaultValue"
        @update:modelValue="updateField(field.id, $event)"
        v-bind="field.props"
      />
    </template>
  </div>
</template>

<style module lang="scss">
.fieldWrapper {
  margin-bottom: 16px;
}
.arrayItem {
  border-bottom: 1px solid var(--ion-color-step-150);
  margin-bottom: 16px;
  padding-bottom: 16px;
}
</style>
