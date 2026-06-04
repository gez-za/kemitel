import {
  type UserInfo,
  UserService as GatewayUserService,
} from "@/api/gateway";
import { type RouteLocationNormalized } from "vue-router";
import { doesCurrentUserHas, useSessionStore } from "@/stores/session";
import {
  LOCAL_STORAGE_KEY_IS_LOGIN_PROCESS_STARTED,
  LOCAL_STORAGE_KEY_REDIRECT_AFTER_LOGIN,
  LOCAL_STORAGE_KEY_USERINFO,
} from "@/utils/constant";

export const getUserInfo = (): Promise<UserInfo | undefined> => {
  return GatewayUserService.getUserInfo().then(({ data, status, error }) => {
    if (error && status !== 401) {
      console.error(
        `not authenticated: [error: ${error}] - [status: ${status}]`,
      );
    }
    return data;
  });
};

export const hasAllowedRoles = (to: RouteLocationNormalized): boolean => {
  const sessionStore = useSessionStore();
  return to.meta.allowedRoles?.some((value) =>
    doesCurrentUserHas(sessionStore.currentUser, value),
  ) as boolean;
};
export const logout = async (): Promise<void> => {
  const sessionStore = useSessionStore();

  const { error } = await sessionStore.logout();
  if (error) {
    console.log(`error during logout ${error}`);
  }

  localStorage.removeItem(LOCAL_STORAGE_KEY_USERINFO);
  localStorage.removeItem(LOCAL_STORAGE_KEY_IS_LOGIN_PROCESS_STARTED);
  localStorage.removeItem(LOCAL_STORAGE_KEY_REDIRECT_AFTER_LOGIN);
  window.location.href = "/login";
};

export const startLoginProcess = () => {
  localStorage.setItem(LOCAL_STORAGE_KEY_IS_LOGIN_PROCESS_STARTED, "yes");
  window.location.href = `${
    import.meta.env.VITE_REST_API_BASE_URL
  }/oauth2/authorization/portal`;
};

export const isLoginProcessStarted = (): boolean => {
  const value = localStorage.getItem(LOCAL_STORAGE_KEY_IS_LOGIN_PROCESS_STARTED);

  return value === "yes";
};
