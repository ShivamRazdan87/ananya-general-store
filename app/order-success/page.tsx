"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, Clock, MessageCircle } from "lucide-react";
import { useOrderStore } from "@/store/useOrderStore";
import { storeConfig } from "@/lib/data";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const order = useOrderStore((s) => s.getOrderById(orderId));

  const notifyShopOnWhatsApp = () => {
    if (!order) return;
    const itemsList = order.items
      .map((i) => `- ${i.product.name} x${i.quantity} (₹${i.product.price * i.quantity})`)
      .join("\n");
    const message =
      `🛒 New Order: ${order.id}\n` +
      `Customer: ${order.customerName}\n` +
      `Items:\n${itemsList || "(see order details)"}\n` +
      `Total: ₹${order.total.toFixed(2)} (${order.paymentMethod})\n` +
      `Deliver to: ${order.address}`;
    const waUrl = `https://wa.me/${storeConfig.ownerWhatsApp}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="container-x py-16 flex flex-col items-center text-center max-w-lg mx-auto">
      <div className="w-20 h-20 rounded-full bg-leaf-100 flex items-center justify-center mb-5 animate-fade-in">
        <CheckCircle2 size={44} className="text-leaf-600" />
      </div>
      <h1 className="text-2xl font-extrabold text-gray-900">Order Placed Successfully!</h1>
      <p className="text-gray-500 mt-2">
        Thank you for shopping with {storeConfig.storeName}. Your order is being prepared.
      </p>

      {order && (
        <div className="card p-5 w-full mt-6 text-left">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500">Order ID</span>
            <span className="font-bold">{order.id}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500">Total Amount</span>
            <span className="font-bold">₹{order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500">Payment Method</span>
            <span className="font-medium">{order.paymentMethod}</span>
          </div>
          <div className="flex items-center gap-2 bg-saffron-50 text-saffron-700 rounded-xl px-3 py-2.5 mt-3 text-sm">
            <Clock size={16} /> Arriving in {storeConfig.deliveryMinutes}
          </div>
        </div>
      )}

      <button
        onClick={notifyShopOnWhatsApp}
        className="w-full mt-5 bg-[#25D366] hover:bg-[#1ebe5b] text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 shadow-md transition"
      >
        <MessageCircle size={18} /> Confirm order with shop on WhatsApp
      </button>
      <p className="text-xs text-gray-400 mt-2">
        Tap this so the shop sees your order right away and starts preparing it.
      </p>

      <div className="flex gap-3 mt-6 w-full">
        <Link href={`/track/${orderId}`} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
          <Package size={18} /> Track Order
        </Link>
        <Link href="/shop" className="btn-secondary flex-1 py-3 flex items-center justify-center">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="container-x py-20 text-center text-gray-400">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
