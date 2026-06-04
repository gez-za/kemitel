export type InsuranceStatus = "Active" | "Expired" | "Renewal Necessary";
export type ContactStatus = "Contacted" | "No Answer" | "Not Contacted";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  insuranceNumber: string;
  insuranceStatus: InsuranceStatus;
  expirationDate: string;
  lastContactStatus: ContactStatus;
}

export interface Device {
  id: string;
  imei: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  insuranceNumber: string;
  paymentMethod: "MTN Mobile Money" | "Orange Money";
  insuranceStatus: InsuranceStatus;
  registrationDate: string;
  expirationDate: string;
}

export interface ContactHistory {
  id: string;
  contactDate: string;
  customerName: string;
  phone: string;
  agentName: string;
  result: ContactStatus;
  comment?: string;
}

export interface NotificationItem {
  id: string;
  customerName: string;
  channel: "SMS" | "Push";
  phone: string;
  expirationDate: string;
  status: "Sent" | "Failed";
}
