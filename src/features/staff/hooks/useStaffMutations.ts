import { useMutation, useQueryClient } from "@tanstack/react-query";
import { impersonationUsersQueryKey } from "@/features/session";
import {
  changeStaffRole,
  createStaff,
  removeStaff,
  updateStaff,
  type StaffUpdateInput,
} from "../api/staffService";
import type { StaffRole } from "../types";
import { staffQueryKey } from "./useStaff";

function useInvalidateStaff() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: staffQueryKey });
    // Staff changes affect org user counts and the "Acting as" switcher.
    void queryClient.invalidateQueries({ queryKey: ["organizations"] });
    void queryClient.invalidateQueries({ queryKey: impersonationUsersQueryKey });
  };
}

export function useCreateStaff() {
  const invalidate = useInvalidateStaff();
  return useMutation({ mutationFn: createStaff, onSuccess: invalidate });
}

export function useUpdateStaff() {
  const invalidate = useInvalidateStaff();
  return useMutation({
    mutationFn: ({
      userId,
      input,
    }: {
      userId: string;
      input: StaffUpdateInput;
    }) => updateStaff(userId, input),
    onSuccess: invalidate,
  });
}

export function useChangeStaffRole() {
  const invalidate = useInvalidateStaff();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: StaffRole }) =>
      changeStaffRole(userId, role),
    onSuccess: invalidate,
  });
}

export function useRemoveStaff() {
  const invalidate = useInvalidateStaff();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeStaff,
    onSuccess: () => {
      invalidate();
      // Removing a staff member unassigns their tickets.
      void queryClient.invalidateQueries({ queryKey: ["tickets"] });
      void queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
