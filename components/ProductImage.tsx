"use client";

import Image, { ImageProps } from "next/image";

type ProductImageProps = Omit<ImageProps, "src"> & { src: string };

// next/image can't optimize data: URLs (used as a fallback when a shop
// owner uploads a photo before Supabase Storage is configured). This
// component falls back to a plain <img> tag in that case, and uses the
// normal optimized next/image for everything else.
export default function ProductImage({ src, alt, className, fill, sizes, ...rest }: ProductImageProps) {
  if (src.startsWith("data:")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={`${className || ""} ${fill ? "absolute inset-0 w-full h-full object-cover" : ""}`} />;
  }
  return <Image src={src} alt={alt} className={className} fill={fill} sizes={sizes} {...rest} />;
}
