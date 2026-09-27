<script setup lang="ts">
import type { Item } from "../types";
import $styles from "./MenuItem.module.scss";
import { computed } from "vue";
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { warningOutline, imageOutline } from "ionicons/icons";
import { truncateText } from "@/utils";

const props = defineProps<{
  item: Item;
}>();

// 2. Computed Properties for UI Logic 搭配 Safe Navigation (Optional Chaining) 以避免報錯
const displayTitle = computed(() => {
  return (
    props.item?.title?.translations?.en || props.item?.id || "未註明商品名稱"
  );
});

const displayDescription = computed(() => {
  return (
    props.item?.description?.translations?.en ||
    props.item?.id ||
    "未註明商品備註"
  );
});

const displayImage = computed(() => {
  return props.item?.image_url || ""; // 若無圖片網址，交由 template 的 placeholder 處理
});

const formattedPrice = computed(() => {
  const price = props.item?.price_info?.price;
  if (typeof price !== "number") return "價格未定";

  // 假設 API 的 7500 代表 75.00 元。
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    minimumFractionDigits: 0,
  }).format(price / 100);
});

const maxQuantity = computed(() => {
  const overrides = props.item?.quantity_info?.overrides;
  if (!Array.isArray(overrides)) return null;

  const override = overrides.find(
    (o) => o?.quantity?.max_permitted !== undefined,
  );
  return override ? override.quantity.max_permitted : null;
});

const displayTags = computed(() => {
  const rawLabels = props.item?.tax_label_info?.default_value?.labels;
  if (!Array.isArray(rawLabels)) return [];

  // 將原始標籤轉換為使用者友善的中文
  const labelMap: Record<string, string> = {
    TEMP_HEATED: "加熱食品",
    CAT_PREPARED_FOOD: "熟食",
  };
  return rawLabels.map((label) => labelMap[label] || label);
});

const modifier_ids = computed(() => props.item.modifier_group_ids?.ids || []);

const emit = defineEmits(["modifier_id"]);

const callPopup = function () {
  console.log(props.item.modifier_group_ids);
  emit("modifier_id", props.item.modifier_group_ids?.ids);
};
</script>

<template>
  <ion-card :class="$styles.menuItemCard">
    <template v-if="!item">
      <div :class="$styles.errorContainer">
        <ion-icon :icon="warningOutline" color="warning"></ion-icon>
        <p>無法載入商品資訊</p>
      </div>
    </template>
    <template v-else>
      <div :class="$styles.imageContainer">
        <!-- 圖片載入失敗時自動隱藏，顯示下方的 fallback -->
        <img
          v-if="displayImage"
          :src="displayImage"
          :alt="displayTitle"
          @error="$event.target.style.display = 'none'"
        />
        <!-- 沒有圖片或載入失敗時的 Fallback UI -->
        <div v-if="!displayImage" :class="$styles.imagePlaceholder">
          <ion-icon :icon="imageOutline"></ion-icon>
          <span>暫無圖片</span>
        </div>

        <div :class="$styles.quantityBadge" v-if="maxQuantity !== null">
          限購: {{ maxQuantity }}
        </div>
      </div>

      <ion-card-header :class="$styles.headerContainer">
        <ion-card-subtitle :class="$styles.itemCode">
          {{ item.external_data || "無編號" }}
        </ion-card-subtitle>
        <ion-card-title :class="$styles.itemTitle">{{ displayTitle }}</ion-card-title>
      </ion-card-header>
      <ion-card-content :class="$styles.contentContainer">
        <div :class="$styles.detailsRow">
          <span>{{ truncateText(displayDescription, 25) }}</span>
        </div>
        <div :class="$styles.detailsRow">
          <span
            :class="[$styles.price, { [$styles.priceUnknown]: formattedPrice === '價格未定' }]"
          >
            {{ formattedPrice }}
          </span>
        </div>
        <div :class="$styles.tagsContainer">
          <template v-if="displayTags.length > 0">
            <ion-badge
              v-for="(tag, index) in displayTags"
              :key="index"
              color="tertiary"
              :class="$styles.customBadge"
            >
              {{ tag }}
            </ion-badge>
          </template>
          <template v-else>
            <!-- 佔位用，防止沒有 tag 時 UI 塌陷 -->
            <span :class="$styles.emptyTag"></span>
          </template>
        </div>
        <div :class="$styles.actionContainer">
          <ion-button expand="block" fill="solid" color="primary">
            編輯內容
          </ion-button>

          <ion-button
            v-if="modifier_ids.length > 0"
            @click="callPopup"
            expand="block"
            fill="solid"
            color="tertiary"
          >
            附加內容
          </ion-button>
        </div>
      </ion-card-content>
    </template>
  </ion-card>
</template>
