<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import AgentDashboard from "./AgentDashboard.vue";
import ClientDashboard from "./ClientDashboard.vue";
import GlobalLoader from "@/components/GlobalLoader.vue";

const authStore = useAuthStore();
</script>

<template>
  <div v-if="authStore.loading" class="flex h-96 items-center justify-center">
    <GlobalLoader />
  </div>
  <template v-else>
    <AgentDashboard v-if="authStore.isAgent" />
    <ClientDashboard v-else />
  </template>
</template>
