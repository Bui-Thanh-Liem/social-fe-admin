import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminStore } from "../stores/useAdminStore";

export function RedirectIfNotAuthenticated({
  children,
}: {
  children: ReactNode;
}) {
  const admin = useAdminStore((state) => state.admin);

  if (!admin) {
    // Xóa token
    return <Navigate to="/login" replace />;
  }

  return children;
}
