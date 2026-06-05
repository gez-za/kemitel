import { createPinia } from "pinia";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import router from "./router";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import App from "@/App.vue";
import "./index.css";
import "@/assets/contrast-fix.css"; // Force high-contrast text on blue
import { SnackbarService } from "vue3-snackbar";
import "vue3-snackbar/styles";
import { initGlobalNavigationGuard } from "@/router/route-guards";
import { setupAdminUser } from "@/utils/setup-admin";
import { BProgress } from "@bprogress/core";
import { locale } from "@/utils/language";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

if (import.meta.env.VITE_ENABLE_SW_UPDATES === 'true') {
  navigator.serviceWorker.ready.then((registration) => {
    setInterval(() => {
      console.log("checking for updates...")
      registration.update();
    }, 15 * 60 * 1000);
  });
}

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "few seconds",
    m: "one minute",
    mm: "%d minutes",
    h: "one hour",
    hh: "%d hours",
    d: "one day",
    dd: "%d days",
    M: "one month",
    MM: "%d months",
    y: "one year",
    yy: "%d years",
  },
});

dayjs.updateLocale("fr", {
  relativeTime: {
    future: "dans %s",
    past: "il y a %s",
    s: "quelques secondes",
    m: "une minute",
    mm: "%d minutes",
    h: "une heure",
    hh: "%d heures",
    d: "un jour",
    dd: "%d jours",
    M: "un mois",
    MM: "%d mois",
    y: "un an",
    yy: "%d ans",
  },
});


const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: "en",
  messages: {
    en,
    fr,
  },
});

createApp(App)
  .use(i18n)
  .use(createPinia())
  .use(router)
  .use(SnackbarService)
  .mount("#app");

localStorage.setItem("tenant-id", import.meta.env.VITE_TENANT);

BProgress.configure({ showSpinner: false });

router.beforeEach(() => {
  BProgress.start();
});

router.afterEach(() => {
  BProgress.done();
});

initGlobalNavigationGuard(router);

setupAdminUser().catch(console.error);
