import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { IAdmin } from "../shared/interfaces/admin.interface";

interface State {
  admin: IAdmin | null;
  setAdmin: (admin: IAdmin) => void;
  clearAdmin: () => void;
}

export const useAdminStore = create<State>()(
  persist(
    (set) => ({
      admin: null,
      setAdmin: (admin) => set({ admin }),
      clearAdmin: () => set({ admin: null }),
    }),
    {
      name: "admin_storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
