<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { devices } from "../data/mockInsurance";
import StatusBadge from "../components/StatusBadge.vue";

const route = useRoute();
const router = useRouter();

const device = computed(() =>
  devices.find((item) => item.id === String(route.params.deviceId)),
);

const goToCustomerProfile = () => {
  if (!device.value) return;
  router.push(`/customers/${device.value.customerId}`);
};
</script>

<template>
  <section v-if="device" class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-[var(--app-dark)]">Device Details</h1>
      <p class="text-sm text-[var(--app-muted)]">
        Détails de l’appareil enregistré.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <div
        class="rounded-xl border border-[var(--dashboard-soft-border)] bg-[var(--dashboard-surface)] p-5 shadow-sm"
      >
        <h2 class="mb-4 text-lg font-semibold text-[var(--app-dark)]">
          Device information
        </h2>

        <div class="space-y-3 text-sm text-[var(--app-dark)]">
          <p><strong>IMEI:</strong> {{ device.imei }}</p>
          <p><strong>Payment method:</strong> {{ device.paymentMethod }}</p>
          <p>
            <strong>Registration date:</strong> {{ device.registrationDate }}
          </p>
          <p><strong>Expiration date:</strong> {{ device.expirationDate }}</p>
          <p>
            <strong>Status:</strong>
            <StatusBadge :status="device.insuranceStatus" />
          </p>
        </div>
      </div>

      <div
        class="rounded-xl border border-[var(--dashboard-soft-border)] bg-[var(--dashboard-surface)] p-5 shadow-sm"
      >
        <h2 class="mb-4 text-lg font-semibold text-[var(--app-dark)]">
          Customer information
        </h2>

        <div class="space-y-3 text-sm text-[var(--app-dark)]">
          <p><strong>Customer:</strong> {{ device.customerName }}</p>
          <p><strong>Phone:</strong> {{ device.customerPhone }}</p>
          <p><strong>Insurance number:</strong> {{ device.insuranceNumber }}</p>
        </div>

        <button
          class="mt-5 rounded-lg bg-[var(--dashboard-primary)] px-4 py-2 text-sm font-semibold text-[var(--dashboard-surface)] hover:bg-[var(--dashboard-primary-hover)]"
          @click="goToCustomerProfile"
        >
          View Customer Profile
        </button>
      </div>
    </div>
  </section>

  <section v-else>
    <p class="text-[var(--app-muted)]">Device not found.</p>
  </section>
</template>
