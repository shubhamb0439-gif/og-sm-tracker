# OG Social — Content Tracker

A shared social-media content tracker built with React + Tailwind CSS on the front end and Supabase (Postgres + Auth) on the back end.

## What's inside

- **Sign up / Log in** — open signup, no admin approval. Anyone with the link can create an account and gets full access to the shared workspace.
- **Dashboard** — upcoming shoots/uploads (next 7 days), a live pipeline snapshot, a recent-activity feed, and top-line stats.
- **Content Planner** — a sortable table of every piece of content with the shoot date, upload date, platform, stage, and who it's assigned to.
- **Content Creation Pipeline** — a drag-and-drop kanban board with 5 stages: **Draft → Under Review → Revisions → Approved → Posted**. Each card opens a detail panel with a comment thread for review notes.

Everyone shares the same workspace/data — there's no per-user siloing, matching a small team that all needs visibility into the same content calendar.

## Supabase project (already created for you)

- Project: **Social media tracker** (`ynppytlqdexfxdsbpndn`)
- URL: `https://ynppytlqdexfxdsbpndn.supabase.co`
- The `.env` file in this project already has the URL + public anon key filled in — it's safe to commit/ship, the anon key only works within the Row Level Security rules that were set up (any **logged-in** user can read/write; nobody logged out can touch data).

### Tables created
- `profiles` — auto-created for every new signup (id, email, display_name)
- `content_items` — powers both the Planner and the Pipeline (title, description, platform, shoot_date, upload_date, stage, assigned_to, created_by)
- `comments` — review notes attached to a content item
- `activity_log` — auto-populated by DB triggers whenever an item is created, moves stage, or gets a comment (feeds the dashboard activity widget)

### One setting you may want to change
By default, Supabase requires email confirmation before a new signup can log in. Since you asked for "anyone signs up and logs straight in," go to **Supabase Dashboard → Authentication → Providers → Email** and turn **off** "Confirm email" if you want instant access after signup. Right now, if it's still on, new users will see a "check your email" message first.

## Running locally

```bash
npm install
npm run dev
```

Open the printed local URL. `.env` is already configured — no setup needed.

## Building for production

```bash
npm run build
```

Outputs a static site in `dist/` — deploy it anywhere that serves static files (Vercel, Netlify, Cloudflare Pages, etc.).

## Project structure

```
src/
  components/     Layout, modals, kanban card detail, comment thread, shared UI
  context/        AuthContext (Supabase auth session + profile)
  hooks/          useContentItems, useProfiles, useActivity (data + realtime)
  lib/            supabaseClient, stage definitions
  pages/          Login, Signup, Dashboard, Planner, Pipeline
```

## Brand

Colors and the logo mark are pulled from the OG logo you provided (deep purple `#4C1D95` family). To swap the logo, replace `src/assets/og-logo.png` and `public/og-logo.png`.
