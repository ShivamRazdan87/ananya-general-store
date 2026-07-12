import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// If env vars aren't set yet, the app still works using localStorage only
// (per-browser data). Once you add real Supabase credentials as environment
// variables, product & order data automatically syncs for every visitor.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

// Uploads a product photo (e.g. taken directly on the shop owner's phone)
// to Supabase Storage and returns a public URL. Falls back to converting
// the image to a compact base64 string if Supabase isn't configured yet,
// so photo upload still works even before the backend is set up.
export async function uploadProductImage(file: File): Promise<string> {
  if (isSupabaseConfigured) {
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `product-${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) {
      console.error("Image upload failed, falling back to local:", error.message);
      return fileToDataUrl(file);
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return data.publicUrl;
  }
  return fileToDataUrl(file);
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}