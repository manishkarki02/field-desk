import { ConfirmDialog } from "@/shared/components/modal";
import type { User } from "../types";
import { useRemoveStaff } from "../hooks/useStaffMutations";

type StaffRemoveConfirmProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: User;
};

export function StaffRemoveConfirm({
  open,
  onOpenChange,
  member,
}: StaffRemoveConfirmProps) {
  const removeStaff = useRemoveStaff();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Remove staff member?"
      description={`${member.name} will lose access and their tickets will become unassigned. This cannot be undone.`}
      confirmLabel="Remove"
      isPending={removeStaff.isPending}
      error={removeStaff.error?.message}
      onConfirm={() =>
        removeStaff.mutate(member.id, { onSuccess: () => onOpenChange(false) })
      }
    />
  );
}
