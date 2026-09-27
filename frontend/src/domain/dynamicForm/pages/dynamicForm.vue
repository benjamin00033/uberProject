<script setup lang="ts">
import SingleColumnLayout from "@/components/Layout/SingleColumnLayout.vue";
import { ref, computed, watch } from "vue";
import $styles from "./dynamicForm.module.scss";
import { useI18n } from "vue-i18n";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonButton,
  IonButtons,
  IonFooter,
  IonItem,
  IonLabel,
  IonLoading,
} from "@ionic/vue";
import FormFieldRenderer from "../components/FormFieldRenderer.vue";
import type { FormStep, I18nString } from "../types.ts";
import { useDynamicForm } from "../composables/useDynamicForm";

const { locale } = useI18n();
const { schema, isLoading, error, fetchSchema } = useDynamicForm();

const formData = ref<Record<string, any>>({});
const fieldLabelDict = ref<Record<string, I18nString>>({});
const currentStepIndex = ref(0);

// 當 schema 從 API (useApiQuery) 載入成功時，初始化 formData 的預設值
watch(
  schema,
  (newSchema) => {
    if (newSchema) {
      newSchema.steps.forEach((step) => {
        step.fields.forEach((field) => {
          // 如果原本已經有值，就不覆蓋 (避免重新 refetch 時洗掉使用者的輸入)
          if (formData.value[field.id] === undefined) {
            formData.value[field.id] = field.defaultValue;
          }
        });
      });
    }
  },
  { immediate: true },
);

const handleRegisterLabel = (payload: { id: string; label: I18nString }) => {
  fieldLabelDict.value[payload.id] = payload.label;
};

// Helper recursive function to extract all labels from schema
const extractLabels = (fields: any[]) => {
  fields.forEach(field => {
    fieldLabelDict.value[field.id] = field.label;
    if (field.children) extractLabels(field.children);
    if (field.itemSchema) {
      if (Array.isArray(field.itemSchema)) extractLabels(field.itemSchema);
      else extractLabels([field.itemSchema]);
    }
  });
};

watch(
  schema,
  (newSchema) => {
    if (newSchema) {
      newSchema.steps.forEach(step => extractLabels(step.fields));
    }
  },
  { immediate: true }
);

// 當前索引等於 steps 長度時，表示進入「確認選擇」頁面
const isConfirmationStep = computed(() => {
  return schema.value
    ? currentStepIndex.value === schema.value.steps.length
    : false;
});

// 取得當前的 Step 資料
const currentStep = computed<FormStep | null>(() => {
  if (!schema.value || isConfirmationStep.value) return null;
  return schema.value.steps[currentStepIndex.value];
});

// 解析 I18nString (若無對應語系，優先使用中文 zh)
const resolveI18nTitle = (val?: I18nString) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val[locale.value] || val["zh"] || val["en"] || "";
};

// 處理 Header 標題顯示
const pageTitle = computed(() => {
  if (isLoading.value) return locale.value === "zh" ? "載入中..." : "Loading...";
  if (error.value) return "Error";
  if (isConfirmationStep.value) {
    return locale.value === "zh" ? "確認選擇" : "Confirm Selections";
  }
  const titleVal = currentStep.value?.stepTitle || schema.value?.title;
  return resolveI18nTitle(titleVal);
});

// 導覽邏輯
const nextStep = () => {
  if (schema.value && currentStepIndex.value <= schema.value.steps.length) {
    currentStepIndex.value++;
  }
};

const prevStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
  }
};

// 送出表單
const submit = () => {
  console.log("Final Form Data Submitted:", formData.value);
  alert(
    locale.value === "zh" ? "表單送出成功！" : "Form Submitted successfully!",
  );
};

// 格式化最後一頁資料的顯示
const formatValue = (val: any) => {
  if (Array.isArray(val)) return `[陣列 ${val.length} 筆]`;
  if (typeof val === "object" && val !== null) return `[物件資料]`;
  if (typeof val === "boolean") {
    return val
      ? locale.value === "zh"
        ? "是"
        : "Yes"
      : locale.value === "zh"
        ? "否"
        : "No";
  }
  return val;
};

// 解析最後一頁資料標題的顯示 (對應多語系)
const resolveLabel = (id: string) => {
  const labelObj = fieldLabelDict.value[id];
  if (!labelObj) return id;
  if (typeof labelObj === "string") return labelObj;
  return labelObj[locale.value] || labelObj["en"] || id;
};
</script>

<template>
  <SingleColumnLayout>
    <template #header>
      <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <!-- 不在第一頁時，顯示返回按鈕 -->
          <ion-button v-if="currentStepIndex > 0" @click="prevStep">
            {{ locale === "zh" ? "返回" : "Back" }}
          </ion-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
          </ion-header>
    </template>

    
      <ion-loading
        v-if="isLoading"
        :is-open="isLoading"
        :message="locale === 'zh' ? '載入表單中...' : 'Loading form...'"
      ></ion-loading>

      <div
        v-else-if="error"
        :class="['ion-text-center', 'ion-padding', $styles.errorText]"
      >
        <p>{{ error }}</p>
      </div>

      <template v-else-if="schema">
        <!-- 動態表單渲染區 -->
        <div v-if="!isConfirmationStep && currentStep">
          <FormFieldRenderer
            :fields="currentStep.fields"
            v-model="formData"
          />
        </div>

        <!-- 確認選擇頁面 (最後一頁固定出現) -->
        <ion-list lines="full" v-else-if="isConfirmationStep">
          <ion-item v-for="(value, key) in formData" :key="key">
            <ion-label class="ion-text-wrap">
              <h3 :class="$styles.confirmLabel">
                {{ resolveLabel(String(key)) }}
              </h3>
              <p :class="$styles.confirmValue">
                {{ formatValue(value) }}
              </p>
            </ion-label>
          </ion-item>
        </ion-list>
      </template>
    

    <!-- 固定在底部的導航按鈕 -->
    <ion-footer v-if="schema && !isLoading && !error">
      <ion-toolbar>
        <ion-button v-if="!isConfirmationStep" expand="block" @click="nextStep">
          {{ locale === "zh" ? "下一步" : "Next Step" }}
        </ion-button>
        <ion-button v-else expand="block" color="success" @click="submit">
          {{ locale === "zh" ? "確認並送出" : "Confirm & Submit" }}
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  </SingleColumnLayout>
</template>
