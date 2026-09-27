<script setup lang="ts">
import { IonPage, IonContent, IonGrid, IonRow, IonCol } from "@ionic/vue";
import $styles from "./FourColumnLayout.module.scss";
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
          <!-- 4 等份欄位，常用於 Dashboard 資料展示 -->
          <ion-col size="12" size-md="6" size-lg="3"
            ><slot name="col1"
          /></ion-col>
          <ion-col size="12" size-md="6" size-lg="3"
            ><slot name="col2"
          /></ion-col>
          <ion-col size="12" size-md="6" size-lg="3"
            ><slot name="col3"
          /></ion-col>
          <ion-col size="12" size-md="6" size-lg="3"
            ><slot name="col4"
          /></ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
