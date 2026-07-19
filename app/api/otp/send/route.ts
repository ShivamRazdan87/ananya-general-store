import { NextRequest, NextResponse } from "next/server";
import { sendOtpViaMsg91 } from "@/lib/msg91";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  if (!phone || !/^\d{10}$/.test(phone)) {
    return NextResponse.json({ error: "Enter a valid 10-digit phone number" }, { status: 400 });
  }

  const result = await sendOtpViaMsg91(phone);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
