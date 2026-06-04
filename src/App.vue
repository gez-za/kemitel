<script setup lang="ts">
import { watch } from "vue";
import { useI18n } from "vue-i18n";
import { RouterView } from "vue-router";
import { useErrorStore } from "@/stores/error.ts";
import { Vue3Snackbar, useSnackbar } from "vue3-snackbar";
import GlobalLoader from "@/components/GlobalLoader.vue";

const { t } = useI18n({
  useScope: "global",
  inheritLocale: true,
  messages: {
    en: {
      conflict_lbl: "Conflict",
      not_found_lbl: "Not Found",
      unauthorized_lbl: "Unauthorized",
      error_msg: "Ooops something went wrong !",
    },
    fr: {
      conflict_lbl: "Conflit",
      not_found_lbl: "Non trouvé",
      unauthorized_lbl: "Non autorisé",
      error_msg: "Oups, il y a eu un problème !",
    },
  },
});

const snackbar = useSnackbar();
const errorStore = useErrorStore();

watch(
  () => errorStore.genericError,
  (value) => {
    if (value) {
      snackbar.add({
        type: "error",
        title: `${value.statusCode}`,
        text: t(`${value.message}`),
      });
    }
  }
);
</script>

<template>
  <section class="h-full w-full">
    <GlobalLoader />
    <RouterView />
    <Vue3Snackbar
      right
      bottom
      groups
      border="bottom"
      :duration="5000"
      @cleared="errorStore.clearGenericError"
    >
      <template #message-content="{ message }">
        <div class="flex flex-col w-full h-5 md:h-10">
          <h2
            class="font-outfit-bold text-sm md:text-lg"
            :data-testid="`title-${message}`"
          >
            {{ t("error_msg") }}
          </h2>
          <div
            data-testid="description"
            class="flex flex-nowrap gap-x-2 text-xs md:text-base ml-[5%] text-blue-800 whitespace-nowrap"
          >
            <span>{{ message.title }}</span>
            <span>{{ message.text }}</span>
          </div>
        </div>
      </template>
    </Vue3Snackbar>
  </section>
</template>
