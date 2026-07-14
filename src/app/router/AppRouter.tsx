/**
 * Route table. Routes are gated by permissions (single source of truth
 * from the permissions feature), not by hard-coded role checks.
 * TODO: add routes for tickets, organizations, staff, analytics, permissions.
 */
export function AppRouter() {
  return (
    <main>
      <h1>FieldDesk</h1>
      <p>Scaffold ready — features land under src/features/*.</p>
    </main>
  )
}
