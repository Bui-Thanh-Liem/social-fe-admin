import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminStore } from "../storage/use-admin.storage";

export function RedirectIfNotAuthenticated({
  children,
}: {
  children: ReactNode;
}) {
  const admin = useAdminStore((state) => state.admin);

  if (!admin || !admin.two_factor_session_enabled) {
    // Xóa token
    return <Navigate to="/login" replace />;
  }

  return children;
}
