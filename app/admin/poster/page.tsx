"use client";

import { storeConfig } from "@/lib/data";

const SITE_URL = "https://ananya-general-store.vercel.app";

export default function PosterPage() {
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(SITE_URL)}`;

  return (
    <div className="max-w-lg mx-auto py-10 px-6 print:p-0 text-center">
      <div className="border-4 border-saffron-500 rounded-3xl p-8 print:border-2">
        <div className="w-14 h-14 rounded-full bg-saffron-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
          A
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">{storeConfig.storeName}</h1>
        <p className="text-saffron-600 font-semibold mt-1">Groceries delivered in {storeConfig.deliveryMinutes}!</p>
        <p className="text-sm text-gray-500 mt-1">Exclusively for {storeConfig.societyName}, {storeConfig.societyArea}</p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrImageUrl}
          alt="Scan to order"
          className="w-56 h-56 mx-auto my-6"
        />

        <p className="font-bold text-lg">📱 Scan to order now!</p>
        <p className="text-sm text-gray-500 mt-1 break-all">{SITE_URL}</p>

        <div className="mt-6 pt-4 border-t border-dashed border-gray-300 text-xs text-gray-400">
          Fresh groceries • Great prices • Right to your door
        </div>
      </div>

      <button
        onClick={() => window.print()}
        className="print:hidden btn-primary w-full py-3 mt-6"
      >
        Print Poster
      </button>
    </div>
  );
}