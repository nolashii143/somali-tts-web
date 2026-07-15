"use client";

import { useEffect, useState } from "react";

import { useApp } from "@/app/providers";
import { StatCard } from "@/app/components/StatCard";
import { formatDate } from "@/lib/format";

export default function ProfilePage() {
  const { profile, stats, updateProfile } = useApp();
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const message = await updateProfile(draft);
    if (message) {
      setError(message);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const initials = draft.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Profile</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Your profile is saved to your account when Supabase auth is enabled.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Generations" value={stats.totalGenerations} />
        <StatCard label="Favorites" value={stats.totalFavorites} />
        <StatCard
          label="Member since"
          value={formatDate(profile.createdAt).split(",")[0]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-sky-600 text-3xl font-bold text-white">
            {initials}
          </div>
          <h3 className="mt-4 text-xl font-bold">{profile.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{profile.title}</p>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {profile.bio}
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Full name</span>
              <input
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
                className="rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                value={draft.email}
                onChange={(event) =>
                  setDraft({ ...draft, email: event.target.value })
                }
                placeholder="you@example.com"
                className="rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
              />
            </label>

            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-sm font-medium">Title</span>
              <input
                value={draft.title}
                onChange={(event) =>
                  setDraft({ ...draft, title: event.target.value })
                }
                className="rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
              />
            </label>

            <label className="flex flex-col gap-2 md:col-span-2">
              <span className="text-sm font-medium">Bio</span>
              <textarea
                value={draft.bio}
                onChange={(event) =>
                  setDraft({ ...draft, bio: event.target.value })
                }
                rows={4}
                className="rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white"
          >
            {saved ? "Saved!" : "Save profile"}
          </button>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
