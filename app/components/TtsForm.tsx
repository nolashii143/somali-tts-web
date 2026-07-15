"use client";

import { useState } from "react";

const DEFAULT_TEXT =
  "ku soo dhowaada casharkii ugu dambeeyay ee mashiin lerning.";

export default function TtsForm() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to generate speech.");
      }

      const blob = await response.blob();
      setAudioUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-700">Somali text</span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={4}
          maxLength={500}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          placeholder="Geli qoraalka Soomaaliga..."
        />
        <span className="text-xs text-slate-500">{text.length}/500</span>
      </label>

      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="inline-flex h-12 items-center justify-center rounded-xl bg-sky-600 px-6 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? "Generating speech..." : "Generate speech"}
      </button>

      {loading && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          First request can take up to a minute while the Hugging Face Space
          wakes up and loads the model.
        </p>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {audioUrl && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-sm font-medium text-slate-700">Generated audio</p>
          <audio controls src={audioUrl} className="w-full" />
          <a
            href={audioUrl}
            download="speech.wav"
            className="mt-3 inline-flex text-sm font-medium text-sky-700 hover:text-sky-800"
          >
            Download WAV
          </a>
        </div>
      )}
    </form>
  );
}
