import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "broadcastVideo",
    name: "broadcastVideo",
    component: () => import("./pages/BroadcastVideo.vue"),
    meta: {
      title: "routes.broadcastVideo.title",
      icon: "videocam-outline",
    },
  },
];

export default routes;
