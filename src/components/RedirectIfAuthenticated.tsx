import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminStore } from "../stores/useAdminStore";

export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const admin = useAdminStore((state) => state.admin);

  if (admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
