-- Run this after the initial schema if the project already exists.
-- It configures the bucket for upload limits and enables signed URLs
-- only for files referenced by published resources.

update storage.buckets
set file_size_limit = 6291456,
    allowed_mime_types = array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
where id = 'resources';

drop policy if exists "Public can read published resource files through signed URLs" on storage.objects;
create policy "Public can read published resource files through signed URLs"
on storage.objects
for select
using (
  bucket_id = 'resources'
  and exists (
    select 1
    from public.resources
    where public.resources.file_path = storage.objects.name
      and public.resources.is_published = true
  )
);
