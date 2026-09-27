/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";
import "@/assets/styles/style.scss";
import router from "./router/index";
import { createApp } from "vue";
import App from "./App.vue";
import { IonicVue } from "@ionic/vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import { setupDirectives } from "./directives";
import { i18n } from "@/locale/language.ts";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
// ===安全性設定======
import SercurityPlugin from "@/plugins/secrityXXS.ts";

// ======動畫設計=========
gsap.registerPlugin(ScrollToPlugin);
// ======動畫設計=========

const app = createApp(App);
const pinia = createPinia();

app.use(SercurityPlugin);
app.use(VueQueryPlugin);
app.use(i18n);
app.use(pinia);
app.use(IonicVue);
app.use(router);
app.provide("gsap", gsap);

// Register global directives
//  v-permssion & v-role
//  權限設定內容
setupDirectives(app);

async function enableMocking() {
  // 當測試結束時取消內容
  // if (!import.meta.env.DEV) {
  //   return;
  // }
  const baseUrl = import.meta.env.BASE_URL;
  const { worker } = await import("./mock/browser");
  return worker.start({
    serviceWorker: {
      url: `${baseUrl}mockServiceWorker.js`,
    },
    onUnhandledRequest: "bypass",
  });
}

enableMocking().then(() => {
  app.mount("#app");
});
