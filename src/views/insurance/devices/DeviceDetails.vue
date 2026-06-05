<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useInsuranceStore } from "@/stores/insurance.store";
import StatusBadge from "../components/StatusBadge.vue";
import { useAuthStore } from "@/stores/auth.store";
import { formatDate, formatCurrency, maskInsuranceNumber } from "@/utils/date";

const route = useRoute();
const router = useRouter();
const insuranceStore = useInsuranceStore();
const authStore = useAuthStore();

const insurance = computed(() =>
  insuranceStore.insurances.find((item) => item.id === String(route.params.deviceId))
);

const phone = computed(() => 
  insuranceStore.phones.find(p => p.id === insurance.value?.phoneId)
);

const customer = computed(() => 
  insuranceStore.customers.find(c => c.uid === insurance.value?.userId)
);

onMounted(async () => {
  if (insuranceStore.insurances.length === 0) {
    await insuranceStore.fetchAllInsurances();
  }
  if (insuranceStore.phones.length === 0) {
    await insuranceStore.fetchAllPhones();
  }
  if (authStore.isAgent && insuranceStore.customers.length === 0) {
    await insuranceStore.fetchAllCustomers();
  }
});

const handleDeclareLoss = () => {
  router.push('/declare-loss');
};
</script>

<template>
  <section v-if="insurance" class="space-y-6 animate-in fade-in duration-500">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900">Device Details</h1>
        <p class="text-sm text-gray-500 mt-1">
          Managing insurance for <span class="font-bold text-gray-900">{{ phone?.brand }} {{ phone?.model }}</span>
        </p>
      </div>
      <button 
        v-if="authStore.isClient"
        @click="handleDeclareLoss"
        class="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-100 transition-all flex items-center gap-2"
      >
        <i class="fas fa-exclamation-triangle"></i>
        Declare Loss / Theft
      </button>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Insurance Info Card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h2 class="text-lg font-bold text-gray-900">Policy Information</h2>
          <StatusBadge :status="insurance.status" />
        </div>
        <div class="p-8 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Policy Number</p>
              <p class="text-lg font-medium text-gray-900 mt-1">{{ maskInsuranceNumber(insurance.insuranceNumber) }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Method</p>
              <p class="text-lg font-medium text-gray-900 mt-1">{{ insurance.paymentMethod }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Start Date</p>
              <p class="text-gray-900 mt-1">{{ formatDate(insurance.registrationDate) }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">End Date</p>
              <p class="text-gray-900 mt-1">{{ formatDate(insurance.expirationDate) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Device Info Card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-50 bg-gray-50/50">
          <h2 class="text-lg font-bold text-gray-900">Device & Owner</h2>
        </div>
        <div class="p-8 space-y-6">
          <div class="flex items-center gap-6">
            <div class="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-3xl">
              <i class="fas fa-mobile-screen"></i>
            </div>
            <div>
              <p class="text-2xl font-black text-gray-900">{{ phone?.brand }} {{ phone?.model }}</p>
              <p class="text-sm text-gray-500 font-medium mt-1 uppercase tracking-widest">IMEI: {{ phone?.imei }}</p>
            </div>
          </div>
          
          <div class="pt-6 border-t border-gray-50 space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-500">Insured Value</span>
              <span class="text-xl font-black text-blue-600">{{ formatCurrency(phone?.value || 0) }}</span>
            </div>
            <div v-if="authStore.isAgent" class="flex justify-between items-center">
              <span class="text-gray-500">Owner</span>
              <span class="font-bold text-gray-900">{{ customer?.displayName || insurance.userId }}</span>
            </div>
          </div>

          <button
            v-if="authStore.isAgent"
            class="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
            @click="router.push(`/customers/${insurance.userId}`)"
          >
            View Customer Profile
          </button>
        </div>
      </div>
    </div>
  </section>

  <section v-else class="text-center py-20">
    <div class="mx-auto h-20 w-20 rounded-full bg-red-50 flex items-center justify-center text-red-600 text-3xl mb-4">
      <i class="fas fa-exclamation-circle"></i>
    </div>
    <h2 class="text-2xl font-bold text-gray-900">Insurance Policy Not Found</h2>
    <p class="text-gray-500 mt-2">The requested device details are unavailable.</p>
    <button @click="router.push('/')" class="mt-6 text-blue-600 font-bold hover:underline">Return to Dashboard</button>
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
