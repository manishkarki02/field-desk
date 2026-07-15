import { useSessionStore } from "../sessionStore";

/**
 * Effective organization scope for the active session; the client-side
 * mirror of the mock API's data-layer scoping. Org-level users are
 * locked to their own organization; platform-level users follow the
 * topbar switcher (`null` = all organizations). Used in query keys so
 * data refetches whenever the scope changes.
 */
export function useOrgScope(): string | null {
  return useSessionStore(
    (state) => state.user.organizationId ?? state.activeOrganizationId,
  );
}
