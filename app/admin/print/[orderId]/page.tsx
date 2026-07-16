"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useOrderStore } from "@/store/useOrderStore";
import { storeConfig } from "@/lib/data";

export default function PrintOrderSlipPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const order = useOrderStore((s) => s.getOrderById(orderId));

  useEffect(() => {
    if (order) {
      const t = setTimeout(() => window.print(), 400);
      return () => clearTimeout(t);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="container-x py-16 text-center text-gray-400">
        Order not found.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8 px-6 print:p-0">
      <div className="text-center mb-6 border-b-2 border-dashed border-gray-300 pb-4">
        <h1 className="text-xl font-extrabold">{storeConfig.storeName}</h1>
        <p className="text-xs text-gray-500">{storeConfig.societyName}, {storeConfig.societyArea}</p>
      </div>

      <div className="mb-4 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-500">Order ID</span>
          <span className="font-bold">{order.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Date</span>
          <span>{new Date(order.createdAt).toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Payment</span>
          <span className="font-semibold">{order.paymentMethod}</span>
        </div>
      </div>

      <div className="mb-4 border-t border-b border-dashed border-gray-300 py-3">
        <p className="text-xs text-gray-500 mb-1">DELIVER TO</p>
        <p className="font-bold">{order.customerName}</p>
        <p className="text-sm">{order.address}</p>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">ITEMS</p>
        {order.items.length > 0 ? (
          <table className="w-full text-sm">
            <tbody>
              {order.items.map((i) => (
                <tr key={i.product.id} className="border-b border-gray-100">
                  <td className="py-1">{i.product.name}</td>
                  <td className="py-1 text-center text-gray-500">x{i.quantity}</td>
                  <td className="py-1 text-right">₹{(i.product.price * i.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-400">See order details in Admin panel.</p>
        )}
      </div>

      <div className="border-t-2 border-dashed border-gray-300 pt-3 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal</span>
          <span>₹{order.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Delivery Fee</span>
          <span>{order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}</span>
        </div>
        <div className="flex justify-between font-bold text-base border-t border-gray-300 pt-1 mt-1">
          <span>Total</span>
          <span>₹{order.total.toFixed(2)}</span>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">Thank you for shopping with us! 🙏</p>

      <button
        onClick={() => window.print()}
        className="print:hidden btn-primary w-full py-3 mt-6"
      >
        Print This Slip
      </button>
    </div>
  );
}