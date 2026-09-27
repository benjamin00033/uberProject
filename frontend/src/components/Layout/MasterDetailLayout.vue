<script setup lang="ts">
import { IonPage, IonContent, IonGrid, IonRow, IonCol } from "@ionic/vue";
import $styles from "./MasterDetailLayout.module.scss";
import LayoutHeader from "./LayoutHeader.vue";
</script>

<template>
  <ion-page>
    <slot name="header">
      <LayoutHeader />
    </slot>
    <ion-content>
      <ion-grid :class="$styles.masterDetailGrid">
        <ion-row :class="$styles.masterDetailRow">
          <!-- 左側列表區：手機版佔 12 格 (全寬)，平板以上佔 4 格 -->
          <ion-col size="12" size-md="4" size-lg="3" :class="$styles.listCol">
            <slot name="list" />
          </ion-col>
          
          <!-- 右側明細區：手機版隱藏 (或透過外部邏輯切換顯示)，平板以上佔 8 格 -->
          <ion-col size="12" size-md="8" size-lg="9" :class="$styles.detailCol" class="ion-hide-sm-down">
            <slot name="detail" />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
