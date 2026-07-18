"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { normalizePhone } from "@/lib/otp";

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
  // Checks (after a phone number's OTP has been verified) whether this is
  // an existing account or a brand-new one that still needs a name/email.
  isRegisteredPhone: (phone: string) => boolean;
  // Call only after verifyOtp() has succeeded for this phone.
  loginWithPhone: (phone: string) => boolean;
  // Call only after verifyOtp() has succeeded for this new phone.
  registerWithPhone: (name: string, phone: string, email: string) => boolean;
  logout: () => void;
  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  updateProfile: (data: Partial<User>) => void;
}

// Demo account, reachable with phone 9876543210 and any OTP shown on screen
// (since OTP delivery is simulated — see lib/otp.ts).
const DEMO_PHONE = "9876543210";
const DEMO_USER: User = {
  name: "Ananya Sharma",
  email: "user@ananya.com",
  phone: DEMO_PHONE,
  addresses: [
    {
      id: "addr1",
      label: "Home",
      fullAddress: "Tower 3, Flat 205, Parsvnath Edens, Alpha-2, Greater Noida",
      pincode: "201308",
      isDefault: true,
    },
  ],
};

function readUsers(): Record<string, User> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("ananya-users") || "{}");
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, User>) {
  if (typeof window === "undefined") return;
  localStorage.setItem("ananya-users", JSON.stringify(users));
}

// Persists any change to the logged-in user's own record back into the
// shared "ananya-users" store too, so it's still there next time they log
// in with their phone (not just kept in this session's local state).
function persistCurrentUser(user: User) {
  if (user.phone === DEMO_PHONE) return; // demo account always resets fresh
  const users = readUsers();
  users[user.phone] = user;
  writeUsers(users);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,

      isRegisteredPhone: (phone) => {
        const normalized = normalizePhone(phone);
        if (normalized === DEMO_PHONE) return true;
        const users = readUsers();
        return Boolean(users[normalized]);
      },

      loginWithPhone: (phone) => {
        const normalized = normalizePhone(phone);
        const users = readUsers();
        const found = users[normalized];
        if (found) {
          set({ user: found, isLoggedIn: true });
          return true;
        }
        if (normalized === DEMO_PHONE) {
          set({ user: DEMO_USER, isLoggedIn: true });
          return true;
        }
        return false;
      },

      registerWithPhone: (name, phone, email) => {
        const normalized = normalizePhone(phone);
        if (normalized === DEMO_PHONE) return false;
        const users = readUsers();
        if (users[normalized]) return false;

        const newUser: User = { name, email, phone: normalized, addresses: [] };
        users[normalized] = newUser;
        writeUsers(users);
        set({ user: newUser, isLoggedIn: true });
        return true;
      },

      logout: () => set({ user: null, isLoggedIn: false }),

      addAddress: (address) => {
        const user = get().user;
        if (!user) return;
        const newAddr = { ...address, id: `addr-${Date.now()}` };
        const updated = { ...user, addresses: [...user.addresses, newAddr] };
        set({ user: updated });
        persistCurrentUser(updated);
      },

      removeAddress: (id) => {
        const user = get().user;
        if (!user) return;
        const updated = { ...user, addresses: user.addresses.filter((a) => a.id !== id) };
        set({ user: updated });
        persistCurrentUser(updated);
      },

      updateProfile: (data) => {
        const user = get().user;
        if (!user) return;
        const updated = { ...user, ...data };
        set({ user: updated });
        persistCurrentUser(updated);
      },
    }),
    { name: "ananya-auth" }
  )
);
