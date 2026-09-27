<script setup lang="ts">
import { computed } from "vue";
import $styles from "./MainLayout.module.scss";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { IonBreadcrumbs, IonBreadcrumb, IonBadge } from "@ionic/vue";
import MenuBar from "./MenuBar.vue";
import LayoutHeader from "./LayoutHeader.vue";

defineProps({
  moduleRoutes: {
    type: Array,
    default: () => [],
  },
});

const route = useRoute();
const { t } = useI18n();

const breadcrumbs = computed(() => {
  return route.matched.map((m) => {
    return {
      path: m.path || "/",
      name: m.name,
      title: m.meta?.title
        ? t(m.meta.title as string)
        : String(m.name || "Home"),
    };
  });
});
</script>

<template>
  <!-- ion-split-pane 自動處理側邊欄行為：
       在 md 以上螢幕顯示左側 menu，小螢幕隱藏並透過 menu-button 呼叫 -->
  <ion-split-pane when="md" :id="$styles.mainLayout" content-id="main-content">
    <!-- 左側選單 (手機版為抽屜選單，電腦版為固定側邊欄) -->
    <ion-menu content-id="main-content">
      <ion-header>
        <ion-toolbar>
          <ion-title :class="$styles.title">
            菜單平台 - 選單
            <ion-badge color="primary" :class="$styles.versionTag">v2.0.0</ion-badge>
          </ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <!-- 傳遞原本的 moduleRoutes，達到與電腦版無痛吻合 -->
        <MenuBar :menu-items="moduleRoutes" />
      </ion-content>
    </ion-menu>
    <!-- 主內容區 -->
    <ion-page id="main-content">
      <LayoutHeader />
      <ion-breadcrumbs :class="$styles.breadcrumbs">
        <ion-breadcrumb v-for="b in breadcrumbs" :key="b.path">
          {{ b.title }}
        </ion-breadcrumb>
      </ion-breadcrumbs>
      <ion-content>
        <!-- Breadcrumbs -->
        <!-- 主內容路由 -->
        <router-view />
      </ion-content>
    </ion-page>
  </ion-split-pane>
</template>
