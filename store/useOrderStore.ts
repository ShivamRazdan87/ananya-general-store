"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/store/useCartStore";

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
  placeOrder: (order: Omit<Order, "id" | "status" | "createdAt">) => Order;
  updateStatus: (orderId: string, status: OrderStatus) => void;
  getOrdersByEmail: (email: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
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
    address: "B-42, Green Park Extension, New Delhi",
    pincode: "110001",
    deliverySlot: "ASAP (30-45 mins)",
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
    address: "12, MG Road, Bengaluru",
    pincode: "560001",
    deliverySlot: "Today 6-8 PM",
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
    address: "Fort, Mumbai",
    pincode: "400001",
    deliverySlot: "ASAP (30-45 mins)",
    customerEmail: "customer3@example.com",
    customerName: "Priya Nair",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: seedOrders,
      placeOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `ORD-${Math.floor(10000 + Math.random() * 89999)}`,
          status: "Confirmed",
          createdAt: new Date().toISOString(),
        };
        set({ orders: [newOrder, ...get().orders] });
        return newOrder;
      },
      updateStatus: (orderId, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        });
      },
      getOrdersByEmail: (email) =>
        get().orders.filter((o) => o.customerEmail === email),
      getOrderById: (orderId) => get().orders.find((o) => o.id === orderId),
    }),
    { name: "ananya-orders" }
  )
);
