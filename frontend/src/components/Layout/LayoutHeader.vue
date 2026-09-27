<script setup lang="ts">
import $styles from "./LayoutHeader.module.scss";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonMenuButton,
  IonToggle,
  IonIcon,
  alertController,
  toastController
} from "@ionic/vue";
import { linkOutline } from "ionicons/icons";
import { useRouter } from "vue-router";
import { ref, onMounted, onUnmounted } from "vue";
import { useBreakpoints } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import axios from "axios";
import { setApiBaseUrl, apiClient } from "../../services/apiClient";

const router = useRouter();
const { locale } = useI18n();

const breakpoints = useBreakpoints({
  mobile: 0,
  tablet: 576,
  laptop: 768,
  desktop: 992,
});
const isMobile = breakpoints.smaller("tablet");

const toggleLanguage = (e: any) => {
  locale.value = e.detail.checked ? "en" : "zh";
};

const mockDataMap = [
  "test: 測試API",
  "happyPath: 正常流程",
  "emptyMenu: 空菜單",
  "missingOptionals: 缺少選填項目",
  "suspended: 暫停供應",
  "complexModifier: 複雜客製化",
  "dietary: 飲食標籤",
  "priceOverrides: 覆寫價格",
  "sellingInfo: 銷售資訊",
  "orphanEntity: 孤立資料",
  "customerRealData: 農夫的故事",
  "retailAndCompliance: 零售、超商與食安資訊",
  "advancedPricingAndBundles: 價格與退款進階情境",
  "coco: COCO菜單",
  "apiError: API 錯誤",
];

const handleApiTest = async () => {
  const message = mockDataMap.join(" | ");
  const alert = await alertController.create({
    header: "api後會去勾[?scenario=?]",
    message: message,
    cssClass: "my-json-alert",
    inputs: [
      {
        name: "url",
        type: "url",
        placeholder: "scenario=",
        value: apiClient.defaults.baseURL,
      },
    ],
    buttons: [
      {
        text: "取消",
        role: "cancel",
      },
      {
        text: "重製",
        handler: () => {
          localStorage.removeItem("API_BASE_URL");
        },
      },
      {
        text: "測試並套用",
        handler: async (data) => {
          const url = data.url;
          if (!url) return false;
          try {
            await axios.get(url);
            setApiBaseUrl(url);
            const toast = await toastController.create({
              message: `API 連線成功！已切換至新網址。`,
              duration: 2000,
              color: "success",
            });
            await toast.present();
          } catch (error) {
            const toast = await toastController.create({
              message: `API 測試失敗，請檢查網址或伺服器狀態。`,
              duration: 3000,
              color: "danger",
            });
            await toast.present();
            return false;
          }
        },
      },
    ],
  });
  await alert.present();
};

const logout = () => {
  router.push("/login");
};

const currentTime = ref("");
let timerWorker: Worker | null = null;

onMounted(() => {
  timerWorker = new Worker(
    new URL("../../helper/worker/timerWorker.ts", import.meta.url),
    { type: "module" },
  );

  timerWorker.onmessage = (e) => {
    if (e.data && e.data.time) {
      const d = new Date(e.data.time);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}`;
    }
  };

  timerWorker.postMessage({ command: "start" });
});

onUnmounted(() => {
  if (timerWorker) {
    timerWorker.postMessage({ command: "stop" });
    timerWorker.terminate();
    timerWorker = null;
  }
});
</script>

<template>
  <ion-header>
    <ion-toolbar class="layout-toolbar">
      <ion-buttons slot="start">
        <ion-menu-button></ion-menu-button>
      </ion-buttons>
      <ion-title :class="$styles.title">
        {{ isMobile ? "平台 (行動版)" : "菜單平台" }}
      </ion-title>
      <ion-buttons slot="end">
        <div v-if="!isMobile" :class="$styles.timeDisplay">{{ currentTime }}</div>
        <ion-toggle
          :checked="locale === 'en'"
          @ionChange="toggleLanguage"
          class="ion-padding-end"
          v-if="!isMobile"
        >
          {{ locale === "en" ? "EN" : "中文" }}
        </ion-toggle>
        <ion-button @click="handleApiTest" class="api-btn" v-if="!isMobile">
          <ion-icon slot="icon-only" :icon="linkOutline"></ion-icon>
        </ion-button>
        <ion-button @click="logout" class="logout-btn">Logout</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>
