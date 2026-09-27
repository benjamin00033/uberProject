import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "budget",
    name: "budget",
    component: () => import("./pages/budget.vue"),
    meta: { title: "routes.budget.title", icon: "routes.budget.icon" },
  },
];

export default routes;
