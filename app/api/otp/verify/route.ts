import { NextRequest, NextResponse } from "next/server";
import { verifyOtpViaMsg91 } from "@/lib/msg91";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { createSessionToken } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { phone, otp, name } = await req.json();

  if (!phone || !otp) {
    return NextResponse.json({ error: "Missing phone number or OTP" }, { status: 400 });
  }

  const result = await verifyOtpViaMsg91(phone, otp);
  if (!result.ok) {
    return NextResponse.json({ error: result.error || "Invalid OTP" }, { status: 400 });
  }

  if (!isSupabaseAdminConfigured) {
    return NextResponse.json({ error: "Accounts aren't fully set up yet. Please contact the store owner." }, { status: 500 });
  }

  const { data: existing } = await supabaseAdmin
    .from("app_users")
    .select("*")
    .eq("phone", phone)
    .maybeSingle();

  let userRow = existing;

  if (!userRow) {
    // Phone verified, but this number has no account yet. If the client
    // hasn't sent a name yet, ask for it before creating the account.
    if (!name || !name.trim()) {
      return NextResponse.json({ isNewUser: true });
    }
    const { data: created, error } = await supabaseAdmin
      .from("app_users")
      .insert({ phone, name: name.trim() })
      .select()
      .single();

    if (error || !created) {
      return NextResponse.json({ error: "Could not create your account. Please try again." }, { status: 500 });
    }
    userRow = created;
  }

  const token = createSessionToken({ userId: userRow.id, phone: userRow.phone });

  return NextResponse.json({
    token,
    user: {
      id: userRow.id,
      phone: userRow.phone,
      name: userRow.name,
      email: userRow.email || "",
      addresses: [],
    },
  });
}
