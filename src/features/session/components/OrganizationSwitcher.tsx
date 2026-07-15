import { Building2Icon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrganizations } from "@/features/organizations";
import { useSessionStore } from "../sessionStore";

const ALL_ORGANIZATIONS = "all";

/**
 * Topbar control to change the organization scope. Only rendered for
 * platform-level users (super admin, auditor). Org-level users are
 * always locked to their own organization.
 */
export function OrganizationSwitcher() {
  const user = useSessionStore((state) => state.user);
  const activeOrganizationId = useSessionStore(
    (state) => state.activeOrganizationId,
  );
  const setActiveOrganization = useSessionStore(
    (state) => state.setActiveOrganization,
  );
  const { data: organizations, isLoading } = useOrganizations();

  if (user.organizationId) return null;

  const activeOrganization = organizations?.find(
    (organization) => organization.id === activeOrganizationId,
  );

  return (
    <Select
      value={activeOrganizationId ?? ALL_ORGANIZATIONS}
      onValueChange={(value) =>
        setActiveOrganization(value === ALL_ORGANIZATIONS ? null : value)
      }
      disabled={isLoading}
    >
      <SelectTrigger className="w-48" aria-label="Switch organization">
        <Building2Icon className="size-4 shrink-0 text-muted-foreground" />
        <SelectValue>
          <span className="truncate">
            {activeOrganization?.name ?? "All organizations"}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end" className="min-w-48">
        <SelectItem value={ALL_ORGANIZATIONS}>All organizations</SelectItem>
        {organizations?.map((organization) => (
          <SelectItem key={organization.id} value={organization.id}>
            {organization.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
