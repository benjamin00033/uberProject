<script setup lang="ts">
import { IonApp } from "@ionic/vue";
import { onMounted, shallowRef } from "vue";
import { useEventBus } from "./composables/useEventBus";
import BaseNotification, {
  type NotificationItem,
} from "./components/UI/BaseNotification.vue";
import { sendWebPushNotification } from "./utils/browser.util";

/**
 * Audit Notes:
 * 1. Performance: Switched notifications to `shallowRef` because notification items
 *    are immutable once created. This avoids the overhead of deep reactivity tracking.
 * 2. Clean Code: Extracted ID generation and consolidated notification mapping.
 */

const { on } = useEventBus();

// Optimization: Using shallowRef for a list of immutable items reduces memory usage
// and reactivity overhead by only tracking the array reference itself.
const notifications = shallowRef<NotificationItem[]>([]);

const removeNotification = (id: string) => {
  notifications.value = notifications.value.filter((n) => n.id !== id);
};

on("notification", async (data: any) => {
  // Clean Code: Unified ID generation logic
  const generatedId = data.id || crypto.randomUUID?.() || Math.random().toString(36).slice(2, 7);

  const notification: NotificationItem = {
    id: generatedId,
    type: data.type || "info",
    title: data.title,
    body: data.body,
    message: data.message,
    image: data.image,
    useWebPush: !!data.useWebPush,
    duration: data.duration ?? 5000, // Explicit nullish coalescing
  };

  // Optimization: shallowRef trigger by creating a new array reference
  notifications.value = [...notifications.value, notification];

  if (notification.duration && notification.duration > 0) {
    setTimeout(() => {
      removeNotification(notification.id);
    }, notification.duration);
  }

  if (notification.useWebPush) {
    await sendWebPushNotification(notification.title || "New Notification", {
      body: notification.body || notification.message,
      icon: notification.image,
    });
  }
});

onMounted(() => {
  // Set default theme
  document.documentElement.setAttribute("data-theme", "light");
});
</script>

<template>
  <ion-app>
    <router-view />
    <BaseNotification
      :notifications="notifications"
      @remove="removeNotification"
    />
  </ion-app>
</template>

<style scoped></style>
