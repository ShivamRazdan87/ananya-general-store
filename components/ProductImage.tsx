"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

type ProductImageProps = Omit<ImageProps, "src"> & { src: string };

// Simple neutral placeholder (a shopping bag icon on a light gray
// background) shown whenever a product photo URL fails to load — e.g. a
// stock photo host removed the image, or a link was mistyped. Encoded as
// inline SVG so it never depends on an external request that could itself
// fail.
const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#f3f4f6"/>
      <g transform="translate(70,60)" fill="none" stroke="#9ca3af" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 24 L54 24 L50 76 L10 76 Z"/>
        <path d="M18 24 V14 a12 12 0 0 1 24 0 V24"/>
      </g>
    </svg>`
  );

// next/image can't optimize data: URLs (used as a fallback when a shop
// owner uploads a photo before Supabase Storage is configured, or when a
// remote photo URL has failed to load). This component falls back to a
// plain <img> tag in that case, and uses the normal optimized next/image
// for everything else.
export default function ProductImage({ src, alt, className, fill, sizes, ...rest }: ProductImageProps) {
  const [errored, setErrored] = useState(false);
  const effectiveSrc = errored ? FALLBACK_IMAGE : src;

  if (effectiveSrc.startsWith("data:")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={effectiveSrc} alt={alt} className={`${className || ""} ${fill ? "absolute inset-0 w-full h-full object-cover" : ""}`} />;
  }
  return (
    <Image
      src={effectiveSrc}
      alt={alt}
      className={className}
      fill={fill}
      sizes={sizes}
      onError={() => setErrored(true)}
      {...rest}
    />
  );
}
