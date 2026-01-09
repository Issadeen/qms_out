# QMS App - PC Migration Guide

## 📦 How to Move Your App to a New PC

When you migrate to a new PC, you need to reinstall dependencies and rebuild the project. Here's the complete process:

---

## 🚀 Quick Migration Steps

### 1️⃣ **Copy/Clone Your Project**

**Option A: From GitHub**
```powershell
git clone https://github.com/yourusername/qms-app.git
cd qms-app
```

**Option B: From USB/External Drive**
```powershell
# Just copy the entire qms_out folder to your new PC
```

---

### 2️⃣ **Install Prerequisites** (On New PC)

**Required Software:**

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Git** (if using GitHub)
   - Download from: https://git-scm.com/
   - Verify: `git --version`

3. **Android Studio** (for Android builds)
   - Download from: https://developer.android.com/studio
   - Install Android SDK

4. **Expo CLI** (optional, but helpful)
   ```powershell
   npm install -g expo-cli
   ```

---

### 3️⃣ **Install Project Dependencies** ⚠️ CRITICAL STEP

Navigate to your project folder and run:

```powershell
cd C:\Users\YourName\Desktop\qms_out

# Delete old node_modules if it exists
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Install all dependencies fresh
npm install
```

**What This Does:**
- Downloads all packages listed in `package.json`
- Creates a new `node_modules` folder
- Installs React Native, Expo, and all libraries

⏱️ This takes 5-15 minutes depending on internet speed.

---

### 4️⃣ **Verify Installation**

Check if everything installed correctly:

```powershell
# Check Node
node --version

# Check npm packages
npm list --depth=0

# Verify React Native
npx react-native --version
```

---

### 5️⃣ **Start Development Server**

```powershell
# Start Expo development server
npm start
# OR
npx expo start
```

---

## 🔧 Common Migration Issues & Fixes

### Issue 1: "Cannot find module" errors

**Problem:** Dependencies not installed
**Fix:**
```powershell
npm install
```

### Issue 2: "expo-haptics" or other package missing

**Problem:** New packages added but not in package.json
**Fix:**
```powershell
# Install specific packages
npm install expo-haptics
npm install expo-blur
npm install @react-native-async-storage/async-storage
```

### Issue 3: Android build fails

**Problem:** Android SDK not configured
**Fix:**
1. Open Android Studio
2. Go to Tools > SDK Manager
3. Install latest Android SDK
4. Set ANDROID_HOME environment variable

### Issue 4: Metro bundler issues

**Problem:** Cached files causing problems
**Fix:**
```powershell
# Clear all caches
npx expo start --clear
# OR
npm start -- --reset-cache
```

### Issue 5: Port already in use

**Problem:** Development server can't start
**Fix:**
```powershell
# Kill the process on port 19000/19001
npx kill-port 19000 19001
# Then start again
npm start
```

---

## 📁 What to Include When Migrating

### ✅ **MUST Include:**
- `src/` folder - All your source code
- `assets/` folder - Images and resources
- `package.json` - Dependencies list
- `app.json` - Expo configuration
- `tsconfig.json` - TypeScript config
- `babel.config.js` - Babel configuration
- `metro.config.js` - Metro bundler config
- `.gitignore` - Git ignore rules

### ❌ **DON'T Include (Can be regenerated):**
- `node_modules/` - Will be reinstalled
- `build/` - Build artifacts
- `.expo/` - Expo cache
- `android/build/` - Android build cache
- `ios/build/` - iOS build cache (if applicable)

---

## 🎯 Best Practice Migration Workflow

### **Step-by-Step Checklist:**

```powershell
# 1. On OLD PC - Push to GitHub (if using Git)
git add .
git commit -m "Latest changes before migration"
git push origin main

# 2. On NEW PC - Install Node.js first
# Download and install from nodejs.org

# 3. Clone/Copy project
git clone https://github.com/yourusername/qms-app.git
cd qms-app

# 4. Install dependencies (MOST IMPORTANT)
npm install

# 5. Verify everything works
npm start

# 6. Test the app
# Scan QR code with Expo Go app on phone
```

