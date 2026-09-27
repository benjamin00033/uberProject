<script setup lang="ts">
import { IonPage, IonContent } from "@ionic/vue";
import $styles from "./FlexBoardLayout.module.scss";
import LayoutHeader from "./LayoutHeader.vue";
</script>

<template>
  <ion-page>
    <slot name="header">
      <LayoutHeader />
    </slot>
    <ion-content>
      <div :class="$styles.boardContainer">
        <div :class="$styles.boardGrid">
          <slot />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
