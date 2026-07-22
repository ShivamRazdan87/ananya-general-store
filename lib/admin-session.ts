import crypto from "crypto";

// Signs and verifies the admin login session. This keeps the actual admin
// password server-side only (via ADMIN_EMAIL / ADMIN_PASSWORD environment
// variables) instead of hardcoded in the page's source code, where anyone
// could view it in the browser's downloaded JavaScript.
//
// IMPORTANT: set ADMIN_SESSION_SECRET as a real random string in your
// environment variables (Vercel -> Project -> Settings -> Environment
// Variables). If left unset, a fallback is used which is NOT secure for
// production.
const SECRET = process.env.ADMIN_SESSION_SECRET || "dev-insecure-secret-change-me";
const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

export function createAdminToken(expiresInSeconds = THIRTY_DAYS_SECONDS): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const body = Buffer.from(JSON.stringify({ role: "admin", exp })).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function verifyAdminToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const [body, signature] = token.split(".");
  if (!body || !signature) return false;

  const expectedSignature = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  if (signature !== expectedSignature) return false;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.role !== "admin") return false;
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}
