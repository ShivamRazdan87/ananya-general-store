import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-session";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  const authed = verifyAdminToken(token);
  return NextResponse.json({ authed });
}
