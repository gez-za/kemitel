import { createRouter, createWebHistory } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: DashboardLayout,
      children: [
        {
          path: "",
          name: "home",
          component: () => import("@/views/auth/HomePage.vue"),
        },
        {
          path: "customers",
          name: "insurance-customers",
          component: () =>
            import("@/views/insurance/customers/CustomersList.vue"),
        },
        {
          path: "customers/:customerId",
          name: "insurance-customer-profile",
          component: () =>
            import("@/views/insurance/customers/CustomerProfile.vue"),
        },
        {
          path: "devices",
          name: "insurance-devices",
          component: () => import("@/views/insurance/devices/DevicesList.vue"),
        },
        {
          path: "devices/:deviceId",
          name: "insurance-device-details",
          component: () =>
            import("@/views/insurance/devices/DeviceDetails.vue"),
        },
        {
          path: "renewals",
          name: "insurance-renewals",
          component: () =>
            import("@/views/insurance/renewals/RenewalsList.vue"),
        },
        {
          path: "history",
          name: "insurance-history",
          component: () => import("@/views/insurance/history/HistoryList.vue"),
        },
        {
          path: "notifications",
          name: "insurance-notifications",
          component: () =>
            import("@/views/insurance/notifications/NotificationsOverview.vue"),
        },
      ],
    },

    {
      path: "/login",
      component: AuthLayout,
      children: [
        {
          path: "",
          name: "sign-in-form",
          meta: { isPublic: true },
          component: () => import("@/views/auth/LoginPage.vue"),
        },
      ],
    },

    {
      path: "/forgot-password",
      component: AuthLayout,
      children: [
        {
          path: "",
          name: "forgot-password",
          meta: { isPublic: true },
          component: () => import("@/views/auth/ForgotPasswordPage.vue"),
        },
      ],
    },
  ],
});

export default router;
