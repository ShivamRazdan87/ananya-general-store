"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  IndianRupee,
  TrendingUp,
  Plus,
  Trash2,
  Edit,
  X,
  Camera,
  Image as ImageIcon,
  Sun,
  PackageX,
  PackageCheck,
  Download,
  Printer,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import clsx from "clsx";
import { useOrderStore, OrderStatus } from "@/store/useOrderStore";
import { uploadProductImage } from "@/lib/supabase";
import { useProductStore } from "@/store/useProductStore";
import { useStoreSettingsStore } from "@/store/useStoreSettingsStore";
import { Product, categories } from "@/lib/data";
import { toast } from "sonner";

const ADMIN_EMAIL = "admin@ananya.com";
const LOW_STOCK_THRESHOLD = 5;
const ADMIN_PASSWORD = "admin123";

const statusOptions: OrderStatus[] = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];
const statusColors: Record<OrderStatus, string> = {
  Pending: "bg-haldi-100 text-haldi-800",
  Confirmed: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-leaf-100 text-leaf-700",
  Cancelled: "bg-red-100 text-red-700",
};
const PIE_COLORS = ["#f9ab06", "#349540", "#8b5cf6", "#3b82f6", "#ef4444"];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"dashboard" | "orders" | "products">("dashboard");

  const { orders, updateStatus, fetchOrders } = useOrderStore();
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { isOpen: isStoreOpen, setOpen: setStoreOpen } = useStoreSettingsStore();
  const knownOrderIdsRef = useRef<Set<string> | null>(null);

  const handleToggleStoreOpen = async () => {
    try {
      await setStoreOpen(!isStoreOpen);
      toast.success(isStoreOpen ? "Store marked as closed" : "Store marked as open");
    } catch (err: any) {
      toast.error(`Couldn't update store status: ${err?.message || "try again"}`);
    }
  };

  const handleExportCsv = () => {
    const headers = ["Order ID", "Customer", "Email", "Amount", "Payment", "Status", "Address", "Date"];
    const rows = orders.map((o) => [
      o.id,
      o.customerName,
      o.customerEmail,
      o.total.toFixed(2),
      o.paymentMethod,
      o.status,
      `"${o.address.replace(/"/g, '""')}"`,
      new Date(o.createdAt).toLocaleString("en-IN"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ananya-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Orders exported");
  };

  // Watch for new orders while the admin panel is open, and alert with
  // sound + vibration (phones) so the shop owner notices right away.
  useEffect(() => {
    if (!authed) return;

    // Seed the "known orders" list once, so we only alert for orders that
    // arrive AFTER the admin panel was opened, not the existing ones.
    if (knownOrderIdsRef.current === null) {
      knownOrderIdsRef.current = new Set(orders.map((o) => o.id));
    }

    const interval = setInterval(async () => {
      await fetchOrders();
      const latestOrders = useOrderStore.getState().orders;
      const newOnes = latestOrders.filter((o) => !knownOrderIdsRef.current!.has(o.id));
      if (newOnes.length > 0) {
        newOnes.forEach((o) => knownOrderIdsRef.current!.add(o.id));
        playNewOrderAlert();
        toast.success(`🛒 New order received: ${newOnes[0].id}`);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [authed, fetchOrders]);

  const playNewOrderAlert = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      [880, 1046].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.18);
        osc.stop(ctx.currentTime + i * 0.18 + 0.35);
      });
    } catch (e) {
      // Audio not available (e.g. blocked by browser) — silently skip
    }
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setAuthed(true);
      toast.success("Welcome back, Admin!");
    } else {
      toast.error("Invalid admin credentials");
    }
  };

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
    const pendingOrders = orders.filter((o) => o.status === "Pending").length;

    const todayStr = new Date().toDateString();
    const todaysOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === todayStr);
    const todaysRevenue = todaysOrders.reduce((s, o) => s + o.total, 0);

    const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      pendingOrders,
      todaysOrderCount: todaysOrders.length,
      todaysRevenue,
      lowStockCount,
    };
  }, [orders, products]);

  const revenueByDay = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
      const day = new Date(o.createdAt).toLocaleDateString("en-IN", { weekday: "short" });
      map[day] = (map[day] || 0) + o.total;
    });
    return Object.entries(map).map(([day, revenue]) => ({ day, revenue }));
  }, [orders]);

  const statusDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
      map[o.status] = (map[o.status] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  if (!authed) {
    return (
      <div className="container-x py-20 flex justify-center">
        <div className="card p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold text-center mb-1">Admin Login</h1>
          <p className="text-sm text-gray-400 text-center mb-6">Ananya General Store Admin Panel</p>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              required
              type="email"
              placeholder="Admin Email"
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
            <button type="submit" className="btn-primary w-full py-3">
              Login to Admin Panel
            </button>
          </form>
          <p className="text-xs text-gray-400 text-center mt-4">
            Demo: admin@ananya.com / admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => setAuthed(false)}
          className="flex items-center gap-1 text-sm text-red-500 font-medium"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "orders", label: "Orders", icon: ShoppingBag },
          { id: "products", label: "Products", icon: Package },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition",
              tab === t.id ? "border-saffron-500 text-saffron-600" : "border-transparent text-gray-400"
            )}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <div>
          <div className="card p-5 mb-6 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-bold">Store Status</h3>
              <p className="text-sm text-gray-500">
                {isStoreOpen ? "You're open and accepting orders." : "Ordering is paused — customers can browse but can't check out."}
              </p>
            </div>
            <button
              onClick={handleToggleStoreOpen}
              className={clsx(
                "px-5 py-2.5 rounded-xl font-semibold text-sm transition",
                isStoreOpen ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-leaf-100 text-leaf-700 hover:bg-leaf-200"
              )}
            >
              {isStoreOpen ? "Close Store" : "Open Store"}
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <a
              href="/admin/poster"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-saffron-600 flex items-center gap-1"
            >
              🖨️ Print QR poster for your society noticeboard →
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <StatCard icon={Sun} label="Today's Orders" value={stats.todaysOrderCount.toString()} color="saffron" />
            <StatCard icon={IndianRupee} label="Today's Revenue" value={`₹${stats.todaysRevenue.toFixed(0)}`} color="leaf" />
            <StatCard icon={Package} label="Pending Orders" value={stats.pendingOrders.toString()} color="red" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={IndianRupee} label="Total Revenue (all-time)" value={`₹${stats.totalRevenue.toFixed(0)}`} color="saffron" />
            <StatCard icon={ShoppingBag} label="Total Orders (all-time)" value={stats.totalOrders.toString()} color="leaf" />
            <StatCard icon={TrendingUp} label="Avg. Order Value" value={`₹${stats.avgOrderValue.toFixed(0)}`} color="haldi" />
            <StatCard icon={PackageX} label="Low Stock Items" value={stats.lowStockCount.toString()} color="red" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-5">
              <h3 className="font-bold mb-4">Revenue Overview</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#ff7e12" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-5">
              <h3 className="font-bold mb-4">Order Status Distribution</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {statusDistribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div>
          <div className="flex justify-end mb-3">
            <button onClick={handleExportCsv} className="btn-secondary text-sm px-4 py-2 flex items-center gap-1">
              <Download size={15} /> Export CSV
            </button>
          </div>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left p-3">Order ID</th>
                  <th className="text-left p-3">Customer</th>
                  <th className="text-left p-3">Amount</th>
                  <th className="text-left p-3">Payment</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Slip</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-100">
                    <td className="p-3 font-semibold">{order.id}</td>
                    <td className="p-3">{order.customerName}</td>
                    <td className="p-3">₹{order.total.toFixed(2)}</td>
                    <td className="p-3">{order.paymentMethod}</td>
                    <td className="p-3">
                      <select
                        value={order.status}
                        onChange={(e) => {
                          updateStatus(order.id, e.target.value as OrderStatus);
                          toast.success(`Order ${order.id} updated to ${e.target.value}`);
                        }}
                        className={clsx(
                          "text-xs font-semibold px-2 py-1 rounded-full border-0 outline-none cursor-pointer",
                          statusColors[order.status]
                        )}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="p-3">
                      <a
                        href={`/admin/print/${order.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                        title="Print order slip"
                      >
                        <Printer size={16} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "products" && (
        <ProductsManager
          products={products}
          addProduct={addProduct}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
        />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    saffron: "bg-saffron-100 text-saffron-600",
    leaf: "bg-leaf-100 text-leaf-600",
    haldi: "bg-haldi-100 text-haldi-700",
    red: "bg-red-100 text-red-600",
  };
  return (
    <div className="card p-4">
      <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center mb-3", colorMap[color])}>
        <Icon size={18} />
      </div>
      <p className="text-xl font-extrabold">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

function ProductsManager({
  products,
  addProduct,
  updateProduct,
  deleteProduct,
}: {
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const lastStockRef = useRef<Record<string, number>>({});
  const [form, setForm] = useState({
    name: "", category: categories[0].id, brand: "", price: "", mrp: "", unit: "", stock: "", image: "",
  });

  const resetForm = () => {
    setForm({ name: "", category: categories[0].id, brand: "", price: "", mrp: "", unit: "", stock: "", image: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setForm((f) => ({ ...f, image: url }));
      toast.success("Photo added");
    } catch (err: any) {
      toast.error(`Couldn't upload photo: ${err?.message || "try again"}`);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast.error("Please fill required fields");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateProduct(editingId, {
          name: form.name,
          category: form.category,
          brand: form.brand,
          price: Number(form.price),
          mrp: Number(form.mrp) || Number(form.price),
          unit: form.unit,
          stock: Number(form.stock),
          image: form.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
        });
        toast.success("Product updated for everyone");
      } else {
        await addProduct({
          id: `p-${Date.now()}`,
          name: form.name,
          category: form.category,
          subCategory: "General",
          brand: form.brand || "Generic",
          price: Number(form.price),
          mrp: Number(form.mrp) || Number(form.price),
          unit: form.unit || "1 pc",
          image: form.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
          rating: 4.0,
          reviewCount: 0,
          stock: Number(form.stock) || 50,
          description: `${form.name} - freshly added product.`,
          tags: [],
          isVeg: true,
        });
        toast.success("Product added for everyone");
      }
      resetForm();
    } catch (err: any) {
      toast.error(`Couldn't save — it only updated on this device. ${err?.message || "Try again."}`);
    } finally {
      setSaving(false);
    }
  };

  const toggleStock = async (p: Product) => {
    try {
      if (p.stock > 0) {
        lastStockRef.current[p.id] = p.stock;
        await updateProduct(p.id, { stock: 0 });
        toast.success(`${p.name} marked out of stock`);
      } else {
        const restored = lastStockRef.current[p.id] || 20;
        await updateProduct(p.id, { stock: restored });
        toast.success(`${p.name} marked back in stock (${restored})`);
      }
    } catch (err: any) {
      toast.error(`Couldn't sync stock change: ${err?.message || "try again"}`);
    }
  };

  const startEdit = (p: Product) => {
    setForm({
      name: p.name, category: p.category, brand: p.brand, price: p.price.toString(),
      mrp: p.mrp.toString(), unit: p.unit, stock: p.stock.toString(), image: p.image,
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">Manage Products ({products.length})</h3>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-sm px-4 py-2 flex items-center gap-1">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="card p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">{editingId ? "Edit Product" : "New Product"}</h4>
            <button onClick={resetForm}><X size={18} /></button>
          </div>

          {/* Photo upload */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
              {uploading ? (
                <span className="text-xs text-gray-400">Uploading...</span>
              ) : form.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.image} alt="Product" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={24} className="text-gray-300" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="btn-primary text-xs px-3 py-2 flex items-center gap-1 cursor-pointer w-fit">
                <Camera size={14} /> Take / Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-gray-400">
                On your phone, this opens the camera directly. On a computer, it opens a file picker.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <input placeholder="Product Name*" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="Unit (e.g. 500 g)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Price*" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="MRP" type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <button onClick={handleSave} disabled={uploading || saving} className="btn-primary text-sm px-5 py-2 mt-4 disabled:opacity-50">
            {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
          </button>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left p-3">Product</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Stock</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-gray-100">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-gray-500">{p.category}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">
                  <span
                    className={clsx(
                      "px-2 py-0.5 rounded-full text-xs font-semibold",
                      p.stock === 0
                        ? "bg-red-100 text-red-600"
                        : p.stock <= LOW_STOCK_THRESHOLD
                        ? "bg-haldi-100 text-haldi-800"
                        : "bg-leaf-100 text-leaf-700"
                    )}
                  >
                    {p.stock === 0 ? "Out of stock" : p.stock <= LOW_STOCK_THRESHOLD ? `Low: ${p.stock} left` : `${p.stock} in stock`}
                  </span>
                </td>
                <td className="p-3 flex gap-2 items-center">
                  <button
                    onClick={() => toggleStock(p)}
                    title={p.stock > 0 ? "Mark out of stock" : "Mark in stock"}
                    className={p.stock > 0 ? "text-red-500 hover:text-red-700" : "text-leaf-600 hover:text-leaf-700"}
                  >
                    {p.stock > 0 ? <PackageX size={16} /> : <PackageCheck size={16} />}
                  </button>
                  <button onClick={() => startEdit(p)} className="text-blue-500 hover:text-blue-700"><Edit size={16} /></button>
                  <button onClick={() => { deleteProduct(p.id); toast.success("Product deleted"); }} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
