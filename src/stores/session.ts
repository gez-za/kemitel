import { defineStore } from "pinia";
import { USER_ROLE } from "@/utils/enum";
import { type UserInfo, UserService } from "@/api/gateway";
import { type ApiError, onErrorDuringExecution } from "@/utils/error";
import { useUserStore } from "@/stores/User";
import { LOCAL_STORAGE_KEY_USERINFO } from "@/utils/constant";


type State = {
  pathToGoAfterAuthentication: string;
  currentUser: UserInfo;
  roles: string[] | undefined;
  currentUserRole: USER_ROLE;
};

export const useSessionStore = defineStore({
  id: "session",
  state: (): State => ({
    pathToGoAfterAuthentication: "/",
    currentUser: useUserStore().userInfo,
    roles: [],
    currentUserRole: USER_ROLE.MEMBER,
  }),
  getters: {
    isLoggedIn(): boolean {
      return !!localStorage.getItem(LOCAL_STORAGE_KEY_USERINFO);
    },
    isMember(): boolean {
      return doesCurrentUserHas(useUserStore().userInfo, USER_ROLE.MEMBER);
    },
  },
    actions: {
    async logout(): Promise<any> {
      try {
        await UserService.logout();
        return {};
      } catch (error) {
        return onErrorDuringExecution(error as ApiError);
      }
    },
  },
  },
);
export const doesCurrentUserHas = (user: UserInfo = {}, role = ""): boolean => {
  if (user.roles) {
    useSessionStore().roles = user.roles;
    return user.roles.includes(role);
  }
  return false;
};