<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  status: string;
}>();

const statusConfig = computed(() => {
  const s = (props.status || "Unknown").toLowerCase();
  
  if (["active", "approved", "validee", "contacted", "sent", "completed", "success"].includes(s)) {
    return {
      label: props.status,
      classes: "bg-green-50 text-green-700 border-green-200"
    };
  }

  if (["expired", "rejected", "rejetee", "no answer", "failed", "offline"].includes(s)) {
    return {
      label: props.status,
      classes: "bg-red-50 text-red-700 border-red-200"
    };
  }

  if (["pending", "en_attente", "renewal necessary", "en attente", "waiting"].includes(s)) {
    return {
      label: props.status,
      classes: "bg-yellow-50 text-yellow-700 border-yellow-200"
    };
  }

  return {
    label: props.status,
    classes: "bg-gray-50 text-gray-700 border-gray-200"
  };
});
</script>

<template>
  <span
    :class="statusConfig.classes"
    class="inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
  >
    {{ statusConfig.label }}
  </span>
</template>
