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
          component: () => import("@/views/insurance/dashboard/DashboardOverview.vue"),
          meta: { roles: ['client', 'agent_hotline'] }
        },
        {
          path: "agents",
          name: "agent-management",
          component: () => import("@/views/admin/AgentManagement.vue"),
          meta: { roles: ['agent_hotline'] } // Assuming senior agents can manage team
        },
        {
          path: "customers",
          name: "insurance-customers",
          component: () =>
            import("@/views/insurance/customers/CustomersList.vue"),
          meta: { roles: ['agent_hotline'] }
        },
        {
          path: "customers/:customerId",
          name: "insurance-customer-profile",
          component: () =>
            import("@/views/insurance/customers/CustomerProfile.vue"),
          meta: { roles: ['agent_hotline'] }
        },
        {
          path: "devices",
          name: "insurance-devices",
          component: () => import("@/views/insurance/devices/DevicesList.vue"),
          meta: { roles: ['client', 'agent_hotline'] }
        },
        {
          path: "devices/:deviceId",
          name: "insurance-device-details",
          component: () =>
            import("@/views/insurance/devices/DeviceDetails.vue"),
          meta: { roles: ['client', 'agent_hotline'] }
        },
        {
          path: "renewals",
          name: "insurance-renewals",
          component: () =>
            import("@/views/insurance/renewals/RenewalsList.vue"),
          meta: { roles: ['client', 'agent_hotline'] }
        },
        {
          path: "history",
          name: "insurance-history",
          component: () => import("@/views/insurance/history/HistoryList.vue"),
          meta: { roles: ['client', 'agent_hotline'] }
        },
        {
          path: "declare-loss",
          name: "insurance-declare-loss",
          component: () => import("@/views/insurance/history/DeclareLoss.vue"),
          meta: { roles: ['client'] }
        },
        {
          path: "payments",
          name: "insurance-payments",
          component: () => import("@/views/insurance/history/PaymentsList.vue"),
          meta: { roles: ['client', 'agent_hotline'] }
        },
        {
          path: "notifications",
          name: "insurance-notifications",
          component: () =>
            import("@/views/insurance/notifications/NotificationsOverview.vue"),
          meta: { roles: ['client', 'agent_hotline'] }
        },
        {
          path: "search",
          name: "insurance-search",
          component: () => import("@/views/insurance/devices/DevicesList.vue"),
          meta: { roles: ['client'] }
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
