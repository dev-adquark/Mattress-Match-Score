import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from "@/lib/auth/admin-session";

/**
 * Gates everything under /admin/dashboard behind a valid signed session
 * cookie. /admin itself (the login screen) stays public — it's the only
 * entry point into admin tooling, and it's intentionally not linked from
 * anywhere in the public site.
 */
export async function middleware(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!(await isValidAdminSessionToken(token))) {
    const loginUrl = new URL("/admin", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
