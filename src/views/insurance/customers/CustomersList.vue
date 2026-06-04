<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { customers } from "../data/mockInsurance";
import StatusBadge from "../components/StatusBadge.vue";

const router = useRouter();
const search = ref("");

const filteredCustomers = computed(() => {
  const value = search.value.toLowerCase().trim();

  if (!value) return customers;

  return customers.filter((customer) => {
    return (
      customer.phone.toLowerCase().includes(value) ||
      customer.insuranceNumber.toLowerCase().includes(value)
    );
  });
});

const openCustomer = (id: string) => {
  router.push(`/customers/${id}`);
};
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-[var(--app-dark)] sm:text-3xl">
        Customers
      </h1>
      <p class="mt-1 text-sm text-[var(--app-muted)]">
        Browse registered customers and filter by phone or insurance number.
      </p>
    </div>

    <div
      class="rounded-xl border border-[var(--dashboard-soft-border)] bg-[var(--dashboard-surface)] p-5 shadow-sm"
    >
      <label
        class="mb-2 block text-sm font-semibold text-[var(--app-dark)]"
        for="customer-search"
      >
        Phone number or insurance number
      </label>
      <input
        id="customer-search"
        v-model="search"
        type="search"
        placeholder="+237690000000 or INS-2025-849302"
        class="h-12 w-full rounded-lg border border-[var(--dashboard-border)] px-4 text-sm outline-none transition focus:border-[var(--dashboard-primary)] focus:ring-2 focus:ring-[var(--dashboard-primary-soft)]"
      />
    </div>

    <div
      v-if="filteredCustomers.length === 0"
      class="rounded-xl border border-[var(--dashboard-soft-border)] bg-[var(--dashboard-surface)] p-12 text-center shadow-sm"
    >
      <h2 class="text-lg font-bold text-[var(--app-dark)]">No customer found</h2>
      <p class="mt-2 text-sm text-[var(--app-muted)]">
        Check the phone number or insurance number and try again.
      </p>
    </div>

    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <button
        v-for="customer in filteredCustomers"
        :key="customer.id"
        class="rounded-xl border border-[var(--dashboard-soft-border)] bg-[var(--dashboard-surface)] p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--dashboard-primary)] hover:shadow-md"
        type="button"
        @click="openCustomer(customer.id)"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold text-[var(--app-dark)]">
              {{ customer.firstName }} {{ customer.lastName }}
            </h2>
            <p class="mt-1 text-sm text-[var(--app-muted)]">
              {{ customer.phone }}
            </p>
          </div>
          <StatusBadge :status="customer.insuranceStatus" />
        </div>

        <div class="mt-5 space-y-3 text-sm">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
              Insurance number
            </p>
            <p class="mt-1 font-semibold text-[var(--app-dark)]">
              {{ customer.insuranceNumber }}
            </p>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
                Expiration
              </p>
              <p class="mt-1 font-semibold text-[var(--app-dark)]">
                {{ customer.expirationDate }}
              </p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
                Last contact
              </p>
              <div class="mt-1">
                <StatusBadge :status="customer.lastContactStatus" />
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  </section>
</template>
