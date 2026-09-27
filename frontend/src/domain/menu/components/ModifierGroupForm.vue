<script setup lang="ts">
import { ref, watch } from 'vue';
import $styles from './ModifierGroupForm.module.scss';
import { useI18n } from 'vue-i18n';
import {
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonButton, IonIcon,
  IonList, IonItemDivider
} from '@ionic/vue';
import { trashOutline, addOutline, saveOutline } from 'ionicons/icons';
import type { ModifierGroup } from '../types';
import { modifierGroupSchema } from '../schemas/modifier.schema';

const props = defineProps<{
  initialData?: Partial<ModifierGroup>;
  isSubmitting?: boolean;
}>();

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'save', data: Partial<ModifierGroup>): void;
  (e: 'cancel'): void;
}>();

const formData = ref<Partial<ModifierGroup>>({
  id: '',
  title: { translations: { en: '', zh: '' } },
  modifier_options: []
});

const errors = ref<Record<string, string>>({});

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    formData.value = JSON.parse(JSON.stringify(newVal));
  } else {
    formData.value = {
      id: '',
      title: { translations: { en: '', zh: '' } },
      modifier_options: []
    };
  }
  
  if (!formData.value.title) {
    formData.value.title = { translations: { en: '', zh: '' } };
  }
  if (!formData.value.modifier_options) {
    formData.value.modifier_options = [];
  }
}, { immediate: true, deep: true });

const addOption = () => {
  formData.value.modifier_options?.push({ id: '', type: 'ITEM' });
};

const removeOption = (index: number) => {
  formData.value.modifier_options?.splice(index, 1);
};

const validateAndSave = () => {
  const result = modifierGroupSchema.safeParse(formData.value);
  if (!result.success) {
    errors.value = {};
    result.error.errors.forEach(err => {
      const path = err.path.join('.');
      errors.value[path] = err.message;
    });
    return;
  }
  errors.value = {};
  emit('save', formData.value);
};
</script>

<template>
  <ion-card :class="$styles.modifierGroupForm">
    <ion-card-header>
      <ion-card-title>{{ initialData?.id ? t('modifierGroup.form.editTitle') : t('modifierGroup.form.addTitle') }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-list>
        <ion-item>
          <ion-input
            v-model="formData.id"
            :label="t('modifierGroup.form.groupId')"
            label-placement="floating"
            :disabled="!!initialData?.id"
            :placeholder="t('modifierGroup.form.groupIdPlaceholder')"
          ></ion-input>
        </ion-item>
        <div v-if="errors.id" :class="$styles.errorText">{{ errors.id }}</div>

        <ion-item>
          <ion-input
            v-model="formData.title!.translations.zh"
            :label="t('modifierGroup.form.zhTitle')"
            label-placement="floating"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-input
            v-model="formData.title!.translations.en"
            :label="t('modifierGroup.form.enTitle')"
            label-placement="floating"
          ></ion-input>
        </ion-item>

        <ion-item-divider>
          <ion-label>{{ t('modifierGroup.form.options') }}</ion-label>
          <ion-button slot="end" fill="clear" @click="addOption">
            <ion-icon :icon="addOutline"></ion-icon> {{ t('modifierGroup.form.addOption') }}
          </ion-button>
        </ion-item-divider>

        <ion-item v-for="(option, index) in formData.modifier_options" :key="index">
          <ion-input
            v-model="option.id"
            :label="t('modifierGroup.form.optionId')"
            label-placement="floating"
            :placeholder="t('modifierGroup.form.optionIdPlaceholder')"
          ></ion-input>
          <ion-button slot="end" color="danger" fill="clear" @click="removeOption(index)">
            <ion-icon :icon="trashOutline"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>

      <div :class="$styles.actionButtons">
        <ion-button color="medium" fill="outline" @click="emit('cancel')">{{ t('modifierGroup.form.cancel') }}</ion-button>
        <ion-button color="primary" @click="validateAndSave" :disabled="isSubmitting">
          <ion-icon :icon="saveOutline" slot="start"></ion-icon>
          {{ t('modifierGroup.form.save') }}
        </ion-button>
      </div>
    </ion-card-content>
  </ion-card>
</template>
