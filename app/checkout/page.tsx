"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Clock, CheckCircle2, Plus } from "lucide-react";
import clsx from "clsx";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useOrderStore } from "@/store/useOrderStore";
import { deliverySlots, storeConfig } from "@/lib/data";
import PaymentModal, { PaymentMethod } from "@/components/PaymentModal";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user, isLoggedIn, addAddress } = useAuthStore();
  const { placeOrder } = useOrderStore();

  const [selectedAddressId, setSelectedAddressId] = useState(
    user?.addresses.find((a) => a.isDefault)?.id || user?.addresses[0]?.id || ""
  );
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "Home", fullAddress: "", pincode: "" });
  const [slot, setSlot] = useState(deliverySlots[0].id);
  const [showPayment, setShowPayment] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 199 || subtotal === 0 ? 0 : 25;
  const total = subtotal + deliveryFee;

  if (!isLoggedIn) {
    return (
      <div className="container-x py-20 text-center">
        <p className="text-lg font-semibold mb-4">Please log in to continue checkout</p>
        <button onClick={() => router.push("/account")} className="btn-primary px-6 py-2.5">
          Go to Login
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-20 text-center">
        <p className="text-lg font-semibold mb-4">Your cart is empty</p>
        <button onClick={() => router.push("/shop")} className="btn-primary px-6 py-2.5">
          Continue Shopping
        </button>
      </div>
    );
  }

  const selectedAddress = user?.addresses.find((a) => a.id === selectedAddressId);

  const handleAddAddress = () => {
    if (!newAddress.fullAddress || !newAddress.pincode) {
      toast.error("Please fill all address fields");
      return;
    }
    addAddress({ ...newAddress, isDefault: false });
    setShowAddAddress(false);
    setNewAddress({ label: "Home", fullAddress: "", pincode: "" });
    toast.success("Address added");
  };

  const handlePaymentSuccess = async (method: PaymentMethod) => {
    const methodLabel = { upi: "UPI", card: "Card", wallet: "Wallet", cod: "Cash on Delivery" }[method];
    const order = await placeOrder({
      items,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: methodLabel,
      address: selectedAddress?.fullAddress || "",
      pincode: selectedAddress?.pincode || "",
      deliverySlot: deliverySlots.find((s) => s.id === slot)?.label || "",
      customerEmail: user!.email,
      customerName: user!.name,
    });
    clearCart();
    setShowPayment(false);
    router.push(`/order-success?orderId=${order.id}`);
  };

  return (
    <div className="container-x py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Address */}
          <div className="card p-5">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-saffron-600" /> Delivery Address
            </h3>
            <div className="space-y-2">
              {user?.addresses.map((addr) => (
                <button
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={clsx(
                    "w-full text-left p-3 rounded-xl border-2 transition",
                    selectedAddressId === addr.id ? "border-saffron-500 bg-saffron-50" : "border-gray-200"
                  )}
                >
                  <p className="font-semibold text-sm">{addr.label}</p>
                  <p className="text-xs text-gray-500">{addr.fullAddress} - {addr.pincode}</p>
                </button>
              ))}
              {user?.addresses.length === 0 && (
                <p className="text-sm text-gray-400">No saved addresses. Add one below.</p>
              )}
            </div>

            {!showAddAddress ? (
              <button
                onClick={() => setShowAddAddress(true)}
                className="mt-3 flex items-center gap-1 text-sm text-saffron-600 font-semibold"
              >
                <Plus size={16} /> Add New Address
              </button>
            ) : (
              <div className="mt-4 space-y-2 border-t pt-4">
                <input
                  placeholder="Label (e.g. Home, Work)"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-saffron-400"
                />
                <textarea
                  placeholder="Full address"
                  value={newAddress.fullAddress}
                  onChange={(e) => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-saffron-400"
                  rows={2}
                />
                <input
                  placeholder="Flat / Tower No. (e.g. Tower 4, Flat 302)"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-saffron-400"
                />
                <div className="flex gap-2">
                  <button onClick={handleAddAddress} className="btn-primary text-sm px-4 py-2">Save Address</button>
                  <button onClick={() => setShowAddAddress(false)} className="text-sm px-4 py-2 text-gray-500">Cancel</button>
                </div>
              </div>
            )}

            {selectedAddress && (
              <div className="mt-3 flex items-center gap-2 text-xs text-leaf-700 bg-leaf-50 rounded-lg px-3 py-2">
                <CheckCircle2 size={14} /> Deliverable in {storeConfig.deliveryMinutes}
              </div>
            )}
          </div>

          {/* Delivery Slot */}
          <div className="card p-5">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Clock size={18} className="text-saffron-600" /> Delivery Slot
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {deliverySlots.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSlot(s.id)}
                  className={clsx(
                    "text-left p-3 rounded-xl border-2 text-sm transition",
                    slot === s.id ? "border-saffron-500 bg-saffron-50" : "border-gray-200"
                  )}
                >
                  <p className="font-semibold">{s.label}</p>
                  <p className="text-xs text-gray-400">{s.day}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="card p-5 h-fit sticky top-24">
          <h3 className="font-bold text-lg mb-4">Price Details</h3>
          <div className="space-y-2 text-sm">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-gray-500">
                <span className="line-clamp-1">{product.name} x {quantity}</span>
                <span>₹{(product.price * quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Fee</span>
              <span className="font-medium">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-base">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          <button
            disabled={!selectedAddress}
            onClick={() => setShowPayment(true)}
            className="btn-primary w-full py-3 mt-5 disabled:opacity-50"
          >
            {selectedAddress ? `Pay ₹${total.toFixed(2)}` : "Select an address"}
          </button>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          amount={total}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
