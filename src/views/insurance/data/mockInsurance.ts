import type {
  Customer,
  Device,
  ContactHistory,
  NotificationItem,
} from "./types";

export const customers: Customer[] = [
  {
    id: "1",
    firstName: "Jean",
    lastName: "Fotso",
    phone: "+237690000000",
    email: "jean.fotso@email.com",
    insuranceNumber: "INS-2025-849302",
    insuranceStatus: "Active",
    expirationDate: "2026-08-12",
    lastContactStatus: "Contacted",
  },
  {
    id: "2",
    firstName: "Marie",
    lastName: "Talla",
    phone: "+237677123456",
    email: "marie.talla@email.com",
    insuranceNumber: "INS-2025-112233",
    insuranceStatus: "Renewal Necessary",
    expirationDate: "2026-05-29",
    lastContactStatus: "No Answer",
  },
  {
    id: "3",
    firstName: "Paul",
    lastName: "Nana",
    phone: "+237699888777",
    email: "paul.nana@email.com",
    insuranceNumber: "INS-2025-445566",
    insuranceStatus: "Expired",
    expirationDate: "2026-03-10",
    lastContactStatus: "Not Contacted",
  },
];

export const devices: Device[] = [
  {
    id: "1",
    imei: "356938035643809",
    customerId: "1",
    customerName: "Jean Fotso",
    customerPhone: "+237690000000",
    insuranceNumber: "INS-2025-849302",
    paymentMethod: "MTN Mobile Money",
    insuranceStatus: "Active",
    registrationDate: "2025-08-12",
    expirationDate: "2026-08-12",
  },
  {
    id: "2",
    imei: "869512047712345",
    customerId: "2",
    customerName: "Marie Talla",
    customerPhone: "+237677123456",
    insuranceNumber: "INS-2025-112233",
    paymentMethod: "Orange Money",
    insuranceStatus: "Renewal Necessary",
    registrationDate: "2025-05-29",
    expirationDate: "2026-05-29",
  },
  {
    id: "3",
    imei: "354789101112131",
    customerId: "3",
    customerName: "Paul Nana",
    customerPhone: "+237699888777",
    insuranceNumber: "INS-2025-445566",
    paymentMethod: "MTN Mobile Money",
    insuranceStatus: "Expired",
    registrationDate: "2025-03-10",
    expirationDate: "2026-03-10",
  },
];

export const contactHistory: ContactHistory[] = [
  {
    id: "1",
    contactDate: "2026-05-20",
    customerName: "Jean Fotso",
    phone: "+237690000000",
    agentName: "Agent 1",
    result: "Contacted",
    comment: "Client informé du statut de son assurance.",
  },
  {
    id: "2",
    contactDate: "2026-05-21",
    customerName: "Marie Talla",
    phone: "+237677123456",
    agentName: "Agent 2",
    result: "No Answer",
    comment: "À rappeler plus tard.",
  },
];

export const notifications: NotificationItem[] = [
  {
    id: "1",
    customerName: "Jean Fotso",
    channel: "SMS",
    phone: "+237690000000",
    expirationDate: "2026-08-12",
    status: "Sent",
  },
  {
    id: "2",
    customerName: "Marie Talla",
    channel: "Push",
    phone: "+237677123456",
    expirationDate: "2026-05-29",
    status: "Failed",
  },
];
