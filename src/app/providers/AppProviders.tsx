import type { ReactNode } from 'react'

/**
 * Composes global providers (session, permissions, mock-db store, …).
 * TODO: wrap children with the real providers as features land.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return <>{children}</>
}
