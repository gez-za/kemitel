import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
  BellIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ArrowLeftStartOnRectangleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CreditCardIcon,
  PlusCircleIcon,
  UserGroupIcon
} from "@heroicons/vue/24/solid";

import type { Component } from "vue";

export type MenuItem = {
  label: string;
  icon: Component;
  path?: string;
  action?: "logout";
  roles?: ('client' | 'agent_hotline')[];
};

export const menuItems: MenuItem[] = [
  // Agent Hotline Items
  {
    label: "Dashboard",
    icon: HomeIcon,
    path: "/",
    roles: ['agent_hotline'],
  },
  {
    label: "Team",
    icon: UserGroupIcon,
    path: "/agents",
    roles: ['agent_hotline'],
  },
  {
    label: "Customers",
    icon: UsersIcon,
    path: "/customers",
    roles: ['agent_hotline'],
  },
  {
    label: "Devices",
    icon: DevicePhoneMobileIcon,
    path: "/devices",
    roles: ['agent_hotline'],
  },
  {
    label: "Renewals",
    icon: ClipboardDocumentCheckIcon,
    path: "/renewals",
    roles: ['agent_hotline'],
  },
  {
    label: "Claims",
    icon: DocumentTextIcon,
    path: "/history",
    roles: ['agent_hotline'],
  },
  {
    label: "Payments",
    icon: CreditCardIcon,
    path: "/payments",
    roles: ['agent_hotline'],
  },
  {
    label: "Notifications",
    icon: BellIcon,
    path: "/notifications",
    roles: ['agent_hotline'],
  },

  // Client Items
  {
    label: "My Dashboard",
    icon: HomeIcon,
    path: "/",
    roles: ['client'],
  },
  {
    label: "My Devices",
    icon: DevicePhoneMobileIcon,
    path: "/devices",
    roles: ['client'],
  },
  {
    label: "My Insurances",
    icon: ShieldCheckIcon,
    path: "/renewals",
    roles: ['client'],
  },
  {
    label: "Declare Loss",
    icon: PlusCircleIcon,
    path: "/declare-loss",
    roles: ['client'],
  },
  {
    label: "My Claims",
    icon: DocumentTextIcon,
    path: "/history",
    roles: ['client'],
  },
  {
    label: "My Payments",
    icon: CreditCardIcon,
    path: "/payments",
    roles: ['client'],
  },
  {
    label: "Notifications",
    icon: BellIcon,
    path: "/notifications",
    roles: ['client'],
  },

  // Shared Items
  {
    label: "Logout",
    icon: ArrowLeftStartOnRectangleIcon,
    action: "logout",
    roles: ['client', 'agent_hotline'],
  },
];
