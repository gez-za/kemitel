import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { UserProfile, AgentProfile } from "@/models/user.model";
import { AuthService } from "@/services/auth.service";
import { useGlobalLoading } from "@/composables/useGlobalLoading";
import type { User } from "firebase/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const profile = ref<UserProfile | AgentProfile | null>(null);
  const loading = ref(true);
  const { startLoading, stopLoading } = useGlobalLoading();

  const isAuthenticated = computed(() => !!user.value);
  
  const isAgent = computed(() => {
    return profile.value?.role === 'agent_hotline' || profile.value?.role === 'admin';
  });
  
  const isClient = computed(() => {
    return profile.value?.role === 'client';
  });

  const agentDetails = computed(() => {
    if (isAgent.value) return profile.value as AgentProfile;
    return null;
  });

  async function login(email: string, pass: string) {
    startLoading();
    try {
      const authUser = await AuthService.login(email, pass);
      if (authUser) {
        user.value = authUser;
        await fetchProfile(authUser.uid);
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      stopLoading();
    }
  }

  async function logout() {
    try {
      await AuthService.logout();
      user.value = null;
      profile.value = null;
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  function setUser(newUser: User | null) {
    user.value = newUser;
    if (!newUser) {
      profile.value = null;
      loading.value = false;
    }
  }

  async function fetchProfile(uid: string) {
    loading.value = true;
    try {
      profile.value = await AuthService.getUserProfile(uid);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      loading.value = false;
    }
  }

  // Persistent listener
  AuthService.onAuthStateChanged(async (newUser) => {
    user.value = newUser;
    if (newUser) {
      await fetchProfile(newUser.uid);
    } else {
      profile.value = null;
    }
    loading.value = false;
  });

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    isAgent,
    isClient,
    agentDetails,
    login,
    logout,
    setUser,
    fetchProfile
  };
});
