"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Package, Truck, Home, Clock } from "lucide-react";
import { useOrderStore, OrderStatus } from "@/store/useOrderStore";

const steps: { status: OrderStatus; label: string; icon: any }[] = [
  { status: "Confirmed", label: "Order Confirmed", icon: CheckCircle2 },
  { status: "Pending", label: "Preparing", icon: Package },
  { status: "Shipped", label: "Out for Delivery", icon: Truck },
  { status: "Delivered", label: "Delivered", icon: Home },
];

export default function TrackOrderPage() {
  const params = useParams();
  const orderId = params.id as string;
  const order = useOrderStore((s) => s.getOrderById(orderId));
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate live progress advancing for demo purposes
    const timer = setInterval(() => {
      setProgress((p) => (p < 3 ? p + 1 : p));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!order) {
    return (
      <div className="container-x py-20 text-center">
        <p className="text-lg font-semibold mb-4">Order not found</p>
        <Link href="/account" className="btn-primary px-6 py-2.5 inline-block">
          View My Orders
        </Link>
      </div>
    );
  }

  const stepIndex = Math.max(
    steps.findIndex((s) => s.status === order.status),
    progress
  );

  return (
    <div className="container-x py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Track Order</h1>
      <p className="text-sm text-gray-500 mb-6">Order ID: {order.id}</p>

      <div className="card p-6 mb-6">
        <div className="flex items-center gap-2 bg-saffron-50 text-saffron-700 rounded-xl px-4 py-3 mb-8 text-sm font-medium">
          <Clock size={18} /> Estimated delivery: 10 minutes from order confirmation
        </div>

        <div className="relative">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isDone = i <= stepIndex;
            return (
              <div key={step.status} className="flex gap-4 relative pb-10 last:pb-0">
                {i < steps.length - 1 && (
                  <div
                    className={`absolute left-[19px] top-10 w-0.5 h-full ${
                      isDone && i < stepIndex ? "bg-leaf-500" : "bg-gray-200"
                    }`}
                  />
                )}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    isDone ? "bg-leaf-600 text-white" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <p className={`font-semibold text-sm ${isDone ? "text-gray-900" : "text-gray-400"}`}>
                    {step.label}
                  </p>
                  {isDone && (
                    <p className="text-xs text-gray-400">
                      {i === stepIndex ? "In progress..." : "Completed"}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-bold mb-3">Order Summary</h3>
        <div className="space-y-1 text-sm text-gray-500">
          <div className="flex justify-between"><span>Delivery Address</span><span className="text-gray-800 text-right max-w-[60%]">{order.address}</span></div>
          <div className="flex justify-between"><span>Delivery Slot</span><span className="text-gray-800">{order.deliverySlot}</span></div>
          <div className="flex justify-between"><span>Payment Method</span><span className="text-gray-800">{order.paymentMethod}</span></div>
          <div className="flex justify-between font-bold text-gray-900 border-t pt-2 mt-2"><span>Total</span><span>₹{order.total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}
