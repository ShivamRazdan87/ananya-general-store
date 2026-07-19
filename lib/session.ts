import crypto from "crypto";

// Signs and verifies login sessions for phone+OTP auth. This is a lightweight
// stand-in for a JWT library: a base64 payload plus an HMAC signature, so a
// token can't be forged or tampered with without knowing SESSION_SECRET.
//
// IMPORTANT: set SESSION_SECRET as a real random string in your environment
// variables (Vercel -> Project -> Settings -> Environment Variables). If it's
// left unset, a fallback is used which is NOT secure for production.
const SECRET = process.env.SESSION_SECRET || "dev-insecure-secret-change-me";

export interface SessionPayload {
  userId: string;
  phone: string;
}

const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

export function createSessionToken(payload: SessionPayload, expiresInSeconds = THIRTY_DAYS_SECONDS): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function verifySessionToken(token: string | null | undefined): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expectedSignature = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return { userId: payload.userId, phone: payload.phone };
  } catch {
    return null;
  }
}
