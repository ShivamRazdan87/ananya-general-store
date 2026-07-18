"use client";

// Simulated OTP system. No real SMS provider is connected yet, so instead of
// texting the code, it's returned directly to the caller so the UI can show
// it on-screen (e.g. via a toast) — good enough for testing and for a small
// trusted community. Swap this out for a real SMS API (MSG91, Twilio, etc.)
// later without touching any of the code that calls these functions.

const OTP_STORE_KEY = "ananya-otp-store";
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

interface OtpRecord {
  code: string;
  expiresAt: number;
}

function readStore(): Record<string, OtpRecord> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(OTP_STORE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, OtpRecord>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(OTP_STORE_KEY, JSON.stringify(store));
}

// Keeps only the last 10 digits, so "+91 98765 43210", "9876543210", and
// "98765-43210" all normalize to the same value.
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "").slice(-10);
}

export function isValidPhone(phone: string): boolean {
  return normalizePhone(phone).length === 10;
}

// Generates and "sends" (simulated) a 6-digit OTP for a phone number.
// Returns the code itself so the UI can display it.
export function sendOtp(phone: string): string {
  const normalized = normalizePhone(phone);
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const store = readStore();
  store[normalized] = { code, expiresAt: Date.now() + OTP_EXPIRY_MS };
  writeStore(store);
  return code;
}

export function verifyOtp(phone: string, code: string): boolean {
  const normalized = normalizePhone(phone);
  const store = readStore();
  const record = store[normalized];
  if (!record) return false;
  if (Date.now() > record.expiresAt) return false;
  if (record.code !== code.trim()) return false;
  delete store[normalized]; // one-time use
  writeStore(store);
  return true;
}
