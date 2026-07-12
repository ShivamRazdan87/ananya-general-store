"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, Clock } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const router = useRouter();

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 199 || subtotal === 0 ? 0 : 25;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container-x py-24 flex flex-col items-center text-center">
        <ShoppingBag size={56} className="text-gray-200 mb-4" />
        <p className="text-lg font-semibold text-gray-600">Your cart is empty</p>
        <p className="text-sm text-gray-400 mb-6">Add some fresh groceries to get started.</p>
        <Link href="/shop" className="btn-primary px-6 py-2.5">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-8">
      <h1 className="text-2xl font-bold mb-6">My Cart ({items.length})</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-leaf-50 border border-leaf-100 rounded-xl p-3 flex items-center gap-2 text-sm text-leaf-800">
            <Clock size={16} /> Your order will arrive in 10 minutes
          </div>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="card flex items-center gap-4 p-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-orange-50">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${product.id}`} className="font-semibold text-sm hover:text-saffron-600 line-clamp-1">
                  {product.name}
                </Link>
                <p className="text-xs text-gray-400">{product.unit}</p>
                <p className="font-bold text-sm mt-1">₹{product.price} <span className="text-xs text-gray-400 font-normal">x {quantity}</span></p>
              </div>
              <div className="flex items-center gap-2 bg-saffron-500 rounded-lg text-white shrink-0">
                <button className="p-2" onClick={() => updateQuantity(product.id, quantity - 1)}>
                  <Minus size={14} />
                </button>
                <span className="text-sm font-semibold w-4 text-center">{quantity}</span>
                <button className="p-2" onClick={() => updateQuantity(product.id, quantity + 1)}>
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={() => removeItem(product.id)}
                className="p-2 text-gray-400 hover:text-red-500 shrink-0"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="card p-5 h-fit sticky top-24">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Fee</span>
              <span className="font-medium">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
            </div>
            {deliveryFee > 0 && (
              <p className="text-xs text-saffron-600">Add ₹{(199 - subtotal).toFixed(0)} more for free delivery!</p>
            )}
            <div className="border-t pt-2 flex justify-between font-bold text-base">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="btn-primary w-full py-3 mt-5"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
