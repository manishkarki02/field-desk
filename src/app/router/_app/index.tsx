import { createFileRoute } from "@tanstack/react-router";
import { useSessionStore } from "@/features/session";
import { usePageHeader } from "@/shared/hooks";

export const Route = createFileRoute("/_app/")({
  component: DashboardPage,
});

function DashboardPage() {
  const user = useSessionStore((state) => state.user);
  usePageHeader("Dashboard");

  return (
    <main className="space-y-2">
      <h1 className="text-2xl font-semibold">Welcome back, {user?.name}</h1>
      <p className="text-muted-foreground">
        Pick a section from the sidebar, or switch users from the topbar to
        see the app as a different role.
      </p>
    </main>
  );
}
