import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Verifies that a completed Razorpay payment is genuine, by recomputing the
// HMAC signature with our secret key and comparing it to the one Razorpay
// sent back. This must run server-side since it uses RAZORPAY_KEY_SECRET.
export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ verified: false, error: "Missing payment details" }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ verified: false, error: "Razorpay is not configured" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const verified = expectedSignature === razorpay_signature;

    return NextResponse.json({ verified });
  } catch (err: any) {
    console.error("Razorpay verification failed:", err);
    return NextResponse.json({ verified: false, error: "Verification failed" }, { status: 500 });
  }
}
