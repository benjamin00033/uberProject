import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "menu",
    name: "menu",
    component: () => import("./pages/Menu.vue"),
    meta: {
      title: "routes.menu.title",
      icon: "routes.menu.icon",
    },
  },
  {
    path: "OptionMenu",
    name: "OptionMenu",
    component: () => import("./pages/OptionMenu.vue"),
    meta: {
      title: "routes.OptionMenu.title",
      icon: "routes.OptionMenu.icon",
    },
  },
  {
    path: "MenuTime",
    name: "MenuTime",
    component: () => import("./pages/MenuTime.vue"),
    meta: {
      title: "routes.MenuTime.title",
      icon: "routes.MenuTime.icon",
    },
  },
  {
    path: "menuItems",
    name: "menuItems",
    component: () => import("./pages/MenuItem.vue"),
    meta: {
      title: "routes.menuItems.title",
      icon: "routes.menuItems.icon",
    },
  },
];

export default routes;
