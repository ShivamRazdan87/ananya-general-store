"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";

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
  loading: boolean;
  init: () => Promise<void>;
  checkIsNewUser: () => Promise<boolean>;
  completeRegistration: (name: string, phone: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addAddress: (address: Omit<Address, "id">) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  updateProfile: (data: Partial<Pick<User, "name" | "phone">>) => Promise<void>;
}

async function loadUserData(userId: string, email: string): Promise<User | null> {
  const [{ data: profile }, { data: addressRows }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("addresses").select("*").eq("user_id", userId),
  ]);

  if (!profile || !profile.name) return null;

  return {
    name: profile.name,
    email,
    phone: profile.phone || "",
    addresses: (addressRows || []).map((a: any) => ({
      id: a.id,
      label: a.label,
      fullAddress: a.full_address || "",
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

  checkIsNewUser: async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) return true;

    const user = await loadUserData(authUser.id, authUser.email || "");
    if (user) {
      set({ user, isLoggedIn: true });
      return false;
    }
    return true;
  },

  completeRegistration: async (name, phone) => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) return false;

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: authUser.id, name, phone });
    if (error) return false;

    set({
      user: { name, email: authUser.email || "", phone, addresses: [] },
      isLoggedIn: true,
    });
    return true;
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isLoggedIn: false });
  },

  addAddress: async (address) => {
    const user = get().user;
    if (!user) return;
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (!authUser) return;

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        user_id: authUser.id,
        label: address.label,
        full_address: address.fullAddress,
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
              fullAddress: data.full_address || "",
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
    if (!user) return;
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (!error) {
      set({ user: { ...user, addresses: user.addresses.filter((a) => a.id !== id) } });
    }
  },

  updateProfile: async (data) => {
    const user = get().user;
    if (!user) return;
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (authUser) {
      await supabase.from("profiles").update(data).eq("id", authUser.id);
    }
    set({ user: { ...user, ...data } });
  },
}));
