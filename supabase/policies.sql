-- ============================================================
-- LumenTarot — Row Level Security Policies
-- Run AFTER schema.sql. Enables RLS and locks every table down so a user
-- can only ever read/write their own private data. Public reference data
-- (tarot_cards, products) is public-read, write-restricted to the
-- service role (used by a future admin dashboard).
-- ============================================================

-- ------------------------------------------------------------
-- profiles
-- ------------------------------------------------------------
alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert with check (auth.uid() = id);

-- ------------------------------------------------------------
-- tarot_cards: public read-only reference data
-- ------------------------------------------------------------
alter table tarot_cards enable row level security;

create policy "Anyone can read tarot cards"
  on tarot_cards for select using (true);
-- No insert/update/delete policy is defined for regular users — only the
-- service-role key (used server-side by a future admin dashboard) bypasses
-- RLS entirely, so card meanings cannot be edited by end users.

-- ------------------------------------------------------------
-- readings: private to the owning user; anonymous readings are not
-- readable via the client at all (they're only written/read by anonymous
-- session id from server-side code, never queried directly by other users)
-- ------------------------------------------------------------
alter table readings enable row level security;

create policy "Users can view their own readings"
  on readings for select using (auth.uid() = user_id);

create policy "Users can insert their own readings"
  on readings for insert with check (auth.uid() = user_id or user_id is null);

create policy "Users can update their own readings"
  on readings for update using (auth.uid() = user_id);

create policy "Users can delete their own readings"
  on readings for delete using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- reading_cards: visible only if the parent reading belongs to the user
-- ------------------------------------------------------------
alter table reading_cards enable row level security;

create policy "Users can view cards from their own readings"
  on reading_cards for select using (
    exists (
      select 1 from readings r
      where r.id = reading_cards.reading_id
        and r.user_id = auth.uid()
    )
  );

create policy "Users can insert cards into their own readings"
  on reading_cards for insert with check (
    exists (
      select 1 from readings r
      where r.id = reading_cards.reading_id
        and (r.user_id = auth.uid() or r.user_id is null)
    )
  );

-- ------------------------------------------------------------
-- daily_cards: private per user
-- ------------------------------------------------------------
alter table daily_cards enable row level security;

create policy "Users can view their own daily cards"
  on daily_cards for select using (auth.uid() = user_id);

create policy "Users can insert their own daily cards"
  on daily_cards for insert with check (auth.uid() = user_id or user_id is null);

-- ------------------------------------------------------------
-- user_streaks: private per user
-- ------------------------------------------------------------
alter table user_streaks enable row level security;

create policy "Users can view their own streak"
  on user_streaks for select using (auth.uid() = user_id);

create policy "Users can update their own streak"
  on user_streaks for update using (auth.uid() = user_id);

create policy "Users can insert their own streak"
  on user_streaks for insert with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- journal_entries: strictly private — never visible to any other user
-- ------------------------------------------------------------
alter table journal_entries enable row level security;

create policy "Users can view their own journal entries"
  on journal_entries for select using (auth.uid() = user_id);

create policy "Users can insert their own journal entries"
  on journal_entries for insert with check (auth.uid() = user_id);

create policy "Users can update their own journal entries"
  on journal_entries for update using (auth.uid() = user_id);

create policy "Users can delete their own journal entries"
  on journal_entries for delete using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- products: public read-only reference data
-- ------------------------------------------------------------
alter table products enable row level security;

create policy "Anyone can read active products"
  on products for select using (is_active = true);

-- ------------------------------------------------------------
-- payments: private per user; INSERT/UPDATE only ever happens via the
-- service-role key from the Stripe webhook handler (service role bypasses
-- RLS, so no insert/update policy is granted to regular users at all).
-- ------------------------------------------------------------
alter table payments enable row level security;

create policy "Users can view their own payments"
  on payments for select using (auth.uid() = user_id);
