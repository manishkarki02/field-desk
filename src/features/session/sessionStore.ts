import { create } from "zustand";
import type { User } from "@/features/staff";

interface SessionState {
  user: User | null;
  activeOrganizationId: string | null;
  switchUser: (user: User) => void;
  setActiveOrganization: (organizationId: string | null) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  user: null,
  activeOrganizationId: null,

  switchUser: (user) =>
    set({
      user,
      activeOrganizationId: user.organizationId ?? get().activeOrganizationId,
    }),

  setActiveOrganization: (organizationId) => {
    const { user } = get();
    if (user?.organizationId) return;
    set({ activeOrganizationId: organizationId });
  },
}));
