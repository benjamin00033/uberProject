<script setup lang="ts">
import { IonList, IonItem, IonLabel, IonIcon, IonMenuToggle } from "@ionic/vue";
import $styles from "./MenuBar.module.scss";
import {
  homeOutline,
  megaphoneOutline,
  documentTextOutline,
  flaskOutline,
  videocamOutline,
  mapOutline,
  chevronForwardOutline,
  restaurantOutline,
  optionsOutline,
  timeOutline,
  fastFoodOutline,
  colorPaletteOutline,
} from "ionicons/icons";
import { useRouter } from "vue-router";

/**
 * Audit Notes (MenuBar Optimization):
 * 1. Dynamic Rendering: The menu now reacts to the `menuItems` prop, enabling DDD modularity.
 * 2. Icon Mapping: A robust map links route icons to Ionic icons.
 * 3. Navigation Logic: Centralized navigation handler for better control.
 */
interface MenuItem {
  path: string;
  name?: string;
  meta?: {
    title?: string;
    icon?: string;
  };
  children?: MenuItem[];
}

const props = withDefaults(
  defineProps<{
    menuItems?: MenuItem[];
  }>(),
  {
    menuItems: () => [],
  },
);

const router = useRouter();

// Map string icons from meta to actual IonIcons
const iconMap: Record<string, string> = {
  "home-outline": homeOutline,
  "megaphone-outline": megaphoneOutline,
  "document-text-outline": documentTextOutline,
  "flask-outline": flaskOutline,
  "videocam-outline": videocamOutline,
  "map-outline": mapOutline,
  "restaurant-outline": restaurantOutline,
  "options-outline": optionsOutline,
  "time-outline": timeOutline,
  "fast-food-outline": fastFoodOutline,
  "color-palette-outline": colorPaletteOutline,
};

const navigateTo = (path: string) => {
  router.push(path);
};

const getIcon = (iconName?: string) => {
  return iconName
    ? iconMap[iconName] || chevronForwardOutline
    : chevronForwardOutline;
};
</script>

<template>
  <ion-list lines="none" :class="$styles.menuList">
    <!-- Home is always first -->
    <!-- <ion-menu-toggle :auto-hide="false">
      <ion-item button @click="navigateTo('/home')" class="menu-item">
        <ion-icon slot="start" :icon="homeOutline" class="menu-icon"></ion-icon>
        <ion-label>首頁 (Home)</ion-label>
      </ion-item>
    </ion-menu-toggle> -->
    <!-- Dynamically rendered modules -->
    <template v-for="item in menuItems" :key="item.path">
      <ion-menu-toggle :auto-hide="false">
        <ion-item
          button
          @click="
            navigateTo(item.path.startsWith('/') ? item.path : '/' + item.path)
          "
          :class="$styles.menuItem"
        >
          <ion-icon
            slot="start"
            :icon="getIcon($t(item.meta?.icon))"
            :class="$styles.menuIcon"
          ></ion-icon>
          <ion-label>{{ $t(item.meta?.title) || item.name }}</ion-label>
        </ion-item>
      </ion-menu-toggle>
    </template>
  </ion-list>
</template>
