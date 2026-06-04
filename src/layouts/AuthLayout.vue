<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <section class="bg-login-page flex min-h-screen items-start justify-center overflow-y-auto px-4">
    <div
      class="flex min-h-[100dvh] w-full max-w-[393px] flex-col items-center justify-center py-6 sm:max-w-[460px] sm:py-8"
    >
      <!-- Header is provided by individual auth pages (e.g. LoginPage) -->
      <main class="w-full">
        <RouterView v-slot="{ Component }">
          <Transition
            name="fade"
            mode="out-in"
            enter-active-class="transition-opacity duration-200 ease"
            leave-active-class="transition-opacity duration-200 ease"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
          >
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </section>
</template>
