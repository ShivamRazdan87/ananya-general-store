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

const DELIVERY_WINDOW_MINUTES = 10;

export default function TrackOrderPage() {
  const params = useParams();
  const orderId = params.id as string;
  const order = useOrderStore((s) => s.getOrderById(orderId));
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    // Re-check elapsed time every 10 seconds so the progress bar advances
    // in step with the real 10-minute delivery window, instead of a fake
    // fixed-interval animation unrelated to when the order was placed.
    const timer = setInterval(() => setNow(Date.now()), 10000);
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

  // Splits the 10-minute delivery window evenly across the 4 stages:
  // Confirmed (instant) -> Preparing -> Out for Delivery -> Delivered.
  const elapsedMinutes = (now - new Date(order.createdAt).getTime()) / 60000;
  const stageLength = DELIVERY_WINDOW_MINUTES / 3;
  let timeBasedIndex = 0;
  if (elapsedMinutes >= stageLength * 2) timeBasedIndex = 3;
  else if (elapsedMinutes >= stageLength) timeBasedIndex = 2;
  else timeBasedIndex = 1;

  const stepIndex = Math.max(
    steps.findIndex((s) => s.status === order.status),
    timeBasedIndex
  );

  return (
    <div className="container-x py-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Track Order</h1>
      <p className="text-sm text-gray-500 mb-6">Order ID: {order.id}</p>

      <div className="card p-6 mb-6">
        <div className="flex items-center gap-2 bg-saffron-50 text-saffron-700 rounded-xl px-4 py-3 mb-8 text-sm font-medium">
          <Clock size={18} />
          {order.status === "Delivered"
            ? "Delivered"
            : order.status === "Cancelled"
            ? "Order cancelled"
            : elapsedMinutes < DELIVERY_WINDOW_MINUTES
            ? `Arriving in about ${Math.max(1, Math.ceil(DELIVERY_WINDOW_MINUTES - elapsedMinutes))} minute${
                Math.ceil(DELIVERY_WINDOW_MINUTES - elapsedMinutes) === 1 ? "" : "s"
              }`
            : "Running a little behind — your order is still on its way"}
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
