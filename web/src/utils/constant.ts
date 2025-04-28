import {
  House,
  CalendarClock,
  Wrench,
  LogOut,
  BotMessageSquare,
} from "lucide-react";

type sidebarType = {
  title: string;
  url: string;
  icon: any;
};

export const sidebarData: sidebarType[] = [
  {
    title: "Home",
    url: "/home",
    icon: House,
  },
  {
    title: "Function",
    url: "/function",
    icon: Wrench,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: BotMessageSquare,
  },
  {
    title: "History",
    url: "/history",
    icon: CalendarClock,
  },
];

export const sidebarFooterData: sidebarType = {
  url: "/setting",
  title: "Log Out",
  icon: LogOut,
};

export type CreateDeviceDto = {
  name: string;
  status?: string;
  description?: string;
};

export type UpdateDeviceDto = Partial<CreateDeviceDto>;

export type ToggleDeviceDto = {
  status?: string;
};

export interface ApiError {
  statusCode?: number;
  errorCode?: string;
  message?: string;
  path?: string;
}

export interface RegisterType {
  fullName: string;
  age?: number;
  phoneNumber: string;
  password: string;
  email: string;
}

export interface VerifyOTPType {
  phoneNumber: string;
  otp: string;
}

export interface ResetPasswordRequest {
  phoneNumber: string;
  newPassword: string;
}

export interface LoginDto {
  phoneNumber: string;
  password: string;
}

// This is a mock implementation of the getDevice function
// In a real application, this would fetch data from an API

export async function getDevice(id: string) {
  // Simulate API call
  return {
    id,
    name: "Fan System",
    status: "Active",
    lastUpdated: new Date().toISOString(),
    statusCode: 200,
  };
}

export async function getAllDevices() {
  // Simulate API call to get all devices
  return [
    {
      id: "1854fee1-769c-4bc4-9263-9697853d54a3",
      name: "Fan System",
      status: "Active",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "2854fee1-769c-4bc4-9263-9697853d54a4",
      name: "Irrigation System",
      status: "Inactive",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "3854fee1-769c-4bc4-9263-9697853d54a5",
      name: "Temperature Sensor",
      status: "Active",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "4854fee1-769c-4bc4-9263-9697853d54a6",
      name: "Humidity Sensor",
      status: "Maintenance",
      lastUpdated: new Date().toISOString(),
    },
  ];
}