---

## 🔄 Using GitHub (Recommended Method)

### **Initial Setup (Do ONCE on old PC):**

```powershell
# Initialize Git (if not already done)
cd C:\Users\issad\Desktop\qms_out
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - QMS App"

# Create repo on GitHub.com, then:
git remote add origin https://github.com/yourusername/qms-app.git
git push -u origin main
```

### **On New PC:**

```powershell
# Clone the repo
git clone https://github.com/yourusername/qms-app.git
cd qms-app

# Install dependencies
npm install

# Start app
npm start
```

---

## 💾 Alternative: USB/Drive Migration

If you don't want to use GitHub:

### **On Old PC:**
1. Copy entire `qms_out` folder to USB drive
2. **EXCLUDE** these folders (to save space):
   - `node_modules/`
   - `build/`
   - `.expo/`
   - `android/build/`

### **On New PC:**
1. Copy folder from USB to your desired location
2. Open PowerShell in that folder
3. Run: `npm install`
4. Run: `npm start`

---

## 📦 Full Reinstall Script (PowerShell)

Save this as `setup-new-pc.ps1`:

```powershell
# QMS App Setup Script for New PC

Write-Host "🚀 Setting up QMS App on new PC..." -ForegroundColor Green

# Check Node.js
Write-Host "`n📌 Checking Node.js..." -ForegroundColor Cyan
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Please install from https://nodejs.org/" -ForegroundColor Red
    exit
}

# Clean old installation
Write-Host "`n🧹 Cleaning old installation..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules
    Write-Host "✅ Removed old node_modules" -ForegroundColor Green
}
if (Test-Path "package-lock.json") {
    Remove-Item package-lock.json
    Write-Host "✅ Removed old package-lock.json" -ForegroundColor Green
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Setup complete! Run 'npm start' to begin" -ForegroundColor Green
} else {
    Write-Host "`n❌ Installation failed. Check errors above." -ForegroundColor Red
}
```

**Usage:**
```powershell
cd C:\Users\YourName\Desktop\qms_out
.\setup-new-pc.ps1
```

---

## 🎯 Quick Reference Commands

```powershell
# Fresh install
npm install

# Clear cache and reinstall
npm cache clean --force
Remove-Item node_modules -Recurse -Force
npm install

# Start development
npm start

# Build APK
npm run android

# Check what's installed
npm list --depth=0

# Update all packages
npm update
```

---

## ⚠️ Important Notes

1. **Always run `npm install` on new PC** - This is the #1 step people forget!

2. **Don't copy `node_modules`** - It's huge (300MB+) and platform-specific

3. **Check Node version** - Use Node 18+ for best compatibility

4. **Environment variables** - May need to set ANDROID_HOME again on new PC

5. **Expo account** - Log in with same account: `npx expo login`

---

## 🆘 Still Having Issues?

### Quick Diagnostic:

```powershell
# Run this to check your setup
npx expo doctor

# Check for outdated packages
npm outdated

# Verify Expo installation
npx expo --version
```

### Nuclear Option (Complete Reset):

```powershell
# Delete everything and start fresh
Remove-Item node_modules, package-lock.json, .expo -Recurse -Force
npm cache clean --force
npm install
npx expo start --clear
```

---

## ✅ Success Checklist

After migration, verify:
- [ ] `npm install` completed without errors
- [ ] `npm start` launches development server
- [ ] Can scan QR code and open app on phone
- [ ] All screens load correctly
- [ ] Glass effects working
- [ ] Auto-refresh working
- [ ] No console errors

---

## 🎉 You're Done!

Your app should now be running on the new PC with all features intact:
- ✅ Crimson red gradient
- ✅ Glass effects
- ✅ Auto-refresh
- ✅ Haptic feedback
- ✅ Last updated timestamp

If you followed these steps, everything should work perfectly! 🚀
