<script setup lang="ts">
import { computed } from "vue";
import { customers } from "../data/mockInsurance";

const totalCustomers = computed(() => customers.length);
const activePolicies = computed(
  () =>
    customers.filter((customer) => customer.insuranceStatus === "Active")
      .length,
);
const expiredPolicies = computed(
  () =>
    customers.filter((customer) => customer.insuranceStatus === "Expired")
      .length,
);
const renewalsNeeded = computed(
  () =>
    customers.filter(
      (customer) => customer.insuranceStatus === "Renewal Necessary",
    ).length,
);
const contactedToday = computed(
  () =>
    customers.filter((customer) => customer.lastContactStatus === "Contacted")
      .length,
);

const stats = computed(() => [
  { label: "Total Customers", value: totalCustomers.value, accent: "primary" },
  { label: "Active Policies", value: activePolicies.value, accent: "success" },
  { label: "Expired Policies", value: expiredPolicies.value, accent: "danger" },
  { label: "Renewals Needed", value: renewalsNeeded.value, accent: "warning" },
  {
    label: "Customers Contacted Today",
    value: contactedToday.value,
    accent: "primary",
  },
]);

const getAccentClass = (accent: string) => {
  if (accent === "success") {
    return "bg-[var(--dashboard-success-soft)] text-[var(--dashboard-success)]";
  }
  if (accent === "danger") {
    return "bg-[var(--dashboard-error-soft)] text-[var(--dashboard-error)]";
  }
  if (accent === "warning") {
    return "bg-[var(--dashboard-warning-soft)] text-[var(--dashboard-warning)]";
  }
  return "bg-[var(--dashboard-primary-soft)] text-[var(--dashboard-primary)]";
};
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-[var(--app-dark)] sm:text-3xl">
        Dashboard
      </h1>
      <p class="mt-1 text-sm text-[var(--app-muted)]">
        Smartphone insurance hotline overview.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-xl border border-[var(--dashboard-soft-border)] bg-[var(--dashboard-surface)] p-5 shadow-sm"
      >
        <div
          class="mb-5 inline-flex rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wide"
          :class="getAccentClass(stat.accent)"
        >
          {{ stat.label }}
        </div>
        <p class="text-3xl font-bold text-[var(--app-dark)] sm:text-4xl">
          {{ stat.value }}
        </p>
        <p class="mt-2 text-sm text-[var(--app-muted)]">Current portfolio</p>
      </div>
    </div>

    <div
      class="rounded-xl border border-[var(--dashboard-soft-border)] bg-[var(--dashboard-surface)] p-6 shadow-sm"
    >
      <h2 class="text-lg font-bold text-[var(--app-dark)]">Agent focus</h2>
      <p class="mt-2 max-w-3xl text-sm leading-6 text-[var(--app-muted)]">
        Prioritize renewal calls, verify insurance numbers before sharing
        sensitive details, and log every customer contact after the call.
      </p>
    </div>
  </section>
</template>
