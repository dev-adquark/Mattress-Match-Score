import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  isAdminPasswordConfigured,
  verifyAdminPassword,
} from "@/lib/auth/admin-session";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required."),
});

/**
 * Issues a short-lived, HMAC-signed session cookie for the admin tooling.
 * See lib/auth/admin-session.ts for the (intentionally minimal) session model.
 */
export async function POST(request: NextRequest) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      { error: { message: "Admin login is not configured. Set ADMIN_PASSWORD to enable it." } },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: { message: "Request body must be valid JSON." } }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: "A password is required.", details: parsed.error.flatten() } },
      { status: 400 }
    );
  }

  if (!verifyAdminPassword(parsed.data.password)) {
    // Same response shape/timing regardless of what went wrong, to avoid
    // signalling whether the failure was "no such thing" vs "wrong password".
    return NextResponse.json({ error: { message: "Incorrect password." } }, { status: 401 });
  }

  const { token, maxAgeSeconds } = await createAdminSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });

  return response;
}
