import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <Outlet />
    </div>
  );
}
