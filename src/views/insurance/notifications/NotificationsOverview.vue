<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useInsuranceStore } from "@/stores/insurance.store";

const authStore = useAuthStore();
const insuranceStore = useInsuranceStore();

onMounted(async () => {
  if (authStore.isClient) {
    await insuranceStore.fetchUserNotifications();
  }
});

const notifications = computed(() => insuranceStore.notifications);

const formatDate = (date: string) => {
  return new Date(date).toLocaleString();
};
</script>

<template>
  <section class="space-y-6 animate-in fade-in duration-500">
    <div>
      <h1 class="text-3xl font-extrabold text-gray-900">Notifications</h1>
      <p class="mt-1 text-sm text-gray-500">
        Stay updated with your insurance status and claims.
      </p>
    </div>

    <div v-if="notifications.length > 0" class="space-y-4">
      <div 
        v-for="note in notifications" 
        :key="note.id"
        class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
        :class="{ 'border-l-4 border-l-blue-500': note.status === 'Unread' }"
      >
        <div class="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
          <i class="fas fa-bell"></i>
        </div>
        <div class="flex-1">
          <p class="text-gray-900 font-medium">{{ note.message }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ formatDate(note.date) }}</p>
        </div>
        <div v-if="note.status === 'Unread'" class="h-2 w-2 rounded-full bg-blue-600"></div>
      </div>
    </div>

    <div
      v-else
      class="rounded-2xl border border-gray-100 bg-white p-16 text-center shadow-sm"
    >
      <div class="mx-auto h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 text-3xl mb-4">
        <i class="fas fa-bell-slash"></i>
      </div>
      <h2 class="text-xl font-bold text-gray-900">No notifications</h2>
      <p class="mt-2 text-sm text-gray-500">
        You're all caught up! We'll notify you here when something happens.
      </p>
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
