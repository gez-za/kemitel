import { watch } from "vue";
import type { Router } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { AuthService } from "@/services/auth.service";

const ROUTE_NAME_LOGIN = "sign-in-form";

export const initGlobalNavigationGuard = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // Wait for auth initialization if it's still loading
    if (authStore.loading) {
      await new Promise<void>((resolve) => {
        const unwatch = watch(
          () => authStore.loading,
          (isLoading) => {
            if (!isLoading) {
              unwatch();
              resolve();
            }
          }
        );
      });
    }

    const isPublicRoute = !!to.meta.isPublic;
    const isAuthenticated = authStore.isAuthenticated;
    const userRole = authStore.profile?.role || (authStore.profile ? 'client' : undefined);

    console.log(`Guard - Path: ${to.path}, Auth: ${isAuthenticated}, Role: ${userRole}`);

    if (isAuthenticated) {
      if (to.name === ROUTE_NAME_LOGIN) {
        console.log("Guard - Already authenticated, redirecting to home");
        return next({ path: "/" });
      }

      // If user is authenticated but profile is not loaded yet, 
      // we might need to wait or let them pass if it's the home page
      if (!userRole && to.path !== "/") {
         console.log("Guard - Role not available yet, allowing pass to handle locally");
         return next();
      }

      const requiredRoles = to.meta.roles as string[] | undefined;
      if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
        console.warn(`Guard - User role ${userRole} is not authorized for ${to.path}. Required: ${requiredRoles}`);
        if (to.path === "/") return next(); // Prevent infinite loop on home
        return next({ path: "/" });
      }

      next();
    } else {
      if (isPublicRoute) {
        next();
      } else {
        next({ name: ROUTE_NAME_LOGIN });
      }
    }
  });
};
