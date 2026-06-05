<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useInsuranceStore } from "@/stores/insurance.store";
import { useAuthStore } from "@/stores/auth.store";
import { formatDate, maskInsuranceNumber } from "@/utils/date";

const insuranceStore = useInsuranceStore();
const authStore = useAuthStore();

onMounted(async () => {
  await Promise.all([
    insuranceStore.fetchAllInsurances(),
    insuranceStore.fetchAllCustomers(),
    insuranceStore.fetchAllClaims(),
    insuranceStore.fetchAllPhones()
  ]);
});

const insurances = computed(() => insuranceStore.insurances);
const claims = computed(() => insuranceStore.claims);
const customers = computed(() => insuranceStore.customers);

const stats = computed(() => [
  { label: "Total Customers", value: customers.value.length, accent: "primary" },
  { label: "Active Policies", value: insurances.value.filter(i => i.status === 'Active').length, accent: "success" },
  { label: "Pending Claims", value: claims.value.filter(c => c.status === 'Pending').length, accent: "warning" },
  { label: "Renewals Needed", value: insurances.value.filter(i => i.status === 'Renewal Necessary').length, accent: "danger" },
]);

const getAccentClass = (accent: string) => {
  if (accent === "success") return "bg-green-50 text-green-700 border-green-100";
  if (accent === "danger") return "bg-red-50 text-red-700 border-red-100";
  if (accent === "warning") return "bg-yellow-50 text-yellow-700 border-yellow-100";
  return "bg-blue-50 text-blue-700 border-blue-100";
};

const getCustomerName = (userId: string) => {
  const customer = customers.value.find(c => c.uid === userId);
  return customer ? (customer.displayName || customer.email || userId) : userId;
};
</script>

<template>
  <section class="space-y-8 animate-in fade-in duration-500">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900">Agent Dashboard</h1>
        <p class="text-gray-500 mt-1">
          Welcome back, <span class="font-bold text-gray-900">{{ authStore.profile?.displayName }}</span> ({{ authStore.agentDetails?.agentCode || 'Hotline' }})
        </p>
      </div>
      <div class="flex gap-2">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
          <span class="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          Available
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all"
      >
        <div
          class="inline-flex rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest border mb-4"
          :class="getAccentClass(stat.accent)"
        >
          {{ stat.label }}
        </div>
        <p class="text-4xl font-black text-gray-900">
          {{ stat.value }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Claims Table -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 class="text-lg font-bold text-gray-900">Priority Claims</h2>
          <button @click="$router.push('/history')" class="text-blue-600 text-sm font-bold hover:underline">View All</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th class="px-6 py-3">Date</th>
                <th class="px-6 py-3">Customer</th>
                <th class="px-6 py-3">Policy Number</th>
                <th class="px-6 py-3">Status</th>
                <th class="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="claim in claims.slice(0, 5)" :key="claim.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-gray-500">{{ formatDate(claim.date) }}</td>
                <td class="px-6 py-4 font-bold text-gray-900">{{ getCustomerName(claim.userId) }}</td>
                <td class="px-6 py-4 font-mono text-xs">{{ maskInsuranceNumber(insurances.find(i => i.id === claim.insuranceId)?.insuranceNumber) }}</td>
                <td class="px-6 py-4">
                  <span :class="claim.status === 'Pending' ? 'text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded text-xs font-bold' : 'text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-bold'">
                    {{ claim.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button @click="$router.push('/history')" class="text-blue-600 hover:text-blue-800 font-bold">Review</button>
                </td>
              </tr>
              <tr v-if="claims.length === 0">
                <td colspan="5" class="px-6 py-10 text-center text-gray-400 italic">No pending claims.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Agent Info Sidebar -->
      <div class="space-y-6">
        <div class="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-100">
          <h3 class="font-bold text-lg text-white">My Performance</h3>
          <div class="mt-4 space-y-4">
            <div class="flex justify-between items-center text-sm">
              <span class="text-blue-100 font-medium">Department</span>
              <span class="font-bold text-white">{{ authStore.agentDetails?.department || 'Hotline' }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-blue-100 font-medium">Resolved Today</span>
              <span class="font-bold text-white">12 Cases</span>
            </div>
            <div class="h-2 w-full bg-blue-500 rounded-full mt-4 overflow-hidden">
              <div class="h-full bg-white w-[75%]"></div>
            </div>
            <p class="text-[10px] text-blue-100 font-bold uppercase tracking-wider">75% of daily target reached</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 class="font-bold text-gray-900 mb-4">Quick Links</h3>
          <div class="grid grid-cols-2 gap-3">
            <button @click="$router.push('/agents')" class="p-3 bg-gray-50 rounded-xl text-center hover:bg-blue-50 transition-colors group">
              <i class="fas fa-users-cog text-blue-600 block mb-2"></i>
              <span class="text-xs font-bold text-gray-600 group-hover:text-blue-700">Team</span>
            </button>
            <button @click="$router.push('/renewals')" class="p-3 bg-gray-50 rounded-xl text-center hover:bg-orange-50 transition-colors group">
              <i class="fas fa-sync text-orange-600 block mb-2"></i>
              <span class="text-xs font-bold text-gray-600 group-hover:text-orange-700">Renewals</span>
            </button>
          </div>
        </div>
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
