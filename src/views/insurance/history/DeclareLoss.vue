<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useInsuranceStore } from "@/stores/insurance.store";
import { useAuthStore } from "@/stores/auth.store";
import { formatDate } from "@/utils/date";

const router = useRouter();
const insuranceStore = useInsuranceStore();
const authStore = useAuthStore();

const formData = ref({
  insuranceId: "",
  description: "",
  location: "",
  lossDate: new Date().toISOString().split('T')[0]
});

const selectedFile = ref<File | null>(null);
const filePreview = ref<string | null>(null);
const submitting = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  if (authStore.user) {
    await Promise.all([
      insuranceStore.fetchUserInsurances(),
      insuranceStore.fetchUserPhones()
    ]);
  }
});

// All insurances of the user for the selection list
const userInsurances = computed(() => insuranceStore.insurances);

const getPhoneInfo = (phoneId: string) => {
  return insuranceStore.phones.find(p => p.id === phoneId);
};

const selectDevice = (id: string) => {
  const ins = userInsurances.value.find(i => i.id === id);
  if (ins && ins.status === 'Active') {
    formData.value.insuranceId = id;
  }
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    selectedFile.value = file;
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        filePreview.value = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      filePreview.value = null; 
    }
  }
};

const handleSubmit = async () => {
  if (!formData.value.insuranceId || !formData.value.description || !selectedFile.value) {
    error.value = "Please select a device, provide a description and upload a certificate.";
    return;
  }

  submitting.value = true;
  error.value = null;

  try {
    await insuranceStore.declareLoss({
      insuranceId: formData.value.insuranceId,
      description: formData.value.description,
      certificateFile: selectedFile.value
    });
    router.push('/history');
  } catch (err: any) {
    error.value = "Failed to submit declaration. Please try again.";
    console.error(err);
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Declare a Loss</h1>
        <p class="text-gray-500 mt-2 font-medium">Follow the steps below to submit your claim for review.</p>
      </div>
      <button 
        @click="router.back()"
        class="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest"
      >
        <i class="fas fa-times mr-2"></i> Cancel
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <!-- Step 1: Device Selection -->
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          <div class="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center gap-4">
            <div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm">1</div>
            <h2 class="text-xl font-black text-gray-900">Select your device</h2>
          </div>
          
          <div class="p-8">
            <div v-if="userInsurances.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                v-for="ins in userInsurances" 
                :key="ins.id"
                type="button"
                @click="selectDevice(ins.id!)"
                :disabled="ins.status !== 'Active'"
                class="relative p-6 rounded-2xl border-2 text-left transition-all group"
                :class="[
                  formData.insuranceId === ins.id 
                    ? 'border-blue-600 bg-blue-50/30' 
                    : 'border-gray-100 hover:border-gray-200 bg-white',
                  ins.status !== 'Active' ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer active:scale-95'
                ]"
              >
                <div v-if="formData.insuranceId === ins.id" class="absolute top-4 right-4 h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                  <i class="fas fa-check text-xs"></i>
                </div>
                
                <div class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                    <i class="fas fa-mobile-screen text-xl"></i>
                  </div>
                  <div>
                    <p class="font-black text-gray-900">{{ getPhoneInfo(ins.phoneId)?.brand }} {{ getPhoneInfo(ins.phoneId)?.model }}</p>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{{ ins.insuranceNumber }}</p>
                  </div>
                </div>
                <div class="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
                  <span class="text-[9px] font-black uppercase tracking-widest text-gray-400">Status</span>
                  <span 
                    class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border"
                    :class="ins.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'"
                  >
                    {{ ins.status }}
                  </span>
                </div>
              </button>
            </div>
            <div v-else-if="!insuranceStore.loading" class="text-center py-12">
               <div class="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                 <i class="fas fa-info-circle text-2xl"></i>
               </div>
               <p class="text-gray-500 font-bold">No insured devices found in your account.</p>
            </div>
          </div>
        </div>

        <!-- Step 2: Claim Details -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden" :class="{ 'opacity-50 pointer-events-none': !formData.insuranceId }">
          <div class="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center gap-4">
            <div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm">2</div>
            <h2 class="text-xl font-black text-gray-900">Incident Details</h2>
          </div>
          
          <div class="p-8 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date of Loss</label>
                <input 
                  v-model="formData.lossDate"
                  type="date"
                  class="block w-full rounded-2xl border-gray-200 bg-gray-50 px-5 py-4 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
              <div class="space-y-2">
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Location</label>
                <input 
                  v-model="formData.location"
                  type="text"
                  placeholder="e.g. Douala, Akwa"
                  class="block w-full rounded-2xl border-gray-200 bg-gray-50 px-5 py-4 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>
            
            <div class="space-y-2">
              <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Description</label>
              <textarea 
                v-model="formData.description"
                rows="4"
                placeholder="What happened? Please be as specific as possible..."
                class="block w-full rounded-2xl border-gray-200 bg-gray-50 px-5 py-4 text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Evidence & Submission -->
      <div class="space-y-8">
        <div class="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden" :class="{ 'opacity-50 pointer-events-none': !formData.description }">
          <div class="p-8 border-b border-gray-50 bg-gray-50/50 flex items-center gap-4">
            <div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm">3</div>
            <h2 class="text-xl font-black text-gray-900">Evidence</h2>
          </div>
          
          <div class="p-8 space-y-6">
            <div 
              class="relative border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
              @click="$refs.fileInput.click()"
            >
              <div v-if="!selectedFile" class="space-y-4">
                <div class="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-2xl mx-auto group-hover:scale-110 transition-transform">
                  <i class="fas fa-file-upload"></i>
                </div>
                <div>
                  <p class="text-sm font-black text-gray-900 uppercase tracking-widest">Certificate</p>
                  <p class="text-[10px] text-gray-400 font-bold mt-1">PDF or image under 10MB</p>
                </div>
              </div>
              <div v-else class="space-y-4">
                <div class="h-16 w-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 text-2xl mx-auto">
                  <i class="fas fa-check-double"></i>
                </div>
                <p class="text-sm font-black text-green-700 truncate px-4">{{ selectedFile.name }}</p>
              </div>
              <input 
                ref="fileInput"
                type="file" 
                class="hidden" 
                accept=".pdf,image/*"
                @change="handleFileChange"
              />
            </div>

            <div v-if="filePreview" class="h-40 rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-gray-100">
               <img :src="filePreview" class="h-full w-full object-contain" />
            </div>
            <div v-else-if="selectedFile && selectedFile.type.includes('pdf')" class="h-40 rounded-2xl bg-red-50 border border-red-100 flex flex-col items-center justify-center text-red-400">
               <i class="fas fa-file-pdf text-4xl mb-2"></i>
               <p class="text-[10px] font-black uppercase tracking-widest">PDF Ready</p>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <button 
            @click="handleSubmit"
            :disabled="submitting || !selectedFile"
            class="w-full bg-blue-600 text-white p-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <i v-if="submitting" class="fas fa-circle-notch fa-spin text-white"></i>
            <span class="text-white">{{ submitting ? 'Processing...' : 'Submit Claim' }}</span>
          </button>
          
          <div v-if="error" class="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 animate-pulse">
            <i class="fas fa-exclamation-circle text-lg"></i>
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-in {
  animation: fade-in 0.5s ease-out forwards;
}
</style>
