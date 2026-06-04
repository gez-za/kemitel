import { COOKIE_CSRF, SESSION } from "@/utils/constant";
import { SecurityService } from "@/api/gateway";

export const getCsrfCookie = (): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${COOKIE_CSRF}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export const getSessionCookie = (): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${SESSION}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const hasCsrfCookie = (): boolean => {
  return !!getCsrfCookie();
};

export const initiateCsrfToken = (): Promise<undefined> => {
  if (hasCsrfCookie()) {
    return Promise.resolve(undefined);
  }
  return SecurityService.initCsrf()
    .then(() => undefined)
    .catch(() => undefined);
};
