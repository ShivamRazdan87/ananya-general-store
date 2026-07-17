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

const statusColors: Record<OrderStatus, string> = {
  Pending: "bg-haldi-100 text-haldi-800",
  Confirmed: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-leaf-100 text-leaf-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AccountPage() {
  const { isLoggedIn, user, login, register, resetPassword, logout, addAddress, removeAddress } = useAuthStore();
  const [tab, setTab] = useState<"profile" | "orders" | "addresses">("profile");
  const allOrders = useOrderStore((s) => s.orders);

  if (!isLoggedIn) {
    return <AuthForm login={login} register={register} resetPassword={resetPassword} />;
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

function AuthForm({
  login,
  register,
  resetPassword,
}: {
  login: (e: string, p: string) => boolean;
  register: (n: string, e: string, p: string, ph: string) => boolean;
  resetPassword: (e: string, p: string) => boolean;
}) {
  const [mode, setMode] = useState<"login" | "register" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      const ok = login(email, password);
      if (ok) toast.success("Logged in successfully!");
      else toast.error("Invalid credentials. Try user@ananya.com / 123456");
    } else if (mode === "register") {
      const ok = register(name, email, password, phone);
      if (ok) toast.success("Account created successfully!");
      else toast.error("Email already registered");
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetNewPassword.length < 4) {
      toast.error("Password should be at least 4 characters");
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    const ok = resetPassword(email, resetNewPassword);
    if (ok) {
      toast.success("Password updated! You can log in now.");
      setPassword("");
      setResetNewPassword("");
      setResetConfirmPassword("");
      setMode("login");
    } else {
      toast.error("We couldn't find an account with that email");
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
            {mode === "login" ? "Welcome Back!" : mode === "register" ? "Create Account" : "Reset Password"}
          </h1>
          <p className="text-sm text-gray-400">
            {mode === "login"
              ? "Login to continue shopping"
              : mode === "register"
              ? "Join Ananya General Store today"
              : "Enter your email and choose a new password"}
          </p>
        </div>

        {mode === "reset" ? (
          <form onSubmit={handleReset} className="space-y-3">
            <input
              required
              type="email"
              placeholder="Your account email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-saffron-400"
            />
            <input
              required
              type="password"
              placeholder="New password"
              value={resetNewPassword}
              onChange={(e) => setResetNewPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-saffron-400"
            />
            <input
              required
              type="password"
              placeholder="Confirm new password"
              value={resetConfirmPassword}
              onChange={(e) => setResetConfirmPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-saffron-400"
            />
            <button type="submit" className="btn-primary w-full py-3 mt-2">
              Update Password
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "register" && (
              <>
                <input
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-saffron-400"
                />
                <input
                  required
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-saffron-400"
                />
              </>
            )}
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-saffron-400"
            />
            <input
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-saffron-400"
            />
            {mode === "login" && (
              <div className="text-right -mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("reset");
                    setResetNewPassword("");
                    setResetConfirmPassword("");
                  }}
                  className="text-xs text-saffron-600 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}
            <button type="submit" className="btn-primary w-full py-3 mt-2">
              {mode === "login" ? "Login" : "Register"}
            </button>
          </form>
        )}

        {mode === "login" && (
          <p className="text-xs text-gray-400 text-center mt-3">
            Demo login: user@ananya.com / 123456
          </p>
        )}

        <p className="text-center text-sm text-gray-500 mt-5">
          {mode === "reset" ? (
            <button onClick={() => setMode("login")} className="text-saffron-600 font-semibold">
              Back to Login
            </button>
          ) : (
            <>
              {mode === "login" ? "New here?" : "Already have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-saffron-600 font-semibold"
              >
                {mode === "login" ? "Register" : "Login"}
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
