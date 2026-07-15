# Somali TTS Web — GitHub + Vercel deploy script
# Run from: j:\SpeechT5_API\somali-tts-web

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$gh = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path $gh)) { $gh = "gh" }

Write-Host "=== Step 1: GitHub login (if needed) ===" -ForegroundColor Cyan
& $gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Opening GitHub login..."
    & $gh auth login -h github.com -p https -w
}

Write-Host "`n=== Step 2: Create GitHub repo and push ===" -ForegroundColor Cyan
$repoExists = & $gh repo view Ayoubadanabdi/somali-tts-web 2>$null
if ($LASTEXITCODE -ne 0) {
    & $gh repo create somali-tts-web --public --source=. --remote=origin --description "Somali TTS web app with Supabase auth and Hugging Face Spaces"
    git push -u origin main
} else {
    git remote remove origin 2>$null
    git remote add origin https://github.com/Ayoubadanabdi/somali-tts-web.git
    git push -u origin main
}

Write-Host "`n=== Step 3: Vercel deploy ===" -ForegroundColor Cyan
Write-Host "Add these env vars in Vercel when prompted or in dashboard:"
Write-Host "  NEXT_PUBLIC_SUPABASE_URL"
Write-Host "  NEXT_PUBLIC_SUPABASE_ANON_KEY"
Write-Host "  HF_SPACE_ID (optional, default: Ayoubadanabdi/Somali-MMS-TTS)"
Write-Host ""

npx vercel@latest --prod

Write-Host "`nDone! Your app should be live on Vercel." -ForegroundColor Green
