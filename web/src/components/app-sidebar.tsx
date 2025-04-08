import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { sidebarData, sidebarFooterData } from "@/utils/constant";
import Link from "next/link";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="mx-auto pt-10">
        <Link href={"/"} className="font-bold">
          <div className="text-[#d1d1d1] ">FRESH</div>
          <div className="flex text-[#d1d1d1] text-4xl">
            <p>F</p>
            <p className="text-[#ECB365]">A</p>
            <p className="text-[#74959A]">R</p>
            <p>M</p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="mx-auto mt-7 font-semibold">
        <SidebarMenu className="">
          {sidebarData.map((item) => (
            <SidebarMenuItem key={item.title} className="mt-3 ">
              <SidebarMenuButton asChild>
                <Link href={item.url} className="gap-4 flex">
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mx-auto mb-5">
          <Link href={sidebarFooterData.url} className="text-[#d1d1d1] flex justify-center gap-2.5">
            <sidebarFooterData.icon />
            <span>{sidebarFooterData.title

            }</span>
          </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
