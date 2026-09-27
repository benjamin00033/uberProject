import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "",
    name: "ProjectScheduler",
    component: () => import("./pages/Dashboard.vue"),
    meta: {
      title: "routes.projectScheduler.title",
      icon: '"routes.projectScheduler.icon"',
    },
  },
];

export default routes;
