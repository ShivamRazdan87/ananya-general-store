"use client";

import { useEffect } from "react";
import { useProductStore } from "@/store/useProductStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useStoreSettingsStore } from "@/store/useStoreSettingsStore";

// Keeps product & order data fresh across devices automatically, without
// needing a manual page reload:
// 1. Fetches once when the app first loads
// 2. Re-fetches whenever the tab becomes visible again (e.g. switching
//    back from another app or tab)
// 3. Re-fetches every 30 seconds while the tab is open and visible
export default function StoreSync() {
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);
  const fetchSettings = useStoreSettingsStore((s) => s.fetchSettings);

  useEffect(() => {
    const refresh = () => {
      fetchProducts();
      fetchOrders();
      fetchSettings();
    };

    refresh();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", refresh);

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    }, 30000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", refresh);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}