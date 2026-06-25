// TODO: Replace with real auth (e.g. NextAuth, Clerk) when ready.
// Currently trusts a `x-user-id` header or `userId` cookie — development only.

import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function getStubUserId(req: NextRequest): Promise<string | null> {
  // 1. Prefer explicit header (useful for API clients / Postman testing)
  const header = req.headers.get("x-user-id");
  if (header) return header;

  // 2. Fall back to cookie
  const cookieStore = await cookies();
  return cookieStore.get("userId")?.value ?? null;
}
