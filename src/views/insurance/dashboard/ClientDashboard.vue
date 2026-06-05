<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useInsuranceStore } from "@/stores/insurance.store";
import { useAuthStore } from "@/stores/auth.store";
import { formatDate, formatCurrency, maskInsuranceNumber, calculateSubscriptionProgress } from "@/utils/date";
import StatusBadge from "../components/StatusBadge.vue";

const router = useRouter();
const insuranceStore = useInsuranceStore();
const authStore = useAuthStore();

const isPolicyVisible = ref(false);

onMounted(async () => {
  await insuranceStore.initClientData();
});

const stats = computed(() => [
  { label: 'Total Insurances', value: insuranceStore.insurances.length, icon: 'shield-check' },
  { label: 'Active Claims', value: insuranceStore.claims.filter(c => c.status === 'Pending' || c.status === 'EN_ATTENTE').length, icon: 'exclamation-circle' },
  { label: 'Recent Payments', value: insuranceStore.payments.length, icon: 'credit-card' }
]);

const activeInsurance = computed(() => {
  if (insuranceStore.insurances.length === 0) return null;
  return [...insuranceStore.insurances]
    .filter(ins => ins.status === 'Active')
    .sort((a, b) => {
       const dateA = new Date(a.registrationDate).getTime();
       const dateB = new Date(b.registrationDate).getTime();
       return dateB - dateA;
    })[0] || null;
});

const activePhone = computed(() => {
  if (!activeInsurance.value) {
    return insuranceStore.phones.length > 0 ? insuranceStore.phones[0] : null;
  }
  return insuranceStore.phones.find(p => p.id === activeInsurance.value?.phoneId) || null;
});

const subscriptionProgress = computed(() => {
  if (!activeInsurance.value) return 0;
  return calculateSubscriptionProgress(activeInsurance.value.registrationDate, activeInsurance.value.expirationDate);
});

const getPhoneForInsurance = (phoneId: string) => {
  return insuranceStore.phones.find(p => p.id === phoneId);
};

