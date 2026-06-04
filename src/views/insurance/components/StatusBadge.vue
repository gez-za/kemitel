<script setup lang="ts">
defineProps<{
  status: string;
}>();

const getClass = (status: string) => {
  if (status === "Active" || status === "Contacted" || status === "Sent") {
    return "bg-[var(--dashboard-success-soft)] text-[var(--dashboard-success)] border-[var(--dashboard-success-soft)]";
  }

  if (status === "Expired" || status === "No Answer" || status === "Failed") {
    return "bg-[var(--dashboard-error-soft)] text-[var(--dashboard-error)] border-[var(--dashboard-error-soft)]";
  }

  if (status === "Renewal Necessary") {
    return "bg-[var(--dashboard-warning-soft)] text-[var(--dashboard-warning)] border-[var(--dashboard-warning-soft)]";
  }

  return "bg-[var(--dashboard-background)] text-[var(--dashboard-muted)] border-[var(--dashboard-soft-border)]";
};
</script>

<template>
  <span
    :class="getClass(status)"
    class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold"
  >
    {{ status }}
  </span>
</template>
