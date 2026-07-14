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
// to Supabase Storage and returns a public URL. Photos are resized/compressed
// first, since phone camera photos are often 3-8MB — too large for a smooth
// upload, and prone to silently failing. Throws on real failure so the UI
// can show an error instead of pretending it worked.
export async function uploadProductImage(file: File): Promise<string> {
  const compressed = await compressImage(file);

  if (isSupabaseConfigured) {
    const fileName = `product-${Date.now()}.jpg`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, compressed, { cacheControl: "3600", upsert: false, contentType: "image/jpeg" });

    if (error) {
      throw new Error(`Photo upload failed: ${error.message}`);
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return data.publicUrl;
  }

  return blobToDataUrl(compressed);
}

// Resizes an image down to a max dimension and re-encodes it as a
// compact JPEG, so uploads stay small and fast regardless of the
// original phone photo's size.
function compressImage(file: File, maxDimension = 1000, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not process image"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Could not process image"));
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image file"));
    };
    img.src = objectUrl;
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
