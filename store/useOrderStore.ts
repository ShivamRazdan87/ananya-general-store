"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/store/useCartStore";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  address: string;
  pincode: string;
  deliverySlot: string;
  customerEmail: string;
  customerName: string;
  createdAt: string;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  placeOrder: (order: Omit<Order, "id" | "status" | "createdAt">) => Promise<Order>;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  getOrdersByEmail: (email: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
}

function toDbRow(o: Order) {
  return {
    id: o.id,
    items: o.items,
    subtotal: o.subtotal,
    delivery_fee: o.deliveryFee,
    total: o.total,
    status: o.status,
    payment_method: o.paymentMethod,
    address: o.address,
    pincode: o.pincode,
    delivery_slot: o.deliverySlot,
    customer_email: o.customerEmail,
    customer_name: o.customerName,
    created_at: o.createdAt,
  };
}

function fromDbRow(row: any): Order {
  return {
    id: row.id,
    items: row.items || [],
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    total: Number(row.total),
    status: row.status,
    paymentMethod: row.payment_method,
    address: row.address,
    pincode: row.pincode,
    deliverySlot: row.delivery_slot,
    customerEmail: row.customer_email,
    customerName: row.customer_name,
    createdAt: row.created_at,
  };
}

const seedOrders: Order[] = [
  {
    id: "ORD-10001",
    items: [],
    subtotal: 540,
    deliveryFee: 0,
    total: 540,
    status: "Delivered",
    paymentMethod: "UPI",
    address: "Tower 4, Flat 302, Parsvnath Edens, Alpha-2, Greater Noida",
    pincode: "201308",
    deliverySlot: "ASAP (10 mins)",
    customerEmail: "user@ananya.com",
    customerName: "Ananya Sharma",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "ORD-10002",
    items: [],
    subtotal: 890,
    deliveryFee: 0,
    total: 890,
    status: "Shipped",
    paymentMethod: "Card",
    address: "Tower 2, Flat 108, Parsvnath Edens, Alpha-2, Greater Noida",
    pincode: "201308",
    deliverySlot: "ASAP (10 mins)",
    customerEmail: "customer2@example.com",
    customerName: "Rahul Verma",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "ORD-10003",
    items: [],
    subtotal: 320,
    deliveryFee: 25,
    total: 345,
    status: "Pending",
    paymentMethod: "COD",
    address: "Tower 6, Flat 501, Parsvnath Edens, Alpha-2, Greater Noida",
    pincode: "201308",
    deliverySlot: "ASAP (10 mins)",
    customerEmail: "customer3@example.com",
    customerName: "Priya Nair",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: seedOrders,
      loading: false,

      // Called once on app load. If Supabase is configured, pulls every
      // order placed by every customer, so the shop owner's Admin panel
      // shows real, shared data instead of only what's in one browser.
      fetchOrders: async () => {
        if (!isSupabaseConfigured) return;
        set({ loading: true });
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Failed to fetch orders:", error.message);
          set({ loading: false });
          return;
        }
        if (data) {
          set({ orders: data.map(fromDbRow), loading: false });
        }
      },

      placeOrder: async (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `ORD-${Math.floor(10000 + Math.random() * 89999)}`,
          status: "Confirmed",
          createdAt: new Date().toISOString(),
        };
        set({ orders: [newOrder, ...get().orders] });
        if (isSupabaseConfigured) {
          const { error } = await supabase.from("orders").insert(toDbRow(newOrder));
          if (error) console.error("Failed to save order:", error.message);
        }
        return newOrder;
      },

      updateStatus: async (orderId, status) => {
        set({
          orders: get().orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        });
        if (isSupabaseConfigured) {
          const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
          if (error) console.error("Failed to update order status:", error.message);
        }
      },

      getOrdersByEmail: (email) => get().orders.filter((o) => o.customerEmail === email),
      getOrderById: (orderId) => get().orders.find((o) => o.id === orderId),
    }),
    { name: "ananya-orders" }
  )
);
