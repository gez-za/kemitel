import { defineStore } from "pinia";
import { ref } from "vue";

export const useErrorStore = defineStore("error", () => {
  const error = ref<string | null>(null);

  function setError(message: string | null) {
    error.value = message;
  }

  function clearError() {
    error.value = null;
  }

  return {
    error,
    setError,
    clearError
  };
});
