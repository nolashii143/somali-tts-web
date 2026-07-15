export async function GET() {
  return Response.json({
    status: "ok",
    space: process.env.HF_SPACE_ID ?? "Ayoubadanabdi/Somali-MMS-TTS",
  });
}
