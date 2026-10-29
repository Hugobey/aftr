-- Apply after the existing dumps/photos/dump_members MVP policy script.
-- This migration adds the schema required by the current app code.
-- Device IDs are application identifiers, not an authentication system. Replace
-- them with authenticated user IDs before relying on them for access control.

alter table public.photos
  add column if not exists device_id text;

create index if not exists photos_dump_device_id_idx
  on public.photos (dump_id, device_id);

create table if not exists public.content_reports (
  id uuid primary key default gen_random_uuid(),
  dump_id uuid not null references public.dumps(id) on delete cascade,
  photo_id uuid not null references public.photos(id) on delete cascade,
  reporter_device_id text not null,
  reported_device_id text,
  reason text not null check (reason in ('objectionable_content')),
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create unique index if not exists content_reports_one_open_report_per_device
  on public.content_reports (photo_id, reporter_device_id)
  where status in ('open', 'reviewing');

-- RLS must be enabled and backed by authenticated user identities in production.
-- Do not use permissive anon policies for photos, memberships, or reports.
alter table public.content_reports enable row level security;

grant insert on public.content_reports to anon, authenticated;

drop policy if exists "Members can report photos in their dumps"
  on public.content_reports;

create policy "Members can report photos in their dumps"
  on public.content_reports
  for insert
  to public
  with check (
    exists (
      select 1
      from public.dump_members member
      where member.dump_id = content_reports.dump_id
        and member.device_id = content_reports.reporter_device_id
    )
  );
