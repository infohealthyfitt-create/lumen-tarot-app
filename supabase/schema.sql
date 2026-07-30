-- ============================================================
-- LumenTarot — Database Schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- Then run policies.sql to enable Row Level Security.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- profiles: 1:1 with auth.users, holds public-facing profile data
-- ------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  preferred_language text default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- tarot_cards: the 78-card deck, editable from a future admin dashboard.
-- The app also ships a bundled JSON copy (src/lib/tarot/deck-data.json)
-- so it keeps working with zero external services; this table lets an
-- admin edit meanings without a redeploy once wired up.
-- ------------------------------------------------------------
create table if not exists tarot_cards (
  id serial primary key,
  name text not null,
  slug text not null unique,
  arcana text not null check (arcana in ('major', 'minor')),
  number int not null,
  suit text check (suit in ('Wands', 'Cups', 'Swords', 'Pentacles') or suit is null),
  upright_keywords text[] not null default '{}',
  reversed_keywords text[] not null default '{}',
  upright_meaning text not null,
  reversed_meaning text not null,
  love_meaning text not null,
  career_meaning text not null,
  money_meaning text not null,
  general_meaning text not null,
  yes_no_tendency text not null check (yes_no_tendency in ('yes','leaning yes','unclear','leaning no','no')),
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_tarot_cards_slug on tarot_cards(slug);

-- ------------------------------------------------------------
-- readings: a completed reading (free or premium)
-- ------------------------------------------------------------
create table if not exists readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade, -- null for anonymous
  anonymous_session_id text, -- set when user_id is null
  category text not null,
  question text,
  spread_type text not null default 'three-card', -- 'three-card' | 'seven-card' | 'yes-no' | 'daily'
  overall_reading text,
  is_premium boolean not null default false,
  payment_id uuid, -- fk added below, after payments table exists
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_readings_user on readings(user_id);
create index if not exists idx_readings_created on readings(created_at desc);

-- ------------------------------------------------------------
-- reading_cards: individual cards within a reading, with position + orientation
-- ------------------------------------------------------------
create table if not exists reading_cards (
  id uuid primary key default gen_random_uuid(),
  reading_id uuid not null references readings(id) on delete cascade,
  card_id int not null references tarot_cards(id),
  position int not null,
  orientation text not null check (orientation in ('upright','reversed')),
  interpretation text,
  created_at timestamptz not null default now()
);
create index if not exists idx_reading_cards_reading on reading_cards(reading_id);

-- ------------------------------------------------------------
-- daily_cards: one row per user (or anonymous id) per calendar day
-- ------------------------------------------------------------
create table if not exists daily_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  anonymous_session_id text,
  card_id int not null references tarot_cards(id),
  orientation text not null check (orientation in ('upright','reversed')),
  draw_date date not null,
  created_at timestamptz not null default now(),
  unique (user_id, draw_date),
  unique (anonymous_session_id, draw_date)
);
create index if not exists idx_daily_cards_user_date on daily_cards(user_id, draw_date);

-- ------------------------------------------------------------
-- user_streaks: rolled-up streak counters per user
-- ------------------------------------------------------------
create table if not exists user_streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_draw_date date,
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- journal_entries: private notes attached to a reading
-- ------------------------------------------------------------
create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  reading_id uuid not null references readings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  journal_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_journal_user on journal_entries(user_id);

-- ------------------------------------------------------------
-- products: premium reading products, editable from admin (see also
-- src/lib/payments/products.ts, the current single source of truth used
-- by the app until an admin UI writes to this table instead).
-- ------------------------------------------------------------
create table if not exists products (
  id text primary key, -- matches Stripe Price ID / src/lib/payments/products.ts id
  name text not null,
  description text,
  price_usd_cents int not null,
  currency text not null default 'usd',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- payments: verified payment records, written only by the Stripe webhook
-- handler using the service-role key. Never trust a client-reported status.
-- ------------------------------------------------------------
create table if not exists payments (
  payment_id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  provider text not null default 'stripe',
  product_id text references products(id),
  amount int not null,
  currency text not null default 'usd',
  status text not null check (status in ('pending','succeeded','failed','refunded')),
  provider_reference text not null unique, -- idempotency key (e.g. Stripe Checkout Session ID)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_payments_user on payments(user_id);

alter table readings
  add constraint fk_readings_payment
  foreign key (payment_id) references payments(payment_id) on delete set null;

-- updated_at auto-touch trigger, reused across tables
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  t text;
begin
  foreach t in array array['profiles','tarot_cards','readings','journal_entries','products','payments']
  loop
    execute format('drop trigger if exists trg_set_updated_at on %I;', t);
    execute format('create trigger trg_set_updated_at before update on %I for each row execute function set_updated_at();', t);
  end loop;
end $$;
