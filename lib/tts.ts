import { Client } from "@gradio/client";

const DEFAULT_SPACE = "Ayoubadanabdi/Somali-MMS-TTS";

export class TtsError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "TtsError";
    this.status = status;
  }
}

export function validateText(text: unknown): string {
  if (typeof text !== "string") {
    throw new TtsError("Text must be a string.", 400);
  }

  const trimmed = text.trim();
  if (!trimmed) {
    throw new TtsError("Text is required.", 400);
  }

  const maxLength = Number(process.env.MAX_TEXT_LENGTH ?? "500");
  if (trimmed.length > maxLength) {
    throw new TtsError(`Text must be at most ${maxLength} characters.`, 400);
  }

  return trimmed;
}

function resolveAudioUrl(data: unknown, spaceRoot: string): string {
  if (typeof data === "string") {
    return data.startsWith("http") ? data : new URL(data, spaceRoot).href;
  }

  if (Array.isArray(data) && data.length > 0) {
    return resolveAudioUrl(data[0], spaceRoot);
  }

  if (data && typeof data === "object") {
    const file = data as Record<string, unknown>;
    const candidates = [file.url, file.path, file.data];

    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.length > 0) {
        return candidate.startsWith("http")
          ? candidate
          : new URL(candidate, spaceRoot).href;
      }
    }
  }

  throw new TtsError("Unexpected audio response from TTS space.", 502);
}

export async function generateSpeech(text: string): Promise<ArrayBuffer> {
  const spaceId = process.env.HF_SPACE_ID ?? DEFAULT_SPACE;
  const clientOptions = process.env.HF_TOKEN
    ? { token: process.env.HF_TOKEN as `hf_${string}` }
    : undefined;

  const client = await Client.connect(spaceId, clientOptions);
  const spaceRoot = client.config?.root ?? `https://${spaceId.replace("/", "-")}.hf.space`;

  const result = await client.predict("/tts", [text]);
  const audioUrl = resolveAudioUrl(result.data, spaceRoot);

  const response = await fetch(audioUrl);
  if (!response.ok) {
    throw new TtsError("Failed to download generated audio.", 502);
  }

  return response.arrayBuffer();
}
