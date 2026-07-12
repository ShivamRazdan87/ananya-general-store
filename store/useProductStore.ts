"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, products as seedProducts } from "@/lib/data";

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: seedProducts,
      addProduct: (product) => set({ products: [product, ...get().products] }),
      updateProduct: (id, data) =>
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        }),
      deleteProduct: (id) =>
        set({ products: get().products.filter((p) => p.id !== id) }),
    }),
    { name: "ananya-products" }
  )
);
