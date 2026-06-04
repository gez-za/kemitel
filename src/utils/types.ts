export type ApiResponse<T> = {
  data?: T;
  error?: string;
};

export type ApiError = {
  body?: string | undefined;
  message?: string | undefined;
  statusCode?: number | undefined;
};