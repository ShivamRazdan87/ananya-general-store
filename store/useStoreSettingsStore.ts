"use client";

import { create } from "zustand";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface StoreSettingsState {
  isOpen: boolean;
  loaded: boolean;
  fetchSettings: () => Promise<void>;
  setOpen: (isOpen: boolean) => Promise<void>;
}

export const useStoreSettingsStore = create<StoreSettingsState>((set) => ({
  isOpen: true,
  loaded: false,
  fetchSettings: async () => {
    if (!isSupabaseConfigured) {
      set({ loaded: true });
      return;
    }
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .eq("id", "main")
      .maybeSingle();
    if (!error && data) {
      set({ isOpen: data.is_open, loaded: true });
    } else {
      set({ loaded: true });
    }
  },
  setOpen: async (isOpen) => {
    set({ isOpen });
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from("store_settings")
        .upsert({ id: "main", is_open: isOpen, updated_at: new Date().toISOString() });
      if (error) throw new Error(error.message);
    }
  },
}));