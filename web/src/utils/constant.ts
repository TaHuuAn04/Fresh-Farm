import {
  House,
  CalendarClock,
  Wrench,
  LogOut,
  BotMessageSquare,
  LucideProps,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

type sidebarType = {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
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

export interface BlockingMessageDto {
  query: string;
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  phone_number: string;
  password: string;
}

export interface Device {
  createdAt?: Date;
  description: string;
  id: string;
  key: string;
  name: string;
  ownerId: string;
  status: string;
  type: string;
  updatedAt?: Date;
  value: string;
}

export interface DeviceProps {
  value: string;
}

export interface ToggleDeviceProps {
  value: string;
  id: string;
}

export interface Notification {
  content: string;
  createdAt?: string;
  id: string;
  severity: string;
  time?: string;
  updatedAt?: string;
  userId: string;
}

export interface NotificationData {
  content: string;
  createdAt?: Date;
  id: string;
  severity: string;
  time?: Date;
  updatedAt?: Date;
  userId: string;
  stt: number;
}

export interface Login {
  age: number;
  createdAt: string;
  email: string;
  fullName: string;
  id: string;
  lastTimeBlocked: null;
  password: string;
  phone_number: string;
  refreshToken: string;
  role: string;
  status: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: number;
  data: {
    statusCode: number;
    message: string;
    data: T;
  };
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
