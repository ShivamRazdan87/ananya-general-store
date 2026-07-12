import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-leaf-900 text-leaf-50 mt-16">
      <div className="container-x py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-saffron-500 flex items-center justify-center font-bold">
              A
            </div>
            <span className="font-extrabold text-lg">Ananya General Store</span>
          </div>
          <p className="text-sm text-leaf-200">
            Your trusted neighbourhood kirana store, now online. Fresh
            groceries delivered in 10-15 minutes, every single day.
          </p>
          <div className="flex gap-3 mt-4">
            <Facebook size={18} className="cursor-pointer hover:text-saffron-400" />
            <Instagram size={18} className="cursor-pointer hover:text-saffron-400" />
            <Twitter size={18} className="cursor-pointer hover:text-saffron-400" />
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-leaf-200">
            <li><Link href="/shop" className="hover:text-white">Shop</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/account" className="hover:text-white">My Account</Link></li>
            <li><Link href="/admin" className="hover:text-white">Admin Panel</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Categories</h4>
          <ul className="space-y-2 text-sm text-leaf-200">
            <li>Fruits & Vegetables</li>
            <li>Dairy & Bakery</li>
            <li>Atta, Rice & Dals</li>
            <li>Snacks & Namkeen</li>
            <li>Personal Care</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Get in Touch</h4>
          <ul className="space-y-3 text-sm text-leaf-200">
            <li className="flex items-center gap-2"><Phone size={16} /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail size={16} /> support@ananyastore.in</li>
            <li className="flex items-center gap-2"><MapPin size={16} /> Sector Alpha-2, Greater Noida, UP</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-leaf-800 py-4 text-center text-xs text-leaf-300">
        © {new Date().getFullYear()} Ananya General Store. All rights reserved. Made with ❤️ in India.
      </div>
    </footer>
  );
}
