<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { devices } from "../data/mockInsurance";
import StatusBadge from "../components/StatusBadge.vue";

const router = useRouter();
const search = ref("");

const filteredDevices = computed(() => {
  const value = search.value.toLowerCase().trim();

  if (!value) return devices;

  return devices.filter((device) => {
    return (
      device.imei.toLowerCase().includes(value) ||
      device.customerName.toLowerCase().includes(value) ||
      device.customerPhone.toLowerCase().includes(value) ||
      device.insuranceNumber.toLowerCase().includes(value)
    );
  });
});

const openCustomerProfile = (customerId: string) => {
  router.push(`/customers/${customerId}`);
};
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-[var(--app-dark)] sm:text-3xl">
        Devices
      </h1>
      <p class="mt-1 text-sm text-[var(--app-muted)]">
        Complete list of registered smartphone insurance devices.
      </p>
    </div>

    <div
      class="rounded-xl border border-[var(--dashboard-soft-border)] bg-[var(--dashboard-surface)] p-5 shadow-sm"
    >
      <label
        class="mb-2 block text-sm font-semibold text-[var(--app-dark)]"
        for="device-search"
      >
        Search device
      </label>
      <input
        id="device-search"
        v-model="search"
        type="search"
        placeholder="Search by IMEI, customer name, phone or insurance number"
        class="h-12 w-full rounded-lg border border-[var(--dashboard-border)] px-4 text-sm outline-none transition focus:border-[var(--dashboard-primary)] focus:ring-2 focus:ring-[var(--dashboard-primary-soft)]"
      />
    </div>

    <div
      v-if="filteredDevices.length === 0"
      class="rounded-xl border border-[var(--dashboard-soft-border)] bg-[var(--dashboard-surface)] p-12 text-center shadow-sm"
    >
      <h2 class="text-lg font-bold text-[var(--app-dark)]">No device found</h2>
      <p class="mt-2 text-sm text-[var(--app-muted)]">
        Try another IMEI, customer name, phone number, or insurance number.
      </p>
    </div>

    <div v-else class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <button
        v-for="device in filteredDevices"
        :key="device.id"
        class="rounded-xl border border-[var(--dashboard-soft-border)] bg-[var(--dashboard-surface)] p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--dashboard-primary)] hover:shadow-md"
        type="button"
        @click="openCustomerProfile(device.customerId)"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
              Device IMEI
            </p>
            <h2 class="mt-1 text-lg font-bold text-[var(--app-dark)]">
              {{ device.imei }}
            </h2>
          </div>
          <StatusBadge :status="device.insuranceStatus" />
        </div>

        <div class="mt-5 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
              Customer
            </p>
            <p class="mt-1 font-semibold text-[var(--app-dark)]">
              {{ device.customerName }}
            </p>
            <p class="mt-1 text-[var(--app-muted)]">
              {{ device.customerPhone }}
            </p>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
              Insurance number
            </p>
            <p class="mt-1 font-semibold text-[var(--app-dark)]">
              {{ device.insuranceNumber }}
            </p>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
              Payment method
            </p>
            <p class="mt-1 font-semibold text-[var(--app-dark)]">
              {{ device.paymentMethod }}
            </p>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-[var(--app-muted)]">
              Coverage period
            </p>
            <p class="mt-1 font-semibold text-[var(--app-dark)]">
              {{ device.registrationDate }} to {{ device.expirationDate }}
            </p>
          </div>
        </div>
      </button>
    </div>
  </section>
</template>
