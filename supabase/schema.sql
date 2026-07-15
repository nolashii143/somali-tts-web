-- Run this in Supabase SQL Editor (https://supabase.com/dashboard)

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  title text not null default 'Somali TTS User',
  bio text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, title, bio)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Somali TTS User'),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'title', 'Somali TTS User'),
    coalesce(new.raw_user_meta_data->>'bio', 'Building with Somali TTS.')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
