<template>
  <div :class="$style.tabsContainer">
    <ion-segment
      :value="modelValue"
      @ionChange="handleChange"
      :class="$style.segment"
    >
      <ion-segment-button
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :class="$style.segmentButton"
      >
        <ion-icon v-if="tab.icon" :icon="tab.icon" />
        <ion-label>{{ tab.label }}</ion-label>
      </ion-segment-button>
    </ion-segment>
    <div :class="$style.content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonSegment, IonSegmentButton, IonLabel, IonIcon } from "@ionic/vue";
import type { Component } from "vue";

export interface TabItem {
  label: string;
  value: string;
  icon?: string | Component;
}

defineProps<{
  tabs: TabItem[];
  modelValue?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const handleChange = (e: any) => {
  emit("update:modelValue", e.detail.value);
};
</script>

<style module lang="scss" src="./BaseTabs.module.scss"></style>
