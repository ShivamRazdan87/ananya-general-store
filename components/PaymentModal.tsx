"use client";

import { useState } from "react";
import {
  X,
  Smartphone,
  CreditCard,
  Wallet,
  Banknote,
  CheckCircle2,
  Loader2,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import clsx from "clsx";

export type PaymentMethod = "upi" | "card" | "wallet" | "cod" | "razorpay";

interface PaymentModalProps {
  amount: number;
  onClose: () => void;
  onSuccess: (method: PaymentMethod) => void;
}

const methods = [
  { id: "razorpay" as const, label: "Pay Online (Razorpay)", desc: "UPI, Cards, Netbanking & more — real payment", icon: ShieldCheck },
  { id: "upi" as const, label: "UPI (Demo)", desc: "GPay, PhonePe, Paytm & more", icon: Smartphone },
  { id: "card" as const, label: "Credit / Debit Card (Demo)", desc: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "wallet" as const, label: "Wallets (Demo)", desc: "Paytm, Amazon Pay, Mobikwik", icon: Wallet },
  { id: "cod" as const, label: "Cash on Delivery", desc: "Pay when you receive", icon: Banknote },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentModal({ amount, onClose, onSuccess }: PaymentModalProps) {
  const [selected, setSelected] = useState<PaymentMethod>("razorpay");
  const [stage, setStage] = useState<"select" | "processing" | "success">("select");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [razorpayError, setRazorpayError] = useState("");

  const handleRazorpayPay = async () => {
    setRazorpayError("");
    setStage("processing");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setRazorpayError("Could not load payment gateway. Check your internet connection.");
        setStage("select");
        return;
      }

      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.orderId) {
        setRazorpayError(orderData.error || "Could not start payment. Please try again.");
        setStage("select");
        return;
      }

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "Ananya General Store",
        description: "Order Payment",
        theme: { color: "#f9ab06" },
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.verified) {
            setStage("success");
            setTimeout(() => onSuccess("razorpay"), 1200);
          } else {
            setRazorpayError("Payment verification failed. If money was deducted, contact support.");
            setStage("select");
          }
        },
        modal: {
          ondismiss: () => {
            setStage("select");
          },
        },
      });

      razorpay.on("payment.failed", () => {
        setRazorpayError("Payment failed. Please try again.");
        setStage("select");
      });

      razorpay.open();
    } catch (err) {
      setRazorpayError("Something went wrong. Please try again.");
      setStage("select");
    }
  };

  const handlePay = () => {
    if (selected === "razorpay") {
      handleRazorpayPay();
      return;
    }
    setStage("processing");
    setTimeout(() => {
      setStage("success");
      setTimeout(() => onSuccess(selected), 1200);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-slide-up max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0c2a4f] to-[#1a3d6d] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-extrabold text-[#1a3d6d]">
              A
            </div>
            <div>
              <p className="font-semibold">Ananya Secure Pay</p>
              <p className="text-xs text-blue-200">Powered by AnanyaPay</p>
            </div>
          </div>
          {stage === "select" && (
            <button onClick={onClose} className="hover:bg-white/10 rounded-full p-1.5">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
          {stage === "select" && (
            <>
              <div className="text-center mb-5">
                <p className="text-sm text-gray-500">Amount Payable</p>
                <p className="text-3xl font-extrabold text-gray-900">₹{amount.toFixed(2)}</p>
              </div>

              <div className="space-y-2 mb-4">
                {methods.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelected(m.id)}
                      className={clsx(
                        "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition text-left",
                        selected === m.id
                          ? "border-saffron-500 bg-saffron-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div
                        className={clsx(
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                          selected === m.id ? "bg-saffron-500 text-white" : "bg-gray-100 text-gray-500"
                        )}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{m.label}</p>
                        <p className="text-xs text-gray-400">{m.desc}</p>
                      </div>
                      <div
                        className={clsx(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                          selected === m.id ? "border-saffron-500" : "border-gray-300"
                        )}
                      >
                        {selected === m.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-saffron-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {selected === "razorpay" && (
                <div className="bg-leaf-50 border border-leaf-200 rounded-xl p-4 mb-4 text-sm text-leaf-800">
                  You'll be redirected to Razorpay's secure checkout to pay via UPI, Card, Netbanking or
                  Wallet. This is a real payment.
                </div>
              )}

              {razorpayError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-600">
                  {razorpayError}
                </div>
              )}

              {selected === "upi" && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4 text-center">
                  <p className="text-xs text-gray-500 mb-3">Scan QR with any UPI app</p>
                  <div className="w-40 h-40 mx-auto bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-3">
                    <QrCode size={110} strokeWidth={1} className="text-gray-700" />
                  </div>
                  <p className="text-xs text-gray-400 mb-2">— OR enter UPI ID —</p>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-saffron-500"
                  />
                </div>
              )}

              {selected === "card" && (
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-saffron-500"
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-saffron-500"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-saffron-500"
                    />
                  </div>
                </div>
              )}

              {selected === "wallet" && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {["Paytm", "Amazon Pay", "Mobikwik"].map((w) => (
                    <div
                      key={w}
                      className="border border-gray-200 rounded-lg py-3 text-center text-xs font-medium hover:border-saffron-400 cursor-pointer"
                    >
                      {w}
                    </div>
                  ))}
                </div>
              )}

              {selected === "cod" && (
                <div className="bg-haldi-50 border border-haldi-200 rounded-xl p-4 mb-4 text-sm text-haldi-800">
                  Pay ₹{amount.toFixed(2)} in cash to our delivery partner when your order arrives.
                </div>
              )}

              <button onClick={handlePay} className="w-full btn-primary py-3 text-base">
                Pay ₹{amount.toFixed(2)}
              </button>
              <p className="text-center text-[11px] text-gray-400 mt-3">
                {selected === "razorpay"
                  ? "🔒 100% Secure Payments via Razorpay"
                  : "🔒 100% Secure Payments (Simulated for demo)"}
              </p>
            </>
          )}

          {stage === "processing" && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 size={48} className="text-saffron-500 animate-spin mb-4" />
              <p className="font-semibold text-gray-700">Processing your payment...</p>
              <p className="text-sm text-gray-400 mt-1">Please do not close this window</p>
            </div>
          )}

          {stage === "success" && (
            <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
              <CheckCircle2 size={64} className="text-leaf-600 mb-4" />
              <p className="font-bold text-xl text-gray-800">Payment Successful!</p>
              <p className="text-sm text-gray-400 mt-1">Redirecting to order confirmation...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
