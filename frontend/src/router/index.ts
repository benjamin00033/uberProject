import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import { useUserStore } from "@/stores/userstore";
import MainLayout from "../components/Layout/MainLayout.vue";

/**
 * Audit Notes (DDD Design):
 * 1. Modular Routing: Routes are now dynamically loaded from the `domain` folders.
 *    Each domain/module is responsible for its own routing definition.
 * 2. Loose Coupling: The core router no longer needs to know about every single page.
 * 3. Scalability: Adding a new module only requires creating a `routes.ts` file in its domain folder.
 */

// Dynamically import all routes.ts files from the domain directory
const domainRoutesModules = import.meta.glob("../domain/**/routes.ts", {
  eager: true,
  import: "default",
});

const domainRoutes: RouteRecordRaw[] = Object.values(
  domainRoutesModules,
).flat() as RouteRecordRaw[];

console.log(domainRoutes);

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/Login.vue"),
    meta: {
      title: "routes.Login.title",
      icon: "routes.Login.icon",
    },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("@/pages/ForgotPassword.vue"),
    meta: {
      title: "routes.ForgotPassword.title",
      icon: "routes.ForgotPassword.icon",
    },
  },
  {
    path: "/",
    component: MainLayout,
    props: { moduleRoutes: domainRoutes },
    meta: {
      title: "routes.home.title",
      icon: "routes.home.icon",
    },
    children: [
      ...domainRoutes,
      {
        path: "",
        redirect: "/menu",
      },
      // {
      //   path: "home",
      //   name: "Home",
      //   component: () => import("@/pages/Home.vue"),
      // },
      // Spread the dynamically discovered domain routes into the MainLayout children
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, _, next) => {
  const userStore = useUserStore();

  if (to.meta.roles) {
    const requiredRoles = to.meta.roles as string | string[];
    if (!userStore.hasRole(requiredRoles)) {
      return next({ name: "Login" });
    }
  }

  if (to.meta.permissions) {
    const requiredPermissions = to.meta.permissions as string | string[];
    if (!userStore.hasAnyPermission(requiredPermissions)) {
      return next({ name: "Login" });
    }
  }

  next();
});

export default router;
