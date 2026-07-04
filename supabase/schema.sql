create table if not exists public.training_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  session_id text not null,
  scenario_id text not null,
  scenario_title text not null,
  total_score integer not null,
  grade text not null,
  scores jsonb not null,
  normalized_scores jsonb not null,
  choice_history jsonb not null,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.training_results enable row level security;

alter table public.training_results
  add column if not exists user_id uuid references auth.users(id) on delete set null;

drop policy if exists "Anyone can insert training results" on public.training_results;
drop policy if exists "Authenticated users can read training results" on public.training_results;
drop policy if exists "Users can read own training results" on public.training_results;
drop policy if exists "Users can insert own training results" on public.training_results;

create policy "Anyone can insert training results"
  on public.training_results
  for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated users can read training results"
  on public.training_results
  for select
  to authenticated
  using (user_id is null or auth.uid() = user_id);
