import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import WhatsAppButton from "@/components/WhatsAppButton";
import StoreSync from "@/components/StoreSync";
import { ThemeProvider } from "@/components/ThemeProvider";

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

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col antialiased text-gray-800 dark:text-gray-100 dark:bg-gray-950">
        <ThemeProvider>
          <StoreSync />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}