import { useSessionStore } from "@/features/session/sessionStore";
import type { User } from "@/features/staff/types";

/**
 * "Server-side" session helpers for the mock API. Organization scoping
 * is enforced here, at the data layer, so org-level users can never
 * fetch or mutate another organization's records, regardless of what
 * the UI renders.
 */

/** The user the mock API treats as authenticated. */
export function getSessionUser(): User {
  return useSessionStore.getState().user;
}

/** Whether the session user is platform-level (not tied to one org). */
export function isPlatformUser(): boolean {
  return getSessionUser().organizationId === null;
}

/**
 * Effective organization scope for the current session. `null` means
 * "all organizations" and is only reachable by platform-level users;
 * org-level users are hard-locked to their own organization.
 */
export function getScopedOrganizationId(): string | null {
  const { user, activeOrganizationId } = useSessionStore.getState();
  return user.organizationId ?? activeOrganizationId;
}

/** Throws when the session may not touch records of `organizationId`. */
export function assertOrganizationAccess(organizationId: string): void {
  const scoped = getScopedOrganizationId();
  if (scoped !== null && scoped !== organizationId) {
    throw new Error("You do not have access to this organization's data.");
  }
}

/** Throws when the session user is scoped to a single organization. */
export function assertPlatformUser(): void {
  if (!isPlatformUser()) {
    throw new Error("Only platform-level users can manage organizations.");
  }
}
