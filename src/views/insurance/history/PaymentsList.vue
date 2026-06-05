<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useInsuranceStore } from "@/stores/insurance.store";
import { useAuthStore } from "@/stores/auth.store";
import { formatDateTime, maskInsuranceNumber, formatCurrency } from "@/utils/date";

const insuranceStore = useInsuranceStore();
const authStore = useAuthStore();

onMounted(async () => {
  if (authStore.isAgent) {
    await insuranceStore.fetchAllPayments();
    await insuranceStore.fetchAllInsurances();
  } else {
    await insuranceStore.fetchUserPayments();
    await insuranceStore.fetchUserInsurances();
  }
});

const getInsuranceNumber = (insuranceId: string) => {
  const ins = insuranceStore.insurances.find(i => i.id === insuranceId);
  return ins ? maskInsuranceNumber(ins.insuranceNumber) : '***';
};
</script>

<template>
  <section class="space-y-6 animate-in fade-in duration-500">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {{ authStore.isAgent ? 'Payments Management' : 'My Payments' }}
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          {{ authStore.isAgent ? 'Review and manage all insurance payments.' : 'History of your insurance subscription payments.' }}
        </p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead class="bg-gray-50 text-gray-500 font-medium uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4">Date</th>
              <th class="px-6 py-4">Insurance Policy</th>
              <th class="px-6 py-4">Amount</th>
              <th class="px-6 py-4">Method</th>
              <th class="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="payment in insuranceStore.payments" :key="payment.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {{ formatDateTime(payment.date) }}
              </td>
              <td class="px-6 py-4 text-gray-600">
                {{ getInsuranceNumber(payment.insuranceId) }}
              </td>
              <td class="px-6 py-4 font-bold text-gray-900">
                {{ formatCurrency(payment.amount) }}
              </td>
              <td class="px-6 py-4 text-gray-600">
                {{ payment.method }}
              </td>
              <td class="px-6 py-4">
                <span 
                  class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  :class="payment.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                >
                  {{ payment.status }}
                </span>
              </td>
            </tr>
            <tr v-if="insuranceStore.payments.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500 italic">
                No payment history found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
