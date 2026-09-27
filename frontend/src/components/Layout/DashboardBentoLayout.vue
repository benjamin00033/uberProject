<script setup lang="ts">
import { IonPage, IonContent } from "@ionic/vue";
import $styles from "./DashboardBentoLayout.module.scss";
import LayoutHeader from "./LayoutHeader.vue";
</script>

<template>
  <ion-page>
    <slot name="header">
      <LayoutHeader />
    </slot>
    <ion-content>
      <div :class="$styles.bentoWrapper">
        <div :class="$styles.bentoGrid">
          <!-- 最大的展示區 (跨 2 欄 2 列) -->
          <div v-if="$slots.hero" :class="$styles.bentoHero">
            <slot name="hero" />
          </div>
          
          <!-- 寬幅展示區 (跨 2 欄) -->
          <div v-if="$slots.wide" :class="$styles.bentoWide">
            <slot name="wide" />
          </div>
          
          <!-- 長型展示區 (跨 2 列) -->
          <div v-if="$slots.tall" :class="$styles.bentoTall">
            <slot name="tall" />
          </div>
          
          <!-- 其餘標準方塊區 -->
          <slot />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
