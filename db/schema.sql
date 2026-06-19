-- Run this once in Supabase: SQL Editor -> paste -> Run.
create table if not exists public.inquiries (
  id          bigserial primary key,
  type        text not null default 'tour',   -- tour | fees | contact
  name        text not null,
  phone       text not null,
  email       text,
  child_age   text,
  message     text,
  source      text default 'website',
  created_at  timestamptz not null default now()
);

-- Lock down: only the service key (used by the server function) can write/read.
alter table public.inquiries enable row level security;
-- No public policies = anon/browser cannot read or write directly. Admins view via the
-- Supabase dashboard (Table editor), which bypasses RLS. That's your secure admin panel.
