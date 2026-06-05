<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { 
  HomeIcon, 
  DevicePhoneMobileIcon, 
  ShieldCheckIcon,
  DocumentTextIcon,
  CreditCardIcon,
  BellIcon,
  ArrowRightStartOnRectangleIcon
} from "@heroicons/vue/24/outline";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const userDisplayName = computed(() => {
  if (authStore.profile?.displayName) return authStore.profile.displayName;
  return authStore.user?.email?.split('@')[0] || "Customer";
});
const userInitial = computed(() => userDisplayName.value.charAt(0).toUpperCase());

const navigationItems = [
  { label: "Dashboard", path: "/", icon: HomeIcon },
  { label: "My Devices", path: "/devices", icon: DevicePhoneMobileIcon },
  { label: "Insurances", path: "/renewals", icon: ShieldCheckIcon },
  { label: "Claims", path: "/history", icon: DocumentTextIcon },
  { label: "Payments", path: "/payments", icon: CreditCardIcon },
  { label: "Notifications", path: "/notifications", icon: BellIcon },
];

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login");
};

const isActive = (path: string) => {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
};
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md shadow-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2 group cursor-pointer" @click="router.push('/')">
          <div class="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform">
            <i class="fas fa-shield-alt text-xl text-white"></i>
          </div>
          <span class="text-2xl font-black text-gray-900 tracking-tight">Kemitel</span>
        </div>

        <!-- Navigation -->
        <nav class="hidden lg:flex items-center gap-1">
          <RouterLink
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
            :class="isActive(item.path) 
              ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50' 
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
          >
            <component :is="item.icon" class="h-5 w-5" />
            {{ item.label }}
          </RouterLink>
        </nav>

        <!-- Right Side -->
        <div class="flex items-center gap-6">
          <!-- User Profile -->
          <div class="flex items-center gap-4 pl-6 border-l border-gray-100">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-black text-gray-900 leading-none">{{ userDisplayName }}</p>
              <p class="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Silver Client</p>
            </div>
            <div class="h-10 w-10 rounded-xl bg-blue-600 border border-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-100">
              {{ userInitial }}
            </div>
            <button 
              @click="handleLogout" 
              class="h-10 w-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
              title="Logout"
            >
              <ArrowRightStartOnRectangleIcon class="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
