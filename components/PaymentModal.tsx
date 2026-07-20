"use client";

import { useState, useEffect } from "react";
import {
  X,
  Banknote,
  CheckCircle2,
  Loader2,
  IndianRupee,
} from "lucide-react";
import clsx from "clsx";
import QRCode from "qrcode";
import { buildUpiLink, STORE_UPI_ID } from "@/lib/upi";

export type PaymentMethod = "direct_upi" | "cod";

interface PaymentModalProps {
  amount: number;
  onClose: () => void;
  onSuccess: (method: PaymentMethod) => void;
}

const methods = [
  { id: "direct_upi" as const, label: "Pay via UPI", desc: "GPay, PhonePe, Paytm & more — real, free payment", icon: IndianRupee },
  { id: "cod" as const, label: "Cash on Delivery", desc: "Pay when you receive", icon: Banknote },
];

export default function PaymentModal({ amount, onClose, onSuccess }: PaymentModalProps) {
  const [selected, setSelected] = useState<PaymentMethod>("direct_upi");
  const [stage, setStage] = useState<"select" | "processing" | "success">("select");
  const [qrDataUrl, setQrDataUrl] = useState("");

  const upiLink = buildUpiLink(amount, "Ananya General Store Order");

  useEffect(() => {
    if (selected !== "direct_upi") return;
    QRCode.toDataURL(upiLink, { width: 220, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, amount]);

  const handlePay = () => {
    if (selected === "direct_upi") {
      // No gateway in the middle, so there's nothing to "process" — the
      // customer pays directly via their UPI app, and the store owner
      // confirms it manually. Order goes through marked as pending
      // verification (see checkout page's paymentMethod label).
      setStage("success");
      setTimeout(() => onSuccess("direct_upi"), 1200);
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

              {selected === "direct_upi" && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4 text-center">
                  <p className="text-xs text-gray-500 mb-3">Scan with any UPI app to pay ₹{amount.toFixed(2)}</p>
                  <div className="w-48 h-48 mx-auto bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                    {qrDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={qrDataUrl} alt="UPI payment QR code" className="w-full h-full object-contain" />
                    ) : (
                      <Loader2 className="animate-spin text-gray-300" size={32} />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mb-1">UPI ID</p>
                  <p className="text-sm font-semibold text-gray-700 mb-3">{STORE_UPI_ID}</p>
                  <a
                    href={upiLink}
                    className="inline-block w-full btn-primary py-2.5 text-sm mb-3"
                  >
                    Open UPI App to Pay
                  </a>
                  <p className="text-[11px] text-gray-400">
                    Pays the store directly — no fees. On a phone, tap "Open UPI App" or scan the QR.
                    After paying, tap "I've Paid" below to place your order.
                  </p>
                </div>
              )}

              {selected === "cod" && (
                <div className="bg-haldi-50 border border-haldi-200 rounded-xl p-4 mb-4 text-sm text-haldi-800">
                  Pay ₹{amount.toFixed(2)} in cash to our delivery partner when your order arrives.
                </div>
              )}

              <button onClick={handlePay} className="w-full btn-primary py-3 text-base">
                {selected === "direct_upi" ? "I've Paid — Place Order" : `Pay ₹${amount.toFixed(2)}`}
              </button>
              <p className="text-center text-[11px] text-gray-400 mt-3">
                {selected === "direct_upi"
                  ? "🔒 Direct UPI transfer — no fees, no middleman"
                  : "🔒 Pay in cash when your order arrives"}
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
              <p className="font-bold text-xl text-gray-800">
                {selected === "direct_upi" ? "Order Placed!" : "Payment Successful!"}
              </p>
              <p className="text-sm text-gray-400 mt-1 text-center px-6">
                {selected === "direct_upi"
                  ? "The store will verify your UPI payment shortly."
                  : "Redirecting to order confirmation..."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
