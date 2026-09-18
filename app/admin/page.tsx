import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from "@/lib/auth/admin-session";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (await isValidAdminSessionToken(token)) {
    redirect("/admin/dashboard");
  }

  return (
    <Container className="flex min-h-[70vh] max-w-sm items-center py-10">
      <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Admin sign in</h1>
        <p className="mt-1.5 text-sm text-slate-500">Restricted access. This page is not linked from the site.</p>
        <div className="mt-6">
          <AdminLoginForm />
        </div>
      </div>
    </Container>
  );
}
