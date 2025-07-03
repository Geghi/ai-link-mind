create table public.scraped_pages (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  task_id uuid null,
  url text null,
  status text null,
  updated_at timestamp with time zone null,
  constraint scraped_pages_pkey primary key (id)
) TABLESPACE pg_default;
