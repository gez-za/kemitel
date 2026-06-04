<script setup lang="ts">
import { ref } from "vue";
import { RouterView } from "vue-router";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar.vue";
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/vue/24/outline";

const agentName = "Ariane Mbarga";
const isMobileSidebarOpen = ref(false);
const currentDate = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
}).format(new Date());
</script>

<template>
  <div class="flex min-h-screen flex-col bg-dashboard-page text-dashboard-heading lg:flex-row">
    <DashboardSidebar
      :mobile-open="isMobileSidebarOpen"
      @close="isMobileSidebarOpen = false"
    />

    <div class="flex min-w-0 flex-1 flex-col">
      <header
        class="flex min-h-20 flex-col gap-3 border-b border-dashboard bg-dashboard-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8"
      >
        <div class="flex min-w-0 items-center gap-3">
          <button
            class="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-dashboard bg-dashboard-card text-dashboard-muted transition hover:border-[var(--dashboard-primary)] hover:text-[var(--dashboard-primary)] lg:hidden"
            type="button"
            aria-label="Open dashboard navigation"
            @click="isMobileSidebarOpen = true"
          >
            <Bars3Icon class="h-6 w-6" />
          </button>

          <div class="min-w-0">
            <p class="text-sm font-medium text-[var(--app-muted)]">
              {{ currentDate }}
            </p>
            <h2 class="mt-1 truncate text-lg font-bold sm:text-xl">
              Good day, {{ agentName }}
            </h2>
          </div>
        </div>

        <div class="flex items-center justify-between gap-3 sm:justify-end">
          <button
            class="grid h-10 w-10 place-items-center rounded-lg border border-dashboard bg-dashboard-card text-dashboard-muted transition hover:border-[var(--dashboard-primary)] hover:text-[var(--dashboard-primary)]"
            type="button"
            aria-label="Search"
          >
            <MagnifyingGlassIcon class="h-5 w-5" />
          </button>
          <div class="flex min-w-0 items-center gap-3">
            <div class="hidden text-right sm:block">
              <p class="text-sm font-semibold">{{ agentName }}</p>
              <p class="text-xs text-[var(--app-muted)]">Hotline Agent</p>
            </div>
            <div
              class="grid h-11 w-11 place-items-center rounded-full bg-[var(--dashboard-primary)] text-sm font-bold text-[var(--dashboard-surface)]"
            >
              AM
            </div>
          </div>
        </div>
      </header>

      <main class="min-h-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <RouterView />
      </main>
    </div>
  </div>
</template>
