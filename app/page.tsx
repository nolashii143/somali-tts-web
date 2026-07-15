import TtsForm from "@/app/components/TtsForm";

export default function Home() {
  return (
    <div className="min-h-full bg-gradient-to-b from-sky-50 via-white to-white">
      <main className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center px-6 py-16">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-sky-700">
            Somali TTS
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Somali Text-to-Speech
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Convert Somali text to natural speech using Meta&apos;s{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
              facebook/mms-tts-som
            </code>{" "}
            model, hosted on Hugging Face Spaces.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <TtsForm />
        </div>
      </main>
    </div>
  );
}
