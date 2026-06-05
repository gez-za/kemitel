<script setup lang="ts">
import { ref, onMounted } from "vue";
import { AuthService } from "@/services/auth.service";
import type { AgentProfile } from "@/models/user.model";
import StatusBadge from "@/views/insurance/components/StatusBadge.vue";

const agents = ref<AgentProfile[]>([]);
const loading = ref(true);
const showAddModal = ref(false);
const submitting = ref(false);

const newAgent = ref({
  email: "",
  pass: "",
  displayName: "",
  agentCode: "",
  department: "Hotline"
});

const fetchAgents = async () => {
  loading.value = true;
  try {
    agents.value = await AuthService.getAllAgents();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAgents);

const handleAddAgent = async () => {
  submitting.value = true;
  try {
    await AuthService.createAgent(newAgent.value);
    showAddModal.value = false;
    await fetchAgents();
    // Reset form
    newAgent.value = { email: "", pass: "", displayName: "", agentCode: "", department: "Hotline" };
  } catch (err) {
    alert("Error creating agent. Check console.");
    console.error(err);
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-500">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900">Agent Management</h1>
        <p class="text-gray-500 mt-1">Manage hotline agents and their access credentials.</p>
      </div>
      <button 
        @click="showAddModal = true"
        class="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center gap-2"
      >
        <i class="fas fa-user-plus"></i>
        Add New Agent
      </button>
    </div>

    <!-- Agent List -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead class="bg-gray-50 text-gray-500 font-medium uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4">Agent Name</th>
              <th class="px-6 py-4">Code</th>
              <th class="px-6 py-4">Email</th>
              <th class="px-6 py-4">Department</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Last Login</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="agent in agents" :key="agent.uid" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {{ agent.displayName?.charAt(0) }}
                  </div>
                  <span class="font-bold text-gray-900">{{ agent.displayName }}</span>
                </div>
              </td>
              <td class="px-6 py-4 font-mono text-xs text-gray-500">{{ agent.agentCode }}</td>
              <td class="px-6 py-4 text-gray-600">{{ agent.email }}</td>
              <td class="px-6 py-4 text-gray-600">{{ agent.department }}</td>
              <td class="px-6 py-4">
                <StatusBadge :status="agent.isAvailable ? 'Active' : 'Offline'" />
              </td>
              <td class="px-6 py-4 text-xs text-gray-400">
                {{ agent.lastLogin ? new Date(agent.lastLogin).toLocaleString() : 'Never' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Agent Modal (Simplified) -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900">Register New Agent</h2>
          <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
            <input v-model="newAgent.displayName" type="text" class="w-full rounded-xl border-gray-200 bg-gray-50 border p-3 text-sm" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Agent Code</label>
              <input v-model="newAgent.agentCode" type="text" placeholder="AG-001" class="w-full rounded-xl border-gray-200 bg-gray-50 border p-3 text-sm" />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Department</label>
              <select v-model="newAgent.department" class="w-full rounded-xl border-gray-200 bg-gray-50 border p-3 text-sm">
                <option>Hotline</option>
                <option>Sales</option>
                <option>Admin</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input v-model="newAgent.email" type="email" class="w-full rounded-xl border-gray-200 bg-gray-50 border p-3 text-sm" />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Temporary Password</label>
            <input v-model="newAgent.pass" type="password" class="w-full rounded-xl border-gray-200 bg-gray-50 border p-3 text-sm" />
          </div>
        </div>
        <div class="p-6 bg-gray-50 flex justify-end gap-3">
          <button @click="showAddModal = false" class="px-4 py-2 text-gray-500 font-bold hover:text-gray-700">Cancel</button>
          <button 
            @click="handleAddAgent" 
            :disabled="submitting"
            class="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {{ submitting ? 'Creating...' : 'Create Agent' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
