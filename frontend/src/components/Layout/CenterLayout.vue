<script setup lang="ts">
import { IonPage, IonContent } from "@ionic/vue";
import $styles from "./CenterLayout.module.scss";
</script>

<template>
  <ion-page>
    <ion-content>
      <div :class="$styles.absoluteCenterWrapper">
        <div :class="$styles.centerContent">
          <!-- 預設插槽，用於放置絕對置中的內容 (例如 Login) -->
          <slot />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
