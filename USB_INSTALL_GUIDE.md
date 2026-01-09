# 📱 Direct APK Installation via ADB (USB)

## 🎯 **Much Better Approach!**

Instead of the web app, let's install the actual APK directly to your Android device via USB using ADB.

## 📋 **Prerequisites:**

### 1. **Enable Developer Options on Android:**
1. Go to **Settings** > **About phone**
2. Tap **Build number** 7 times rapidly
3. Developer options will be unlocked

### 2. **Enable USB Debugging:**
1. Go to **Settings** > **Developer options**
2. Enable **USB debugging**
3. Enable **Install via USB** (if available)

### 3. **Install ADB on Windows:**

**Option A: Minimal ADB (Recommended)**
```powershell
# Download minimal ADB and fastboot
# Go to: https://developer.android.com/studio/releases/platform-tools
# Extract to C:\adb\
```

**Option B: Full Android Studio**
```powershell
# Download Android Studio from https://developer.android.com/studio
# ADB will be installed automatically
```

**Option C: Chocolatey (if you have it)**
```powershell
choco install adb
```

## 🔨 **Build the APK:**

### **Method 1: Expo Development Build (Recommended)**
```powershell
# Build development APK
npx expo run:android --variant release --no-install --no-bundler
```

### **Method 2: Using Android Studio**
```powershell
# Navigate to android folder and build
cd android
.\gradlew assembleRelease
```

### **Method 3: EAS Build and Download**
```powershell
# Build with EAS and download APK
npx eas build --platform android --profile preview --local
```

## 📱 **Install via ADB:**

### **Step 1: Connect Device**
```powershell
# Connect phone via USB cable
# Check if device is detected
adb devices
```

### **Step 2: Install APK**
```powershell
# Install the built APK
adb install path\to\your\app.apk

# If you need to reinstall
adb install -r path\to\your\app.apk

# Force install (overwrites existing)
adb install -r -d path\to\your\app.apk
```

## 🎯 **Let's Try This Now:**

### **Quick Test - Build Development APK:**