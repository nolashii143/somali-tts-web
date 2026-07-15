import { generateSpeech, TtsError, validateText } from "@/lib/tts";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = validateText(body?.text);
    const audio = await generateSpeech(text);

    return new Response(audio, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Disposition": 'inline; filename="speech.wav"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof TtsError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    console.error("TTS error:", error);
    return Response.json(
      { error: "Failed to generate speech. The Space may be waking up — try again." },
      { status: 500 },
    );
  }
}
