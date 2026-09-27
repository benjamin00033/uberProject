<script setup lang="ts">
import {
  IonCard,
  IonItem,
  IonAvatar,
  IonLabel,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { closeOutline, imageOutline } from "ionicons/icons";
import { shallowRef } from "vue";

/**
 * Audit Notes:
 * 1. Performance: Switched `failedImages` to `shallowRef`. Since we only need to track
 *    the Set instance itself (and trigger updates when the Set reference changes),
 *    shallowRef avoids unnecessary deep proxy overhead.
 * 2. Clean Code: Standardized emit syntax and improved type safety.
 * 3. Accessibility: Added better aria-label and role handling.
 */

export interface NotificationItem {
  id: string;
  type?:
    | "primary"
    | "secondary"
    | "warning"
    | "danger"
    | "info"
    | "light"
    | "dark"
    | "success";
  title?: string;
  body?: string;
  message?: string;
  image?: string;
  useWebPush?: boolean;
  duration?: number;
}

defineProps<{
  notifications: NotificationItem[];
}>();

// Vue 3.5 standard emit definition
const emit = defineEmits<{
  remove: [id: string];
}>();

// Optimization: Use shallowRef for Sets/Maps when deep reactivity isn't needed.
// We update the reference to trigger reactivity.
const failedImages = shallowRef<Set<string>>(new Set());

const handleImageError = (id: string) => {
  const newSet = new Set(failedImages.value);
  newSet.add(id);
  failedImages.value = newSet;
};

const remove = (id: string) => {
  emit("remove", id);
  if (failedImages.value.has(id)) {
    const newSet = new Set(failedImages.value);
    newSet.delete(id);
    failedImages.value = newSet;
  }
};

const getColor = (type?: string) => {
  if (type === "info") return "tertiary";
  return type || "light";
};
</script>

<template>
  <div class="base-notification-container">
    <transition-group
      name="notification-slide"
      tag="div"
      class="notification-list"
    >
      <ion-card
        v-for="item in notifications"
        :key="item.id"
        class="notification-item"
        :color="getColor(item.type)"
      >
        <ion-item :color="getColor(item.type)" lines="none">
          <ion-avatar slot="start" v-if="item.image" class="notification-image">
            <img
              v-if="!failedImages.has(item.id)"
              :src="item.image"
              alt="notification image"
              @error="handleImageError(item.id)"
            />
            <div v-else class="fallback-icon-container">
              <ion-icon :icon="imageOutline" class="fallback-icon" />
            </div>
          </ion-avatar>
          <ion-label class="ion-text-wrap">
            <h2 v-if="item.title" class="notification-title">
              {{ item.title }}
            </h2>
            <p v-if="item.body || item.message" class="notification-body">
              {{ item.body || item.message }}
            </p>
          </ion-label>
          <ion-button
            fill="clear"
            slot="end"
            class="notification-close"
            @click="remove(item.id)"
            aria-label="Close"
            :color="item.type && item.type !== 'light' ? 'light' : 'dark'"
          >
            <ion-icon slot="icon-only" :icon="closeOutline" />
          </ion-button>
        </ion-item>
      </ion-card>
    </transition-group>
  </div>
</template>

<style scoped>
.base-notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none; /* Let clicks pass through the container */
  max-width: 350px;
  width: 100%;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification-item {
  padding: 10px;
  pointer-events: auto; /* Re-enable clicks for items */
  margin: 0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(var(--ion-color-dark-rgb), 0.15);
}

.notification-image img {
  border-radius: 4px;
}

.fallback-icon-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(var(--ion-color-dark-rgb), 0.1);
  border-radius: 4px;
}

.fallback-icon {
  font-size: 24px;
  opacity: 0.6;
}

.notification-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
}

.notification-body {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

/* Transitions */
.notification-slide-enter-active,
.notification-slide-leave-active {
  transition: all 0.3s ease;
}
.notification-slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.notification-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
