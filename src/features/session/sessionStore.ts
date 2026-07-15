import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/features/staff/types";
import { seedUsers } from "@/mocks/seed";

/** There is no real auth: the app always runs as an impersonated user. */
const defaultUser: User = seedUsers[0];

interface SessionState {
  user: User;
  activeOrganizationId: string | null;
  switchUser: (user: User) => void;
  setActiveOrganization: (organizationId: string | null) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      activeOrganizationId: defaultUser.organizationId,

      switchUser: (user) =>
        set({
          user,
          activeOrganizationId: user.organizationId ?? get().activeOrganizationId,
        }),

      setActiveOrganization: (organizationId) => {
        const { user } = get();
        if (user.organizationId) return;
        set({ activeOrganizationId: organizationId });
      },
    }),
    {
      name: "fielddesk-session",
      partialize: (state) => ({
        user: state.user,
        activeOrganizationId: state.activeOrganizationId,
      }),
      // Older persisted sessions (from the login era) may hold user: null.
      merge: (persisted, current) => {
        const stored = persisted as
          | Partial<Pick<SessionState, "user" | "activeOrganizationId">>
          | undefined;
        return {
          ...current,
          ...stored,
          user: stored?.user ?? current.user,
        };
      },
    },
  ),
);
