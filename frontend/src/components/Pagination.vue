<script setup lang="ts">
import { IonButton, IonIcon } from '@ionic/vue';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  currentPage: number;
  totalPages: number;
  totalItems?: number;
}>();

const { t } = useI18n();

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void;
  (e: 'page-change', page: number): void;
}>();

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page);
    emit('page-change', page);
  }
};
</script>

<template>
  <div class="pagination-wrapper">
    <div class="total-info" v-if="totalItems !== undefined">
      {{ t('pagination.totalItems', { total: totalItems }) }}
    </div>
    <div class="pagination-container" v-if="totalPages > 1">
      <ion-button 
        fill="clear" 
        :disabled="currentPage <= 1" 
        @click="goToPage(currentPage - 1)"
      >
        <ion-icon :icon="chevronBackOutline" slot="icon-only"></ion-icon>
      </ion-button>

      <div class="page-info">
        <span>{{ currentPage }} / {{ totalPages }}</span>
      </div>

      <ion-button 
        fill="clear" 
        :disabled="currentPage >= totalPages" 
        @click="goToPage(currentPage + 1)"
      >
        <ion-icon :icon="chevronForwardOutline" slot="icon-only"></ion-icon>
      </ion-button>
    </div>
  </div>
</template>

<style scoped>
.pagination-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  background: var(--ion-background-color);
  border-top: 1px solid var(--ion-color-step-150);
}
.total-info {
  font-size: 14px;
  color: var(--ion-color-medium);
  margin-bottom: 4px;
}
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}
.page-info {
  font-size: 14px;
  color: var(--ion-color-medium);
}
</style>
