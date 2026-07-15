"use client";

import Link from "next/link";

import { useApp } from "@/app/providers";
import { formatDate } from "@/lib/format";

export default function FavoritesPage() {
  const { favorites, deleteFavorite } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Favorites</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Save phrases you use often for quick access.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {favorites.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center md:col-span-2 dark:border-slate-700">
            <p className="font-medium">No favorites yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Use &quot;Save phrase&quot; on the Generate page.
            </p>
          </div>
        )}

        {favorites.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm font-semibold text-sky-700 dark:text-sky-400">
              {item.label}
            </p>
            <p className="mt-3 text-sm leading-6">{item.text}</p>
            <p className="mt-3 text-xs text-slate-500">
              Saved {formatDate(item.createdAt)}
            </p>
            <div className="mt-4 flex gap-2">
              <Link
                href={`/generate?text=${encodeURIComponent(item.text)}`}
                className="rounded-lg bg-sky-600 px-3 py-2 text-sm text-white"
              >
                Use phrase
              </Link>
              <button
                type="button"
                onClick={() => deleteFavorite(item.id)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
