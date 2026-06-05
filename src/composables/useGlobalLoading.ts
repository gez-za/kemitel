import { ref, computed } from "vue";

const loadingCount = ref(0);

export const useGlobalLoading = () => {
  const isGlobalLoading = computed(() => loadingCount.value > 0);

  const startLoading = () => {
    loadingCount.value++;
  };

  const stopLoading = () => {
    if (loadingCount.value > 0) {
      loadingCount.value--;
    }
  };

  return { 
    isGlobalLoading, 
    startLoading, 
    stopLoading 
  };
};
