import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/app/layout/AppLayout";

/** App shell layout: sidebar navigation + topbar with the user switcher. */
export const Route = createFileRoute("/_app")({
  component: AppShell,
});

function AppShell() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
