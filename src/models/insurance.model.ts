export type InsuranceStatus = "Active" | "Expired" | "Renewal Necessary";
export type ClaimStatus = "Pending" | "Approved" | "Rejected";
export type PaymentMethod = "MTN Mobile Money" | "Orange Money";

export interface Phone {
  id?: string;
  imei: string;
  brand: string;
  model: string;
  value: number;
  userId: string;
}

export interface Insurance {
  id?: string;
  phoneId: string;
  insuranceNumber: string;
  status: InsuranceStatus;
  registrationDate: string;
  expirationDate: string;
  userId: string;
  paymentMethod: PaymentMethod;
}

export interface Claim {
  id?: string;
  insuranceId: string;
  date: string;
  description: string;
  certificateUrl: string;
  status: ClaimStatus;
  userId: string;
}

export interface Payment {
  id?: string;
  insuranceId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  status: "Completed" | "Failed";
  userId: string;
}

export interface AppNotification {
  id?: string;
  userId: string;
  message: string;
  date: string;
  status: "Read" | "Unread";
}
