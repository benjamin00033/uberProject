<script setup lang="ts">
import { computed, ref } from "vue";
import $styles from "./MenuInfo.module.scss";
import type { Menu } from "../types";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonLabel,
  IonIcon,
  IonChip,
  IonText,
  IonBadge,
} from "@ionic/vue";
import { calendarOutline, warningOutline } from "ionicons/icons";

const props = defineProps<{
  menu?: Menu[];
}>();

const hasMenus = computed(() => props.menu && props.menu.length > 0);

const emit = defineEmits<{
  (e: "scrollTo:Category", value: string): void;
}>();

const getTitle = (menuItem: Menu) => {
  return menuItem.title?.translations?.en || menuItem.id || "未命名菜單";
};

// const dayMap: Record<string, string> = {
//   monday: "星期一",
//   tuesday: "星期二",
//   wednesday: "星期三",
//   thursday: "星期四",
//   friday: "星期五",
//   saturday: "星期六",
//   sunday: "星期日",
// };

// const formatTimePeriods = (
//   periods: { start_time: string; end_time: string }[],
// ) => {
//   if (!periods || periods.length === 0) return "未設定時間";
//   return periods.map((p) => `${p.start_time} - ${p.end_time}`).join(", ");
// };

// 處理分類 ID，去掉後面的底線與英文（例如 "肉類咖哩_Meat_Curry" => "肉類咖哩"）
const formatCategoryId = (id: string) => {
  return id.split("_")[0] || id;
};

const activeCategory = ref<string>("");

const scrollToEmitter = function (categoryID: string) {
  activeCategory.value = categoryID;
  emit("scrollTo:Category", categoryID);
};
</script>

<template>
  <div :class="$styles.menuInfoContainer">
    <slot></slot>
    <!-- 狀況：沒有菜單 (Empty Menu / Suspended / API Error) -->
    <div v-if="!hasMenus" :class="$styles.emptyState">
      <ion-icon :icon="warningOutline" :class="$styles.emptyIcon"></ion-icon>
      <ion-text color="medium">
        <h3>目前沒有可用的菜單</h3>
        <p>這可能是因為暫停供應、目前並非營業時間，或發生連線錯誤。</p>
      </ion-text>
    </div>

    <!-- 狀況：有菜單 (Happy Path 等) -->
    <div v-else>
      <ion-card
        v-for="menuItem in props.menu"
        :key="menuItem.id"
        :class="$styles.menuCard"
      >
        <ion-card-header>
          <ion-card-title>{{ getTitle(menuItem) }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div
            v-if="
              menuItem.service_availability &&
              menuItem.service_availability.length > 0
            "
            class="availability-section"
          >
            <!-- <h3 class="section-title">
              <ion-icon :icon="timeOutline"></ion-icon> 供應時間
            </h3>
            <ion-list lines="none" class="schedule-list">
              <ion-item
                v-for="(schedule, index) in menuItem.service_availability"
                :key="index"
              >
                <ion-label>
                  {{ dayMap[schedule.day_of_week] || schedule.day_of_week }}
                </ion-label>
                <ion-note slot="end" color="primary">
                  {{ formatTimePeriods(schedule.time_periods) }}
                </ion-note>
              </ion-item>
            </ion-list> -->
          </div>
          <!-- 若缺少時間設定 -->
          <div v-else class="availability-section">
            <ion-text color="warning">
              <p>
                <ion-icon :icon="warningOutline"></ion-icon>
                此菜單未設定供應時間。
              </p>
            </ion-text>
          </div>
          <!-- 分類清單 -->
          <div
            v-if="menuItem.category_ids && menuItem.category_ids.length > 0"
            class="categories-section"
          >
            <h3 :class="$styles.sectionTitle">
              <ion-icon :icon="calendarOutline"></ion-icon> 包含分類
              <ion-badge color="light">{{
                menuItem.category_ids.length
              }}</ion-badge>
            </h3>
            <div :class="$styles.chipContainer">
              <ion-chip
                :invert="activeCategory === catId"
                outline
                color="primary"
                @click="() => scrollToEmitter(catId)"
                v-for="catId in menuItem.category_ids"
                :key="catId"
              >
                <ion-label>{{ formatCategoryId(catId) }}</ion-label>
              </ion-chip>
            </div>
          </div>
          <!-- 若沒有分類資料 (Missing Optionals / Orphan) -->
          <div v-else class="categories-section">
            <ion-text color="medium">
              <p>此菜單目前沒有分類項目。</p>
            </ion-text>
          </div>
        </ion-card-content>
      </ion-card>
    </div>
  </div>
</template>
