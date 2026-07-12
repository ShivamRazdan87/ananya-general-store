# 🛒 Ananya General Store

A complete, production-ready multi-page e-commerce website for a modern Indian
general store / kirana store — built with **Next.js 14 (App Router)**,
**TypeScript**, **Tailwind CSS**, and **Zustand**.

Focus areas: an excellent 30-45 minute delivery experience, full shopping
cart & wishlist functionality, a Razorpay-style payment simulation, and a
complete admin panel with analytics.

---

## ✨ Features

- **Home** — hero, pincode delivery checker, categories, featured products & deals
- **Shop** (`/shop`) — search, category filters, price filter, sorting
- **Product details** (`/product/[id]`) — gallery, ratings, related products
- **Wishlist** (`/wishlist`) — heart-icon add/remove, persisted
- **Cart** (`/cart`) — add/update/remove, free delivery threshold
- **Checkout** (`/checkout`) — address management, delivery slot picker, Razorpay-style payment modal (UPI/QR, Card, Wallets, COD)
- **Order tracking** (`/track/[id]`) — animated progress bar
- **Account** (`/account`) — fake auth, profile, order history, saved addresses
- **Admin Panel** (`/admin`) — password protected, dashboard stats, revenue & status charts (Recharts), order status management, full product CRUD
- **About / Contact** pages
- Toast notifications (sonner), floating WhatsApp button, fully responsive, warm Indian saffron/green/yellow theme

---

## 🏘️ Single-Society Store Setup

This build is configured for **Ananya General Store**, delivering exclusively
within **Parsvnath Edens, Alpha-2, Greater Noida**, with **10-minute delivery**.

To change the store name, society, or WhatsApp number, edit `lib/data.ts`:

```ts
export const storeConfig = {
  storeName: "Ananya General Store",
  ownerWhatsApp: "919958882260", // digits only, country code first, no + or spaces
  societyName: "Parsvnath Edens",
  societyArea: "Alpha-2, Greater Noida",
  deliveryMinutes: "10 mins",
};
```

## 📲 WhatsApp Order Alerts

After a customer's order is confirmed, the order confirmation page shows a
**"Confirm order with shop on WhatsApp"** button. Tapping it opens WhatsApp
with a pre-filled message (order ID, items, total, delivery address) addressed
to `storeConfig.ownerWhatsApp` — so the shop owner gets notified instantly with
zero backend needed. This works today, with no further setup.

## 🗄️ Real Shared Backend (Supabase) — Recommended for real use

By default, this app stores products/orders in each visitor's own browser
(localStorage) — fine for a demo, but for a real store, **the owner needs to
see every customer's orders**, and every customer needs to see the same
product catalog. Follow these steps to enable real, shared data:

### 1. Create a free Supabase project
Go to **https://supabase.com** → Sign up → "New Project". Pick any name/region,
set a database password, and wait ~2 minutes for it to provision.

### 2. Run the database schema
In your Supabase project → **SQL Editor** → **New Query** → paste the entire
contents of `supabase-schema.sql` (included in this project) → click **Run**.
This creates the `products` and `orders` tables.

### 3. Get your API credentials
In Supabase → **Project Settings** → **API**, copy:
- **Project URL**
- **anon public** key

### 4. Add them as environment variables

**Locally**, create a file named `.env.local` in the project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**On Vercel** (for your live site): go to your Vercel project → **Settings** →
**Environment Variables** → add both `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` with the same values → **Save** → then
**redeploy** (Deployments tab → "..." → Redeploy) so the live site picks them up.

### That's it
Once those env vars are set, the app automatically:
- Loads the shared product catalog from Supabase (and seeds it with the
  starter catalog the very first time, if the table is empty)
- Saves every order to Supabase, so the Admin panel shows **every customer's
  order**, not just orders placed in one browser
- Products added/edited/deleted in the Admin panel sync for all visitors

If these env vars are **not** set, the app still works exactly as before
(local-only demo mode) — nothing breaks either way.

---



| Role | Email | Password |
|------|-------|----------|
| Customer | `user@ananya.com` | `123456` |
| Admin | `admin@ananya.com` | `admin123` |

You can also register a new customer account — it's stored in `localStorage`.

### Delivery zone
This store now serves a single society only: **Parsvnath Edens, Alpha-2, Greater Noida**.
See "Single-Society Store Setup" below to change this.

---

## 🧰 Tech Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS
- Zustand (with `persist` middleware → localStorage) for cart, wishlist, auth, orders, products
- lucide-react icons
- sonner (toasts)
- recharts (admin analytics)

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
ananya-general-store/
├── app/
│   ├── page.tsx                # Home
│   ├── layout.tsx               # Root layout (Navbar, Footer, Toaster)
│   ├── globals.css
│   ├── shop/page.tsx            # Product listing + filters
│   ├── product/[id]/page.tsx    # Product detail
│   ├── wishlist/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── order-success/page.tsx
│   ├── track/[id]/page.tsx      # Order tracking
│   ├── account/page.tsx         # Auth + profile + orders + addresses
│   ├── admin/page.tsx           # Admin dashboard
│   ├── about/page.tsx
│   └── contact/page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── PaymentModal.tsx         # Razorpay-style payment simulation
│   └── WhatsAppButton.tsx
├── store/                       # Zustand stores (persisted to localStorage)
│   ├── useCartStore.ts
│   ├── useWishlistStore.ts
│   ├── useAuthStore.ts
│   ├── useOrderStore.ts
│   └── useProductStore.ts
├── lib/
│   └── data.ts                  # Product catalog, categories, pincode data, delivery slots
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## 💳 Payment Simulation

The checkout flow opens a Razorpay-style modal (`components/PaymentModal.tsx`)
supporting:
- **UPI** — fake QR code + UPI ID field
- **Credit/Debit Card** — card number, expiry, CVV inputs
- **Wallets** — Paytm, Amazon Pay, Mobikwik
- **Cash on Delivery**

On "Pay", a loading animation simulates payment processing (~2s), followed by
a success screen, then redirects to the order confirmation page. No real
payment gateway is integrated — this is a **UI/UX simulation only**.

---

## 🗃️ Data Persistence

All state (cart, wishlist, auth session, orders, product catalog edits) is
persisted using Zustand's `persist` middleware, backed by `localStorage`.
This means:
- Cart/wishlist survive page refreshes
- Orders placed during checkout appear in Account → Order History and Admin → Orders
- Products added/edited in the Admin Panel are reflected across the whole site

Since there's no real backend, data is scoped to your browser only.

---

## 📝 Notes

- This project uses fake/simulated authentication and payments for demo purposes — do **not** use this code as-is for a real production store handling real payments or user data.
- Product images are sourced from Unsplash for demo purposes.

---

Made with ❤️ for Indian kirana stores going digital.
