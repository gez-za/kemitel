export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  firstname: string | null;
  lastname: string | null;
  photoURL: string | null;
  role: "client" | "agent_hotline" | "admin";
  phoneNumber?: string;
  createdAt: number;
}

export interface AgentProfile extends UserProfile {
  agentCode: string;
  department: string;
  isAvailable: boolean;
  lastLogin?: number;
}
