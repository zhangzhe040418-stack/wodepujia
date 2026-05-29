-- 我的谱夹 Supabase schema
-- 运行位置：Supabase Dashboard -> SQL Editor

create extension if not exists pgcrypto;

create table if not exists public.folders (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  normalized_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.scores (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  folder_id uuid references public.folders(id) on delete set null,
  name text not null,
  normalized_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.score_pages (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  score_id uuid not null references public.scores(id) on delete cascade,
  page_index integer not null default 0,
  name text not null,
  type text not null default 'image/jpeg',
  size bigint not null default 0,
  storage_path text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.share_batches (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  code text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.share_items (
  share_id uuid not null references public.share_batches(id) on delete cascade,
  score_id uuid not null references public.scores(id) on delete cascade,
  primary key (share_id, score_id)
);

create index if not exists folders_user_id_idx on public.folders(user_id);
create index if not exists scores_user_id_idx on public.scores(user_id);
create index if not exists scores_folder_id_idx on public.scores(folder_id);
create index if not exists score_pages_score_id_idx on public.score_pages(score_id);
create index if not exists share_batches_code_idx on public.share_batches(code);

alter table public.folders enable row level security;
alter table public.scores enable row level security;
alter table public.score_pages enable row level security;
alter table public.share_batches enable row level security;
alter table public.share_items enable row level security;

drop policy if exists "folders owner access" on public.folders;
create policy "folders owner access" on public.folders
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "scores owner or shared select" on public.scores;
create policy "scores owner or shared select" on public.scores
for select using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.share_items si
    join public.share_batches sb on sb.id = si.share_id
    where si.score_id = scores.id
  )
);

drop policy if exists "scores owner insert" on public.scores;
create policy "scores owner insert" on public.scores
for insert
with check (auth.uid() = user_id);

drop policy if exists "scores owner update" on public.scores;
create policy "scores owner update" on public.scores
for update using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "scores owner delete" on public.scores;
create policy "scores owner delete" on public.scores
for delete using (auth.uid() = user_id);

drop policy if exists "score pages owner or shared access" on public.score_pages;
create policy "score pages owner or shared access" on public.score_pages
for select using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.share_items si
    where si.score_id = score_pages.score_id
  )
);

drop policy if exists "score pages owner write" on public.score_pages;
create policy "score pages owner write" on public.score_pages
for insert with check (auth.uid() = user_id);

drop policy if exists "score pages owner update" on public.score_pages;
create policy "score pages owner update" on public.score_pages
for update using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "score pages owner delete" on public.score_pages;
create policy "score pages owner delete" on public.score_pages
for delete using (auth.uid() = user_id);

drop policy if exists "share batches owner insert" on public.share_batches;
create policy "share batches owner insert" on public.share_batches
for insert with check (auth.uid() = owner_id);

drop policy if exists "share batches readable by code" on public.share_batches;
create policy "share batches readable by code" on public.share_batches
for select using (auth.role() = 'authenticated');

drop policy if exists "share items owner insert" on public.share_items;
create policy "share items owner insert" on public.share_items
for insert with check (
  exists (
    select 1
    from public.share_batches sb
    where sb.id = share_items.share_id
      and sb.owner_id = auth.uid()
  )
);

drop policy if exists "share items readable" on public.share_items;
create policy "share items readable" on public.share_items
for select using (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('score-pages', 'score-pages', false)
on conflict (id) do nothing;

drop policy if exists "score page files owner write" on storage.objects;
create policy "score page files owner write" on storage.objects
for insert with check (
  bucket_id = 'score-pages'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "score page files owner update" on storage.objects;
create policy "score page files owner update" on storage.objects
for update using (
  bucket_id = 'score-pages'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'score-pages'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "score page files owner or shared read" on storage.objects;
create policy "score page files owner or shared read" on storage.objects
for select using (
  bucket_id = 'score-pages'
  and (
    auth.uid()::text = (storage.foldername(name))[1]
    or exists (
      select 1
      from public.score_pages sp
      join public.share_items si on si.score_id = sp.score_id
      where sp.storage_path = storage.objects.name
    )
  )
);

drop policy if exists "score page files owner delete" on storage.objects;
create policy "score page files owner delete" on storage.objects
for delete using (
  bucket_id = 'score-pages'
  and auth.uid()::text = (storage.foldername(name))[1]
);
