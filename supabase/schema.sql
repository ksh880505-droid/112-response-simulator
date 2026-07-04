create table if not exists public.training_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario_id text not null,
  scenario_title text not null,
  total_score integer not null,
  grade text not null,
  scores jsonb not null,
  normalized_scores jsonb not null,
  choice_history jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.training_results enable row level security;

create policy "Users can read own training results"
  on public.training_results
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own training results"
  on public.training_results
  for insert
  with check (auth.uid() = user_id);
