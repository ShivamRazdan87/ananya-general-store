import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const session = verifySessionToken(authHeader.replace("Bearer ", ""));

  if (!session) {
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
  }

  const { label, pincode, isDefault } = await req.json();
  if (!pincode) {
    return NextResponse.json({ error: "Flat number is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("addresses")
    .insert({ user_id: session.userId, label, pincode, is_default: Boolean(isDefault) })
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Could not save address" }, { status: 500 });
  }

  return NextResponse.json({
    address: { id: data.id, label: data.label, pincode: data.pincode, isDefault: data.is_default },
  });
}
