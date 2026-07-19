import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const authHeader = req.headers.get("authorization") || "";
  const session = verifySessionToken(authHeader.replace("Bearer ", ""));

  if (!session) {
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
  }

  // The .eq("user_id", ...) check ensures a resident can only ever delete
  // their own address, even if they somehow guessed another address's id.
  const { error } = await supabaseAdmin
    .from("addresses")
    .delete()
    .eq("id", params.id)
    .eq("user_id", session.userId);

  if (error) {
    return NextResponse.json({ error: "Could not delete address" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
