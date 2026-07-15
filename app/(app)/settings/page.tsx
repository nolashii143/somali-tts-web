"use client";

import { useApp } from "@/app/providers";
import { useTheme } from "@/app/theme-provider";

export default function SettingsPage() {
  const { settings, updateSettings, resetApp } = useApp();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Settings</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Customize your Somali TTS experience.
        </p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-semibold">Appearance</h3>
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
          <div>
            <p className="font-medium">Theme</p>
            <p className="text-sm text-slate-500">Currently {theme} mode</p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white dark:bg-slate-100 dark:text-slate-900"
          >
            Toggle theme
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-semibold">Generation</h3>
        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <div>
              <p className="font-medium">Save history</p>
              <p className="text-sm text-slate-500">
                Store recent generations in this browser
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.saveHistory}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  saveHistory: event.target.checked,
                })
              }
              className="h-5 w-5"
            />
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <div>
              <p className="font-medium">Show example phrases</p>
              <p className="text-sm text-slate-500">
                Display quick-start Somali examples
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.showExamples}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  showExamples: event.target.checked,
                })
              }
              className="h-5 w-5"
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20">
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
          Danger zone
        </h3>
        <p className="mt-2 text-sm text-red-700 dark:text-red-300">
          Reset profile, history, favorites, and cached audio from this browser.
        </p>
        <button
          type="button"
          onClick={() => void resetApp()}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Reset all local data
        </button>
      </section>
    </div>
  );
}
