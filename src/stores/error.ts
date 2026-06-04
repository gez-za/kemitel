import { defineStore } from "pinia";
import type { ApiError } from "@/utils/types.ts";

type State = { genericError?: ApiError };

export const useErrorStore = defineStore("error", {
  state: (): State => ({
    genericError: undefined,
  }),
  actions: {
    setGenericError(error: ApiError): void {
      this.genericError = error;
    },
    clearGenericError(): void {
      this.genericError = undefined;
    },
  },
});
