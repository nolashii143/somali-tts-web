"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { useApp } from "@/app/providers";
import { getAudio, deleteAudio } from "@/lib/audio-store";
import { formatDate, formatDuration } from "@/lib/format";

export default function HistoryPage() {
  const { history, deleteHistory, wipeHistory } = useApp();
  const [query, setQuery] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return history;
    return history.filter((item) => item.text.toLowerCase().includes(q));
  }, [history, query]);

  async function playItem(id: string) {
    const blob = await getAudio(id);
    if (!blob) return;

    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(URL.createObjectURL(blob));
    setPlayingId(id);
  }

  async function removeItem(id: string) {
    deleteHistory(id);
    await deleteAudio(id);
    if (playingId === id && audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setPlayingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold">History</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Your recent generations are saved locally in this browser.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void wipeHistory()}
          className="rounded-xl border border-red-200 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:text-red-400"
        >
          Clear all history
        </button>
      </div>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search history..."
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
      />

      {audioUrl && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
          <p className="mb-2 text-sm font-medium">Now playing</p>
          <audio controls src={audioUrl} className="w-full" autoPlay />
        </div>
      )}

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
            <p className="font-medium">No history yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Generate speech to build your history.
            </p>
            <Link
              href="/generate"
              className="mt-4 inline-flex text-sm font-medium text-sky-700 dark:text-sky-400"
            >
              Go to Generate →
            </Link>
          </div>
        )}

        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-medium">{item.text}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {formatDate(item.createdAt)} · {formatDuration(item.durationMs)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void playItem(item.id)}
                  className="rounded-lg bg-sky-600 px-3 py-2 text-sm text-white"
                >
                  Play
                </button>
                <Link
                  href={`/generate?text=${encodeURIComponent(item.text)}`}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
                >
                  Regenerate
                </Link>
                <button
                  type="button"
                  onClick={() => void removeItem(item.id)}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 dark:border-red-900"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
