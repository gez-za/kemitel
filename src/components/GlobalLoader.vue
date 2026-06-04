<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { BProgress } from "@bprogress/core";
import { useGlobalLoading } from "@/composables/useGlobalLoading";

const { isGlobalLoading } = useGlobalLoading();

const isVisible = ref(false);
let showTimer: number | undefined;
let hideTimer: number | undefined;

const start = () => {
  BProgress.start();
  isVisible.value = true;
};

const stop = () => {
  BProgress.done();
  isVisible.value = false;
};

const safeClear = (timer?: number) => {
  if (timer) window.clearTimeout(timer);
};

watch(
  () => isGlobalLoading.value,
  (loading) => {
    safeClear(showTimer);
    safeClear(hideTimer);

    if (loading) {
      // Small delay to avoid flicker on very fast requests.
      showTimer = window.setTimeout(start, 150);
      return;
    }

    // Keep loader visible briefly to avoid rapid toggling.
    hideTimer = window.setTimeout(stop, 150);
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  safeClear(showTimer);
  safeClear(hideTimer);
});

</script>

<template></template>
