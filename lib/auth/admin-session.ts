/**
 * Minimal, dependency-free admin session handling.
 *
 * The session cookie is a signed token of the form `<expiryMs>.<hmacHex>`.
 * There is no server-side session store: the HMAC signature (keyed by
 * ADMIN_SESSION_SECRET) is what proves the cookie was issued by us and
 * hasn't been tampered with, and the embedded expiry enforces a timeout.
 *
 * Uses Web Crypto (globalThis.crypto.subtle) rather than Node's `crypto`
 * module so this file works from both the Edge middleware and Node.js API
 * routes without a runtime-specific build.
 *
 * This is intentionally simple — enough to keep the admin tool from being
 * open to the public internet — not a full identity/auth system. If admin
 * tooling grows beyond a single shared password, replace this with a real
 * auth provider.
 */

export const ADMIN_SESSION_COOKIE = "mms_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8; // 8 hours

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    // Fail loudly in production; allow a predictable dev-only fallback so
    // `next dev` keeps working without extra setup.
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_SESSION_SECRET must be set in production.");
    }
    return "dev-only-insecure-admin-session-secret";
  }
  return secret;
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Constant-time comparison for two equal-length strings. */
function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bufferToHex(signature);
}

export function getAdminPassword(): string | null {
  return process.env.ADMIN_PASSWORD ?? null;
}

export function isAdminPasswordConfigured(): boolean {
  return Boolean(getAdminPassword());
}

export function verifyAdminPassword(candidate: string): boolean {
  const expected = getAdminPassword();
  if (!expected || !candidate) return false;
  return timingSafeEqualStr(expected, candidate);
}

/** Creates a signed session token with a fresh expiry. */
export async function createAdminSessionToken(): Promise<{ token: string; maxAgeSeconds: number }> {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = String(expiresAt);
  const signature = await sign(payload);
  return { token: `${payload}.${signature}`, maxAgeSeconds: Math.floor(SESSION_DURATION_MS / 1000) };
}

/** Verifies a session token's signature and expiry. */
export async function isValidAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  const expectedSignature = await sign(payload);
  return timingSafeEqualStr(expectedSignature, signature);
}
