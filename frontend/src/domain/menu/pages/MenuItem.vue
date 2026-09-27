<script setup lang="ts">
import SingleColumnLayout from "@/components/Layout/SingleColumnLayout.vue";
import { ref, computed } from "vue";
import $styles from "./MenuItem.module.scss";
import { useI18n } from "vue-i18n";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonButtons,
  IonAlert,
  IonModal,
  IonFooter,
  IonLoading,
} from "@ionic/vue";
import {
  addOutline,
  createOutline,
  trashOutline,
  fastFoodOutline,
} from "ionicons/icons";
import { useMenuItems, useMenuItemMutation } from "../hooks/useMenuItems";
import MenuItemForm from "../components/MenuItemForm.vue";
import Pagination from "@/components/Pagination.vue";
import type { Item } from "../types";

const { data: menuItems, isPending, isError } = useMenuItems();
const { createMutation, updateMutation, deleteMutation } =
  useMenuItemMutation();

const { t } = useI18n();

const showForm = ref(false);
const editingItem = ref<Partial<Item> | undefined>(undefined);
const deleteAlertOpen = ref(false);
const deleteTargetId = ref<string>("");

// Pagination logic
const currentPage = ref(1);
const itemsPerPage = 10;

const paginatedItems = computed(() => {
  if (!menuItems.value) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  return menuItems.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  if (!menuItems.value) return 0;
  return Math.ceil(menuItems.value.length / itemsPerPage);
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const openNewForm = () => {
  editingItem.value = undefined;
  showForm.value = true;
};

const openEditForm = (item: Item) => {
  editingItem.value = item;
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  editingItem.value = undefined;
};

const handleSave = async (data: Partial<Item>) => {
  if (editingItem.value?.id) {
    // 編輯模式
    await updateMutation.mutateAsync({ id: editingItem.value.id, data });
  } else {
    // 新增模式
    await createMutation.mutateAsync(data);
  }
  closeForm();
};

const confirmDelete = (id: string) => {
  deleteTargetId.value = id;
  deleteAlertOpen.value = true;
};

const handleDelete = async () => {
  if (deleteTargetId.value) {
    await deleteMutation.mutateAsync(deleteTargetId.value);
  }
  deleteAlertOpen.value = false;
};

const alertButtons = [
  {
    text: t("menuItem.page.cancel"),
    role: "cancel",
    handler: () => {
      deleteAlertOpen.value = false;
    },
  },
  {
    text: t("menuItem.page.delete"),
    role: "confirm",
    handler: handleDelete,
  },
];
</script>

<template>
  <SingleColumnLayout>
    <template #header>
      <ion-header>
      <ion-toolbar>
        <ion-title :class="$styles.pageTitle">
          <ion-icon
            :icon="fastFoodOutline"
            :class="$styles.titleIcon"
          ></ion-icon>
          {{ t("routes.menuItems.title") }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openNewForm" v-if="!showForm">
            <ion-icon :icon="addOutline" slot="start"></ion-icon>
            {{ t("menuItem.page.addItem") }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
          </ion-header>
    </template>

    
      <ion-loading
        v-if="isPending"
        :is-open="isPending"
        message="Loading..."
        duration="3000"
      ></ion-loading>
      <div v-else-if="isError" :class="$styles.errorState">
        {{ t("menuItem.page.error") }}
      </div>

      <template v-else>
        <!-- 列表區塊 -->
        <ion-list>
          <ion-item v-for="item in paginatedItems" :key="item.id">
            <ion-label>
              <h2>
                {{
                  item.title?.translations?.zh ||
                  item.title?.translations?.en ||
                  item.id
                }}
              </h2>
              <p>ID: {{ item.id }} | 價格: {{ item.price_info?.price || 0 }}</p>
              <p v-if="item.modifier_group_ids?.ids?.length">
                選項群組: {{ item.modifier_group_ids.ids.join(", ") }}
              </p>
            </ion-label>
            <ion-button slot="end" fill="clear" @click="openEditForm(item)">
              <ion-icon :icon="createOutline"></ion-icon>
            </ion-button>
            <ion-button
              slot="end"
              color="danger"
              fill="clear"
              @click="confirmDelete(item.id)"
            >
              <ion-icon :icon="trashOutline"></ion-icon>
            </ion-button>
          </ion-item>

          <div v-if="menuItems?.length === 0" :class="$styles.emptyState">
            {{ t("menuItem.page.empty") }}
          </div>
        </ion-list>

        <!-- 表單 Modal -->
        <ion-modal :is-open="showForm" @didDismiss="closeForm">
          <template #header>
      <ion-header>
            <ion-toolbar>
              <ion-title>{{
                editingItem?.id
                  ? t("menuItem.form.editTitle")
                  : t("menuItem.form.addTitle")
              }}</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="closeForm">{{
                  t("menuItem.page.cancel")
                }}</ion-button>
              </ion-buttons>
            </ion-toolbar>
                </ion-header>
    </template>
          
            <MenuItemForm
              :initial-data="editingItem"
              :is-submitting="
                createMutation.isPending.value || updateMutation.isPending.value
              "
              @save="handleSave"
              @cancel="closeForm"
            />
          
        </ion-modal>
      </template>

      <!-- 刪除確認對話框 -->
      <ion-alert
        :is-open="deleteAlertOpen"
        :header="t('menuItem.page.deleteConfirmTitle')"
        :message="t('menuItem.page.deleteConfirmMessage')"
        :buttons="alertButtons"
        @didDismiss="deleteAlertOpen = false"
      ></ion-alert>
    

    <ion-footer v-if="!isPending && !isError">
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="menuItems?.length || 0"
        @update:currentPage="handlePageChange"
      />
    </ion-footer>
  </SingleColumnLayout>
</template>
