-- Run this in the Supabase Dashboard → SQL Editor for the project
-- (ynppytlqdexfxdsbpndn), AFTER creating the "content-media" storage
-- bucket (see supabase/MEDIA_SETUP.md for the bucket + dashboard steps).

-- 1. Add columns to store one media attachment per content item.
alter table content_items
  add column if not exists media_url text,
  add column if not exists media_path text,
  add column if not exists media_type text;

-- 2. Let any authenticated user upload/replace/delete/read files in the
--    content-media bucket (matches this app's existing "any logged-in
--    user can read/write everything" model).
create policy "content-media insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'content-media');

create policy "content-media update" on storage.objects
  for update to authenticated
  using (bucket_id = 'content-media');

create policy "content-media delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'content-media');

create policy "content-media select" on storage.objects
  for select to authenticated
  using (bucket_id = 'content-media');
