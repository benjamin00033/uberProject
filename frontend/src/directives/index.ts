import type { App } from "vue";
import { permissionDirective, roleDirective } from "./permission";

export function setupDirectives(app: App) {
  //  v-permssion & v-role

  app.directive("permission", permissionDirective);
  app.directive("role", roleDirective);
}
