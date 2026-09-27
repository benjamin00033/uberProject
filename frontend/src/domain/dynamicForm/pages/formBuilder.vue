<script setup lang="ts">
import SingleColumnLayout from "@/components/Layout/SingleColumnLayout.vue";
import { ref, watch } from "vue";
import $styles from "./formBuilder.module.scss";
import { useRoute } from "vue-router";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonInput,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from "@ionic/vue";
import { add, trash } from "ionicons/icons";
import { useDynamicFormBuilder } from "../composables/useDynamicFormBuilder";
import type { DynamicFormSchema, FormStep, FormField } from "../types";
import DynamicFieldBuilder from "../components/builders/DynamicFieldBuilder.vue";

const route = useRoute();
const formId = route.query.id as string | undefined;
const { schema, isLoading, createForm, updateForm, isCreating, isUpdating } =
  useDynamicFormBuilder(formId);

const draftSchema = ref<DynamicFormSchema>({
  formId: formId || `form_${Date.now()}`,
  title: "",
  totalSteps: 0,
  steps: [],
});

watch(
  schema,
  (newSchema) => {
    if (newSchema) {
      // 編輯模式，套用現有資料
      // 注意這裡因為 I18nString 可能是 string | Record，這裡簡化處理強制轉為字串或保留物件
      draftSchema.value = JSON.parse(JSON.stringify(newSchema));
    }
  },
  { immediate: true },
);

const step = ref(1);

const addStep = () => {
  const newStep: FormStep = {
    stepId: crypto.randomUUID(),
    stepTitle: `第${step.value}步`,
    fields: [],
  };
  draftSchema.value.steps.push(newStep);
  draftSchema.value.totalSteps = draftSchema.value.steps.length;
  step.value++;
};

const removeStep = (index: number) => {
  draftSchema.value.steps.splice(index, 1);
  draftSchema.value.totalSteps = draftSchema.value.steps.length;
};

const addField = (stepIndex: number) => {
  const newField: FormField = {
    id: crypto.randomUUID(),
    label: "新增欄位名稱",
    type: "text",
    defaultValue: "",
    props: {},
  };
  draftSchema.value.steps[stepIndex].fields.push(newField);
};

const removeField = (stepIndex: number, fieldIndex: number) => {
  draftSchema.value.steps[stepIndex].fields.splice(fieldIndex, 1);
};

const saveForm = async () => {
  try {
    if (formId) {
      await updateForm({ id: formId, data: draftSchema.value });
    } else {
      await createForm(draftSchema.value);
    }
    alert("Form saved successfully!");
  } catch (error) {
    alert("Error saving form: " + error);
  }
};
</script>

<template>
  <SingleColumnLayout>
    <template #header>
      <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/dynamicForm"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ formId ? "編輯表單" : "建立新表單" }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="saveForm" :disabled="isCreating || isUpdating"
            >儲存</ion-button
          >
        </ion-buttons>
      </ion-toolbar>
          </ion-header>
    </template>

    
      <div v-if="isLoading">載入中...</div>
      <div v-else>
        <ion-item>
          <ion-label position="stacked">表單標題</ion-label>
          <ion-input
            v-model="draftSchema.title as unknown as string"
            placeholder="輸入表單標題"
          ></ion-input>
        </ion-item>
        <div class="ion-margin-top">
          <div class="ion-margin-bottom">
            <ion-button @click="addStep" expand="block">
              <ion-icon slot="start" :icon="add"></ion-icon>
              新增步驟
            </ion-button>
          </div>

          <ion-card
            v-for="(step, index) in draftSchema.steps"
            :key="step.stepId"
          >
            <ion-card-header>
              <ion-card-title>
                <ion-input
                  v-model="step.stepTitle as unknown as string"
                  placeholder="步驟標題"
                ></ion-input>
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-button
                color="danger"
                fill="clear"
                @click="removeStep(index)"
              >
                <ion-icon slot="start" :icon="trash"></ion-icon>
                刪除此步驟
              </ion-button>

              <div class="ion-margin-top">
                <h4 :class="$styles.sectionHeader">欄位列表</h4>
                <template
                  v-for="(field, fieldIdx) in step.fields"
                  :key="field.id || fieldIdx"
                >
                  <DynamicFieldBuilder v-model="step.fields[fieldIdx]" />
                </template>
                <div :class="$styles.buttonGroup">
                  <ion-button
                    size="small"
                    fill="outline"
                    @click="addField(index)"
                  >
                    <ion-icon slot="start" :icon="add"></ion-icon>
                    新增欄位
                  </ion-button>
                  <ion-button
                    v-if="step.fields.length > 0"
                    color="danger"
                    size="small"
                    fill="clear"
                    @click="removeField(index, step.fields.length - 1)"
                  >
                    <ion-icon slot="start" :icon="trash"></ion-icon>
                    移除最後一欄
                  </ion-button>
                </div>
              </div>
            </ion-card-content>
          </ion-card>
        </div>
      </div>
    
  </SingleColumnLayout>
</template>
