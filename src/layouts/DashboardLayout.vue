<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterView } from "vue-router";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar.vue";
import ClientNavbar from "@/components/dashboard/ClientNavbar.vue";
import GlobalLoader from "@/components/GlobalLoader.vue";
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore();
const agentName = computed(() => authStore.profile?.displayName || authStore.user?.email || "User");
const userInitial = computed(() => agentName.value.substring(0, 2).toUpperCase());

const isMobileSidebarOpen = ref(false);
const currentDate = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
}).format(new Date());
</script>

<template>
  <div v-if="authStore.loading" class="min-h-screen flex items-center justify-center bg-gray-50">
    <GlobalLoader />
  </div>

  <template v-else>
    <!-- Agent Layout -->
    <div v-if="authStore.isAgent" class="flex min-h-screen flex-col bg-dashboard-page text-dashboard-heading lg:flex-row">
      <DashboardSidebar
        :mobile-open="isMobileSidebarOpen"
        @close="isMobileSidebarOpen = false"
      />

      <div class="flex min-w-0 flex-1 flex-col">
        <header
          class="flex min-h-20 flex-col gap-3 border-b border-dashboard bg-dashboard-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8 shadow-sm"
        >
          <div class="flex min-w-0 items-center gap-3">
            <button
              class="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-dashboard bg-dashboard-card text-dashboard-muted transition hover:border-blue-600 hover:text-blue-600 lg:hidden"
              type="button"
              aria-label="Open dashboard navigation"
              @click="isMobileSidebarOpen = true"
            >
              <Bars3Icon class="h-6 w-6" />
            </button>

            <div class="min-w-0">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {{ currentDate }}
              </p>
              <h2 class="mt-1 truncate text-lg font-black sm:text-xl text-gray-900">
                Good day, {{ agentName }}
              </h2>
            </div>
          </div>

          <div class="flex items-center justify-between gap-3 sm:justify-end">
            <button
              class="grid h-10 w-10 place-items-center rounded-lg border border-gray-100 bg-gray-50 text-gray-400 transition hover:text-blue-600"
              type="button"
              aria-label="Search"
            >
              <MagnifyingGlassIcon class="h-5 w-5" />
            </button>
            <div class="flex min-w-0 items-center gap-4 pl-4 border-l border-gray-100">
              <div class="hidden text-right sm:block">
                <p class="text-sm font-black text-gray-900 leading-none">{{ agentName }}</p>
                <p class="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Hotline Agent</p>
              </div>
              <div
                class="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-100"
              >
                {{ userInitial }}
              </div>
            </div>
          </div>
        </header>

        <main class="min-h-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <RouterView />
        </main>
      </div>
    </div>

    <!-- Client Layout -->
    <div v-else class="min-h-screen bg-[#f8fafc]">
      <ClientNavbar />
      <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <RouterView />
      </main>
    </div>
  </template>
</template>
