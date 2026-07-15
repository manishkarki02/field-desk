import { ConfirmDialog } from "@/shared/components/modal";
import type { Organization } from "../types";
import { useDeleteOrganization } from "../hooks/useOrganizationMutations";

type OrganizationDeleteConfirmProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: Organization;
};

export function OrganizationDeleteConfirm({
  open,
  onOpenChange,
  organization,
}: OrganizationDeleteConfirmProps) {
  const deleteOrganization = useDeleteOrganization();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete organization?"
      description={`“${organization.name}” and all of its staff and tickets will be permanently deleted. This cannot be undone.`}
      confirmLabel="Delete organization"
      isPending={deleteOrganization.isPending}
      error={deleteOrganization.error?.message}
      onConfirm={() =>
        deleteOrganization.mutate(organization.id, {
          onSuccess: () => onOpenChange(false),
        })
      }
    />
  );
}
