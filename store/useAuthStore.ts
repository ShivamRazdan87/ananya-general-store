"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Address {
  id: string;
  label: string;
  fullAddress: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, phone: string) => boolean;
  logout: () => void;
  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  updateProfile: (data: Partial<User>) => void;
}

const DEFAULT_EMAIL = "user@ananya.com";
const DEFAULT_PASSWORD = "123456";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      login: (email, password) => {
        if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
          set({
            user: {
              name: "Ananya Sharma",
              email,
              phone: "+91 98765 43210",
              addresses: [
                {
                  id: "addr1",
                  label: "Home",
                  fullAddress: "Tower 3, Flat 205, Parsvnath Edens, Alpha-2, Greater Noida",
                  pincode: "201308",
                  isDefault: true,
                },
              ],
            },
            isLoggedIn: true,
          });
          return true;
        }
        // allow any previously registered user stored in localStorage "ananya-users"
        if (typeof window !== "undefined") {
          const raw = localStorage.getItem("ananya-users");
          const users: Record<string, { name: string; password: string; phone: string }> = raw
            ? JSON.parse(raw)
            : {};
          const found = users[email];
          if (found && found.password === password) {
            set({
              user: {
                name: found.name,
                email,
                phone: found.phone,
                addresses: [],
              },
              isLoggedIn: true,
            });
            return true;
          }
        }
        return false;
      },
      register: (name, email, password, phone) => {
        if (typeof window !== "undefined") {
          const raw = localStorage.getItem("ananya-users");
          const users = raw ? JSON.parse(raw) : {};
          if (users[email] || email === DEFAULT_EMAIL) return false;
          users[email] = { name, password, phone };
          localStorage.setItem("ananya-users", JSON.stringify(users));
        }
        set({
          user: { name, email, phone, addresses: [] },
          isLoggedIn: true,
        });
        return true;
      },
      logout: () => set({ user: null, isLoggedIn: false }),
      addAddress: (address) => {
        const user = get().user;
        if (!user) return;
        const newAddr = { ...address, id: `addr-${Date.now()}` };
        set({ user: { ...user, addresses: [...user.addresses, newAddr] } });
      },
      removeAddress: (id) => {
        const user = get().user;
        if (!user) return;
        set({
          user: { ...user, addresses: user.addresses.filter((a) => a.id !== id) },
        });
      },
      updateProfile: (data) => {
        const user = get().user;
        if (!user) return;
        set({ user: { ...user, ...data } });
      },
    }),
    { name: "ananya-auth" }
  )
);
