import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// Creates a Razorpay order. This must run server-side because it needs
// RAZORPAY_KEY_SECRET, which should never be exposed to the browser.
export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay is not configured. Missing API keys." },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    // Razorpay expects the amount in paise (smallest currency unit)
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err: any) {
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json({ error: "Could not create payment order" }, { status: 500 });
  }
}
