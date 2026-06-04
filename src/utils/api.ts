import type { Client } from "@hey-api/client-axios";
import { client as gatewayOpenApi } from "@/api/gateway/client.gen";

import { COOKIE_CSRF, HEADER_KEY_CSRF, TENANT } from "@/utils/constant";

const setupClient = (
  client: Client,
  name: string,
  shouldPrefixWithApi = true
): void => {
  client.setConfig({
    baseURL: shouldPrefixWithApi
      ? `${import.meta.env.VITE_REST_API_BASE_URL}/api/${name}`
      : `${import.meta.env.VITE_REST_API_BASE_URL}/${name}`,
    headers: { "tenant-id": `${TENANT}` },
    xsrfCookieName: COOKIE_CSRF,
    xsrfHeaderName: HEADER_KEY_CSRF,
    withCredentials: true,
    withXSRFToken: true,
  });
};

export const prepareApis = () => {
  setupClient(gatewayOpenApi, "", false);
};
