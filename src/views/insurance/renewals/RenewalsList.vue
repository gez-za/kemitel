<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useInsuranceStore } from "@/stores/insurance.store";
import StatusBadge from "../components/StatusBadge.vue";
import { useAuthStore } from "@/stores/auth.store";
import { formatDate, maskInsuranceNumber } from "@/utils/date";

const insuranceStore = useInsuranceStore();
const authStore = useAuthStore();

onMounted(async () => {
  if (authStore.isAgent) {
    await insuranceStore.fetchAllInsurances();
  } else {
    await insuranceStore.fetchUserInsurances();
  }
});

const items = computed(() => {
  if (authStore.isAgent) {
    return insuranceStore.insurances.filter(ins => ins.status === "Renewal Necessary");
  }
  return insuranceStore.insurances;
});
</script>

<template>
  <section class="space-y-6 animate-in fade-in duration-500">
    <div>
      <h1 class="text-3xl font-extrabold text-gray-900">
        {{ authStore.isAgent ? 'Renewals Management' : 'My Insurances' }}
      </h1>
      <p class="mt-1 text-sm text-gray-500">
        {{ authStore.isAgent ? 'Customers with insurance policies requiring immediate renewal.' : 'Overview of all your current and past insurance policies.' }}
      </p>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead class="bg-gray-50 text-gray-500 font-medium uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4">Policy Number</th>
              <th v-if="authStore.isAgent" class="px-6 py-4">Client ID</th>
              <th class="px-6 py-4">Effective Date</th>
              <th class="px-6 py-4">Expiry Date</th>
              <th class="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white text-gray-600">
            <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                {{ maskInsuranceNumber(item.insuranceNumber) }}
              </td>
              <td v-if="authStore.isAgent" class="px-6 py-4 text-xs font-mono">
                {{ item.userId }}
              </td>
              <td class="px-6 py-4">
                {{ formatDate(item.registrationDate) }}
              </td>
              <td class="px-6 py-4">
                {{ formatDate(item.expirationDate) }}
              </td>
              <td class="px-6 py-4 text-right">
                <StatusBadge :status="item.status" />
              </td>
            </tr>
            <tr v-if="items.length === 0">
              <td colspan="5" class="px-6 py-16 text-center text-gray-500 italic">
                <div class="flex flex-col items-center">
                  <i class="fas fa-shield-slash text-4xl mb-4 text-gray-200"></i>
                  <p>{{ authStore.isAgent ? 'No renewals pending at this time.' : 'No insurance records found.' }}</p>
                </div>
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
