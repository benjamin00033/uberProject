import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "dynamicForm",
    name: "dynamicForm",
    // Ignore TS error for missing .vue module declaration
    // @ts-ignore
    component: () => import("./pages/dynamicForm.vue"),
    meta: {
      title: "routes.dynamicForm.title",
      icon: "routes.dynamicForm.icon",
    },
  },
  {
    path: "dynamicForm/builder",
    name: "formBuilder",
    // @ts-ignore
    component: () => import("./pages/formBuilder.vue"),
    meta: {
      title: "表單建置器",
      icon: "routes.dynamicForm.icon",
    },
  },
];

export default routes;
