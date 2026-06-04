import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  Router,
} from "vue-router";
import { getSessionCookie, initiateCsrfToken } from "@/utils/backend-api";
import {
  LOCAL_STORAGE_KEY_IS_LOGIN_PROCESS_STARTED,
  LOCAL_STORAGE_KEY_REDIRECT_AFTER_LOGIN,
  LOCAL_STORAGE_KEY_USERINFO,
} from "@/utils/constant";
import { useUserStore } from "@/stores/User";
import { useSessionStore } from "@/stores/session";
import { USER_ROLE } from "@/utils/enum";

const ROUTE_NAME_LOGIN = "sign-in-form";

export const initGlobalNavigationGuard = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    const sessionStore = useSessionStore();
    const isPublicRoute = !!to.meta.isPublic;
    const hasStoredUser = !!localStorage.getItem(LOCAL_STORAGE_KEY_USERINFO);
    const hasSessionCookie = !!getSessionCookie();
    const shouldCheckUser = hasStoredUser || (!isPublicRoute && hasSessionCookie);
    const user = shouldCheckUser ? await userStore.getUser() : undefined;
    const isAuthenticated = !!user?.sub;

    if (isAuthenticated) {
      localStorage.removeItem(LOCAL_STORAGE_KEY_IS_LOGIN_PROCESS_STARTED);
      localStorage.setItem(LOCAL_STORAGE_KEY_USERINFO, JSON.stringify(user));

      initiateCsrfToken().catch(console.error);
      await handleAuthenticatedUser(to, next, userStore, sessionStore, router);
    } else {
      if (isPublicRoute) {
        next();
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY_USERINFO);
        await handleNonAuthenticated(to, next);
      }
    }
  });
};

const handleAuthenticatedUser = async (
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
  userStore: ReturnType<typeof useUserStore>,
  sessionStore: ReturnType<typeof useSessionStore>,
  router: Router,
) => {
  const savedRedirectPath = localStorage.getItem(
    LOCAL_STORAGE_KEY_REDIRECT_AFTER_LOGIN,
  );
  const userRoles = userStore.userInfo.roles || [];

  if (savedRedirectPath) {
    localStorage.removeItem(LOCAL_STORAGE_KEY_REDIRECT_AFTER_LOGIN);
    next(savedRedirectPath);
    return;
  }

  if (ROUTE_NAME_LOGIN === to.name) {
    next({ path: "/" });
    return;
  }

  if (!to.meta.isPublic) {
    const requiredRoles = (to.meta.allowedRoles as string[]) || [];
    const hasRequiredRole =
      !requiredRoles.length ||
      requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRequiredRole) {
      next({ path: "/" });
    } else {
      next();
    }
  } else {
    if (
      await redirectToRoleDashboard(
        "/",
        USER_ROLE.MEMBER,
        userRoles,
        sessionStore,
        to,
        router,
      )
    )
      return;
    next();
  }
};

const redirectToRoleDashboard = async (
  targetPath: string,
  role: USER_ROLE,
  userRoles: string[],
  sessionStore: ReturnType<typeof useSessionStore>,
  to: RouteLocationNormalized,
  router: Router,
): Promise<boolean> => {
  if (userRoles.includes(role)) {
    sessionStore.currentUserRole = role;
    if (to.path !== targetPath) {
      await router.push(targetPath);
      return true;
    }
  }
  return false;
};

const handleNonAuthenticated = async (
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  if (to.name === ROUTE_NAME_LOGIN) {
    next();
  } else {
    localStorage.setItem(LOCAL_STORAGE_KEY_REDIRECT_AFTER_LOGIN, to.fullPath);
    next({ name: ROUTE_NAME_LOGIN });
  }
};
