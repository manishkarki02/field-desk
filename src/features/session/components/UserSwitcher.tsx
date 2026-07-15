import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roleLabels } from "@/features/permissions/types";
import { useImpersonationUsers } from "../hooks/useImpersonationUsers";
import { useSessionStore } from "../sessionStore";

/** Topbar control to impersonate any seeded user. */
export function UserSwitcher() {
  const user = useSessionStore((state) => state.user);
  const switchUser = useSessionStore((state) => state.switchUser);
  const { data: users, isLoading } = useImpersonationUsers();

  return (
    <Select
      value={user.id}
      onValueChange={(id) => {
        const next = users?.find((candidate) => candidate.id === id);
        if (next) switchUser(next);
      }}
      disabled={isLoading}
    >
      <SelectTrigger className="w-56" aria-label="Switch user">
        <SelectValue>
          <span className="truncate">{user.name}</span>
          <span className="text-xs text-muted-foreground">
            {roleLabels[user.role]}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="end" className="min-w-56">
        {(users ?? [user]).map((candidate) => (
          <SelectItem key={candidate.id} value={candidate.id}>
            <span>{candidate.name}</span>
            <span className="text-xs text-muted-foreground">
              {roleLabels[candidate.role]}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
