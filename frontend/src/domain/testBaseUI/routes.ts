import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "TestBaseUI",
    name: "TestBaseUI",
    component: () => import("./pages/TestBaseUIPage.vue"),
    meta: {
      title: "routes.TestBaseUI.title",
      icon: "routes.TestBaseUI.icon",
    },
  },
  {
    path: "test-layout",
    name: "TestLayout",
    component: () => import("./pages/TestLayoutPage.vue"),
    meta: {
      title: "Layout 展示區",
      icon: "routes.TestBaseUI.icon",
    },
  },
];

export default routes;
