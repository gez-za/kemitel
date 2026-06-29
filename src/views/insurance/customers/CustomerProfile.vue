<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useInsuranceStore } from "@/stores/insurance.store";
import { AuthService } from "@/services/auth.service";
import StatusBadge from "../components/StatusBadge.vue";
import type { UserProfile } from "@/models/user.model";
import { formatDate } from "@/utils/date";

const route = useRoute();
const insuranceStore = useInsuranceStore();

const customer = ref<UserProfile | null>(null);
const showVerificationModal = ref(false);
const verificationNumber = ref("");
const verificationError = ref("");
const isVerified = ref(false);
const contactMessage = ref("");
const reminderMessage = ref("");

onMounted(async () => {
  const userId = String(route.params.customerId);
  customer.value = await AuthService.getUserProfile(userId);
  await insuranceStore.fetchAllInsurances();
  await insuranceStore.fetchAllPhones();
});

const insurance = computed(() =>
  insuranceStore.insurances.find((item) => item.userId === String(route.params.customerId)),
);

const phone = computed(() => 
  insuranceStore.phones.find(p => p.id === insurance.value?.phoneId)
);

const verifyInsuranceNumber = () => {
  if (!insurance.value) return;

  if (verificationNumber.value === insurance.value.insuranceNumber) {
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

const toggleInsuranceStatus = async () => {
  if (!insurance.value?.id) return;
  const newStatus = insurance.value.status === 'Active' ? 'Expired' : 'Active';
  await insuranceStore.updateInsuranceStatus(insurance.value.id, newStatus);
};
</script>

<template>
  <section v-if="customer" class="space-y-6 animate-in fade-in duration-500">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
          {{ customer.firstname }}
        </h1>
        <p class="mt-1 text-sm text-gray-500 font-medium uppercase tracking-widest">Customer Profile & History</p>
      </div>
      <div class="flex gap-2">
        <button
          class="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
          @click="$router.back()"
        >
          <i class="fas fa-arrow-left mr-2"></i> Back
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Personal Info -->
      <div class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div class="flex items-center gap-4 mb-6">
          <div class="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl font-black">
            {{ (customer.firstname || 'U').charAt(0) }}
          </div>
          <h2 class="text-xl font-black text-gray-900">Personal Info</h2>
        </div>
        <div class="space-y-5 text-sm">
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
            <p class="font-bold text-gray-900 truncate">{{ customer.email }}</p>
          </div>
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
            <p class="font-bold text-gray-900">{{ customer.phoneNumber || 'Not provided' }}</p>
          </div>
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account Created</p>
            <p class="font-bold text-gray-900">{{ formatDate(customer.createdAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Device Info -->
      <div class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div class="flex items-center gap-4 mb-6">
          <div class="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 text-xl">
            <i class="fas fa-mobile-alt"></i>
          </div>
          <h2 class="text-xl font-black text-gray-900">Device Details</h2>
        </div>
        <div v-if="phone" class="space-y-5 text-sm">
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Brand & Model</p>
            <p class="font-bold text-gray-900">{{ phone.brand }} {{ phone.model }}</p>
          </div>
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">IMEI Number</p>
            <p class="font-bold text-gray-900 font-mono tracking-tighter">{{ phone.imei }}</p>
          </div>
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Policy Number</p>
            <p class="font-bold text-gray-900 font-mono">
              {{ isVerified ? insurance?.insuranceNumber : (insurance ? "INS-****-*** (Hidden)" : "N/A") }}
            </p>
          </div>
        </div>
        <div v-else class="text-sm text-gray-400 italic py-4">No device registered.</div>
      </div>

      <!-- Insurance Status -->
      <div class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 text-xl">
              <i class="fas fa-shield-check"></i>
            </div>
            <h2 class="text-xl font-black text-gray-900">Insurance</h2>
          </div>
          <StatusBadge v-if="insurance" :status="insurance.status" />
        </div>
        
        <div v-if="insurance" class="space-y-5 text-sm">
          <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Registered</p>
              <p class="font-black text-gray-900">{{ formatDate(insurance.registrationDate) }}</p>
            </div>
            <div>
              <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Expires</p>
              <p class="font-black text-red-600">{{ formatDate(insurance.expirationDate) }}</p>
            </div>
          </div>
          <div>
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Payment Method</p>
            <p class="font-bold text-gray-900">{{ insurance.paymentMethod }}</p>
          </div>
        </div>
        <div v-else class="text-sm text-gray-400 italic py-4">No active insurance policy.</div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex flex-wrap gap-4 pt-4">
      <button
        v-if="insurance"
        class="flex-1 min-w-[200px] rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
        @click="showVerificationModal = true"
      >
        <i class="fas fa-user-check"></i>
        Verify Policy Number
      </button>

      <button
        v-if="insurance"
        class="flex-1 min-w-[200px] rounded-2xl border-2 px-6 py-4 text-sm font-black transition-all active:scale-95 flex items-center justify-center gap-2"
        :class="insurance.status === 'Active' ? 'border-red-100 text-red-600 bg-red-50 hover:bg-red-100' : 'border-green-100 text-green-600 bg-green-50 hover:bg-green-100'"
        @click="toggleInsuranceStatus"
      >
        <i :class="insurance.status === 'Active' ? 'fas fa-pause-circle' : 'fas fa-play-circle'"></i>
        {{ insurance.status === 'Active' ? 'Suspend Policy' : 'Activate Policy' }}
      </button>

      <button
        class="flex-1 min-w-[200px] rounded-2xl border border-gray-200 bg-white px-6 py-4 text-sm font-black text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
        @click="markAsContacted"
      >
        <i class="fas fa-comment-alt"></i>
        Log Contact
      </button>

      <button
        class="flex-1 min-w-[200px] rounded-2xl border border-gray-200 bg-white px-6 py-4 text-sm font-black text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
        @click="sendReminder"
      >
        <i class="fas fa-paper-plane"></i>
        Send Reminder
      </button>
    </div>

    <div v-if="contactMessage || reminderMessage" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-if="contactMessage" class="p-4 bg-green-50 border border-green-100 rounded-2xl text-sm font-bold text-green-700 flex items-center gap-3">
        <i class="fas fa-check-circle"></i> {{ contactMessage }}
      </div>
      <div v-if="reminderMessage" class="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-sm font-bold text-blue-700 flex items-center gap-3">
        <i class="fas fa-info-circle"></i> {{ reminderMessage }}
      </div>
    </div>

    <!-- Verification Modal -->
    <div
      v-if="showVerificationModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in duration-300">
        <div class="flex items-center gap-4 mb-6">
          <div class="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
             <i class="fas fa-lock"></i>
          </div>
          <h2 class="text-2xl font-black text-gray-900 tracking-tight">Secure Verification</h2>
        </div>
        
        <p class="text-gray-500 font-medium mb-6">
          Ask the customer for their policy number and enter it below to reveal full details.
        </p>

        <input
          v-model="verificationNumber"
          type="text"
          placeholder="e.g. INS-2026-123456"
          class="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
        />

        <div v-if="isVerified" class="mt-4 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-700 text-sm font-bold flex items-center gap-3">
          <i class="fas fa-check-double"></i> Verification successful.
        </div>
        <div v-if="verificationError" class="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-bold flex items-center gap-3">
          <i class="fas fa-exclamation-triangle"></i> {{ verificationError }}
        </div>

        <div class="mt-8 flex gap-4">
          <button
            class="flex-1 rounded-2xl border border-gray-200 px-6 py-4 text-sm font-black text-gray-600 hover:bg-gray-50 transition-all"
            @click="closeVerificationModal"
          >
            Cancel
          </button>

          <button
            class="flex-1 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
            @click="verifyInsuranceNumber"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  </section>

  <section v-else class="flex flex-col items-center justify-center py-20">
    <div class="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center text-red-400 text-3xl mb-6">
       <i class="fas fa-user-slash"></i>
    </div>
    <h2 class="text-2xl font-black text-gray-900">Customer Not Found</h2>
    <p class="text-gray-500 mt-2 font-medium">The requested profile could not be loaded.</p>
    <button @click="$router.push('/customers')" class="mt-8 text-blue-600 font-black hover:underline">Return to Customer List</button>
  </section>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-in {
  animation: fade-in 0.5s ease-out forwards;
}
</style>
