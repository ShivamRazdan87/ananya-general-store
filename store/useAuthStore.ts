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
  resetPassword: (email: string, newPassword: string) => boolean;
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
        // Check localStorage first — this is where password resets and
        // registered users live, so a reset always takes effect immediately,
        // even for the demo account.
        if (typeof window !== "undefined") {
          const raw = localStorage.getItem("ananya-users");
          const users: Record<string, { name: string; password: string; phone: string }> = raw
            ? JSON.parse(raw)
            : {};
          const found = users[email];
          if (found) {
            if (found.password === password) {
              set({
                user: {
                  name: found.name,
                  email,
                  phone: found.phone,
                  addresses: email === DEFAULT_EMAIL
                    ? [
                        {
                          id: "addr1",
                          label: "Home",
                          fullAddress: "Tower 3, Flat 205, Parsvnath Edens, Alpha-2, Greater Noida",
                          pincode: "201308",
                          isDefault: true,
                        },
                      ]
                    : [],
                },
                isLoggedIn: true,
              });
              return true;
            }
            return false;
          }
        }
        // Fallback: original hardcoded demo account (only used if it has
        // never been overridden via reset/registration in this browser)
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
      resetPassword: (email, newPassword) => {
        if (typeof window === "undefined") return false;
        const raw = localStorage.getItem("ananya-users");
        const users: Record<string, { name: string; password: string; phone: string }> = raw
          ? JSON.parse(raw)
          : {};

        if (users[email]) {
          users[email] = { ...users[email], password: newPassword };
          localStorage.setItem("ananya-users", JSON.stringify(users));
          return true;
        }
        if (email === DEFAULT_EMAIL) {
          users[email] = { name: "Ananya Sharma", password: newPassword, phone: "+91 98765 43210" };
          localStorage.setItem("ananya-users", JSON.stringify(users));
          return true;
        }
        // Email not recognized — nothing to reset
        return false;
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
