"use client";

import { create } from "zustand";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface Address {
  id: string;
  label: string;
  pincode: string;
  isDefault: boolean;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

type Result = { ok: true } | { ok: false; error: string };

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<Result>;
  register: (name: string, email: string, password: string, phone: string) => Promise<Result>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<Result>;
  updatePassword: (newPassword: string) => Promise<Result>;
  addAddress: (address: Omit<Address, "id">) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  updateProfile: (data: Partial<Pick<User, "name" | "phone">>) => Promise<void>;
}

const NOT_CONFIGURED_ERROR =
  "Accounts aren't fully set up yet. Please contact the store owner.";

async function loadUserData(userId: string, email: string): Promise<User> {
  const [{ data: profile }, { data: addressRows }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("addresses").select("*").eq("user_id", userId),
  ]);

  return {
    name: profile?.name || "",
    email,
    phone: profile?.phone || "",
    addresses: (addressRows || []).map((a: any) => ({
      id: a.id,
      label: a.label,
      pincode: a.pincode,
      isDefault: a.is_default,
    })),
  };
}

let listenerAttached = false;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  loading: true,

  init: async () => {
    if (!isSupabaseConfigured) {
      set({ loading: false });
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      const user = await loadUserData(session.user.id, session.user.email || "");
      set({ user, isLoggedIn: true, loading: false });
    } else {
      set({ loading: false });
    }

    if (!listenerAttached) {
      listenerAttached = true;
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_OUT") {
          set({ user: null, isLoggedIn: false });
        } else if (session?.user) {
          const user = await loadUserData(session.user.id, session.user.email || "");
          set({ user, isLoggedIn: true });
        }
      });
    }
  },

  login: async (email, password) => {
    if (!isSupabaseConfigured) return { ok: false, error: NOT_CONFIGURED_ERROR };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return { ok: false, error: error?.message || "Invalid email or password." };
    const user = await loadUserData(data.user.id, data.user.email || "");
    set({ user, isLoggedIn: true });
    return { ok: true };
  },

  register: async (name, email, password, phone) => {
    if (!isSupabaseConfigured) return { ok: false, error: NOT_CONFIGURED_ERROR };
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) return { ok: false, error: error?.message || "Could not create account." };

    await supabase.from("profiles").upsert({ id: data.user.id, name, phone });

    if (data.session) {
      const user = await loadUserData(data.user.id, email);
      set({ user, isLoggedIn: true });
    }
    return { ok: true };
  },

  logout: async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    set({ user: null, isLoggedIn: false });
  },

  requestPasswordReset: async (email) => {
    if (!isSupabaseConfigured) return { ok: false, error: NOT_CONFIGURED_ERROR };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  },

  updatePassword: async (newPassword) => {
    if (!isSupabaseConfigured) return { ok: false, error: NOT_CONFIGURED_ERROR };
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  },

  addAddress: async (address) => {
    const user = get().user;
    if (!user || !isSupabaseConfigured) return;
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    if (!userId) return;

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        user_id: userId,
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
            {
              id: data.id,
              label: data.label,
              pincode: data.pincode,
              isDefault: data.is_default,
            },
          ],
        },
      });
    }
  },

  removeAddress: async (id) => {
    const user = get().user;
    if (!user || !isSupabaseConfigured) return;
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (!error) {
      set({ user: { ...user, addresses: user.addresses.filter((a) => a.id !== id) } });
    }
  },

  updateProfile: async (data) => {
    const user = get().user;
    if (!user) return;
    if (isSupabaseConfigured) {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      if (userId) {
        await supabase.from("profiles").update(data).eq("id", userId);
      }
    }
    set({ user: { ...user, ...data } });
  },
}));
