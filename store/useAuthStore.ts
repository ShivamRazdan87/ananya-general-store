"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";

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
  isLoggedIn: boolean;
  loading: boolean;
  init: () => Promise<void>;
  sendOtp: (email: string) => Promise<Result>;
  verifyOtp: (email: string, otp: string, name?: string) => Promise<VerifyResult>;
  logout: () => Promise<void>;
  addAddress: (address: Omit<Address, "id">) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
}

async function loadUserData(userId: string, email: string): Promise<User | null> {
  const [{ data: profile }, { data: addressRows }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("addresses").select("*").eq("user_id", userId),
  ]);

  if (!profile || !profile.name) return null;

  return {
    id: userId,
    name: profile.name,
    email,
    phone: profile.phone || "",
    addresses: (addressRows || []).map((a: any) => ({
      id: a.id,
      label: a.label,
      pincode: a.pincode,
      isDefault: a.is_default,
    })),
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  loading: true,

  init: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      const user = await loadUserData(session.user.id, session.user.email || "");
      set({ user, isLoggedIn: !!user, loading: false });
    } else {
      set({ loading: false });
    }

    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        set({ user: null, isLoggedIn: false });
      }
    });
  },

  sendOtp: async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  },

  verifyOtp: async (email, otp, name) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: "email",
    });
    if (error || !data.user) {
      return { ok: false, error: error?.message || "Invalid or expired OTP" };
    }

    const userId = data.user.id;
    const existing = await loadUserData(userId, data.user.email || "");

    if (existing) {
      set({ user: existing, isLoggedIn: true });
      return { ok: true };
    }

    if (!name || !name.trim()) {
      // Verified, but no profile yet — ask the caller to collect a name
      // and call verifyOtp again before we consider them logged in.
      return { ok: true, isNewUser: true };
    }

    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert({ id: userId, name: name.trim() });
    if (upsertError) {
      return { ok: false, error: "Could not create your account. Please try again." };
    }

    set({
      user: { id: userId, name: name.trim(), email: data.user.email || "", phone: "", addresses: [] },
      isLoggedIn: true,
    });
    return { ok: true };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isLoggedIn: false });
  },

  addAddress: async (address) => {
    const user = get().user;
    if (!user) return;

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        user_id: user.id,
        label: address.label,
        pincode: address.pincode,
        is_default: address.isDefault,
      })
      .select()
      .single();

    if (!error && data) {
      set({
        user: {
          ...user,
          addresses: [
            ...user.addresses,
            { id: data.id, label: data.label, pincode: data.pincode, isDefault: data.is_default },
          ],
        },
      });
    }
  },

  removeAddress: async (id) => {
    const user = get().user;
    if (!user) return;
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (!error) {
      set({ user: { ...user, addresses: user.addresses.filter((a) => a.id !== id) } });
    }
  },
}));
