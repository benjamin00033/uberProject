<script setup lang="ts">
import { IonPage, IonContent, IonGrid, IonRow, IonCol } from "@ionic/vue";
import $styles from "./ThreeColumnLayout.module.scss";
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
          <ion-col size="12" size-md="3" :class="$styles.sideCol">
            <slot name="left" />
          </ion-col>
          <ion-col size="12" size-md="6" :class="$styles.mainCol">
            <slot />
          </ion-col>
          <ion-col size="12" size-md="3" :class="$styles.sideCol">
            <slot name="right" />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
