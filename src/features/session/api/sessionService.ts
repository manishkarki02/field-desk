import { db } from "@/mocks/db";
import { delay } from "@/shared/lib";
import type { User } from "@/features/staff/types";

/**
 * Users available to the demo "Acting as" switcher. This is the mock
 * auth layer, not organization data, so it is intentionally unscoped.
 */
export async function fetchImpersonationUsers(): Promise<User[]> {
  await delay();
  return structuredClone(db.users);
}