const userFullName = computed(() => {
  return authStore.profile?.displayName || authStore.user?.displayName || authStore.user?.email?.split('@')[0] || 'Client';
});
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-500">
    <!-- Welcome Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome back, <span class="text-blue-600">{{ userFullName }}</span>
        </h1>
        <p class="text-gray-500 mt-1 text-sm font-medium">Review your coverage and manage your insured devices.</p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="router.push('/declare-loss')"
          class="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-bold rounded-xl shadow-lg shadow-blue-100 text-white bg-blue-600 hover:bg-blue-700 transition-all active:scale-95"
        >
          <i class="fas fa-plus-circle mr-2 text-white"></i>
          <span class="text-white">Declare Loss</span>
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="stat in stats" :key="stat.label" class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">{{ stat.label }}</p>
            <p class="mt-2 text-3xl font-black text-gray-900">{{ stat.value }}</p>
          </div>
          <div class="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
             <i :class="`fas fa-${stat.icon}`"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <!-- Main Device Highlights -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h2 class="text-xl font-black text-gray-900">Featured Device</h2>
            <StatusBadge v-if="activeInsurance" :status="activeInsurance.status" />
          </div>
          
          <div v-if="activePhone" class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div class="space-y-6">
                <div>
                  <p class="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Registered Device</p>
                  <p class="text-2xl font-black text-gray-900">{{ activePhone.brand }} {{ activePhone.model }}</p>
                  <p class="text-sm text-gray-500 font-medium font-mono">IMEI: {{ activePhone.imei }}</p>
                </div>
                <div v-if="activeInsurance">
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Insurance Policy</p>
                  <div class="flex items-center gap-2">
                    <p class="text-lg font-bold text-gray-900 font-mono">
                      {{ maskInsuranceNumber(activeInsurance.insuranceNumber, !isPolicyVisible) }}
                    </p>
                    <button @click="isPolicyVisible = !isPolicyVisible" class="text-gray-400 hover:text-blue-600 transition-colors p-1">
                      <i :class="`fas fa-eye${isPolicyVisible ? '-slash' : ''}`"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="space-y-6">
                <div v-if="activeInsurance">
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Coverage Period</p>
                  <p class="text-sm font-bold text-gray-900">
                    {{ formatDate(activeInsurance.registrationDate) }} — {{ formatDate(activeInsurance.expirationDate) }}
                  </p>
                  <!-- Subscription Progress Bar -->
                  <div class="mt-4 space-y-2">
                    <div class="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span class="text-gray-400">Subscription Status</span>
                      <span class="text-blue-600">{{ subscriptionProgress }}%</span>
                    </div>
                    <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out shadow-sm shadow-blue-100"
                        :style="{ width: `${subscriptionProgress}%` }"
                      ></div>
                    </div>
                    <p v-if="subscriptionProgress === 0" class="text-[9px] font-bold text-orange-500 italic uppercase">
                      Activation pending review
                    </p>
                  </div>
                </div>
                <div>
                  <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Insured Value</p>
                  <p class="text-2xl font-black text-blue-600">{{ formatCurrency(activePhone.value) }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="p-20 text-center">
            <div class="mx-auto h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 text-2xl mb-4">
              <i class="fas fa-mobile-alt"></i>
            </div>
            <p class="text-gray-500 font-bold">No active device found.</p>
            <button @click="router.push('/devices')" class="mt-4 text-blue-600 font-black hover:underline">Register your first device</button>
          </div>
        </div>

        <!-- Registered Devices Quick List -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-white">
          <div class="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h2 class="text-xl font-black text-gray-900">My Devices</h2>
            <button @click="router.push('/devices')" class="text-blue-600 text-sm font-black hover:underline">View All</button>
          </div>
          <div v-if="insuranceStore.insurances.length > 0" class="divide-y divide-gray-50">
            <div 
              v-for="ins in insuranceStore.insurances.slice(0, 3)" 
              :key="ins.id"
              class="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer"
              @click="router.push(`/devices/${ins.id}`)"
            >
              <div class="flex items-center gap-4">
                <div class="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <i class="fas fa-mobile-screen"></i>
                </div>
                <div>
                  <p class="font-bold text-gray-900">{{ getPhoneForInsurance(ins.phoneId)?.brand }} {{ getPhoneForInsurance(ins.phoneId)?.model }}</p>
                  <p class="text-xs text-gray-400 font-medium font-mono tracking-tighter">Policy: {{ maskInsuranceNumber(ins.insuranceNumber) }}</p>
                </div>
              </div>
              <StatusBadge :status="ins.status" />
            </div>
          </div>
          <div v-else class="p-16 text-center text-gray-400 italic">
            <p>No registered devices available.</p>
          </div>
        </div>
      </div>

      <!-- Profile Sidebar -->
      <div class="space-y-8">
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
          <div class="mx-auto h-24 w-24 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-100 transition-transform hover:scale-105">
            <span class="text-white">{{ userFullName.charAt(0) }}</span>
          </div>
          <h3 class="mt-6 text-2xl font-black text-gray-900 leading-tight">{{ userFullName }}</h3>
          <p class="text-sm text-gray-500 font-medium mt-1 truncate">{{ authStore.profile?.email }}</p>
          
          <div class="mt-8 pt-8 border-t border-gray-50 space-y-4 text-left">
            <div class="flex items-center gap-4 text-sm text-gray-600">
              <div class="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shadow-inner">
                <i class="fas fa-phone-alt"></i>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</p>
                <p class="font-bold text-gray-900">{{ authStore.profile?.phoneNumber || 'Not provided' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-600">
              <div class="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 shadow-inner">
                <i class="fas fa-calendar-check"></i>
              </div>
              <div>
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</p>
                <p class="font-bold text-gray-900">{{ formatDate(authStore.profile?.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Support Card -->
        <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl shadow-blue-200 group">
          <div class="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl mb-6 group-hover:rotate-12 transition-transform">
            <i class="fas fa-headset text-white"></i>
          </div>
          <h3 class="font-black text-xl text-white">Need Support?</h3>
          <p class="text-blue-50 text-sm mt-3 leading-relaxed font-medium">Our team is ready to help you with your insurance claims or technical issues.</p>
          <button class="mt-8 w-full bg-white text-blue-700 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/20 uppercase tracking-widest active:scale-95">
            <span class="text-blue-700">Contact Us</span>
          </button>
        </div>
      </div>
    </div>
  </div>
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
