import { defineStore } from "pinia";
import { ref, watch } from "vue";
import type { Insurance, Claim, Phone, Payment, AppNotification } from "@/models/insurance.model";
import type { UserProfile } from "@/models/user.model";
import { InsuranceService } from "@/services/insurance.service";
import { StorageService } from "@/services/storage.service";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "./auth.store";
import { useGlobalLoading } from "@/composables/useGlobalLoading";

export const useInsuranceStore = defineStore("insurance", () => {
  const insurances = ref<Insurance[]>([]);
  const claims = ref<Claim[]>([]);
  const phones = ref<Phone[]>([]);
  const payments = ref<Payment[]>([]);
  const notifications = ref<AppNotification[]>([]);
  const customers = ref<UserProfile[]>([]);
  const loading = ref(false);
  
  // Track loaded state per user to avoid flickering on back/forward
  const currentUserId = ref<string | null>(null);
  const isInitialLoaded = ref(false);

  const authStore = useAuthStore();
  const { startLoading, stopLoading } = useGlobalLoading();

  // Helper to ensure we only clear state when user actually changes
  watch(() => authStore.user?.uid, (newUid) => {
    if (newUid !== currentUserId.value) {
      currentUserId.value = newUid || null;
      insurances.value = [];
      claims.value = [];
      phones.value = [];
      payments.value = [];
      notifications.value = [];
      isInitialLoaded.value = false;
    }
  });

  async function fetchUserInsurances() {
    if (!authStore.user) return;
    if (insurances.value.length > 0 && isInitialLoaded.value) return;
    
    loading.value = true;
    startLoading();
    try {
      const data = await InsuranceService.getUserInsurances(authStore.user.uid);
      insurances.value = data;
    } catch (error) {
      console.error("Error fetching insurances", error);
    } finally {
      loading.value = false;
      stopLoading();
    }
  }

  async function fetchUserClaims() {
    if (!authStore.user) return;
    if (claims.value.length > 0 && isInitialLoaded.value) return;

    loading.value = true;
    startLoading();
    try {
      const data = await InsuranceService.getUserClaims(authStore.user.uid);
      claims.value = data;
    } catch (error) {
      console.error("Error fetching claims", error);
    } finally {
      loading.value = false;
      stopLoading();
    }
  }

  async function fetchUserPhones() {
    if (!authStore.user) return;
    if (phones.value.length > 0 && isInitialLoaded.value) return;

    loading.value = true;
    startLoading();
    try {
      const data = await InsuranceService.getUserPhones(authStore.user.uid);
      phones.value = data;
    } catch (error) {
      console.error("Error fetching phones", error);
    } finally {
      loading.value = false;
      stopLoading();
    }
  }

  async function fetchUserPayments() {
    if (!authStore.user) return;
    if (payments.value.length > 0 && isInitialLoaded.value) return;

    loading.value = true;
    startLoading();
    try {
      const allPayments = await InsuranceService.getAllPayments();
      payments.value = allPayments.filter(p => p.userId === authStore.user?.uid);
    } catch (error) {
      console.error("Error fetching payments", error);
    } finally {
      loading.value = false;
      stopLoading();
    }
  }

  async function fetchUserNotifications() {
    if (!authStore.user) return;
    if (notifications.value.length > 0 && isInitialLoaded.value) return;

    loading.value = true;
    startLoading();
    try {
      const data = await InsuranceService.getUserNotifications(authStore.user.uid);
      notifications.value = data;
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      loading.value = false;
      stopLoading();
    }
  }

  async function initClientData() {
    if (!authStore.user || isInitialLoaded.value) return;
    loading.value = true;
    startLoading();
    try {
      // Use Promise.allSettled to ensure we load what we can
      await Promise.all([
        fetchUserInsurances(),
        fetchUserPhones(),
        fetchUserClaims(),
        fetchUserPayments()
      ]);
      isInitialLoaded.value = true;
    } finally {
      loading.value = false;
      stopLoading();
    }
  }

  async function declareLoss(claimData: { insuranceId: string, description: string, certificateFile: File }) {
    if (!authStore.user) return;
    loading.value = true;
    startLoading();
    try {
      const certificateUrl = await StorageService.uploadCertificate(authStore.user.uid, claimData.certificateFile);
      await InsuranceService.declareLoss(authStore.user.uid, {
        insuranceId: claimData.insuranceId,
        description: claimData.description,
        certificateUrl,
        userId: authStore.user.uid,
        status: "Pending",
        date: new Date().toISOString()
      });
      await InsuranceService.addNotification({
        userId: authStore.user.uid,
        message: "Your loss declaration has been submitted and is pending review.",
        status: "Unread"
      });
      
      // Force refresh claims and notifications
      const [newClaims, newNotes] = await Promise.all([
        InsuranceService.getUserClaims(authStore.user.uid),
        InsuranceService.getUserNotifications(authStore.user.uid)
      ]);
      claims.value = newClaims;
      notifications.value = newNotes;
    } catch (error) {
      console.error("Error declaring loss", error);
      throw error;
    } finally {
      loading.value = false;
      stopLoading();
    }
  }

  async function fetchAllInsurances() {
    loading.value = true;
    startLoading();
    try {
      insurances.value = await InsuranceService.getAllInsurances();
    } catch (error) {
      console.error("Error fetching all insurances", error);
    } finally {
      loading.value = false;
      stopLoading();
    }
  }

  async function fetchAllClaims() {
    loading.value = true;
    startLoading();
    try {
      claims.value = await InsuranceService.getAllClaims();
    } catch (error) {
      console.error("Error fetching all claims", error);
    } finally {
      loading.value = false;
      stopLoading();
    }
  }

  async function fetchAllPhones() {
    loading.value = true;
    startLoading();
    try {
      phones.value = await InsuranceService.getAllPhones();
    } catch (error) {
      console.error("Error fetching all phones", error);
    } finally {
      loading.value = false;
      stopLoading();
    }
  }

  async function fetchAllCustomers() {
    loading.value = true;
    startLoading();
    try {
      const allProfiles = await AuthService.getAllUserProfiles();
      customers.value = allProfiles.filter(p => !p.role || p.role === 'client');
    } catch (error) {
      console.error("Error fetching customers", error);
    } finally {
      loading.value = false;
      stopLoading();
    }
  }

  async function fetchAllPayments() {
    loading.value = true;
    startLoading();
    try {
      payments.value = await InsuranceService.getAllPayments();
    } catch (error) {
      console.error("Error fetching all payments", error);
    } finally {
      loading.value = false;
      stopLoading();
    }
  }

  async function updateClaimStatus(claimId: string, status: string) {
    try {
      await InsuranceService.updateClaimStatus(claimId, status);
      await fetchAllClaims();
    } catch (error) {
      console.error("Error updating claim status", error);
    }
  }

  async function updateInsuranceStatus(insuranceId: string, status: any) {
    try {
      await InsuranceService.updateInsuranceStatus(insuranceId, status);
      await fetchAllInsurances();
    } catch (error) {
      console.error("Error updating insurance status", error);
    }
  }

  return {
    insurances,
    claims,
    phones,
    payments,
    notifications,
    customers,
    loading,
    isInitialLoaded,
    initClientData,
    fetchUserInsurances,
    fetchUserClaims,
    fetchUserPhones,
    fetchUserPayments,
    fetchUserNotifications,
    declareLoss,
    fetchAllInsurances,
    fetchAllClaims,
    fetchAllPhones,
    fetchAllCustomers,
    fetchAllPayments,
    updateClaimStatus,
    updateInsuranceStatus
  };
});
