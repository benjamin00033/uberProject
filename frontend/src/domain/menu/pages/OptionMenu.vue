<script setup lang="ts">
import SingleColumnLayout from "@/components/Layout/SingleColumnLayout.vue";
import { ref, computed } from "vue";
import $styles from "./OptionMenu.module.scss";
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
  IonLoading,
  IonButtons,
  IonAlert,
  IonModal,
  IonFooter,
} from "@ionic/vue";
import {
  addOutline,
  createOutline,
  trashOutline,
  optionsOutline,
} from "ionicons/icons";
import {
  useModifierGroups,
  useModifierGroupMutation,
} from "../hooks/useModifierGroups";
import ModifierGroupForm from "../components/ModifierGroupForm.vue";
import Pagination from "@/components/Pagination.vue";
import type { ModifierGroup } from "../types";

const { data: modifierGroups, isPending, isError } = useModifierGroups();
const { createMutation, updateMutation, deleteMutation } =
  useModifierGroupMutation();

const { t } = useI18n();

const showForm = ref(false);
const editingGroup = ref<Partial<ModifierGroup> | undefined>(undefined);
const deleteAlertOpen = ref(false);
const deleteTargetId = ref<string>("");

// Pagination logic
const currentPage = ref(1);
const itemsPerPage = 10;

const paginatedGroups = computed(() => {
  if (!modifierGroups.value) return [];
  const start = (currentPage.value - 1) * itemsPerPage;
  return modifierGroups.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => {
  if (!modifierGroups.value) return 0;
  return Math.ceil(modifierGroups.value.length / itemsPerPage);
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const openNewForm = () => {
  editingGroup.value = undefined;
  showForm.value = true;
};

const openEditForm = (group: ModifierGroup) => {
  editingGroup.value = group;
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  editingGroup.value = undefined;
};

const handleSave = async (data: Partial<ModifierGroup>) => {
  if (editingGroup.value?.id) {
    // 編輯模式
    await updateMutation.mutateAsync({ id: editingGroup.value.id, data });
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
    text: t("modifierGroup.page.cancel"),
    role: "cancel",
    handler: () => {
      deleteAlertOpen.value = false;
    },
  },
  {
    text: t("modifierGroup.page.delete"),
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
            :icon="optionsOutline"
            :class="$styles.titleIcon"
          ></ion-icon>
          {{ t("routes.OptionMenu.title") }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openNewForm" v-if="!showForm">
            <ion-icon :icon="addOutline" slot="start"></ion-icon>
            {{ t("modifierGroup.page.addGroup") }}
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
        {{ t("modifierGroup.page.error") }}
      </div>
      <template v-else>
        <!-- 列表區塊 -->
        <ion-list>
          <ion-item v-for="group in paginatedGroups" :key="group.id">
            <ion-label>
              <h2>
                {{
                  group.title?.translations?.zh ||
                  group.title?.translations?.en ||
                  group.id
                }}
              </h2>
              <p>
                ID: {{ group.id }} | {{ t("modifierGroup.page.optionsCount") }}
                {{ group.modifier_options?.length || 0 }}
              </p>
            </ion-label>
            <ion-button slot="end" fill="clear" @click="openEditForm(group)">
              <ion-icon :icon="createOutline"></ion-icon>
            </ion-button>
            <ion-button
              slot="end"
              color="danger"
              fill="clear"
              @click="confirmDelete(group.id)"
            >
              <ion-icon :icon="trashOutline"></ion-icon>
            </ion-button>
          </ion-item>

          <div v-if="modifierGroups?.length === 0" :class="$styles.emptyState">
            {{ t("modifierGroup.page.empty") }}
          </div>
        </ion-list>

        <!-- 表單 Modal -->
        <ion-modal :is-open="showForm" @didDismiss="closeForm">
          <template #header>
      <ion-header>
            <ion-toolbar>
              <ion-title>{{
                editingGroup?.id
                  ? t("modifierGroup.form.editTitle")
                  : t("modifierGroup.form.addTitle")
              }}</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="closeForm">{{
                  t("modifierGroup.page.cancel")
                }}</ion-button>
              </ion-buttons>
            </ion-toolbar>
                </ion-header>
    </template>
          
            <ModifierGroupForm
              :initial-data="editingGroup"
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
        :header="t('modifierGroup.page.deleteConfirmTitle')"
        :message="t('modifierGroup.page.deleteConfirmMessage')"
        :buttons="alertButtons"
        @didDismiss="deleteAlertOpen = false"
      ></ion-alert>
    

    <ion-footer v-if="!isPending && !isError">
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="modifierGroups?.length || 0"
        @update:currentPage="handlePageChange"
      />
    </ion-footer>
  </SingleColumnLayout>
</template>
