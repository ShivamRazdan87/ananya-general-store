"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  MapPin,
  Clock,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { isLoggedIn, user } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/shop?q=${encodeURIComponent(search)}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="bg-leaf-700 text-white text-xs sm:text-sm">
        <div className="container-x flex items-center justify-center gap-2 py-1.5">
          <Clock size={14} />
          <span className="font-medium">
            Delivering groceries in 30-45 mins across your city!
          </span>
        </div>
      </div>

      <div className="container-x py-3">
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-full bg-saffron-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
              A
            </div>
            <div className="hidden sm:block">
              <p className="font-extrabold text-lg leading-tight text-leaf-800">
                Ananya
              </p>
              <p className="text-xs text-saffron-600 -mt-1 font-medium">
                General Store
              </p>
            </div>
          </Link>

          <button
            className="hidden md:flex items-center gap-1 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2 hover:border-saffron-400 transition"
            onClick={() => router.push("/#pincode")}
          >
            <MapPin size={16} className="text-saffron-600" />
            Delivery Location
          </button>

          <form
            onSubmit={handleSearch}
            className="flex-1 flex items-center bg-gray-100 rounded-xl px-3 py-2"
          >
            <Search size={18} className="text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for atta, rice, oil, snacks..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </form>

          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium shrink-0">
            <Link href="/shop" className="hover:text-saffron-600 transition">
              Shop
            </Link>
            <Link href="/about" className="hover:text-saffron-600 transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-saffron-600 transition">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/wishlist"
              className="relative p-2 rounded-full hover:bg-orange-50 transition"
            >
              <Heart size={22} className="text-gray-700" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-saffron-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-orange-50 transition"
            >
              <ShoppingCart size={22} className="text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-leaf-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              className="p-2 rounded-full hover:bg-orange-50 transition hidden sm:flex items-center gap-2"
            >
              <User size={22} className="text-gray-700" />
              {isLoggedIn && (
                <span className="hidden xl:inline text-sm font-medium">
                  {user?.name.split(" ")[0]}
                </span>
              )}
            </Link>
            <button
              className="lg:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="container-x py-3 flex flex-col gap-3 text-sm font-medium">
            <Link href="/shop" onClick={() => setMenuOpen(false)}>
              Shop
            </Link>
            <Link href="/wishlist" onClick={() => setMenuOpen(false)}>
              Wishlist
            </Link>
            <Link href="/cart" onClick={() => setMenuOpen(false)}>
              Cart
            </Link>
            <Link href="/account" onClick={() => setMenuOpen(false)}>
              Account
            </Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-saffron-600">
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
