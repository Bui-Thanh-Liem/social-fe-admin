import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

import { Home, Users } from "lucide-react";
import { Logo } from "../Logo";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      {/* ===== HEADER ===== */}
      <SidebarHeader className="px-4 py-3">
        <Logo size={20} />
      </SidebarHeader>

      {/* ===== CONTENT ===== */}
      <SidebarContent>
        {/* Platform */}
        <SidebarGroup>
          {/* Label ẩn khi collapsed */}
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Platform
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Playground">
                  <Home />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Trang chủ
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Projects */}
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Projects
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Design Engineering">
                  <Users />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Design Engineering
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Sales & Marketing">
                  <Users />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Sales & Marketing
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ===== FOOTER ===== */}
      {/* <SidebarFooter className="border-t px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src="https://avatars.githubusercontent.com/u/139895814?v=4"
            alt="avatar"
            className="h-8 w-8 rounded-full"
          />

          <div className="leading-tight group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-medium">shadcn</p>
            <p className="text-xs text-muted-foreground">m@example.com</p>
          </div>
        </div>
      </SidebarFooter> */}
    </Sidebar>
  );
}
