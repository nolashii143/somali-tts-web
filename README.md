# Somali TTS Web

Next.js dashboard for Somali text-to-speech, connected to the [Somali-MMS-TTS](https://huggingface.co/spaces/Ayoubadanabdi/Somali-MMS-TTS) Hugging Face Space.

**Somali TTS model by: Engr Ayoub Adan Abdi**

## Authentication (Supabase)

Users sign in with **email and password**. Profiles are stored in Supabase.

### Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Copy **Project URL** and **anon public key** from Settings → API
4. Add to `.env.local` and Vercel environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

5. In Supabase → Authentication → Providers, enable **Email**
6. Restart the app and visit `/auth/signup`

Protected routes: `/generate`, `/history`, `/favorites`, `/profile`, `/settings`

## Features

- **Generate** — Convert Somali text to speech with example phrases
- **History** — Replay, search, and manage recent generations (saved locally)
- **Favorites** — Save phrases for quick reuse
- **Profile** — Authenticated account with name, email, title, and bio (Supabase)
- **Settings** — Dark mode, history toggle, data reset
- **Dashboard UI** — Sidebar navigation, stats, mobile-friendly layout

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HF_SPACE_ID` | No | Defaults to `Ayoubadanabdi/Somali-MMS-TTS` |
| `HF_TOKEN` | No | Only needed for private Spaces |
| `MAX_TEXT_LENGTH` | No | Defaults to `500` |

## API

### `POST /api/tts`

```json
{ "text": "ku soo dhowaada casharkii ugu dambeeyay ee mashiin lerning." }
```

Returns `audio/wav`.

### `GET /api/health`

Returns service status.

## Deploy to Vercel

### Quick deploy (recommended)

1. Log in to GitHub (once):

```powershell
gh auth login
```

2. Log in to Vercel (once):

```powershell
npx vercel login
```

3. Run the deploy script:

```powershell
cd j:\SpeechT5_API\somali-tts-web
.\deploy.ps1
```

### Manual steps

1. Push to GitHub:

```powershell
gh repo create somali-tts-web --public --source=. --remote=origin --push
git push -u origin main
```

2. Import at [vercel.com/new](https://vercel.com/new) or run `npx vercel --prod`

3. Add **Environment Variables** in Vercel → Settings:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://cwzgbucpshnnkwujoaoi.supabase.co` (Project URL only — **do not** append `/rest/v1`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |
| `HF_SPACE_ID` | `Ayoubadanabdi/Somali-MMS-TTS` |

4. Redeploy after adding env vars.

Note: `/api/tts` uses a 60s timeout (`vercel.json`). Vercel Pro is recommended because free Hobby functions timeout at 10s, which may be too short when the HF Space is cold.
