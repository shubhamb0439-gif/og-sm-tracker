# Media upload setup (one-time, do this in the Supabase Dashboard)

The app's code now supports attaching one image or video per content item,
but it needs a Storage bucket + two new columns that only a project owner
can create (the app only ships with the anon/publishable key).

## 1. Create the storage bucket

Supabase Dashboard → **Storage** → **New bucket**

- Name: `content-media` (must match exactly — the code in `src/lib/media.js` hardcodes this)
- Public bucket: **ON** (so the app can render images/videos via a plain public URL)
- File size limit: `100 MB` (matches the client-side check in `src/lib/media.js`)
- Allowed MIME types: `image/*,video/*`

## 2. Run the SQL

Supabase Dashboard → **SQL Editor** → paste and run [`media_setup.sql`](media_setup.sql).

This adds `media_url`, `media_path`, `media_type` columns to `content_items`
and adds RLS policies so any logged-in user can upload/read/replace/delete
files in the `content-media` bucket — consistent with how the rest of this
app already trusts any authenticated user with the shared workspace.

## 3. Verify

Open the app → Pipeline or Planner → open a content item → add an image or
video → save. The attachment should show up on the kanban card, in the
pipeline detail panel, and in the edit modal.
