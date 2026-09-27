<script setup lang="ts">
import { IonPage, IonContent } from "@ionic/vue";
import LayoutHeader from "./LayoutHeader.vue";
</script>

<template>
  <ion-page>
    <slot name="header">
      <LayoutHeader />
    </slot>
    <ion-content class="ion-padding">
      <!-- 預設插槽，單欄全滿內容 -->
      <slot />
    </ion-content>
  </ion-page>
</template>
