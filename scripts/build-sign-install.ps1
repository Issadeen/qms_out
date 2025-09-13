param(
  [string]$KeystorePath = "debug.keystore",
  [string]$KeystorePass = "android",
  [string]$KeyAlias = "androiddebugkey",
  [string]$KeyPass = "android",
  [string]$BuildToolsVersion = "34.0.0",
  [switch]$SkipInstall
)

$ErrorActionPreference = 'Stop'

function Fail($msg){ Write-Error $msg; exit 1 }

# Resolve build-tools paths
$androidHome = $env:ANDROID_HOME
if(-not $androidHome){ $androidHome = $env:ANDROID_SDK_ROOT }
if(-not $androidHome){ Fail "ANDROID_HOME or ANDROID_SDK_ROOT not set." }
$bt = Join-Path $androidHome ("build-tools/" + $BuildToolsVersion)
$zipalign = Join-Path $bt 'zipalign.exe'
$apksigner = Join-Path $bt 'apksigner.bat'
if(-not (Test-Path $zipalign)){ Fail "zipalign not found at $zipalign" }
if(-not (Test-Path $apksigner)){ Fail "apksigner not found at $apksigner" }

if(-not (Test-Path build)){ New-Item -ItemType Directory build | Out-Null }

Write-Host "[1/5] Building (apktool)" -ForegroundColor Cyan
apktool b -o build/qms-out-unsigned.apk . | Write-Host
if(-not (Test-Path build/qms-out-unsigned.apk)){ Fail "Unsigned APK not produced." }

Write-Host "[2/5] Aligning (zipalign)" -ForegroundColor Cyan
& $zipalign -v 4 build/qms-out-unsigned.apk build/qms-out-aligned.apk | Write-Host
if(-not (Test-Path build/qms-out-aligned.apk)){ Fail "Aligned APK missing." }

Write-Host "[3/5] Signing (apksigner)" -ForegroundColor Cyan
& $apksigner sign --ks $KeystorePath --ks-pass pass:$KeystorePass --ks-key-alias $KeyAlias --key-pass pass:$KeyPass --out build/qms-out-signed.apk build/qms-out-aligned.apk
if(-not (Test-Path build/qms-out-signed.apk)){ Fail "Signed APK missing." }

Write-Host "[4/5] Verifying signature" -ForegroundColor Cyan
try {
  & $apksigner verify build/qms-out-signed.apk
  if($LASTEXITCODE -ne 0){ Fail "Verification failed (exit $LASTEXITCODE)" }
} catch {
  Fail "Verification failed: $($_.Exception.Message)"
}

if(-not $SkipInstall){
  Write-Host "[5/5] Installing via adb" -ForegroundColor Cyan
  adb install -r build/qms-out-signed.apk | Write-Host
  Write-Host "Done." -ForegroundColor Green
} else {
  Write-Host "Skipping install (SkipInstall set)." -ForegroundColor Yellow
}
