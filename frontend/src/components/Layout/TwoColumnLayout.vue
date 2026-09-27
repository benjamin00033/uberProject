<script setup lang="ts">
import { IonPage, IonContent, IonGrid, IonRow, IonCol } from "@ionic/vue";
import $styles from "./TwoColumnLayout.module.scss";
import LayoutHeader from "./LayoutHeader.vue";
</script>

<template>
  <ion-page>
    <slot name="header">
      <LayoutHeader />
    </slot>
    <ion-content>
      <ion-grid :class="$styles.fullHeightGrid">
        <ion-row :class="$styles.fullHeightRow">
          <!-- 左側邊欄：手機滿版，平板以上佔 3 格 -->
          <ion-col size="12" size-md="3" :class="$styles.sidebarCol">
            <slot name="left" />
          </ion-col>
          
          <!-- 主內容區：手機滿版，平板以上佔 9 格 -->
          <ion-col size="12" size-md="9" :class="$styles.mainCol">
            <slot />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
