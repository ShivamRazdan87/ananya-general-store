"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Address {
  id: string;
  label: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  addresses: Address[];
}

type Result = { ok: true } | { ok: false; error: string };
type VerifyResult = Result | { ok: true; isNewUser: true };

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  init: () => Promise<void>;
  sendOtp: (phone: string) => Promise<Result>;
  verifyOtp: (phone: string, otp: string, name?: string) => Promise<VerifyResult>;
  logout: () => void;
  addAddress: (address: Omit<Address, "id">) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      loading: true,

      // Called once on app load (see StoreSync). Uses the token persisted
      // from a previous session (if any) to fetch a fresh copy of the
      // resident's profile and addresses.
      init: async () => {
        const token = get().token;
        if (!token) {
          set({ loading: false });
          return;
        }
        try {
          const res = await fetch("/api/account/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok && data.user) {
            set({ user: data.user, isLoggedIn: true, loading: false });
          } else {
            set({ user: null, token: null, isLoggedIn: false, loading: false });
          }
        } catch {
          set({ loading: false });
        }
      },

      sendOtp: async (phone) => {
        try {
          const res = await fetch("/api/otp/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone }),
          });
          const data = await res.json();
          if (!res.ok) return { ok: false, error: data.error || "Could not send OTP" };
          return { ok: true };
        } catch {
          return { ok: false, error: "Network error. Please try again." };
        }
      },

      verifyOtp: async (phone, otp, name) => {
        try {
          const res = await fetch("/api/otp/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, otp, name }),
          });
          const data = await res.json();

          if (!res.ok) return { ok: false, error: data.error || "Invalid OTP" };
          if (data.isNewUser) return { ok: true, isNewUser: true };

          set({ user: data.user, token: data.token, isLoggedIn: true });
          return { ok: true };
        } catch {
          return { ok: false, error: "Network error. Please try again." };
        }
      },

      logout: () => {
        set({ user: null, token: null, isLoggedIn: false });
      },

      addAddress: async (address) => {
        const { token, user } = get();
        if (!token || !user) return;
        try {
          const res = await fetch("/api/account/addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(address),
          });
          const data = await res.json();
          if (res.ok && data.address) {
            set({ user: { ...user, addresses: [...user.addresses, data.address] } });
          }
        } catch {
          // fetch failure — address just won't appear; caller's toast covers UX
        }
      },

      removeAddress: async (id) => {
        const { token, user } = get();
        if (!token || !user) return;
        try {
          const res = await fetch(`/api/account/addresses/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            set({ user: { ...user, addresses: user.addresses.filter((a) => a.id !== id) } });
          }
        } catch {
          // fetch failure — address stays in list; user can retry
        }
      },
    }),
    {
      name: "ananya-auth",
      // Only the token needs to persist across page loads/tabs. The user
      // object is re-fetched fresh via init() every time, so it always
      // reflects the latest name/addresses instead of a stale snapshot.
      partialize: (state) => ({ token: state.token }),
    }
  )
);
