import { computed } from "vue";
import { useIsFetching, useIsMutating } from "@tanstack/vue-query";

export const useGlobalLoading = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  const pendingCount = computed(() => isFetching.value + isMutating.value);
  const isGlobalLoading = computed(() => pendingCount.value > 0);

  return { isGlobalLoading, pendingCount };
};
