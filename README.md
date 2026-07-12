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

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Customer | `user@ananya.com` | `123456` |
| Admin | `admin@ananya.com` | `admin123` |

You can also register a new customer account — it's stored in `localStorage`.

### Sample serviceable pincodes
`110001`, `400001`, `560001`, `700001`, `600001`, `201301`, `500001`, `411001`

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
