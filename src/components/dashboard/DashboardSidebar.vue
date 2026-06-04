<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import { menuItems } from "@/utils/menu";
import { logout } from "@/utils/oauth2";
import { XMarkIcon } from "@heroicons/vue/24/outline";

defineProps<{
  mobileOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const route = useRoute();
const navigationItems = menuItems.filter((item) => item.path);
const actionItems = menuItems.filter((item) => item.action);

const isActive = (path?: string) => {
  if (!path) return false;

  if (path === "/") {
    return route.path === "/";
  }

  return route.path.startsWith(path);
};
</script>

<template>
  <div
    v-if="mobileOpen"
    class="fixed inset-0 z-40 bg-[var(--dashboard-overlay)] lg:hidden"
    @click="emit('close')"
  />

  <aside
    class="fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col bg-[var(--dashboard-sidebar)] text-[var(--dashboard-surface)] transition-transform duration-200 lg:static lg:min-h-screen lg:translate-x-0"
    :class="mobileOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div
      class="flex items-center justify-between border-b border-[rgb(255_255_255_/_0.1)] px-4 py-4 lg:block lg:px-6 lg:py-6"
    >
      <div>
        <h1 class="text-lg font-bold tracking-tight lg:text-xl">SmartCover</h1>
        <p class="mt-1 text-xs text-[rgb(255_255_255_/_0.6)] lg:text-sm">
          Hotline Agent Console
        </p>
      </div>

      <button
        class="grid h-10 w-10 place-items-center rounded-lg text-[rgb(255_255_255_/_0.7)] hover:bg-[rgb(255_255_255_/_0.1)] hover:text-[var(--dashboard-surface)] lg:hidden"
        type="button"
        aria-label="Close dashboard navigation"
        @click="emit('close')"
      >
        <XMarkIcon class="h-6 w-6" />
      </button>
    </div>

    <nav
      class="flex-1 space-y-1 px-3 py-5"
    >
      <RouterLink
        v-for="item in navigationItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition"
        :class="
          isActive(item.path)
            ? 'bg-[var(--dashboard-primary)] text-[var(--dashboard-surface)]'
            : 'text-[rgb(255_255_255_/_0.7)] hover:bg-[rgb(255_255_255_/_0.1)] hover:text-[var(--dashboard-surface)]'
        "
        @click="emit('close')"
      >
        <component v-if="item.icon" :is="item.icon" class="h-5 w-5" />

        <span class="whitespace-nowrap">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="border-t border-[rgb(255_255_255_/_0.1)] p-3">
      <button
        v-for="item in actionItems"
        :key="item.label"
        class="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold text-[rgb(255_255_255_/_0.7)] transition hover:bg-[rgb(255_255_255_/_0.1)] hover:text-[var(--dashboard-surface)]"
        type="button"
        @click="logout"
      >
        <component :is="item.icon" class="h-5 w-5" />
        <span>{{ item.label }}</span>
      </button>
    </div>
  </aside>
</template>
