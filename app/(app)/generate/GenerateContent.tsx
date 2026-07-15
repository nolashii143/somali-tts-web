"use client";

import { useSearchParams } from "next/navigation";

import TtsForm from "@/app/components/TtsForm";
import { StatCard } from "@/app/components/StatCard";
import { EXAMPLE_PHRASES } from "@/lib/storage";

export default function GenerateContent() {
  const searchParams = useSearchParams();
  const textParam = searchParams.get("text");
  const autoGenerate = searchParams.get("auto") === "1";

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
          Somali TTS model by: Engr Ayoub Adan Abdi
        </p>
        <h2 className="mt-2 text-3xl font-bold">Generate Speech</h2>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
          Convert Somali text to natural speech with{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">
            somali_tts
          </code>
          , hosted on Hugging Face Spaces.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Model" value="somali_tts" hint="Hugging Face Spaces" />
        <StatCard label="Language" value="Somali" hint="Natural speech output" />
        <StatCard label="Output" value="WAV" hint="16 kHz audio file" />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <TtsForm
          initialText={textParam ?? EXAMPLE_PHRASES[0]}
          autoGenerate={autoGenerate}
        />
      </section>
    </div>
  );
}
