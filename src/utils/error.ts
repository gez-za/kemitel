import { useErrorStore } from "@/stores/error.ts";
import type { ApiError, ApiResponse } from "@/utils/types.ts";

export const GENERIC_ERROR = "GENERIC_ERROR";
export const apiErrorCodes = [
  "UUM-3001",
];

export enum UUMErrorCode {
  "UUM-3001" = "UUM-3001",
}

export const isGenericError = (errorMessage?: string): boolean => {
  if (!errorMessage) return false;
  return !apiErrorCodes.includes(errorMessage);
};


const generateMessage = (error: ApiError) => {
  const code = error.body;
  if (code && exchangeDeadlineErrors[code]) {
    return exchangeDeadlineErrors[code];
  }
  switch (error.statusCode) {
    case 409:
      return "conflict_lbl";
    case 404:
      return "not_found_lbl";
    case 403:
      return "unauthorized_lbl";
    default:
      return error.message;
  }
};

export const onErrorDuringExecution = <T>(error: ApiError): ApiResponse<T> => {
  let errorCode = error.body;
  if (isGenericError(errorCode)) {
    errorCode = GENERIC_ERROR;
    useErrorStore().setGenericError({
      ...error,
      message: generateMessage(error),
    });
  }
  return { error: errorCode };
};
