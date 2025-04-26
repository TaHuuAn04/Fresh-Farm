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
