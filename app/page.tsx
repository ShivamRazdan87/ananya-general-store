"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

export default function HomePage() {
  const products = useProductStore((s) => s.products);

  const featured = products.slice(0, 8);
  const bestDeals = [...products].sort((a, b) => (b.mrp - b.price) - (a.mrp - a.price)).slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-saffron-50 via-white to-leaf-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 overflow-hidden">
        <div className="container-x py-10 md:py-16 grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial="hidden" animate="visible" variants={heroContainer}>
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-leaf-100 text-leaf-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4"
            >
              <Clock size={14} /> Delivery in 10 minutes
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Your Kirana Store,
              <br />
              <span className="text-saffron-600">Now Online.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-600 mt-4 text-lg max-w-md">
              Fresh groceries, snacks & daily essentials delivered to your
              doorstep in just 10 minutes. Quality you trust, speed you love.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mt-7">
              <Link href="/shop" className="btn-primary px-7 py-3.5 flex items-center gap-2 text-base">
                Start Shopping <ArrowRight size={18} />
              </Link>
              <Link href="#pincode" className="btn-secondary px-7 py-3.5 flex items-center gap-2 text-base">
                <MapPin size={18} /> Check Delivery
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="relative h-64 md:h-96 rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/store-front.jpg"
              alt="Ananya General Store"
              fill
              unoptimized
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* USP Strip */}
      <section className="bg-white border-y border-orange-100">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={staggerContainer}
          className="container-x py-6 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: Truck, title: "10 Min Delivery", desc: "Lightning-fast doorstep delivery" },
            { icon: ShieldCheck, title: "Quality Assured", desc: "Fresh, checked & verified" },
            { icon: Percent, title: "Best Prices", desc: "Great deals every day" },
            { icon: Clock, title: "Open Till Late", desc: "8 AM - 11 PM, all days" },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeUp} className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-saffron-100 flex items-center justify-center shrink-0">
                <item.icon size={20} className="text-saffron-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Delivery Zone Banner */}
      <section id="pincode" className="container-x py-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="bg-leaf-800 rounded-3xl p-6 md:p-10 text-white grid md:grid-cols-2 gap-6 items-center"
        >
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
          <div className="block relative h-48 md:h-56 rounded-2xl overflow-hidden bg-leaf-900">
            <Image
              src="/society.jpg"
              alt="Delivery"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="container-x py-8">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-2xl font-bold mb-5"
        >
          Shop by Category
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={fadeUp}>
              <Link
                href={`/shop?category=${cat.id}`}
                className="card p-4 flex flex-col items-center text-center gap-2 hover:-translate-y-1 transition"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="text-xs font-semibold">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="container-x py-8">
        <div className="flex items-center justify-between mb-5">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-2xl font-bold"
          >
            Popular Products
          </motion.h2>
          <Link href="/shop" className="text-saffron-600 text-sm font-semibold flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {featured.map((p) => (
            <motion.div key={p.id} variants={fadeUp}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Best Deals */}
      <section className="container-x py-8 pb-16">
        <div className="flex items-center justify-between mb-5">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-2xl font-bold flex items-center gap-2"
          >
            🔥 Best Deals
          </motion.h2>
          <Link href="/shop" className="text-saffron-600 text-sm font-semibold flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {bestDeals.map((p) => (
            <motion.div key={p.id} variants={fadeUp}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}