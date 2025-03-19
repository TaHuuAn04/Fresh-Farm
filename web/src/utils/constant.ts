import { House, ChartLine, CalendarClock, Wrench, LogOut } from "lucide-react";

type sidebarType = {
  title: string;
  url: string;
  icon: any;
}

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
    title: "Chart",
    url: "/chart",
    icon: ChartLine,
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
} 