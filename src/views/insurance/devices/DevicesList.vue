<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useInsuranceStore } from "@/stores/insurance.store";
import StatusBadge from "../components/StatusBadge.vue";
import { useAuthStore } from "@/stores/auth.store";
import { formatDate, maskInsuranceNumber } from "@/utils/date";

const router = useRouter();
const route = useRoute();
const search = ref("");
const insuranceStore = useInsuranceStore();
const authStore = useAuthStore();

const isSearchPage = computed(() => route.name === 'insurance-search');
const title = computed(() => {
  if (authStore.isAgent) return 'Devices Management';
  return isSearchPage.value ? 'Search Devices' : 'My Insured Devices';
});

onMounted(async () => {
  if (authStore.isAgent) {
    await Promise.all([
      insuranceStore.fetchAllInsurances(),
      insuranceStore.fetchAllPhones(),
      insuranceStore.fetchAllCustomers()
    ]);
  } else {
    await insuranceStore.initClientData();
  }
});

const getOwnerName = (userId: string) => {
  const customer = insuranceStore.customers.find(c => c.uid === userId);
  return customer ? (customer.displayName || customer.email || 'Client') : 'Client';
};

const getPhoneInfo = (phoneId: string) => {
  return insuranceStore.phones.find(p => p.id === phoneId);
};

const filteredDevices = computed(() => {
  const value = search.value.toLowerCase().trim();
  const insurances = insuranceStore.insurances;

  if (!value) return insurances;

  return insurances.filter((device) => {
    const phone = getPhoneInfo(device.phoneId);
    const ownerName = getOwnerName(device.userId) || "";
    return (
      (phone?.imei || "").toLowerCase().includes(value) ||
      device.insuranceNumber.toLowerCase().includes(value) ||
      ownerName.toLowerCase().includes(value) ||
      phone?.brand.toLowerCase().includes(value) ||
      phone?.model.toLowerCase().includes(value)
    );
  });
});
</script>

<template>
  <section class="space-y-6 animate-in fade-in duration-500">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900">
          {{ title }}
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          {{ authStore.isAgent ? 'Complete list of registered smartphone insurance devices.' : 'Manage your registered smartphone insurance devices.' }}
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
          placeholder="Search by IMEI, brand, model or insurance number..."
          class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
        />
      </div>
    </div>

    <div v-if="filteredDevices.length === 0" class="rounded-2xl border border-gray-100 bg-white p-20 text-center shadow-sm">
      <div class="mx-auto h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 text-3xl mb-4">
        <i class="fas fa-mobile-alt"></i>
      </div>
      <h2 class="text-xl font-bold text-gray-900">No devices found</h2>
      <p class="mt-2 text-sm text-gray-500">
        Try adjusting your search criteria or register a new device.
      </p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="device in filteredDevices"
        :key="device.id"
        class="group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
        @click="router.push(`/devices/${device.id}`)"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
            <i class="fas fa-mobile-screen-button"></i>
          </div>
          <StatusBadge :status="device.status" />
        </div>

        <div>
          <h3 class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {{ getPhoneInfo(device.phoneId)?.brand }} {{ getPhoneInfo(device.phoneId)?.model }}
          </h3>
          <p class="text-sm text-gray-500 font-medium uppercase tracking-widest">IMEI: {{ getPhoneInfo(device.phoneId)?.imei }}</p>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-50 space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Policy No.</span>
            <span class="font-bold text-gray-900 font-mono">{{ maskInsuranceNumber(device.insuranceNumber, authStore.isAgent) }}</span>
          </div>
          <div v-if="authStore.isAgent" class="flex justify-between text-sm">
            <span class="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Owner</span>
            <span class="font-bold text-gray-900">{{ getOwnerName(device.userId) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Expires</span>
            <span class="font-bold text-gray-900">{{ formatDate(device.expirationDate) }}</span>
          </div>
        </div>

        <div class="mt-4 flex items-center text-xs font-bold text-blue-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
          View Details <i class="fas fa-arrow-right ml-2"></i>
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
