import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminStore } from "../storage/use-admin.storage";

export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const admin = useAdminStore((state) => state.admin);

  if (admin && admin.two_factor_session_enabled) {
    return <Navigate to="/" replace />;
  }

  return children;
}
