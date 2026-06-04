import { defineStore } from "pinia";
import { getUserInfo } from "@/utils/oauth2";
import type { UserInfo } from "@/api/gateway";
import { LOCAL_STORAGE_KEY_USERINFO } from "@/utils/constant";

type State = {
  userInfo: UserInfo;
};

export const useUserStore = defineStore({
  id: "user",
  state: (): State =>
    <State>{
      userInfo: {} as UserInfo,
    },
  getters: {},
  actions: {
    async getUser(): Promise<UserInfo> {
      if (this.userInfo && Object.keys(this.userInfo).length === 0) {
        const storedUserInfo = localStorage.getItem(LOCAL_STORAGE_KEY_USERINFO);

        if (storedUserInfo) {
          try {
            this.userInfo = JSON.parse(storedUserInfo) as UserInfo;
            return this.userInfo;
          } catch {
            localStorage.removeItem(LOCAL_STORAGE_KEY_USERINFO);
          }
        }

        const userInfo = await getUserInfo();
        if (userInfo) {
          this.userInfo = userInfo;
        }
      }
      return this.userInfo;
    },
  },
});
