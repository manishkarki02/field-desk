import { Link, useRouterState } from "@tanstack/react-router";
import {
  Building2Icon,
  ChartColumnIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
  TicketIcon,
  UsersIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePermissions } from "@/features/permissions";
import { OrganizationSwitcher, UserSwitcher } from "@/features/session";
import { usePageHeaderStore } from "@/shared/hooks";

/**
 * App shell: sidebar navigation + topbar with the organization scope
 * (platform-level users only) and user switcher. Navigation items
 * render based on the active user's permissions.
 */

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboardIcon, permission: null },
  { to: "/tickets", label: "Tickets", icon: TicketIcon, permission: "tickets.view" },
  { to: "/organizations", label: "Organizations", icon: Building2Icon, permission: "organizations.manage" },
  { to: "/staff", label: "Staff", icon: UsersIcon, permission: "staff.manage" },
  { to: "/analytics", label: "Analytics", icon: ChartColumnIcon, permission: "analytics.view" },
  { to: "/permissions", label: "Permissions", icon: ShieldCheckIcon, permission: "permissions.manage" },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const { can } = usePermissions();
  const pageTitle = usePageHeaderStore((state) => state.title);
  const pageDescription = usePageHeaderStore((state) => state.description);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  const visibleItems = navItems.filter(
    (item) => item.permission === null || can(item.permission),
  );

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link
            to="/"
            className="flex h-8 items-center px-2 text-base font-semibold group-data-[collapsible=icon]:px-0"
          >
            <span className="group-data-[collapsible=icon]:hidden">
              FieldDesk
            </span>
            <span className="hidden group-data-[collapsible=icon]:inline">
              FD
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleItems.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      isActive={
                        item.to === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.to)
                      }
                      render={<Link to={item.to} />}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          {pageTitle ? (
            <div className="min-w-0">
              <h1 className="truncate text-sm leading-tight font-semibold">
                {pageTitle}
              </h1>
              {pageDescription ? (
                <p className="hidden truncate text-xs leading-tight text-muted-foreground md:block">
                  {pageDescription}
                </p>
              ) : null}
            </div>
          ) : null}
          <div className="ml-auto flex items-center gap-2">
            <OrganizationSwitcher />
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Acting as
            </span>
            <UserSwitcher />
          </div>
        </header>
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
