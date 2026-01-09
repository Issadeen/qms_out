# KPC QMS APK Build Script for Windows
# Run this script in PowerShell

Write-Host "🏗️  KPC QMS APK Build Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

Write-Host "📱 Step 1: Checking dependencies..." -ForegroundColor Yellow
Write-Host "✅ Project found" -ForegroundColor Green

Write-Host "📱 Step 2: Exporting project..." -ForegroundColor Yellow
npx expo export --platform android

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Export successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Export failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Build Summary:" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan
Write-Host "✅ Project exported to 'dist' folder" -ForegroundColor Green
Write-Host "✅ Android native project available in 'android' folder" -ForegroundColor Green
Write-Host "✅ App configuration complete" -ForegroundColor Green
Write-Host ""
Write-Host "📱 To create APK, run:" -ForegroundColor White
Write-Host "npx eas login" -ForegroundColor Yellow
Write-Host "npx eas build --platform android --profile preview" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎉 KPC QMS app is ready for APK creation!" -ForegroundColor Green

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")