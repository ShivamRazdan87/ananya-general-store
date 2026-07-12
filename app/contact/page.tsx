"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="container-x py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">Get in Touch</h1>
        <p className="text-gray-500 mt-2">We'd love to hear from you. Reach out anytime!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        <div className="space-y-5">
          {[
            { icon: Phone, title: "Call Us", desc: "+91 99588 82260", sub: "Mon-Sun, 8 AM - 11 PM" },
            { icon: Mail, title: "Email Us", desc: "support@ananyastore.in", sub: "We reply within 24 hours" },
            { icon: MapPin, title: "Visit Us", desc: "Parsvnath Edens, Alpha-2, Greater Noida", sub: "Our flagship store" },
            { icon: Clock, title: "Delivery Hours", desc: "8:00 AM - 11:00 PM", sub: "10 minutes delivery" },
          ].map((item, i) => (
            <div key={i} className="card p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-saffron-100 flex items-center justify-center shrink-0">
                <item.icon size={20} className="text-saffron-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-sm text-gray-700">{item.desc}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4 h-fit">
          <h3 className="font-bold text-lg mb-1">Send us a message</h3>
          <input
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-saffron-400"
          />
          <input
            placeholder="Your Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-saffron-400"
          />
          <textarea
            placeholder="Your Message"
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-saffron-400"
          />
          <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            <Send size={16} /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
