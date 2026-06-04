<script setup lang="ts">
import { computed } from "vue";
import { notifications } from "../data/mockInsurance";
import StatusBadge from "../components/StatusBadge.vue";

const smsSentToday = computed(
  () =>
    notifications.filter(
      (notification) =>
        notification.channel === "SMS" && notification.status === "Sent",
    ).length,
);
const pushSentToday = computed(
  () =>
    notifications.filter(
      (notification) =>
        notification.channel === "Push" && notification.status === "Sent",
    ).length,
);
const failedSms = computed(
  () =>
    notifications.filter(
      (notification) =>
        notification.channel === "SMS" && notification.status === "Failed",
    ).length,
);
const failedPush = computed(
  () =>
    notifications.filter(
      (notification) =>
        notification.channel === "Push" && notification.status === "Failed",
    ).length,
);

const metrics = computed(() => [
  { label: "SMS sent today", value: smsSentToday.value, tone: "success" },
  {
    label: "Push notifications sent today",
    value: pushSentToday.value,
    tone: "success",
  },
  { label: "Failed SMS", value: failedSms.value, tone: "danger" },
  {
    label: "Failed push notifications",
    value: failedPush.value,
    tone: "danger",
  },
  { label: "Last batch execution", value: "08:00 AM", tone: "primary" },
  { label: "Next batch execution", value: "02:00 PM", tone: "warning" },
]);

const getMetricClass = (tone: string) => {
  if (tone === "success") {
    return "text-[var(--dashboard-success)] bg-[var(--dashboard-success-soft)]";
  }
  if (tone === "danger") {
    return "text-[var(--dashboard-error)] bg-[var(--dashboard-error-soft)]";
  }
  if (tone === "warning") {
    return "text-[var(--dashboard-warning)] bg-[var(--dashboard-warning-soft)]";
  }
  return "text-[var(--dashboard-primary)] bg-[var(--dashboard-primary-soft)]";
};
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-[var(--app-dark)] sm:text-3xl">
        Notifications Admin
      </h1>
      <p class="mt-1 text-sm text-[var(--app-muted)]">
        Monitor automated SMS and push notification batches.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="metric in metrics"
        :key="metric.label"
        class="rounded-xl border border-[var(--dashboard-soft-border)] bg-[var(--dashboard-surface)] p-5 shadow-sm"
      >
        <p class="text-sm font-semibold text-[var(--app-muted)]">
          {{ metric.label }}
        </p>
        <p
          class="mt-4 inline-flex rounded-lg px-3 py-2 text-2xl font-bold"
          :class="getMetricClass(metric.tone)"
        >
          {{ metric.value }}
        </p>
      </div>
    </div>

    <div
      class="overflow-x-auto rounded-xl border border-[var(--dashboard-soft-border)] bg-[var(--dashboard-surface)] shadow-sm"
    >
      <table class="min-w-[760px] w-full text-left text-sm">
        <thead class="bg-[var(--dashboard-table-header)] text-[var(--dashboard-muted)]">
          <tr>
            <th class="px-5 py-4">Customer</th>
            <th class="px-5 py-4">Channel</th>
            <th class="px-5 py-4">Phone</th>
            <th class="px-5 py-4">Expiration</th>
            <th class="px-5 py-4">Status</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="notification in notifications"
            :key="notification.id"
            class="border-t border-[var(--app-soft-border)]"
          >
            <td class="px-5 py-4 font-medium text-[var(--app-dark)]">
              {{ notification.customerName }}
            </td>
            <td class="px-5 py-4 text-[var(--app-muted)]">
              {{ notification.channel }}
            </td>
            <td class="px-5 py-4 text-[var(--app-muted)]">
              {{ notification.phone }}
            </td>
            <td class="px-5 py-4 text-[var(--app-muted)]">
              {{ notification.expirationDate }}
            </td>
            <td class="px-5 py-4">
              <StatusBadge :status="notification.status" />
            </td>
          </tr>

          <tr v-if="notifications.length === 0">
            <td
              colspan="5"
              class="px-5 py-10 text-center text-[var(--app-muted)]"
            >
              No notification found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
