# Firebase Realtime Database Setup

## Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the wizard
3. Name your project (e.g., "EnviroTrack")

## Step 2: Enable Realtime Database
1. In Firebase Console, navigate to "Build" → "Realtime Database"
2. Click "Create Database"
3. Choose a location (e.g., us-central1)
4. Start in **test mode** for development

## Step 3: Get Database URL
Your database URL for this project:
```
https://ecomonitor-e79ca-default-rtdb.firebaseio.com/
```

**Project Details:**
- Project ID: `ecomonitor-e79ca`
- API Key: `AIzaSyBaWPavo-Gl005gMoy6E718KHI7WkZ-F7Y`
- App ID: `1:202779264082:web:fb72e74d644c2a363f4b8b`
- Measurement ID: `G-CXENRXDGQR`

## Step 4: Configure Database Rules

### Option A: Public Write (Development Only - NOT SECURE)
```json
{
  "rules": {
    "sensor_data": {
      ".read": true,
      ".write": true
    }
  }
}
```

### Option B: API Key Authentication (Recommended)
```json
{
  "rules": {
    "sensor_data": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

For Option B, you'll need:
1. Go to Project Settings → Service accounts
2. Generate a new private key (for Python backend)
3. For ESP32, use Web API Key from Project Settings → General

## Step 5: Get API Key (for authenticated requests)
1. Go to Project Settings → General
2. Scroll to "Your apps" section
3. Copy the "Web API Key"

## Database Structure
Data will be stored as:
```
sensor_data/
  └── {timestamp}/
      ├── temperature: 25.5
      ├── humidity: 60.2
      ├── air_quality: 450
      └── timestamp: "2025-12-05T10:30:00Z"
```

## Security Notes
- **Never use public write rules in production**
- Use Firebase Authentication or secure tokens
- Implement rate limiting
- Monitor usage in Firebase Console
