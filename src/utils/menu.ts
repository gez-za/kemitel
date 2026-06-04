import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
  BellIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/vue/24/solid";

import type { Component } from "vue";

export type MenuItem = {
  label: string;
  icon: Component;
  path?: string;
  action?: "logout";
};

export const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: HomeIcon,
    path: "/",
  },
  {
    label: "Customers",
    icon: UsersIcon,
    path: "/customers",
  },
  {
    label: "Devices",
    icon: DevicePhoneMobileIcon,
    path: "/devices",
  },
  {
    label: "Renewals",
    icon: ClipboardDocumentCheckIcon,
    path: "/renewals",
  },
  {
    label: "History",
    icon: ClockIcon,
    path: "/history",
  },
  {
    label: "Notifications",
    icon: BellIcon,
    path: "/notifications",
  },
  {
    label: "Logout",
    icon: ArrowLeftStartOnRectangleIcon,
    action: "logout",
  },
];
