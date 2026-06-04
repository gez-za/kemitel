<script setup lang="ts">
import { contactHistory } from "../data/mockInsurance";
import StatusBadge from "../components/StatusBadge.vue";
</script>

<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-[var(--app-dark)] sm:text-3xl">
        History
      </h1>
      <p class="mt-1 text-sm text-[var(--app-muted)]">
        Review previous hotline contact attempts and outcomes.
      </p>
    </div>

    <div
      class="overflow-x-auto rounded-xl border border-[var(--dashboard-soft-border)] bg-[var(--dashboard-surface)] shadow-sm"
    >
      <table class="min-w-[760px] w-full text-left text-sm">
        <thead class="bg-[var(--dashboard-table-header)] text-[var(--dashboard-muted)]">
          <tr>
            <th class="px-5 py-4">Date</th>
            <th class="px-5 py-4">Customer</th>
            <th class="px-5 py-4">Phone</th>
            <th class="px-5 py-4">Agent</th>
            <th class="px-5 py-4">Result</th>
            <th class="px-5 py-4">Comment</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in contactHistory"
            :key="item.id"
            class="border-t border-[var(--app-soft-border)]"
          >
            <td class="px-5 py-4 font-medium text-[var(--app-dark)]">
              {{ item.contactDate }}
            </td>
            <td class="px-5 py-4 text-[var(--app-muted)]">
              {{ item.customerName }}
            </td>
            <td class="px-5 py-4 text-[var(--app-muted)]">
              {{ item.phone }}
            </td>
            <td class="px-5 py-4 text-[var(--app-muted)]">
              {{ item.agentName }}
            </td>
            <td class="px-5 py-4">
              <StatusBadge :status="item.result" />
            </td>
            <td class="px-5 py-4 text-[var(--app-muted)]">
              {{ item.comment ?? "-" }}
            </td>
          </tr>

          <tr v-if="contactHistory.length === 0">
            <td
              colspan="6"
              class="px-5 py-10 text-center text-[var(--app-muted)]"
            >
              No history found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
