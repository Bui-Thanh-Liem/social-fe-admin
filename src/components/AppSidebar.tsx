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

import {
  ChartNoAxesCombined,
  ImagePlay,
  LayoutDashboard,
  Newspaper,
  Users,
  WholeWord,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";

const overviewMenuItems = [
  {
    label: "Bảng điều khiển",
    icon: <LayoutDashboard />,
    link: "/",
  },
  {
    label: "Biểu đồ",
    icon: <ChartNoAxesCombined />,
    link: "/charts",
  },
];

const managementMenuItems = [
  {
    label: "Người dùng",
    icon: <Users />,
    link: "/management/users",
  },
  {
    label: "Bài viết",
    icon: <Newspaper />,
    link: "/management/posts",
  },
  {
    label: "Phương tiện",
    icon: <ImagePlay />,
    link: "/management/media",
  },
  {
    label: "Ngôn từ",
    icon: <WholeWord />,
    link: "/management/bad-words",
  },
];

const reportMenuItems = [
  {
    label: "Người dùng",
    icon: <Users />,
    link: "/reports/users",
  },
  {
    label: "Bài viết",
    icon: <Newspaper />,
    link: "/reports/posts",
  },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  console.log("pathname:", pathname);

  return (
    <Sidebar collapsible="icon">
      {/* ===== HEADER ===== */}
      <SidebarHeader className="px-4 py-3">
        <Logo size={20} />
      </SidebarHeader>

      {/* ===== CONTENT ===== */}
      <SidebarContent>
        {/* Tổng quan */}
        <SidebarGroup>
          {/* Label ẩn khi collapsed */}
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Tổng quan
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {overviewMenuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    asChild
                    isActive={pathname === item.link}
                  >
                    <Link to={item.link}>
                      {item.icon}
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quản lý / kiểm soát */}
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Quản lý / kiểm soát
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {managementMenuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    asChild
                    isActive={pathname === item.link}
                  >
                    <Link to={item.link}>
                      {item.icon}
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Báo cáo */}
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Báo cáo / vi phạm
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {reportMenuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    asChild
                    isActive={pathname === item.link}
                  >
                    <Link to={item.link}>
                      {item.icon}
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
