# Alternative Installation Guide for KPC QMS App

Since the native APK builds are encountering issues, here are alternative methods to get the KPC QMS app on your Android device:

## Option 1: Progressive Web App (PWA) - Recommended for immediate use

This method creates a web app that can be installed and used like a native app on Android.

### Steps:

1. **Build the web version:**
   ```bash
   npx expo export --platform web
   ```

2. **Serve the app locally:**
   ```bash
   npx serve dist
   ```

3. **Access on your Android device:**
   - Connect your Android device to the same WiFi network as your computer
   - Find your computer's IP address (usually something like 192.168.1.x)
   - Open Chrome on your Android device
   - Go to: `http://YOUR_COMPUTER_IP:3000`
   - Once the app loads, tap the menu (⋮) in Chrome
   - Select "Add to Home screen" or "Install app"
   - The app will be installed as a PWA with offline capabilities

## Option 2: Expo Go App (Development)

### Steps:

1. **Install Expo Go on your Android device:**
   - Download from Google Play Store: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Start the development server:**
   ```bash
   npx expo start
   ```

3. **Connect your device:**
   - Scan the QR code displayed in the terminal with Expo Go app
   - The app will load directly in Expo Go

## Option 3: Online APK Build Services

### Using AppCenter (Alternative to EAS):

1. **Sign up for Visual Studio App Center:**
   - Go to https://appcenter.ms/
   - Create a new project for Android

2. **Connect your repository:**
   - Upload your project to GitHub/GitLab
   - Connect it to App Center

3. **Configure build:**
   - Set up Android build configuration
   - Build and download APK

## Option 4: Local APK Build (Advanced)

If you want to build locally, you'll need to:

1. **Install Android Studio:**
   - Download from https://developer.android.com/studio
   - Install Android SDK and NDK

2. **Configure environment:**
   ```bash
   # Set ANDROID_HOME environment variable
   # Add platform-tools to PATH
   ```

3. **Build:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

## Features Available in All Options:

- ✅ Full KPC branding and crimson red theme
- ✅ Depot selection with 3D carousel
- ✅ Queue management functionality
- ✅ Secure authentication (web storage for PWA)
- ✅ Responsive design for mobile devices

## Recommendation:

For immediate testing and deployment, **Option 1 (PWA)** is the best choice as it:
- Works immediately without complex setup
- Provides native-like experience
- Can be installed on the home screen
- Works offline once cached
- Supports all app features including biometric authentication

## Need Help?

If you encounter any issues with these alternatives, please let me know and I can help troubleshoot or provide additional solutions.