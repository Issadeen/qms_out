# APK Build & Sign Workflow

## Prerequisites
- Android SDK (ANDROID_HOME or ANDROID_SDK_ROOT set)
- Build-Tools (contains zipalign, apksigner) e.g. 34.0.0
- apktool in PATH
- Java (for keytool, optional jarsigner fallback)
- adb (platform-tools) for install

## One Command (PowerShell)
```powershell
# Adjust BuildToolsVersion if different
./scripts/build-sign-install.ps1 -BuildToolsVersion 34.0.0
```
Produces: `build/qms-out-signed.apk` and installs it.

## Using a Custom Keystore
```powershell
./scripts/build-sign-install.ps1 -KeystorePath my-release.keystore -KeystorePass secretPass -KeyAlias myalias -KeyPass secretPass -BuildToolsVersion 34.0.0
```

## Fallback: jarsigner (If apksigner missing)
```powershell
apktool b -o build\qms-out-unsigned.apk .
zipalign -v 4 build\qms-out-unsigned.apk build\qms-out-aligned.apk
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore debug.keystore -storepass android -keypass android build\qms-out-aligned.apk androiddebugkey
# Optional: verify with apksigner later
apksigner.bat verify build\qms-out-aligned.apk
```
Note: jarsigner signs in-place (produces a signed aligned APK at same file) unless you copy first.

## Fallback: Uber APK Signer
1. Download JAR: https://github.com/patrickfav/uber-apk-signer/releases
2. Run:
```powershell
java -jar uber-apk-signer.jar -a build\qms-out-unsigned.apk --allowResign
```
Outputs signed + aligned variants in same directory.

## Generate Debug Keystore (if missing)
```powershell
keytool -genkeypair -v -keystore debug.keystore -storepass android -keypass android -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
```

## Environment Setup Quick Ref
```powershell
$env:ANDROID_HOME = "C:\Android"
$env:Path += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\build-tools\34.0.0"
```

## Clean Rebuild
```powershell
Remove-Item -Recurse -Force build
apktool b -o build\qms-out-unsigned.apk .
```

## Troubleshooting
- zipalign not recognized: ensure build-tools path appended to PATH or invoke full path.
- INSTALL_FAILED_VERSION_DOWNGRADE: uninstall existing app first: `adb uninstall <package>`.
- Signature verification failure: make sure you aligned before signing (zipalign must run pre-sign).

## Continuous Use
Re-run the script after each change; it automatically overwrites previous artifacts.
