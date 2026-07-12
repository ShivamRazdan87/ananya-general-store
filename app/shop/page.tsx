"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { categories } from "@/lib/data";
import { useProductStore } from "@/store/useProductStore";
import ProductCard from "@/components/ProductCard";
import clsx from "clsx";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialQuery = searchParams.get("q") || "";

  const allProducts = useProductStore((s) => s.products);

  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState("relevance");
  const [maxPrice, setMaxPrice] = useState(500);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (query.trim())
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      );
    list = list.filter((p) => p.price <= maxPrice);

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "discount")
      list.sort((a, b) => (b.mrp - b.price) - (a.mrp - a.price));

    return list;
  }, [allProducts, category, query, sort, maxPrice]);

  return (
    <div className="container-x py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Shop All Products</h1>
          <p className="text-sm text-gray-500">{filtered.length} products found</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm w-full sm:w-64 outline-none focus:border-saffron-400"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-saffron-400"
          >
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="discount">Best Discount</option>
          </select>
          <button
            className="sm:hidden border border-gray-200 rounded-xl px-3 py-2.5"
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-6">
        {/* Filters sidebar - desktop */}
        <aside className="hidden sm:block">
          <FilterPanel
            category={category}
            setCategory={setCategory}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />
        </aside>

        {/* Filters drawer - mobile */}
        {showFilters && (
          <div className="fixed inset-0 z-50 bg-black/50 sm:hidden" onClick={() => setShowFilters(false)}>
            <div
              className="absolute right-0 top-0 h-full w-72 bg-white p-5 overflow-y-auto animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Filters</h3>
                <button onClick={() => setShowFilters(false)}><X size={20} /></button>
              </div>
              <FilterPanel
                category={category}
                setCategory={setCategory}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
              />
            </div>
          </div>
        )}

        <div>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No products found. Try adjusting your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  category,
  setCategory,
  maxPrice,
  setMaxPrice,
}: {
  category: string;
  setCategory: (v: string) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3 text-sm">Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => setCategory("all")}
            className={clsx(
              "block text-sm w-full text-left px-3 py-1.5 rounded-lg",
              category === "all" ? "bg-saffron-100 text-saffron-700 font-semibold" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={clsx(
                "block text-sm w-full text-left px-3 py-1.5 rounded-lg",
                category === c.id ? "bg-saffron-100 text-saffron-700 font-semibold" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-3 text-sm">Max Price: ₹{maxPrice}</h3>
        <input
          type="range"
          min={10}
          max={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-saffron-500"
        />
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-x py-20 text-center text-gray-400">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
