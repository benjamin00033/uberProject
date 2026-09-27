<template>
  <teleport to="body">
    <ion-modal v-if="isOpen" :is-open="true" @didDismiss="close" :class="$style.modalContainer">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="close">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <slot></slot>
    </ion-content>
    <ion-footer class="ion-no-border" v-if="$slots.footer">
      <ion-toolbar>
        <slot name="footer"></slot>
      </ion-toolbar>
    </ion-footer>
    </ion-modal>
  </teleport>
</template>

<script setup lang="ts">
import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButtons, IonButton, IonIcon } from "@ionic/vue";
import { closeOutline } from "ionicons/icons";
import $style from "./BaseModal.module.scss";

withDefaults(defineProps<{
  isOpen: boolean;
  title?: string;
}>(), {
  title: ""
});

const emit = defineEmits(["update:isOpen", "close"]);

const close = () => {
  emit("update:isOpen", false);
  emit("close");
};
</script>
