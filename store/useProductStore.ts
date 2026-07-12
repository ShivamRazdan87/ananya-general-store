"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, products as seedProducts } from "@/lib/data";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface ProductState {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

function toDbRow(p: Product) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    sub_category: p.subCategory,
    brand: p.brand,
    price: p.price,
    mrp: p.mrp,
    unit: p.unit,
    image: p.image,
    rating: p.rating,
    review_count: p.reviewCount,
    stock: p.stock,
    description: p.description,
    tags: p.tags,
    is_veg: p.isVeg,
  };
}

function fromDbRow(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    subCategory: row.sub_category,
    brand: row.brand,
    price: Number(row.price),
    mrp: Number(row.mrp),
    unit: row.unit,
    image: row.image,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    stock: row.stock,
    description: row.description,
    tags: row.tags || [],
    isVeg: row.is_veg,
  };
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: seedProducts,
      loading: false,

      // Called once on app load. If Supabase is configured, pulls the shared
      // product catalog so every visitor sees the same, up-to-date list.
      fetchProducts: async () => {
        if (!isSupabaseConfigured) return;
        set({ loading: true });
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Failed to fetch products:", error.message);
          set({ loading: false });
          return;
        }

        if (data && data.length === 0) {
          // First-ever load: seed the shared database with the starter catalog
          await supabase.from("products").insert(seedProducts.map(toDbRow));
          set({ products: seedProducts, loading: false });
        } else if (data) {
          set({ products: data.map(fromDbRow), loading: false });
        }
      },

      addProduct: async (product) => {
        set({ products: [product, ...get().products] });
        if (isSupabaseConfigured) {
          const { error } = await supabase.from("products").insert(toDbRow(product));
          if (error) console.error("Failed to add product:", error.message);
        }
      },

      updateProduct: async (id, data) => {
        set({
          products: get().products.map((p) => (p.id === id ? { ...p, ...data } : p)),
        });
        if (isSupabaseConfigured) {
          const updated = get().products.find((p) => p.id === id);
          if (updated) {
            const { error } = await supabase.from("products").update(toDbRow(updated)).eq("id", id);
            if (error) console.error("Failed to update product:", error.message);
          }
        }
      },

      deleteProduct: async (id) => {
        set({ products: get().products.filter((p) => p.id !== id) });
        if (isSupabaseConfigured) {
          const { error } = await supabase.from("products").delete().eq("id", id);
          if (error) console.error("Failed to delete product:", error.message);
        }
      },
    }),
    { name: "ananya-products" }
  )
);
