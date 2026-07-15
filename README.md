# Somali TTS Web

Next.js web app that connects to the [Somali-MMS-TTS](https://huggingface.co/spaces/Ayoubadanabdi/Somali-MMS-TTS) Hugging Face Space.

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

1. Push this folder to GitHub
2. Import the repo in [Vercel](https://vercel.com/new)
3. Add environment variables (optional `HF_SPACE_ID`, `HF_TOKEN`)
4. Deploy

Note: `/api/tts` uses a 60s timeout (`vercel.json`). Vercel Pro is recommended because free Hobby functions timeout at 10s, which may be too short when the HF Space is cold.
