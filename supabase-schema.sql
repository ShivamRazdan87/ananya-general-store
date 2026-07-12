-- Run this entire file in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New Query → paste this → Run)

-- PRODUCTS TABLE
create table if not exists products (
  id text primary key,
  name text not null,
  category text not null,
  sub_category text,
  brand text,
  price numeric not null,
  mrp numeric not null,
  unit text,
  image text,
  rating numeric default 4.0,
  review_count integer default 0,
  stock integer default 0,
  description text,
  tags text[] default '{}',
  is_veg boolean default true,
  created_at timestamptz default now()
);

-- ORDERS TABLE
create table if not exists orders (
  id text primary key,
  items jsonb not null default '[]',
  subtotal numeric not null,
  delivery_fee numeric not null default 0,
  total numeric not null,
  status text not null default 'Confirmed',
  payment_method text,
  address text,
  pincode text,
  delivery_slot text,
  customer_email text,
  customer_name text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table products enable row level security;
alter table orders enable row level security;

-- Allow public read/write access.
-- This is a small single-society store with no server-side auth system, so
-- we keep this simple and open. If you outgrow this, you can tighten these
-- policies later (e.g. require a signed-in role for writes).
create policy "Public can read products" on products for select using (true);
create policy "Public can insert products" on products for insert with check (true);
create policy "Public can update products" on products for update using (true);
create policy "Public can delete products" on products for delete using (true);

create policy "Public can read orders" on orders for select using (true);
create policy "Public can insert orders" on orders for insert with check (true);
create policy "Public can update orders" on orders for update using (true);
