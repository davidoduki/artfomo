-- ArtFOMO Database Schema
-- Run this in your Supabase SQL Editor (https://app.supabase.com > SQL Editor)

-- 1. Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Blog posts
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_image text,
  author_id uuid references public.profiles(id) on delete set null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts enable row level security;

create policy "Published posts are viewable by everyone"
  on public.blog_posts for select using (published = true);

create policy "Admins can do everything with posts"
  on public.blog_posts for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- 3. Watchlist (user tracks artists)
create table public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  artist_slug text not null,
  created_at timestamptz not null default now(),
  unique(user_id, artist_slug)
);

alter table public.watchlist enable row level security;

create policy "Users can view own watchlist"
  on public.watchlist for select using (auth.uid() = user_id);

create policy "Users can manage own watchlist"
  on public.watchlist for all using (auth.uid() = user_id);

-- 4. Saved artists
create table public.saved_artists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  artist_slug text not null,
  created_at timestamptz not null default now(),
  unique(user_id, artist_slug)
);

alter table public.saved_artists enable row level security;

create policy "Users can view own saved artists"
  on public.saved_artists for select using (auth.uid() = user_id);

create policy "Users can manage own saved artists"
  on public.saved_artists for all using (auth.uid() = user_id);

-- 5. Updated_at trigger helper
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger update_blog_posts_updated_at
  before update on public.blog_posts
  for each row execute procedure public.update_updated_at();
