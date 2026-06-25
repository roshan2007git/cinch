// TODO: Replace with real auth (e.g. NextAuth, Clerk) when ready.
// Creates an anonymous guest User on first visit and sets an httpOnly cookie.
// All routes call getOrCreateGuestUserId — no login form required.

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/user";

const COOKIE = "userId";
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365, // 1 year
};

export async function getOrCreateGuestUserId(
  req: NextRequest,
  res?: NextResponse
): Promise<string> {
  // 1. Check existing cookie on the request
  const existing = req.cookies.get(COOKIE)?.value;
  if (existing) return existing;

  // 2. Check the response cookie jar (set earlier in this request cycle)
  if (res) {
    const fromRes = res.cookies.get(COOKIE)?.value;
    if (fromRes) return fromRes;
  }

  // 3. Create a new anonymous user
  try {
    await connectDB();
    const user = await User.create({
      email: `guest_${Date.now()}_${Math.random().toString(36).slice(2)}@cinch.guest`,
      name: "Guest",
      plan: "free",
    });

    const id = String(user._id);

    // 4. Set the cookie on the next response via next/headers (works in Route Handlers)
    const cookieStore = await cookies();
    cookieStore.set(COOKIE, id, COOKIE_OPTS);

    return id;
  } catch (err) {
    console.error("[guest-auth] Guest user creation failed:", err instanceof Error ? err.stack : err);
    throw new Error("Guest user creation failed");
  }
}
