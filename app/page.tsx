"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Truck,
  ShieldCheck,
  Percent,
  MapPin,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { categories, storeConfig } from "@/lib/data";
import { useProductStore } from "@/store/useProductStore";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const products = useProductStore((s) => s.products);

  const featured = products.slice(0, 8);
  const bestDeals = [...products].sort((a, b) => (b.mrp - b.price) - (a.mrp - a.price)).slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-saffron-50 via-white to-leaf-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 overflow-hidden">
        <div className="container-x py-10 md:py-16 grid md:grid-cols-2 gap-8 items-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 bg-leaf-100 dark:bg-leaf-800 text-leaf-700 dark:text-leaf-200 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              <Clock size={14} /> Delivery in 10 minutes
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Ananya General Store,
              <br />
              <span className="text-saffron-600">Now Online.</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg max-w-md">
              Fresh groceries, snacks & daily essentials delivered to your
              doorstep in just 10 minutes. Quality you trust, speed you love.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link href="/shop" className="btn-primary px-7 py-3.5 flex items-center gap-2 text-base">
                Start Shopping <ArrowRight size={18} />
              </Link>
              <Link href="#pincode" className="btn-secondary px-7 py-3.5 flex items-center gap-2 text-base">
                <MapPin size={18} /> Check Delivery
              </Link>
            </div>
          </div>
          <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
            <Image
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900"
              alt="Fresh groceries"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* USP Strip */}
      <section className="bg-white dark:bg-gray-900 border-y border-orange-100 dark:border-gray-800">
        <div className="container-x py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: "10 Min Delivery", desc: "Lightning-fast doorstep delivery" },
            { icon: ShieldCheck, title: "Quality Assured", desc: "Fresh, checked & verified" },
            { icon: Percent, title: "Best Prices", desc: "Great deals every day" },
            { icon: Clock, title: "Open Till Late", desc: "8 AM - 11 PM, all days" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-saffron-100 dark:bg-saffron-900 flex items-center justify-center shrink-0">
                <item.icon size={20} className="text-saffron-600 dark:text-saffron-400" />
              </div>
              <div>
                <p className="font-semibold text-sm dark:text-gray-100">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery Zone Banner */}
      <section id="pincode" className="container-x py-10">
        <div className="bg-leaf-800 rounded-3xl p-6 md:p-10 text-white grid md:grid-cols-2 gap-6 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-leaf-700/60 text-leaf-100 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              <MapPin size={14} /> Exclusively serving our home society
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {storeConfig.societyName}
            </h2>
            <p className="text-leaf-200 text-sm mb-5">
              {storeConfig.societyArea}
            </p>
            <div className="flex items-center gap-2 bg-leaf-700/60 rounded-xl px-4 py-3 max-w-sm">
              <CheckCircle2 className="text-green-300 shrink-0" size={20} />
              <div>
                <p className="font-semibold text-sm">We deliver right to your door!</p>
                <p className="text-xs text-leaf-200">Estimated delivery: {storeConfig.deliveryMinutes}</p>
              </div>
            </div>
          </div>
          <div className="hidden md:block relative h-56 rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1601599963565-b7f49deb2c98?w=800"
              alt="Delivery"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-x py-8">
        <h2 className="text-2xl font-bold dark:text-white mb-5">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className="card p-4 flex flex-col items-center text-center gap-2 hover:-translate-y-1 transition"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-xs font-semibold dark:text-gray-200">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-x py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold dark:text-white">Popular Products</h2>
          <Link href="/shop" className="text-saffron-600 text-sm font-semibold flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Best Deals */}
      <section className="container-x py-8 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            🔥 Best Deals
          </h2>
          <Link href="/shop" className="text-saffron-600 text-sm font-semibold flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {bestDeals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}