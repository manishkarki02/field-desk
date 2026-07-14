import type { ReactNode } from 'react'

/**
 * App shell: sidebar navigation + top bar (user switcher, org selector).
 * Navigation items render based on the active user's permissions.
 * TODO: implement.
 */
export function AppLayout({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}
