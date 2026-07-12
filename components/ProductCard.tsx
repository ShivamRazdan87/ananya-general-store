"use client";

import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { Heart, Star, Plus, Minus } from "lucide-react";
import { Product } from "@/lib/data";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { toast } from "sonner";

export default function ProductCard({ product }: { product: Product }) {
  const { items, addItem, updateQuantity } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();

  const cartItem = items.find((i) => i.product.id === product.id);
  const inWishlist = isInWishlist(product.id);
  const discount = Math.round(
    ((product.mrp - product.price) / product.mrp) * 100
  );

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem(product);
    toast(inWishlist ? "Removed from wishlist" : "Added to wishlist ❤️");
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="card relative group overflow-hidden flex flex-col">
      <Link href={`/product/${product.id}`} className="flex-1 flex flex-col">
        <div className="relative h-40 sm:h-44 bg-orange-50 dark:bg-gray-700">
          <ProductImage
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-leaf-600 text-white text-[10px] font-bold px-2 py-1 rounded-md">
              {discount}% OFF
            </span>
          )}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 rounded-full p-1.5 shadow hover:scale-110 transition"
          >
            <Heart
              size={16}
              className={inWishlist ? "text-red-500" : "text-gray-400"}
              fill={inWishlist ? "#ef4444" : "none"}
            />
          </button>
        </div>
        <div className="p-3 flex-1 flex flex-col">
          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">{product.brand}</p>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 mt-0.5">
            {product.name}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{product.unit}</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center bg-leaf-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded gap-0.5">
              {product.rating} <Star size={9} fill="white" />
            </div>
            <span className="text-[11px] text-gray-400 dark:text-gray-500">({product.reviewCount})</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-bold text-gray-900 dark:text-gray-100">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="text-xs text-gray-400 dark:text-gray-500 line-through">₹{product.mrp}</span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-3 pb-3">
        {!cartItem ? (
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="w-full btn-primary text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        ) : (
          <div className="flex items-center justify-between bg-saffron-500 rounded-xl text-white">
            <button
              className="p-2"
              onClick={(e) => {
                e.preventDefault();
                updateQuantity(product.id, cartItem.quantity - 1);
              }}
            >
              <Minus size={16} />
            </button>
            <span className="font-semibold text-sm">{cartItem.quantity}</span>
            <button
              className="p-2"
              onClick={(e) => {
                e.preventDefault();
                updateQuantity(product.id, cartItem.quantity + 1);
              }}
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}