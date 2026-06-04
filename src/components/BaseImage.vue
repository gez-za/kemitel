<template>
  <img
    :src="getImageUrl"
    alt="image"
    loading="lazy"
    :class="$attrs.class"
    :fetchpriority="fetchPriority"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  fetchPriority: {
    type: String,
    default: "auto",
    validator(value: string): boolean {
      return ["low", "high", "auto"].includes(value);
    },
  },
});

const getImageUrl = computed(() => {
  return new URL(`../assets/${props.path}/${props.name}.png`, import.meta.url)
    .href;
});
</script>
