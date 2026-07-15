"use client";

import { useEffect, useState } from "react";

import { useApp } from "@/app/providers";
import { EXAMPLE_PHRASES } from "@/lib/storage";
import { saveAudio, getAudio } from "@/lib/audio-store";

interface TtsFormProps {
  initialText?: string;
  autoGenerate?: boolean;
}

export default function TtsForm({
  initialText = EXAMPLE_PHRASES[0],
  autoGenerate = false,
}: TtsFormProps) {
  const { settings, logGeneration, toggleFavorite, isFavorite } = useApp();
  const [text, setText] = useState(initialText);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  useEffect(() => {
    if (autoGenerate && initialText.trim()) {
      void generateSpeech(initialText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoGenerate, initialText]);

  async function generateSpeech(inputText: string) {
    setLoading(true);
    setError(null);

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    const started = performance.now();

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to generate speech.");
      }

      const blob = await response.blob();
      const durationMs = performance.now() - started;
      const item = logGeneration(inputText, durationMs);

      if (item) {
        await saveAudio(item.id, blob);
        setHistoryId(item.id);
      }

      setAudioUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await generateSpeech(text);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
      {settings.showExamples && (
        <div>
          <p className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-300">
            Example phrases
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PHRASES.map((phrase) => (
              <button
                key={phrase}
                type="button"
                onClick={() => setText(phrase)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:border-sky-400 hover:text-sky-700 dark:border-slate-700 dark:text-slate-300"
              >
                {phrase.slice(0, 42)}...
              </button>
            ))}
          </div>
        </div>
      )}

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">Somali text</span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={5}
          maxLength={500}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-sky-900"
          placeholder="Geli qoraalka Soomaaliga..."
        />
        <span className="text-xs text-slate-500">{text.length}/500</span>
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-sky-600 px-6 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "Generating speech..." : "Generate speech"}
        </button>

        <button
          type="button"
          onClick={() => toggleFavorite(text)}
          disabled={!text.trim()}
          className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-medium dark:border-slate-700"
        >
          {isFavorite(text) ? "★ Saved" : "☆ Save phrase"}
        </button>
      </div>

      {loading && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          First request can take up to a minute while the Hugging Face Space
          wakes up and loads the model.
        </p>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      )}

      {audioUrl && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
          <p className="mb-3 text-sm font-medium">Generated audio</p>
          <audio controls src={audioUrl} className="w-full" />
          <div className="mt-3 flex flex-wrap gap-4">
            <a
              href={audioUrl}
              download="speech.wav"
              className="text-sm font-medium text-sky-700 dark:text-sky-400"
            >
              Download WAV
            </a>
            {historyId && (
              <button
                type="button"
                onClick={async () => {
                  const blob = await getAudio(historyId);
                  if (blob) setAudioUrl(URL.createObjectURL(blob));
                }}
                className="text-sm font-medium text-slate-600 dark:text-slate-300"
              >
                Reload from history
              </button>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
