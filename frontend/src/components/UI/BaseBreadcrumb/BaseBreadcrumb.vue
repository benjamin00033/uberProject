<template>
  <ion-breadcrumbs :class="$style.breadcrumbs">
    <ion-breadcrumb 
      v-for="(item, index) in items" 
      :key="index"
      :href="item.href"
      :class="$style.breadcrumbItem"
    >
      {{ item.label }}
    </ion-breadcrumb>
  </ion-breadcrumbs>
</template>

<script setup lang="ts">
import { IonBreadcrumbs, IonBreadcrumb } from '@ionic/vue';

/**
 * Interface representing a breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

defineProps<{
  items: BreadcrumbItem[];
}>();
</script>

<style module lang="scss" src="./BaseBreadcrumb.module.scss"></style>
