<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { customers, devices } from "../data/mockInsurance";
import StatusBadge from "../components/StatusBadge.vue";

const route = useRoute();
const showVerificationModal = ref(false);
const verificationNumber = ref("");
const verificationError = ref("");
const isVerified = ref(false);
const contactMessage = ref("");
const reminderMessage = ref("");

const customer = computed(() =>
  customers.find((item) => item.id === String(route.params.customerId)),
);

const device = computed(() =>
  devices.find((item) => item.customerId === String(route.params.customerId)),
);

const verifyInsuranceNumber = () => {
  if (!customer.value) return;

  if (verificationNumber.value === customer.value.insuranceNumber) {
    isVerified.value = true;
    verificationError.value = "";
  } else {
    isVerified.value = false;
    verificationError.value = "Invalid Number";
  }
};

const closeVerificationModal = () => {
  showVerificationModal.value = false;
  verificationNumber.value = "";
  verificationError.value = "";
};

const markAsContacted = () => {
  contactMessage.value = "Customer marked as contacted for this session.";
};

const sendReminder = () => {
  reminderMessage.value = "Reminder queued for the customer.";
};
</script>

<template>
  <section v-if="customer" class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-[var(--app-dark)] sm:text-3xl">
        {{ customer.firstName }} {{ customer.lastName }}
      </h1>
      <p class="mt-1 text-sm text-[var(--app-muted)]">Customer Profile</p>
    </div>

    <div class="grid grid-cols-1 gap-5 xl:grid-cols-3">
      <div
        class="rounded-xl border border-[var(--dashboard-soft-border)] bg-[var(--dashboard-surface)] p-5 shadow-sm"
      >
        <h2 class="mb-4 text-lg font-bold text-[var(--app-dark)]">
          Personal information
        </h2>
        <div class="space-y-3 text-sm text-[var(--app-muted)]">
          <p><strong class="text-[var(--app-dark)]">First name:</strong> {{ customer.firstName }}</p>
          <p><strong class="text-[var(--app-dark)]">Last name:</strong> {{ customer.lastName }}</p>
          <p><strong class="text-[var(--app-dark)]">Phone number:</strong> {{ customer.phone }}</p>
          <p><strong class="text-[var(--app-dark)]">Email:</strong> {{ customer.email }}</p>
        </div>
      </div>

      <div
        class="rounded-xl border border-[var(--dashboard-soft-border)] bg-[var(--dashboard-surface)] p-5 shadow-sm"
      >
        <h2 class="mb-4 text-lg font-bold text-[var(--app-dark)]">
          Device information
        </h2>
        <div class="space-y-3 text-sm text-[var(--app-muted)]">
          <p><strong class="text-[var(--app-dark)]">IMEI:</strong> {{ device?.imei || "N/A" }}</p>
          <p>
            <strong class="text-[var(--app-dark)]">Payment method:</strong>
            {{ device?.paymentMethod || "N/A" }}
          </p>
          <p>
            <strong class="text-[var(--app-dark)]">Insurance number:</strong>
            {{ isVerified ? customer.insuranceNumber : "INS-****" }}
          </p>
        </div>
      </div>

      <div
        class="rounded-xl border border-[var(--dashboard-soft-border)] bg-[var(--dashboard-surface)] p-5 shadow-sm"
      >
        <h2 class="mb-4 text-lg font-bold text-[var(--app-dark)]">
          Insurance status
        </h2>
        <div class="space-y-3 text-sm text-[var(--app-muted)]">
          <StatusBadge :status="customer.insuranceStatus" />
          <p><strong class="text-[var(--app-dark)]">Expiration date:</strong> {{ customer.expirationDate }}</p>
          <p><strong class="text-[var(--app-dark)]">Last contact:</strong> {{ customer.lastContactStatus }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
      <button
        class="rounded-lg bg-[var(--dashboard-primary)] px-4 py-3 text-sm font-bold text-[var(--dashboard-surface)] hover:bg-[var(--dashboard-primary-hover)]"
        @click="showVerificationModal = true"
      >
        Verify Insurance Number
      </button>

      <button
        class="rounded-lg border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] px-4 py-3 text-sm font-bold text-[var(--dashboard-heading)] hover:border-[var(--dashboard-primary)]"
        @click="markAsContacted"
      >
        Mark as Contacted
      </button>

      <button
        class="rounded-lg border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] px-4 py-3 text-sm font-bold text-[var(--dashboard-heading)] hover:border-[var(--dashboard-primary)]"
        @click="sendReminder"
      >
        Send Reminder
      </button>
    </div>

    <div v-if="contactMessage || reminderMessage" class="space-y-2">
      <p v-if="contactMessage" class="text-sm font-semibold text-[var(--app-success)]">
        {{ contactMessage }}
      </p>
      <p v-if="reminderMessage" class="text-sm font-semibold text-[var(--app-primary)]">
        {{ reminderMessage }}
      </p>
    </div>

    <div
      v-if="showVerificationModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-[var(--dashboard-overlay)]"
    >
      <div class="mx-4 w-full max-w-md rounded-xl bg-[var(--dashboard-surface)] p-5 shadow-xl sm:p-6">
        <h2 class="text-lg font-bold text-[var(--app-dark)]">
          Secure Verification
        </h2>
        <p class="mt-1 text-sm text-[var(--app-muted)]">
          Enter the insurance number provided by the customer.
        </p>

        <input
          v-model="verificationNumber"
          type="text"
          placeholder="Insurance number"
          class="mt-5 w-full rounded-lg border border-[var(--dashboard-border)] px-4 py-3 text-sm outline-none focus:border-[var(--dashboard-primary)] focus:ring-2 focus:ring-[var(--dashboard-primary-soft)]"
        />

        <p v-if="isVerified" class="mt-2 text-sm font-semibold text-[var(--app-success)]">
          Number verified
        </p>
        <p
          v-if="verificationError"
          class="mt-2 text-sm font-semibold text-[var(--app-danger)]"
        >
          {{ verificationError }}
        </p>

        <div class="mt-6 flex justify-end gap-3">
          <button
            class="rounded-lg border border-[var(--app-border)] px-4 py-2 text-sm font-semibold"
            @click="closeVerificationModal"
          >
            Cancel
          </button>

          <button
            class="rounded-lg bg-[var(--dashboard-primary)] px-4 py-2 text-sm font-bold text-[var(--dashboard-surface)]"
            @click="verifyInsuranceNumber"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  </section>

  <section v-else>
    <p class="text-[var(--app-muted)]">Customer not found.</p>
  </section>
</template>
