<script setup lang="ts">
import SingleColumnLayout from "@/components/Layout/SingleColumnLayout.vue";
import $styles from "./Menu.module.scss";
import MenuItem from "../components/MenuItem.vue";
import MenuInfo from "../components/MenuInfo.vue";
import MenuModifier from "../components/MenuModifier.vue";
import { useScrollToCenter } from "@/composables/useScrollToCenter";
import { IonList, IonItem, IonSelect, IonSelectOption, IonLoading, IonGrid, IonRow, IonCol, IonTitle, IonIcon, IonHeader, IonToolbar } from "@ionic/vue";
import { useI18n } from "vue-i18n";
import { restaurantOutline } from "ionicons/icons";
import { storeToRefs } from "pinia";
import { useMenuStore } from "../store/useMenuStore";
import { useMenuPage } from "../composables/useMenuPage";

const { t } = useI18n();
const { scrollTo } = useScrollToCenter();

const store = useMenuStore();
const { scenario, isPending, menus, modifierGroups, groupedMenuItems } = storeToRefs(store);

const { isOpen, modifierIds, receiveModifierIds, handleModalUpdate } = useMenuPage();

const scenarioOptions = [
  { id: 1, key: "happyPath", value: "正常流程" },
  { id: 2, key: "emptyMenu", value: "空菜單" },
  { id: 3, key: "missingOptionals", value: "缺少選填項目" },
  { id: 4, key: "suspended", value: "暫停供應" },
  { id: 5, key: "complexModifier", value: "複雜客製化" },
  { id: 6, key: "dietary", value: "飲食標籤" },
  { id: 11, key: "customerRealData", value: "農夫的故事" },
  { id: 7, key: "priceOverrides", value: "覆寫價格" },
  { id: 8, key: "sellingInfo", value: "銷售資訊" },
  { id: 9, key: "orphanEntity", value: "孤立資料" },
  { id: 12, key: "retailAndCompliance", value: "零售、超商與食安資訊" },
  { id: 13, key: "advancedPricingAndBundles", value: "價格與退款進階情境" },
  { id: 14, key: "coco", value: "COCO菜單" },
  { id: 10, key: "apiError", value: "API 錯誤" },
  { id: 15, key: "test", value: "測試API" },
];

function onModalUpdate(newIsOpen: boolean) {
  handleModalUpdate(newIsOpen);
  if (!newIsOpen) {
    // Wait, in Pinia, if we just assigned modifierGroups, it would mutate the state. 
    // Usually we don't need to clear modifier_groups if it's derived from API data.
    // The original code did: modifier_groups = [] which mutated a computed ref (error).
    // In vue 3, mutating a computed ref will cause a warning and does nothing. 
    // We can just ignore it or clear the ids.
    modifierIds.value = [];
  }
}
</script>

<template>
  <SingleColumnLayout>
    <template #header>
      <ion-header>
      <ion-toolbar>
        <ion-title :class="$styles.pageTitle">
          <ion-icon
            :icon="restaurantOutline"
            :class="$styles.titleIcon"
          ></ion-icon>
          {{ t("routes.menu.title") }}
        </ion-title>
      </ion-toolbar>
          </ion-header>
    </template>
    <ion-list>
      <ion-item>
        <ion-select
          :class="$styles.myDesktopSelect"
          interface="popover"
          v-model="scenario"
          label="狀況"
        >
          <ion-select-option
            v-for="option in scenarioOptions"
            :key="option.id"
            :value="option.key"
            >{{ option.value }}</ion-select-option
          >
        </ion-select>
      </ion-item>
    </ion-list>
    <MenuInfo
      :menu="menus"
      @scrollTo:Category="(id) => scrollTo('category-' + id)"
    >
    </MenuInfo>
    <MenuModifier
      :modifierIds="modifierIds"
      :is-open="isOpen"
      @update:isOpen="onModalUpdate"
      :allModifiers="modifierGroups"
    />
    
      <ion-loading
        :is-open="isPending"
        message="Loading..."
        duration="3000"
      ></ion-loading>
      <ion-grid :class="$styles.gridContainer" v-cloak v-if="!isPending">
        <template v-for="group in groupedMenuItems" :key="group.id">
          <!-- 分類標題 -->
          <ion-row :id="'category-' + group.id">
            <ion-col>
              <ion-title color="primary" size="large">{{
                group.title
              }}</ion-title>
            </ion-col>
          </ion-row>
          <!-- 該分類下的商品 -->
          <ion-row :class="$styles.ionCol">
            <MenuItem
              v-cloak
              :key="item.id"
              v-for="item in group.items"
              :item="item"
              @modifier_id="receiveModifierIds"
            />
          </ion-row>
        </template>
      </ion-grid>
    
  </SingleColumnLayout>
</template>
