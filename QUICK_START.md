# EnviTrack Quick Start Guide

## ✅ What's Already Done

- ✅ Firebase project created: `ecomonitor-e79ca`
- ✅ Python dependencies installed
- ✅ Firebase URL configured in Python scripts
- ✅ ESP32 config file created with Firebase URL

## 🔧 What You Need to Do Now

### Step 1: Configure WiFi in ESP32 (2 minutes)

1. Open `esp32_firmware/config.h`
2. Replace these lines with your WiFi credentials:
   ```cpp
   #define WIFI_SSID "YOUR_WIFI_SSID"        // Your WiFi name
   #define WIFI_PASSWORD "YOUR_WIFI_PASSWORD" // Your WiFi password
   ```

### Step 2: Set Firebase Database Rules (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **ecomonitor-e79ca**
3. Click "Realtime Database" in left sidebar
4. Click "Rules" tab
5. Replace with this (for development):
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
6. Click "Publish"

⚠️ **Note:** These rules allow public access. Fine for testing, but secure it for production!

### Step 3: Install Arduino Libraries (5 minutes)

In Arduino IDE:

1. Open **Tools → Manage Libraries** (Ctrl+Shift+I)

2. Install **DHT sensor library**:
   - Search: `DHT sensor library`
   - Install: **DHT sensor library by Adafruit**
   - Click "Install All" when prompted for dependencies

3. Install **ArduinoJson**:
   - Search: `ArduinoJson`
   - Install: **ArduinoJson by Benoit Blanchon** (version 6.x)

4. Verify ESP32 board is installed:
   - Go to **Tools → Board → Boards Manager**
   - Search: `ESP32`
   - Install: **esp32 by Espressif Systems** (if not already installed)

### Step 4: Upload to ESP32 (5 minutes)

1. Connect ESP32 via USB
2. In Arduino IDE:
   - **Tools → Board** → Select "ESP32 Dev Module"
   - **Tools → Port** → Select your COM port
3. Open `esp32_firmware/envitrack.ino`
4. Click **Upload** button (→)
5. Wait for "Done uploading"

### Step 5: Monitor Serial Output

1. Open **Tools → Serial Monitor**
2. Set baud rate to **115200**
3. You should see:
   ```
   === EnviTrack Starting ===
   Connecting to WiFi...
   ✓ WiFi connected
   IP Address: 192.168.x.x
   ✓ Time synchronized
   === Setup Complete ===
   
   --- Reading Sensors ---
   Temperature: 25.5°C
   Humidity: 60.2%
   Air Quality: 450 ppm
   Upload attempt 1/3...
   ✓ Data uploaded successfully
   ```

### Step 6: Verify Data in Firebase

1. Go to Firebase Console → Realtime Database
2. You should see data appearing under `sensor_data/`
3. Data structure:
   ```
   sensor_data/
     └── {timestamp}/
         ├── temperature: 25.5
         ├── humidity: 60.2
         ├── air_quality: 450
         ├── timestamp: "2025-12-05T10:30:00Z"
         └── device_id: "ESP32_001"
   ```

### Step 7: Test Python Scripts

```powershell
# Fetch and display data
python python_backend/fetch_data.py

# Generate visualizations (after you have some data)
python python_backend/visualize.py

# Run real-time monitoring
python python_backend/alert_monitor.py
```

## 🔌 Hardware Wiring

### DHT22 (Temperature & Humidity)
```
DHT22 Pin 1 (VCC)  → ESP32 3.3V
DHT22 Pin 2 (DATA) → ESP32 GPIO 4 (with 10kΩ pull-up to 3.3V)
DHT22 Pin 4 (GND)  → ESP32 GND
```

### MQ135 (Air Quality)
```
MQ135 VCC  → ESP32 3.3V (or 5V depending on module)
MQ135 GND  → ESP32 GND
MQ135 AOUT → ESP32 GPIO 34
```

## 🐛 Troubleshooting

### ESP32 won't compile
- Make sure DHT and ArduinoJson libraries are installed
- Restart Arduino IDE after installing libraries

### WiFi won't connect
- Double-check SSID and password in config.h
- Make sure you're using 2.4GHz WiFi (ESP32 doesn't support 5GHz)
- Check WiFi signal strength

### Sensor reads NaN
- Check wiring connections
- Add 10kΩ pull-up resistor between DHT22 DATA and VCC
- Wait for MQ135 to warm up (24-48 hours for accurate readings)

### Firebase upload fails
- Verify database rules allow write access
- Check Serial Monitor for specific error messages
- Ensure ESP32 has internet access

### Python scripts show "No data"
- Make sure ESP32 has uploaded at least one reading
- Verify Firebase URL in `.env` file
- Check Firebase Console to confirm data exists

## 📊 Your Firebase Details

- **Database URL:** `https://ecomonitor-e79ca-default-rtdb.firebaseio.com`
- **Project ID:** `ecomonitor-e79ca`
- **API Key:** `AIzaSyBaWPavo-Gl005gMoy6E718KHI7WkZ-F7Y`
- **App ID:** `1:202779264082:web:fb72e74d644c2a363f4b8b`
- **Measurement ID:** `G-CXENRXDGQR`

## 🎯 Next Steps After Setup

1. Let MQ135 warm up for 24-48 hours for accurate readings
2. Calibrate MQ135 in clean outdoor air
3. Adjust alert thresholds in `python_backend/.env`
4. Set up automated monitoring with `alert_monitor.py`
5. Create visualizations with `visualize.py`

## 📝 Configuration Files Summary

- `esp32_firmware/config.h` - WiFi and Firebase settings for ESP32
- `python_backend/.env` - Firebase URL and alert thresholds for Python
- Both files are in `.gitignore` to protect your credentials

Good luck! 🚀
