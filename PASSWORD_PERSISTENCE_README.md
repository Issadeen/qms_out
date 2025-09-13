# Password Persistence & Auto-Login Feature

## Overview
The QMS app now includes secure password storage and auto-login functionality to improve user experience. Users won't need to login every time they open the app.

## Features

### 🔐 Secure Credential Storage
- **Secure Storage**: Passwords are stored using Expo SecureStore (iOS Keychain/Android Keystore)
- **Encryption**: All sensitive data is encrypted at the device level
- **Expiry**: Stored credentials automatically expire after 30 days for security

### 🚀 Auto-Login
- **Seamless Experience**: App automatically logs in users with saved credentials
- **Depot Memory**: Remembers the last selected depot for instant access
- **Fallback**: If auto-login fails, falls back to normal login screen

### 🔒 Biometric Authentication
- **Fingerprint/Face ID**: Optional biometric authentication for added security
- **Device Support**: Automatically detects if biometric authentication is available
- **User Control**: Users can enable/disable biometric authentication

### ⚙️ User Settings
- **Remember Me Toggle**: Users can choose to save their credentials
- **Biometric Toggle**: Enable/disable biometric authentication
- **Clear Credentials**: Easy way to logout and clear stored data

## How It Works

### First Time Login
1. User enters username and password
2. Optionally enables "Remember Me"
3. If biometric is available, can enable biometric authentication
4. Credentials are saved securely after successful login

### Subsequent App Opens
1. App checks for stored credentials
2. If biometric is enabled, prompts for biometric authentication
3. Automatically logs in with stored credentials
4. If last depot is saved, goes directly to main app
5. If no depot saved, shows depot selection screen

### Security Features
- **Secure Storage**: Uses iOS Keychain and Android Keystore
- **Auto-Expiry**: Credentials expire after 30 days
- **Biometric Protection**: Optional biometric authentication layer
- **Easy Logout**: Users can clear credentials anytime

## Usage

### Enable Password Saving
1. On login screen, toggle "Remember me"
2. Login with your credentials
3. App will save credentials securely

### Enable Biometric Authentication
1. Ensure "Remember me" is enabled
2. Toggle "Use biometric authentication"
3. Next time app opens, you'll be prompted for biometric authentication

### Disable/Clear Credentials
- Toggle off "Remember me" before logging in
- Or use the logout function in the app to clear credentials

## Security Benefits
- **No Plain Text**: Passwords never stored in plain text
- **Device-Level Security**: Uses platform-native secure storage
- **Biometric Integration**: Additional security layer
- **Auto-Expiry**: Prevents indefinite credential storage

## Technical Implementation
- **Expo SecureStore**: For secure credential storage
- **Expo LocalAuthentication**: For biometric authentication
- **Automatic Cleanup**: Failed authentications clear stored credentials
- **Graceful Fallback**: Always falls back to manual login if auto-login fails

This feature significantly improves user experience while maintaining security standards suitable for enterprise applications.