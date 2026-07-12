"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import {
  Heart,
  Star,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronLeft,
} from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const products = useProductStore((s) => s.products);
  const product = products.find((p) => p.id === params.id);
  const { items, addItem, updateQuantity } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="container-x py-20 text-center">
        <p className="text-xl font-semibold mb-4">Product not found</p>
        <Link href="/shop" className="btn-primary px-6 py-2 inline-block">
          Back to Shop
        </Link>
      </div>
    );
  }

  const cartItem = items.find((i) => i.product.id === product.id);
  const inWishlist = isInWishlist(product.id);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container-x py-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-gray-800"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative h-80 md:h-[420px] bg-orange-50 rounded-3xl overflow-hidden">
          <ProductImage src={product.image} alt={product.name} fill className="object-cover" />
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-leaf-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
              {discount}% OFF
            </span>
          )}
        </div>

        <div>
          <p className="text-sm text-saffron-600 font-semibold">{product.brand}</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">
            {product.name}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{product.unit}</p>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center bg-leaf-600 text-white text-xs font-bold px-2 py-1 rounded gap-1">
              {product.rating} <Star size={11} fill="white" />
            </div>
            <span className="text-sm text-gray-500">{product.reviewCount} ratings</span>
          </div>

          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-3xl font-extrabold text-gray-900">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="text-lg text-gray-400 line-through">₹{product.mrp}</span>
            )}
            {discount > 0 && (
              <span className="text-leaf-600 font-semibold text-sm">{discount}% off</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-center gap-2 mt-5 text-sm">
            <Truck size={18} className="text-saffron-600" />
            <span className="font-medium">Delivery in 10 minutes</span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mt-5">{product.description}</p>

          <div className="flex items-center gap-4 mt-6">
            {!cartItem ? (
              <button
                onClick={() => {
                  addItem(product, qty);
                  toast.success(`${product.name} added to cart`);
                }}
                disabled={product.stock === 0}
                className="btn-primary px-8 py-3 flex-1 disabled:opacity-50"
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            ) : (
              <div className="flex items-center justify-between bg-saffron-500 rounded-xl text-white flex-1 px-2">
                <button className="p-3" onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}>
                  <Minus size={18} />
                </button>
                <span className="font-bold">{cartItem.quantity}</span>
                <button className="p-3" onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}>
                  <Plus size={18} />
                </button>
              </div>
            )}
            <button
              onClick={() => {
                toggleItem(product);
                toast(inWishlist ? "Removed from wishlist" : "Added to wishlist ❤️");
              }}
              className="border-2 border-gray-200 rounded-xl p-3.5 hover:border-red-300"
            >
              <Heart size={22} className={inWishlist ? "text-red-500" : "text-gray-400"} fill={inWishlist ? "#ef4444" : "none"} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8 text-center">
            <div className="flex flex-col items-center gap-1">
              <Truck size={20} className="text-leaf-600" />
              <span className="text-[11px] text-gray-500">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck size={20} className="text-leaf-600" />
              <span className="text-[11px] text-gray-500">Quality Assured</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw size={20} className="text-leaf-600" />
              <span className="text-[11px] text-gray-500">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-5">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
