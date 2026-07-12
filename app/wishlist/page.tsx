"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);

  return (
    <div className="container-x py-8">
      <h1 className="text-2xl font-bold mb-1">My Wishlist</h1>
      <p className="text-sm text-gray-500 mb-6">{items.length} item(s) saved</p>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart size={56} className="text-gray-200 mb-4" />
          <p className="text-lg font-semibold text-gray-600">Your wishlist is empty</p>
          <p className="text-sm text-gray-400 mb-6">Save items you love for later.</p>
          <Link href="/shop" className="btn-primary px-6 py-2.5">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
