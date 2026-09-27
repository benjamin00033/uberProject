<script setup lang="ts">
import SingleColumnLayout from "@/components/Layout/SingleColumnLayout.vue";
import $styles from "./MenuTime.module.scss";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLoading,
  toastController,
  IonIcon,
} from "@ionic/vue";
import { useI18n } from "vue-i18n";
import { timeOutline } from "ionicons/icons";
import { useMenu, useMenuMutation } from "../hooks/useMenuTimes";
import TimeScheduleEditor from "../components/TimeScheduleEditor.vue";
import type { Menu } from "../types";

const STORE_HOURS_ID = "store_hours";

const { t } = useI18n();

const { data: storeMenu, isPending, isError } = useMenu(STORE_HOURS_ID);
const { updateMutation } = useMenuMutation();

const handleSave = async (data: Partial<Menu>) => {
  await updateMutation.mutateAsync({ id: STORE_HOURS_ID, data });

  const toast = await toastController.create({
    message: t("menuTime.page.saveSuccess"),
    duration: 2000,
    color: "success",
    position: "top",
  });
  await toast.present();
};
</script>

<template>
  <SingleColumnLayout>
    <template #header>
      <ion-header>
      <ion-toolbar>
        <ion-title :class="$styles.pageTitle">
          <ion-icon :icon="timeOutline" :class="$styles.titleIcon"></ion-icon>
          {{ t("routes.MenuTime.title") }}
        </ion-title>
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
        {{ t("menuTime.page.error") }}
      </div>
      <template v-else>
        <div :class="$styles.pageDescription">
          <p>設定店家的營業時間，可以針對每週的每一天設定多段開放時段。</p>
        </div>
        <TimeScheduleEditor
          :initial-data="storeMenu"
          :is-submitting="updateMutation.isPending.value"
          @save="handleSave"
        />
      </template>
    
  </SingleColumnLayout>
</template>
