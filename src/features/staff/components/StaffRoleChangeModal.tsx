import { useState } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roleLabels } from "@/features/permissions";
import { FormModal } from "@/shared/components/modal";

import type { StaffRole, User } from "../types";
import { useChangeStaffRole } from "../hooks/useStaffMutations";

const staffRoles: StaffRole[] = ["org_admin", "team_lead", "agent"];

type StaffRoleChangeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: User;
};

export function StaffRoleChangeModal({
  open,
  onOpenChange,
  member,
}: StaffRoleChangeModalProps) {
  const changeStaffRole = useChangeStaffRole();
  const [role, setRole] = useState<StaffRole>(
    (staffRoles as readonly string[]).includes(member.role)
      ? (member.role as StaffRole)
      : "agent",
  );

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Change role"
      description={`Pick a new role for ${member.name}. Their permissions update immediately.`}
      submitLabel="Change role"
      isPending={changeStaffRole.isPending}
      error={changeStaffRole.error?.message}
      onSubmit={(event) => {
        event.preventDefault();
        changeStaffRole.mutate(
          { userId: member.id, role },
          { onSuccess: () => onOpenChange(false) },
        );
      }}
    >
      <Field>
        <FieldLabel htmlFor="staff-new-role">Role</FieldLabel>
        <Select
          value={role}
          onValueChange={(value) => setRole(value as StaffRole)}
        >
          <SelectTrigger id="staff-new-role" className="w-full">
            <SelectValue>{roleLabels[role]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {staffRoles.map((candidate) => (
              <SelectItem key={candidate} value={candidate}>
                {roleLabels[candidate]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </FormModal>
  );
}
