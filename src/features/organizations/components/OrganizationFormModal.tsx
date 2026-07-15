import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormModal } from "@/shared/components/modal";

import type { Organization } from "../types";
import {
  useCreateOrganization,
  useUpdateOrganization,
} from "../hooks/useOrganizationMutations";

const organizationFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
});

type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

type OrganizationFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the modal edits this organization instead of creating one. */
  organization?: Organization;
};

export function OrganizationFormModal({
  open,
  onOpenChange,
  organization,
}: OrganizationFormModalProps) {
  const createOrganization = useCreateOrganization();
  const updateOrganization = useUpdateOrganization();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: { name: organization?.name ?? "" },
  });

  const onSubmit = handleSubmit((values) => {
    const options = { onSuccess: () => onOpenChange(false) };
    if (organization) {
      updateOrganization.mutate(
        { organizationId: organization.id, input: values },
        options,
      );
    } else {
      createOrganization.mutate(values, options);
    }
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={organization ? "Edit organization" : "Create organization"}
      description={
        organization
          ? "Update the organization's details."
          : "Add a new customer organization to the platform."
      }
      submitLabel={organization ? "Save changes" : "Create organization"}
      isPending={createOrganization.isPending || updateOrganization.isPending}
      error={
        (organization ? updateOrganization.error : createOrganization.error)
          ?.message
      }
      onSubmit={onSubmit}
    >
      <Field>
        <FieldLabel htmlFor="organization-name">Name</FieldLabel>
        <Input
          id="organization-name"
          placeholder="e.g. Acme Retail"
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
        <FieldError errors={[errors.name]} />
      </Field>
    </FormModal>
  );
}
