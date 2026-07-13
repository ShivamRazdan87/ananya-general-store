import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import WhatsAppButton from "@/components/WhatsAppButton";
import StoreSync from "@/components/StoreSync";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Ananya General Store | Groceries Delivered in 10 mins",
  description:
    "Your neighbourhood kirana store online. Fresh groceries, snacks, household essentials & more delivered to your doorstep in 10 minutes.",
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
      <head>
        {/* Apply saved dark mode preference before paint, to avoid a light-mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var raw = localStorage.getItem("ananya-theme");
                  var isDark = raw ? JSON.parse(raw).state.isDark : false;
                  if (isDark) document.documentElement.classList.add("dark");
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased text-gray-800 dark:text-gray-100 dark:bg-gray-950 bg-white transition-colors">
        <StoreSync />
        <Navbar />
        <main className="flex-1"><PageTransition>{children}</PageTransition></main>
        <Footer />
        <WhatsAppButton />
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
