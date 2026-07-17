"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919910428488?text=Hi%20Ananya%20General%20Store%2C%20I%20need%20help%20with%20my%20order."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1ebe5b] text-white rounded-full p-4 shadow-2xl transition-transform hover:scale-110 animate-bounce-slow print:hidden"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} fill="white" className="text-[#25D366]" />
    </a>
  );
}
