"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Package,
  MapPin,
  LogOut,
  Mail,
  Phone,
  Trash2,
  Plus,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useOrderStore, OrderStatus } from "@/store/useOrderStore";
import { toast } from "sonner";
import clsx from "clsx";
import { validateSocietyAddress } from "@/lib/address";
import { sendEmailOtp, verifyEmailOtp, isValidEmail } from "@/lib/emailOtp";

const statusColors: Record<OrderStatus, string> = {
  Pending: "bg-haldi-100 text-haldi-800",
  Confirmed: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-leaf-100 text-leaf-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AccountPage() {
  const { isLoggedIn, user, logout, addAddress, removeAddress } = useAuthStore();
  const [tab, setTab] = useState<"profile" | "orders" | "addresses">("profile");
  const allOrders = useOrderStore((s) => s.orders);

  if (!isLoggedIn) {
    return <AuthForm />;
  }

  const orders = allOrders.filter((o) => o.customerEmail === user!.email);

  return (
    <div className="container-x py-8">
      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        <aside className="card p-4 h-fit">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-12 h-12 rounded-full bg-saffron-500 text-white flex items-center justify-center font-bold text-lg">
              {user?.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-sm">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
          <nav className="space-y-1">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "orders", label: "Order History", icon: Package },
              { id: "addresses", label: "Saved Addresses", icon: MapPin },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id as any)}
                className={clsx(
                  "w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition",
                  tab === item.id ? "bg-saffron-100 text-saffron-700" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <item.icon size={17} /> {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                logout();
                toast.success("Logged out successfully");
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 mt-2"
            >
              <LogOut size={17} /> Logout
            </button>
          </nav>
        </aside>

        <div>
          {tab === "profile" && (
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-5">Profile Information</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-xs text-gray-500 font-medium">Full Name</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 mt-1">
                    <User size={16} className="text-gray-400" />
                    <span className="text-sm">{user?.name}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Email</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 mt-1">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Phone</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 mt-1">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm">{user?.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div>
              <h2 className="font-bold text-lg mb-5">Order History</h2>
              {orders.length === 0 ? (
                <div className="card p-10 text-center text-gray-400">No orders yet.</div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="card p-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <p className="font-semibold text-sm">{order.id}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <span className={clsx("text-xs font-semibold px-3 py-1 rounded-full", statusColors[order.status])}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-sm text-gray-500">
                          {order.items.length || "Multiple"} item(s) · ₹{order.total.toFixed(2)}
                        </p>
                        <Link href={`/track/${order.id}`} className="text-saffron-600 text-sm font-semibold">
                          Track Order →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "addresses" && (
            <AddressesTab
              addresses={user?.addresses || []}
              addAddress={addAddress}
              removeAddress={removeAddress}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function AddressesTab({
  addresses,
  addAddress,
  removeAddress,
}: {
  addresses: any[];
  addAddress: (a: any) => void;
  removeAddress: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "Home", fullAddress: "", pincode: "" });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-lg">Saved Addresses</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm px-4 py-2 flex items-center gap-1">
          <Plus size={16} /> Add Address
        </button>
      </div>

      {showForm && (
        <div className="card p-4 mb-4 space-y-2">
          <input
            placeholder="Label (Home/Work)"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
          />
          <textarea
            placeholder="Full Address"
            value={form.fullAddress}
            onChange={(e) => setForm({ ...form, fullAddress: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
          />
          <input
            placeholder="Flat No. (e.g. T-206 or IND-025)"
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
          />
          <button
            onClick={() => {
              if (!form.fullAddress || !form.pincode) {
                toast.error("Please fill all fields");
                return;
              }
              const result = validateSocietyAddress(form.pincode);
              if (!result.valid) {
                toast.error(result.error);
                return;
              }
              addAddress({ ...form, pincode: result.formatted, isDefault: addresses.length === 0 });
              setForm({ label: "Home", fullAddress: "", pincode: "" });
              setShowForm(false);
              toast.success("Address added");
            }}
            className="btn-primary text-sm px-4 py-2"
          >
            Save
          </button>
        </div>
      )}

      <div className="space-y-3">
        {addresses.map((addr) => (
          <div key={addr.id} className="card p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{addr.label} {addr.isDefault && <span className="text-[10px] bg-leaf-100 text-leaf-700 px-2 py-0.5 rounded-full ml-1">Default</span>}</p>
              <p className="text-xs text-gray-500">{addr.fullAddress} - {addr.pincode}</p>
            </div>
            <button onClick={() => removeAddress(addr.id)} className="text-gray-400 hover:text-red-500">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {addresses.length === 0 && !showForm && (
          <div className="card p-8 text-center text-gray-400">No addresses saved yet.</div>
        )}
      </div>
    </div>
  );
}

// Real 3-step email + OTP flow, backed by Supabase's built-in email OTP:
//  1. Enter email -> "Send OTP" (Supabase sends a real 6-digit code by email)
//  2. Enter the code -> verified against Supabase, creates a real session
//  3a. If this email already has a completed profile -> logged in immediately
//  3b. If it's a new user -> ask for name + phone to finish registration
function AuthForm() {
  const checkIsNewUser = useAuthStore((s) => s.checkIsNewUser);
  const completeRegistration = useAuthStore((s) => s.completeRegistration);

  const [step, setStep] = useState<"email" | "otp" | "details">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error("Enter a valid email address");
      return;
    }
    setSending(true);
    try {
      await sendEmailOtp(email);
      toast.success("OTP sent! Check your email.");
      setStep("otp");
    } catch (err: any) {
      toast.error(err?.message || "Could not send OTP. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    try {
      await verifyEmailOtp(email, otp);
      const isNew = await checkIsNewUser();
      if (isNew) {
        setStep("details");
      } else {
        toast.success("Logged in successfully!");
      }
    } catch (err: any) {
      toast.error(err?.message || "Invalid or expired OTP. Try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await sendEmailOtp(email);
      toast.success("OTP resent! Check your email.");
    } catch (err: any) {
      toast.error(err?.message || "Could not resend OTP.");
    }
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setSubmitting(true);
    try {
      const ok = await completeRegistration(name.trim(), phone.trim());
      if (ok) toast.success("Account created successfully!");
      else toast.error("Something went wrong, please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-x py-16 flex justify-center">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-saffron-500 text-white flex items-center justify-center font-bold text-2xl mx-auto mb-3">
            A
          </div>
          <h1 className="text-xl font-bold">
            {step === "email" ? "Welcome!" : step === "otp" ? "Verify Your Email" : "Almost There"}
          </h1>
          <p className="text-sm text-gray-400">
            {step === "email"
              ? "Enter your email to log in or sign up"
              : step === "otp"
              ? `Enter the code sent to ${email}`
              : "Just a couple of details to finish setting up your account"}
          </p>
        </div>

        {step === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <input
              required
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-saffron-400"
            />
            <button type="submit" disabled={sending} className="btn-primary w-full py-3 mt-2 disabled:opacity-50">
              {sending ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <input
              required
              type="text"
              inputMode="numeric"
              maxLength={8}
              placeholder="8-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-saffron-400 tracking-widest text-center text-lg"
            />
            <button type="submit" disabled={verifying} className="btn-primary w-full py-3 mt-2 disabled:opacity-50">
              {verifying ? "Verifying..." : "Verify & Continue"}
            </button>
            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                }}
                className="hover:text-gray-700"
              >
                Change email
              </button>
              <button type="button" onClick={handleResendOtp} className="text-saffron-600 font-medium">
                Resend OTP
              </button>
            </div>
          </form>
        )}

        {step === "details" && (
          <form onSubmit={handleCompleteRegistration} className="space-y-3">
            <input
              required
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-saffron-400"
            />
            <input
              type="tel"
              placeholder="Phone Number (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-saffron-400"
            />
            <button type="submit" disabled={submitting} className="btn-primary w-full py-3 mt-2 disabled:opacity-50">
              {submitting ? "Creating..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
