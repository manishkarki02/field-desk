import { useMutation, useQueryClient } from "@tanstack/react-query";
import { impersonationUsersQueryKey, useSessionStore } from "@/features/session";
import {
  createOrganization,
  deleteOrganization,
  updateOrganization,
  type OrganizationInput,
} from "../api/organizationsService";
import { organizationsQueryKey } from "./useOrganizations";

function useInvalidateOrganizations() {
  const queryClient = useQueryClient();
  return () =>
    void queryClient.invalidateQueries({ queryKey: organizationsQueryKey });
}

export function useCreateOrganization() {
  const invalidate = useInvalidateOrganizations();
  return useMutation({ mutationFn: createOrganization, onSuccess: invalidate });
}

export function useUpdateOrganization() {
  const invalidate = useInvalidateOrganizations();
  return useMutation({
    mutationFn: ({
      organizationId,
      input,
    }: {
      organizationId: string;
      input: OrganizationInput;
    }) => updateOrganization(organizationId, input),
    onSuccess: invalidate,
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrganization,
    onSuccess: (_data, organizationId) => {
      // Deleting cascades to the org's staff and tickets.
      void queryClient.invalidateQueries({ queryKey: organizationsQueryKey });
      void queryClient.invalidateQueries({ queryKey: ["staff"] });
      void queryClient.invalidateQueries({ queryKey: ["tickets"] });
      void queryClient.invalidateQueries({ queryKey: ["analytics"] });
      void queryClient.invalidateQueries({
        queryKey: impersonationUsersQueryKey,
      });
      const { activeOrganizationId, setActiveOrganization } =
        useSessionStore.getState();
      if (activeOrganizationId === organizationId) setActiveOrganization(null);
    },
  });
}
