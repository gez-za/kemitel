<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useInsuranceStore } from "@/stores/insurance.store";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";
import StatusBadge from "../components/StatusBadge.vue";
import { formatDate, maskInsuranceNumber } from "@/utils/date";

const insuranceStore = useInsuranceStore();
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  if (authStore.isAgent) {
    await insuranceStore.fetchAllClaims();
    await insuranceStore.fetchAllInsurances();
  } else {
    await insuranceStore.fetchUserClaims();
    await insuranceStore.fetchUserInsurances();
  }
});

const claims = computed(() => insuranceStore.claims);

const getInsuranceNumber = (id: string) => {
  const ins = insuranceStore.insurances.find(i => i.id === id);
  return ins ? maskInsuranceNumber(ins.insuranceNumber) : '***';
};

const updateStatus = async (claimId: string, status: string) => {
  await insuranceStore.updateClaimStatus(claimId, status);
};
</script>

<template>
  <section class="space-y-6 animate-in fade-in duration-500">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900">
          {{ authStore.isAgent ? 'Claims Management' : 'My Claims' }}
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          {{ authStore.isAgent ? 'Review and manage all submitted insurance claims.' : 'Track your submitted claims and their current status.' }}
        </p>
      </div>
      <button 
        v-if="authStore.isClient"
        @click="router.push('/declare-loss')"
        class="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
      >
        Declare New Loss
      </button>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead class="bg-gray-50 text-gray-500 font-medium uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4">Submission Date</th>
              <th class="px-6 py-4">Policy Number</th>
              <th v-if="authStore.isAgent" class="px-6 py-4">Client ID</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Evidence</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white text-gray-600">
            <tr v-for="item in claims" :key="item.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {{ formatDate(item.date) }}
              </td>
              <td class="px-6 py-4">
                {{ getInsuranceNumber(item.insuranceId) }}
              </td>
              <td v-if="authStore.isAgent" class="px-6 py-4 text-xs font-mono">
                {{ item.userId }}
              </td>
              <td class="px-6 py-4">
                <StatusBadge :status="item.status" />
              </td>
              <td class="px-6 py-4">
                <a 
                  :href="item.certificateUrl" 
                  target="_blank" 
                  class="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                >
                  <i class="fas fa-file-download"></i>
                  View Certificate
                </a>
              </td>
              <td class="px-6 py-4 text-right">
                <div v-if="authStore.isAgent && item.status === 'Pending'" class="flex justify-end gap-2">
                  <button 
                    @click="updateStatus(item.id!, 'Approved')" 
                    class="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors"
                  >
                    Approve
                  </button>
                  <button 
                    @click="updateStatus(item.id!, 'Rejected')" 
                    class="bg-red-50 text-red-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                  >
                    Reject
                  </button>
                </div>
                <span v-else class="text-xs text-gray-400">Processed</span>
              </td>
            </tr>
            <tr v-if="claims.length === 0">
              <td colspan="6" class="px-6 py-16 text-center text-gray-500 italic">
                <div class="flex flex-col items-center">
                  <i class="fas fa-folder-open text-4xl mb-4 text-gray-200"></i>
                  <p>No claims found in the system.</p>
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
