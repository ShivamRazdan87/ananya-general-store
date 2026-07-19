// Sends and verifies OTPs using MSG91's dedicated OTP API. MSG91 generates,
// stores, and expires the OTP on their end — we just ask it to send one and
// ask it to check one, so this app never has to store OTP codes itself.
//
// Docs: https://docs.msg91.com/reference/send-otp
//
// Requires these environment variables (set in Vercel -> Project ->
// Settings -> Environment Variables):
//   MSG91_AUTH_KEY     - from MSG91 dashboard -> API -> Auth Key
//   MSG91_TEMPLATE_ID  - a DLT-approved OTP template ID containing ##OTP##

const BASE_URL = "https://control.msg91.com/api/v5/otp";

function getAuthKey() {
  return process.env.MSG91_AUTH_KEY || "";
}

export async function sendOtpViaMsg91(
  phone: string
): Promise<{ ok: boolean; error?: string }> {
  const authKey = getAuthKey();
  const templateId = process.env.MSG91_TEMPLATE_ID;

  if (!authKey || !templateId) {
    return { ok: false, error: "SMS service is not configured yet. Please contact the store owner." };
  }

  try {
    const url = `${BASE_URL}?template_id=${encodeURIComponent(templateId)}&mobile=91${phone}&authkey=${encodeURIComponent(authKey)}`;
    const res = await fetch(url, { method: "POST" });
    const data = await res.json();

    if (data.type !== "success") {
      return { ok: false, error: data.message || "Failed to send OTP" };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the SMS service. Please try again." };
  }
}

export async function verifyOtpViaMsg91(
  phone: string,
  otp: string
): Promise<{ ok: boolean; error?: string }> {
  const authKey = getAuthKey();
  if (!authKey) {
    return { ok: false, error: "SMS service is not configured yet. Please contact the store owner." };
  }

  try {
    const url = `${BASE_URL}/verify?otp=${encodeURIComponent(otp)}&mobile=91${phone}`;
    const res = await fetch(url, { headers: { authkey: authKey } });
    const data = await res.json();

    if (data.type !== "success") {
      return { ok: false, error: data.message || "Invalid or expired OTP" };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the SMS service. Please try again." };
  }
}
