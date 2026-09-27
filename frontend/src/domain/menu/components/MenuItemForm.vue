<script setup lang="ts">
import { ref, watch } from 'vue';
import $styles from './MenuItemForm.module.scss';
import { useI18n } from 'vue-i18n';
import {
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonButton, IonIcon,
  IonList, IonSelect, IonSelectOption
} from '@ionic/vue';
import { saveOutline } from 'ionicons/icons';
import type { Item } from '../types';
import { menuItemSchema } from '../schemas/menuItem.schema';
import { useModifierGroups } from '../hooks/useModifierGroups';

const props = defineProps<{
  initialData?: Partial<Item>;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  (e: 'save', data: Partial<Item>): void;
  (e: 'cancel'): void;
}>();

const { t } = useI18n();

// 取得所有的選項群組，供下拉多選使用
const { data: modifierGroups } = useModifierGroups();

const formData = ref<Partial<Item>>({
  id: '',
  title: { translations: { en: '', zh: '' } },
  description: { translations: { en: '', zh: '' } },
  price_info: { price: 0 },
  image_url: '',
  modifier_group_ids: { ids: [] }
});

const errors = ref<Record<string, string>>({});

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    formData.value = JSON.parse(JSON.stringify(newVal));
  } else {
    formData.value = {
      id: '',
      title: { translations: { en: '', zh: '' } },
      description: { translations: { en: '', zh: '' } },
      price_info: { price: 0 },
      image_url: '',
      modifier_group_ids: { ids: [] }
    };
  }
  
  if (!formData.value.title) formData.value.title = { translations: { en: '', zh: '' } };
  if (!formData.value.description) formData.value.description = { translations: { en: '', zh: '' } };
  if (!formData.value.price_info) formData.value.price_info = { price: 0 };
  if (!formData.value.modifier_group_ids) formData.value.modifier_group_ids = { ids: [] };
  if (!formData.value.modifier_group_ids.ids) formData.value.modifier_group_ids.ids = [];
}, { immediate: true, deep: true });

const validateAndSave = () => {
  const result = menuItemSchema.safeParse(formData.value);
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
  <ion-card :class="$styles.menuItemForm">
    <ion-card-header>
      <ion-card-title>{{ initialData?.id ? t('menuItem.form.editTitle') : t('menuItem.form.addTitle') }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-list>
        <ion-item>
          <ion-input
            v-model="formData.id"
            :label="t('menuItem.form.itemId')"
            label-placement="floating"
            :disabled="!!initialData?.id"
            :placeholder="t('menuItem.form.itemIdPlaceholder')"
          ></ion-input>
        </ion-item>
        <div v-if="errors.id" :class="$styles.errorText">{{ errors.id }}</div>

        <ion-item>
          <ion-input
            v-model="formData.title!.translations.zh"
            :label="t('menuItem.form.zhTitle')"
            label-placement="floating"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-input
            v-model="formData.title!.translations.en"
            :label="t('menuItem.form.enTitle')"
            label-placement="floating"
          ></ion-input>
        </ion-item>
        
        <ion-item>
          <ion-input
            v-model="formData.description!.translations.zh"
            :label="t('menuItem.form.zhDesc')"
            label-placement="floating"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-input
            v-model="formData.description!.translations.en"
            :label="t('menuItem.form.enDesc')"
            label-placement="floating"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-input
            type="number"
            v-model.number="formData.price_info!.price"
            :label="t('menuItem.form.price')"
            label-placement="floating"
            min="0"
          ></ion-input>
        </ion-item>
        <div v-if="errors['price_info.price']" :class="$styles.errorText">{{ errors['price_info.price'] }}</div>

        <ion-item>
          <ion-input
            v-model="formData.image_url"
            :label="t('menuItem.form.imageUrl')"
            label-placement="floating"
          ></ion-input>
        </ion-item>
        <div v-if="errors.image_url" :class="$styles.errorText">{{ errors.image_url }}</div>

        <ion-item>
          <ion-select
            v-model="formData.modifier_group_ids!.ids"
            :label="t('menuItem.form.modifierGroups')"
            :placeholder="t('menuItem.form.modifierGroupsSelect')"
            multiple="true"
          >
            <ion-select-option v-for="group in modifierGroups" :key="group.id" :value="group.id">
              {{ group.title?.translations?.zh || group.id }}
            </ion-select-option>
          </ion-select>
        </ion-item>

      </ion-list>

      <div :class="$styles.actionButtons">
        <ion-button color="medium" fill="outline" @click="emit('cancel')">{{ t('menuItem.form.cancel') }}</ion-button>
        <ion-button color="primary" @click="validateAndSave" :disabled="isSubmitting">
          <ion-icon :icon="saveOutline" slot="start"></ion-icon>
          {{ t('menuItem.form.save') }}
        </ion-button>
      </div>
    </ion-card-content>
  </ion-card>
</template>
