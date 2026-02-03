import { Outlet } from "react-router-dom";
import { Header } from "~/components/Header";
import { AppSidebar } from "~/components/ui/app-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-screen">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main */}
        <div className="flex flex-1 flex-col">
          <Header />

          <main className="flex-1 p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
