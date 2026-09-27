<script setup lang="ts">
import { computed } from "vue";
import $styles from "./MenuModifier.module.scss";
import type { ModifierGroup } from "../types";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonBadge,
  IonIcon,
  IonText,
} from "@ionic/vue";
import { closeOutline, listOutline, warningOutline } from "ionicons/icons";

const props = defineProps<{
  isOpen: boolean;
  modifierIds?: string[];
  allModifiers?: ModifierGroup[];
  itemTitle?: string;
}>();

const emit = defineEmits<{
  (e: "update:isOpen", value: boolean): void;
}>();

const close = () => {
  emit("update:isOpen", false);
};

const displayModifiers = computed(() => {
  if (!props.allModifiers || !Array.isArray(props.allModifiers)) return [];
  if (!props.modifierIds || !Array.isArray(props.modifierIds)) return [];
  console.log(props.modifierIds, props.allModifiers);
  console.log(
    "props.modifierIds",
    !Array.isArray(props.modifierIds),
    "props.allModifiers",
    !Array.isArray(props.allModifiers),
  );
  // 根據 MenuItem 傳遞過來的 ID 陣列，篩選出對應的 modifier
  return props.allModifiers.filter((mod) =>
    props.modifierIds!.includes(mod.id),
  );
});

const getModTitle = (mod: ModifierGroup) => {
  return mod.title?.translations?.en || mod.id;
};

const getMinMaxText = (mod: ModifierGroup) => {
  const min = mod.quantity_info?.quantity?.min_permitted;
  const max = mod.quantity_info?.quantity?.max_permitted;

  if (min !== undefined && max !== undefined) {
    if (min === max) return `必選 ${min} 項`;
    return `選 ${min} - ${max} 項`;
  } else if (max !== undefined) {
    return `最多 ${max} 項`;
  } else if (min !== undefined) {
    return `最少 ${min} 項`;
  }
  return "不限數量";
};

// 整理 Entity ID（去掉結尾的英文字母與底線，僅保留主要名稱，視專案需求調整）
const formatOptionId = (id: string) => {
  return id.split("_")[0] || id;
};
</script>

<template>
  <ion-modal :is-open="isOpen" @didDismiss="close" class="responsive-modal">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{
          itemTitle ? `${itemTitle} - 客製化` : "客製化選項"
        }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="close" color="medium">
            <ion-icon :icon="closeOutline" size="large"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :class="['ion-padding', $styles.customBg]">
      <div v-if="displayModifiers.length === 0" :class="$styles.emptyState">
        <ion-icon :icon="warningOutline" :class="$styles.emptyIcon"></ion-icon>
        <ion-text color="medium">
          <h3>沒有可用的客製化選項</h3>
          <p>此商品目前無設定客製化項目，或是資料不存在。</p>
        </ion-text>
      </div>

      <div v-else>
        <ion-list
          v-for="mod in displayModifiers"
          :key="mod.id"
          :class="$styles.modifierGroup"
          lines="full"
        >
          <ion-list-header :class="$styles.groupHeader">
            <ion-label>
              <h2>{{ getModTitle(mod) }}</h2>
              <p>{{ getMinMaxText(mod) }}</p>
            </ion-label>

            <ion-badge
              v-if="
                mod.quantity_info?.quantity?.min_permitted &&
                mod.quantity_info.quantity.min_permitted > 0
              "
              color="danger"
            >
              必填
            </ion-badge>
            <ion-badge v-else color="medium">選填</ion-badge>
          </ion-list-header>

          <template
            v-if="mod.modifier_options && mod.modifier_options.length > 0"
          >
            <ion-item v-for="option in mod.modifier_options" :key="option.id">
              <ion-icon
                :icon="listOutline"
                slot="start"
                color="medium"
              ></ion-icon>
              <ion-label>
                {{ formatOptionId(option.id) }}
              </ion-label>
              <!-- 這裡可以根據未來需求加入 Checkbox / Radio -->
            </ion-item>
          </template>

          <template v-else>
            <ion-item>
              <ion-label color="medium" class="ion-text-center"
                >尚無選項資料</ion-label
              >
            </ion-item>
          </template>
        </ion-list>
      </div>
    </ion-content>
  </ion-modal>
</template>
