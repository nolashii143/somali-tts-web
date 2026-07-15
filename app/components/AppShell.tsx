"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/app/auth-provider";
import { useApp } from "@/app/providers";
import { useTheme } from "@/app/theme-provider";

const NAV_ITEMS = [
  { href: "/generate", label: "Generate", icon: "🎙️" },
  { href: "/history", label: "History", icon: "🕘" },
  { href: "/favorites", label: "Favorites", icon: "⭐" },
  { href: "/profile", label: "Profile", icon: "👤" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, stats } = useApp();
  const { user, signOut, configured } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:flex">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
              Somali TTS
            </p>
            <h1 className="mt-2 text-2xl font-bold">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              by Engr Ayoub Adan Abdi
            </p>
          </div>

          <nav className="flex flex-1 flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-sky-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Quick stats
            </p>
            <p className="mt-2 text-2xl font-bold">{stats.totalGenerations}</p>
            <p className="text-sm text-slate-500">generations</p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 lg:px-8">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Welcome back
              </p>
              <p className="font-semibold">{profile.name}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
              >
                {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
              </button>
              {configured && user && (
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
                >
                  Sign out
                </button>
              )}
              <Link
                href="/profile"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white"
              >
                {initials}
              </Link>
            </div>
          </header>

          <div className="border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
            <div className="flex gap-2 overflow-x-auto">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
                      active
                        ? "bg-sky-600 text-white"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
