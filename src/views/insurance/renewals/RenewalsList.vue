<script setup lang="ts">
import { computed, ref } from "vue";
import { customers } from "../data/mockInsurance";
import StatusBadge from "../components/StatusBadge.vue";

const filters = ["All", "Renewal Necessary", "Expired", "Contacted", "No Answer"];
const activeFilter = ref("All");
const showContactLogModal = ref(false);
const selectedCustomerName = ref("");
const contactStatus = ref("Contacted Successfully");
const contactComment = ref("");

const getDaysRemaining = (expirationDate: string) => {
  const today = new Date();
  const expiration = new Date(`${expirationDate}T00:00:00`);
  const diff = expiration.getTime() - today.getTime();

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const filteredCustomers = computed(() => {
  if (activeFilter.value === "All") return customers;
  if (activeFilter.value === "Contacted") {
    return customers.filter((customer) => customer.lastContactStatus === "Contacted");
  }
  if (activeFilter.value === "No Answer") {
    return customers.filter((customer) => customer.lastContactStatus === "No Answer");
  }

  return customers.filter(
    (customer) => customer.insuranceStatus === activeFilter.value,
  );
});

const openContactLog = (customerName: string) => {
  selectedCustomerName.value = customerName;
  contactStatus.value = "Contacted Successfully";
  contactComment.value = "";
  showContactLogModal.value = true;
};

const saveContactLog = () => {
  showContactLogModal.value = false;
};
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-[var(--app-dark)] sm:text-3xl">
        Renewal Management
      </h1>
      <p class="mt-1 text-sm text-[var(--app-muted)]">
        Track expiring policies and log hotline outcomes.
      </p>
    </div>

    <div class="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
      <button
        v-for="filter in filters"
        :key="filter"
        class="shrink-0 rounded-lg border px-4 py-2 text-sm font-bold transition"
        :class="
          activeFilter === filter
            ? 'border-[var(--dashboard-primary)] bg-[var(--dashboard-primary)] text-[var(--dashboard-surface)]'
            : 'border-[var(--dashboard-soft-border)] bg-[var(--dashboard-surface)] text-[var(--dashboard-muted)] hover:border-[var(--dashboard-primary)] hover:text-[var(--dashboard-primary)]'
        "
        type="button"
        @click="activeFilter = filter"
      >
        {{ filter }}
      </button>
    </div>

    <div
      class="overflow-x-auto rounded-xl border border-[var(--dashboard-soft-border)] bg-[var(--dashboard-surface)] shadow-sm"
    >
      <table class="min-w-[920px] w-full text-left text-sm">
        <thead class="bg-[var(--dashboard-table-header)] text-[var(--dashboard-muted)]">
          <tr>
            <th class="px-5 py-4">Customer</th>
            <th class="px-5 py-4">Phone</th>
            <th class="px-5 py-4">Expiration date</th>
            <th class="px-5 py-4">Days remaining</th>
            <th class="px-5 py-4">Status</th>
            <th class="px-5 py-4">Last contact</th>
            <th class="px-5 py-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="customer in filteredCustomers"
            :key="customer.id"
            class="border-t border-[var(--app-soft-border)]"
          >
            <td class="px-5 py-4 font-semibold text-[var(--app-dark)]">
              {{ customer.firstName }} {{ customer.lastName }}
            </td>
            <td class="px-5 py-4 text-[var(--app-muted)]">
              {{ customer.phone }}
            </td>
            <td class="px-5 py-4 text-[var(--app-muted)]">
              {{ customer.expirationDate }}
            </td>
            <td class="px-5 py-4 text-[var(--app-muted)]">
              {{ getDaysRemaining(customer.expirationDate) }}
            </td>
            <td class="px-5 py-4">
              <StatusBadge :status="customer.insuranceStatus" />
            </td>
            <td class="px-5 py-4">
              <StatusBadge :status="customer.lastContactStatus" />
            </td>
            <td class="px-5 py-4">
              <button
                class="rounded-lg bg-[var(--dashboard-primary)] px-3 py-2 text-xs font-bold text-[var(--dashboard-surface)] hover:bg-[var(--dashboard-primary-hover)]"
                type="button"
                @click="
                  openContactLog(`${customer.firstName} ${customer.lastName}`)
                "
              >
                Log contact
              </button>
            </td>
          </tr>

          <tr v-if="filteredCustomers.length === 0">
            <td
              colspan="7"
              class="px-5 py-10 text-center text-[var(--app-muted)]"
            >
              No customer matches this filter
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="showContactLogModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-[var(--dashboard-overlay)]"
    >
      <div class="mx-4 w-full max-w-lg rounded-xl bg-[var(--dashboard-surface)] p-5 shadow-xl sm:p-6">
        <h2 class="text-lg font-bold text-[var(--app-dark)]">Contact Log</h2>
        <p class="mt-1 text-sm text-[var(--app-muted)]">
          {{ selectedCustomerName }}
        </p>

        <label class="mt-5 block text-sm font-semibold text-[var(--app-dark)]">
          Status
        </label>
        <select
          v-model="contactStatus"
          class="mt-2 w-full rounded-lg border border-[var(--dashboard-border)] px-4 py-3 text-sm outline-none focus:border-[var(--dashboard-primary)]"
        >
          <option>Contacted Successfully</option>
          <option>No Answer</option>
        </select>

        <label class="mt-5 block text-sm font-semibold text-[var(--app-dark)]">
          Comment
        </label>
        <textarea
          v-model="contactComment"
          class="mt-2 min-h-28 w-full rounded-lg border border-[var(--dashboard-border)] px-4 py-3 text-sm outline-none focus:border-[var(--dashboard-primary)]"
          placeholder="Add call notes"
        />

        <div class="mt-6 flex justify-end gap-3">
          <button
            class="rounded-lg border border-[var(--app-border)] px-4 py-2 text-sm font-semibold"
            type="button"
            @click="showContactLogModal = false"
          >
            Cancel
          </button>
          <button
            class="rounded-lg bg-[var(--dashboard-primary)] px-4 py-2 text-sm font-bold text-[var(--dashboard-surface)]"
            type="button"
            @click="saveContactLog"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
