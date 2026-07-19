import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  const session = verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
  }

  const [{ data: userRow }, { data: addressRows }] = await Promise.all([
    supabaseAdmin.from("app_users").select("*").eq("id", session.userId).maybeSingle(),
    supabaseAdmin.from("addresses").select("*").eq("user_id", session.userId),
  ]);

  if (!userRow) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: userRow.id,
      phone: userRow.phone,
      name: userRow.name,
      email: userRow.email || "",
      addresses: (addressRows || []).map((a: any) => ({
        id: a.id,
        label: a.label,
        pincode: a.pincode,
        isDefault: a.is_default,
      })),
    },
  });
}
