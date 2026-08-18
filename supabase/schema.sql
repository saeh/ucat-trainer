-- Run this in the Supabase SQL Editor.
-- Requires the native Clerk integration: in Supabase, add Clerk as a
-- third-party auth provider (Authentication > Sign In / Providers > Clerk)
-- and enable the integration in Clerk Dashboard > Setup > Supabase.
-- The Clerk session token's "sub" claim is the Clerk user ID, available
-- in policies via auth.jwt() ->> 'sub'.

create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default auth.jwt() ->> 'sub',
  section text not null,
  total_questions integer not null,
  correct_answers integer not null,
  time_spent integer not null,
  percentage double precision not null,
  created_at timestamptz not null default now()
);

create index if not exists quiz_results_user_id_idx on public.quiz_results (user_id);

alter table public.quiz_results enable row level security;

drop policy if exists "select own results" on public.quiz_results;
create policy "select own results"
  on public.quiz_results
  for select
  to authenticated
  using ((auth.jwt() ->> 'sub') = user_id);

drop policy if exists "insert own results" on public.quiz_results;
create policy "insert own results"
  on public.quiz_results
  for insert
  to authenticated
  with check ((auth.jwt() ->> 'sub') = user_id);

drop policy if exists "delete own results" on public.quiz_results;
create policy "delete own results"
  on public.quiz_results
  for delete
  to authenticated
  using ((auth.jwt() ->> 'sub') = user_id);