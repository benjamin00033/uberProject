<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import { IonLoading } from "@ionic/vue";

type LayoutType = "center" | "single" | "two" | "three" | "four" | "master-detail" | "bento";

const props = withDefaults(
  defineProps<{
    /** 指定要渲染的佈局類型 */
    type?: LayoutType;
  }>(),
  {
    type: "single",
  },
);

// 使用 defineAsyncComponent 實作 Lazy Loading (懶加載)
// 只有在當前路由真的需要該 layout 時，才會去 Fetch 該元件的 JS Chunk
const LayoutComponent = computed(() => {
  switch (props.type) {
    case "center":
      return defineAsyncComponent(() => import("./CenterLayout.vue"));
    case "two":
      return defineAsyncComponent(() => import("./TwoColumnLayout.vue"));
    case "three":
      return defineAsyncComponent(() => import("./ThreeColumnLayout.vue"));
    case "four":
      return defineAsyncComponent(() => import("./FourColumnLayout.vue"));
    case "master-detail":
      return defineAsyncComponent(() => import("./MasterDetailLayout.vue"));
    case "bento":
      return defineAsyncComponent(() => import("./DashboardBentoLayout.vue"));
    case "single":
    default:
      return defineAsyncComponent(() => import("./SingleColumnLayout.vue"));
  }
});
</script>

<template>
  <!-- Suspense 提供異步元件載入時的緩衝與 loading 狀態 -->
  <Suspense>
    <template #default>
      <!-- 動態渲染元件，並將所有插槽 (slots) 無縫轉發至子層元件 -->
      <component :is="LayoutComponent">
        <template v-for="(_, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData || {}" />
        </template>
      </component>
    </template>

    <template #fallback>
      <!-- 載入 Chunk 時的 Loading 畫面 -->
      <ion-loading :is-open="true" message="Loading..."></ion-loading>
    </template>
  </Suspense>
</template>
