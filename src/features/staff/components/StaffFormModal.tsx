import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrganizations } from "@/features/organizations";
import { roleLabels } from "@/features/permissions";
import { useOrgScope } from "@/features/session";
import { FormModal } from "@/shared/components/modal";

import type { User } from "../types";
import {
  useCreateStaff,
  useUpdateStaff,
} from "../hooks/useStaffMutations";

const staffRoles = ["org_admin", "team_lead", "agent"] as const;

const staffFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.email("Enter a valid email address."),
  role: z.enum(staffRoles),
  organizationId: z.string().min(1, "Select an organization."),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

type StaffFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the modal edits this staff member instead of creating one. */
  member?: User;
  /** Pins new staff to one org (per-organization staff page). */
  organizationId?: string;
};

/** One form for both create and edit; only the visible fields differ. */
export function StaffFormModal({
  open,
  onOpenChange,
  member,
  organizationId,
}: StaffFormModalProps) {
  const scope = useOrgScope();
  const { data: organizations } = useOrganizations();
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();

  const pinnedOrganizationId = member?.organizationId ?? organizationId ?? scope;
  // Platform users viewing all organizations must pick one on create.
  const showOrganizationField = !member && pinnedOrganizationId === null;
  // Role changes go through the dedicated "Change role" modal.
  const showRoleField = !member;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: member
      ? {
          name: member.name,
          email: member.email,
          role: member.role as StaffFormValues["role"],
          organizationId: member.organizationId ?? "",
        }
      : {
          name: "",
          email: "",
          role: "agent",
          organizationId: pinnedOrganizationId ?? "",
        },
  });

  const onSubmit = handleSubmit((values) => {
    const options = { onSuccess: () => onOpenChange(false) };
    if (member) {
      updateStaff.mutate(
        {
          userId: member.id,
          input: { name: values.name, email: values.email },
        },
        options,
      );
    } else {
      createStaff.mutate(values, options);
    }
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={member ? "Edit staff member" : "Add staff member"}
      description={
        member
          ? "Update the staff member's details."
          : "Invite a new member to the organization."
      }
      submitLabel={member ? "Save changes" : "Add staff member"}
      isPending={createStaff.isPending || updateStaff.isPending}
      error={(member ? updateStaff.error : createStaff.error)?.message}
      onSubmit={onSubmit}
    >
      <Field>
        <FieldLabel htmlFor="staff-name">Name</FieldLabel>
        <Input
          id="staff-name"
          placeholder="Full name"
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
        <FieldError errors={[errors.name]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="staff-email">Email</FieldLabel>
        <Input
          id="staff-email"
          type="email"
          placeholder="name@company.com"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        <FieldError errors={[errors.email]} />
      </Field>

      {showOrganizationField ? (
        <Controller
          control={control}
          name="organizationId"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="staff-organization">Organization</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="staff-organization" className="w-full">
                  <SelectValue>
                    {organizations?.find((org) => org.id === field.value)
                      ?.name ?? "Select an organization"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {organizations?.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.organizationId]} />
            </Field>
          )}
        />
      ) : null}

      {showRoleField ? (
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="staff-role">Role</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="staff-role" className="w-full">
                  <SelectValue>{roleLabels[field.value]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {staffRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {roleLabels[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />
      ) : null}
    </FormModal>
  );
}
