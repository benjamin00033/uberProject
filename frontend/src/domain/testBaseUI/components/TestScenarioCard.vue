<template>
  <ion-card :class="$style.testCard">
    <ion-card-header>
      <ion-card-title>{{ title }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <p v-if="description" :class="$style.description">{{ description }}</p>
      <div :class="$style.contentWrapper">
        <slot></slot>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue';

defineProps<{
  title: string;
  description?: string;
}>();
</script>

<style lang="scss" module src="./TestScenarioCard.module.scss"></style>
