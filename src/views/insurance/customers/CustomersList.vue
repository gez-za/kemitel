<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useInsuranceStore } from "@/stores/insurance.store";
import { formatDate, maskInsuranceNumber } from "@/utils/date";

const router = useRouter();
const search = ref("");
const insuranceStore = useInsuranceStore();

onMounted(async () => {
  await Promise.all([
    insuranceStore.fetchAllCustomers(),
    insuranceStore.fetchAllInsurances()
  ]);
});

const getCustomerInsurances = (userId: string) => {
  return insuranceStore.insurances.filter(ins => ins.userId === userId);
};

const filteredCustomers = computed(() => {
  const value = search.value.toLowerCase().trim();
  const customers = insuranceStore.customers;

  if (!value) return customers;

  return customers.filter((user) => {
    const insurances = getCustomerInsurances(user.uid);
    return (
      (user.displayName || "").toLowerCase().includes(value) ||
      (user.email || "").toLowerCase().includes(value) ||
      (user.phoneNumber || "").toLowerCase().includes(value) ||
      insurances.some(ins => ins.insuranceNumber.toLowerCase().includes(value))
    );
  });
});

const openCustomer = (id: string) => {
  router.push(`/customers/${id}`);
};
</script>

<template>
  <section class="space-y-6 animate-in fade-in duration-500">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900">Registered Customers</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage and review all active client accounts.
        </p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="fas fa-search text-gray-400"></i>
        </div>
        <input
          v-model="search"
          type="search"
          placeholder="Search by name, email, phone or policy number..."
          class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
        />
      </div>
    </div>

    <div v-if="filteredCustomers.length === 0" class="rounded-2xl border border-gray-100 bg-white p-20 text-center shadow-sm">
      <div class="mx-auto h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 text-3xl mb-4">
        <i class="fas fa-users-slash"></i>
      </div>
      <h2 class="text-xl font-bold text-gray-900">No customers found</h2>
      <p class="mt-2 text-sm text-gray-500">Check your search criteria or try again later.</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="customer in filteredCustomers"
        :key="customer.uid"
        class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
        @click="openCustomer(customer.uid)"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-lg">
            {{ customer.firstname?.charAt(0) }}
          </div>
          <div class="flex flex-col items-end gap-1">
             <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</span>
             <span class="text-xs font-bold text-gray-900">{{ formatDate(customer.createdAt) }}</span>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">
            {{ customer.firstname }}
          </h2>
          <p class="text-sm text-gray-500 font-medium">{{ customer.email }}</p>
          <p class="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">{{ customer.phoneNumber || 'No phone provided' }}</p>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-50">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Active Policies</p>
          <div v-if="getCustomerInsurances(customer.uid).length > 0" class="flex flex-wrap gap-2">
            <span 
              v-for="ins in getCustomerInsurances(customer.uid).slice(0, 2)" 
              :key="ins.id"
              class="px-2 py-1 bg-gray-50 border border-gray-100 rounded text-[10px] font-mono font-bold text-gray-600"
            >
              {{ maskInsuranceNumber(ins.insuranceNumber) }}
            </span>
            <span v-if="getCustomerInsurances(customer.uid).length > 2" class="text-[10px] font-bold text-blue-600 mt-1">
              +{{ getCustomerInsurances(customer.uid).length - 2 }} more
            </span>
          </div>
          <p v-else class="text-xs italic text-gray-400">No active policies found.</p>
        </div>

        <div class="mt-4 flex items-center text-xs font-bold text-blue-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
          View Profile <i class="fas fa-chevron-right ml-2"></i>
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
