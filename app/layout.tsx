import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Ananya General Store | Groceries Delivered in 30-45 mins",
  description:
    "Your neighbourhood kirana store online. Fresh groceries, snacks, household essentials & more delivered to your doorstep in 30-45 minutes.",
  keywords: [
    "grocery delivery",
    "kirana store",
    "online groceries India",
    "Ananya General Store",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased text-gray-800">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
