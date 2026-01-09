#!/bin/bash

# KPC QMS APK Build Script
echo "🏗️  Building KPC QMS APK..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📱 Step 1: Exporting Expo project..."
npx expo export --platform android

echo "📦 Step 2: Creating APK build directory..."
mkdir -p apk-build

echo "✅ Export completed!"
echo "📍 Build files are in the 'dist' directory"
echo "📍 You can now use these files with Cordova, Capacitor, or React Native CLI to create an APK"

echo ""
echo "🚀 To create an APK, you can:"
echo "1. Use online APK builders like App Inventor or PWA Builder"
echo "2. Set up Android Studio and build with React Native CLI"
echo "3. Use Capacitor to wrap the app: npx @capacitor/cli create"

echo ""
echo "✨ KPC QMS app is ready for APK creation!"