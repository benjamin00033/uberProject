<template>
  <ion-accordion-group :class="$style.accordionGroup">
    <ion-accordion 
      v-for="(item, index) in items" 
      :key="item.value || index" 
      :value="item.value"
      :class="$style.accordion"
    >
      <ion-item slot="header" :color="headerColor">
        <ion-label>{{ item.title }}</ion-label>
      </ion-item>
      <div slot="content" :class="$style.content">
        <!-- Render specific slot for this item, or default content if no slot provided -->
        <slot :name="item.value">{{ item.content }}</slot>
      </div>
    </ion-accordion>
  </ion-accordion-group>
</template>

<script setup lang="ts">
import { IonAccordionGroup, IonAccordion, IonItem, IonLabel } from '@ionic/vue';

/**
 * Interface representing an accordion item
 */
export interface AccordionItem {
  value: string;
  title: string;
  content?: string;
}

withDefaults(defineProps<{
  items: AccordionItem[];
  headerColor?: string;
}>(), {
  headerColor: 'light'
});
</script>

<style module lang="scss" src="./BaseAccordion.module.scss"></style>
