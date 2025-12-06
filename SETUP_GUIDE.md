# EnviTrack Complete Setup Guide

## Overview
This guide walks you through setting up the complete EnviTrack environmental monitoring system from scratch.

## Prerequisites
- ESP32 development board
- MQ135 air quality sensor
- DHT22 temperature/humidity sensor
- USB cable for ESP32
- WiFi network (2.4GHz)
- Computer with Arduino IDE
- Python 3.8+ (for backend scripts)

---

## Part 1: Firebase Setup (15 minutes)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: "EnviTrack" (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Realtime Database
1. In left sidebar, click "Build" → "Realtime Database"
2. Click "Create Database"
3. Choose location closest to you
4. Start in **Test Mode** (for development)
5. Click "Enable"

### Step 3: Get Database URL
1. In Realtime Database page, note the URL at top:
   ```
   https://YOUR-PROJECT-ID-default-rtdb.firebaseio.com/
   ```
2. Copy this URL - you'll need it for ESP32 and Python

### Step 4: Configure Security Rules
1. Click "Rules" tab in Realtime Database
2. For development, use:
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
3. Click "Publish"

⚠️ **Security Warning**: These rules allow public access. For production:
- Implement Firebase Authentication
- Use secure API keys
- Add rate limiting

---

## Part 2: Hardware Setup (30 minutes)

### Wiring Diagram

```
ESP32 Pinout:
┌─────────────────┐
│     ESP32       │
│                 │
│  3.3V ●─────────┼─→ DHT22 VCC
│  GND  ●─────────┼─→ DHT22 GND, MQ135 GND
│  GPIO4●─────────┼─→ DHT22 DATA (with 10kΩ pull-up to 3.3V)
│  GPIO34●────────┼─→ MQ135 AOUT
│  3.3V ●─────────┼─→ MQ135 VCC (or 5V if module requires)
│                 │
└─────────────────┘
```

### DHT22 Connection
1. Pin 1 (VCC) → ESP32 3.3V
2. Pin 2 (DATA) → ESP32 GPIO 4
3. Pin 4 (GND) → ESP32 GND
4. Add 10kΩ resistor between DATA and VCC

### MQ135 Connection
1. VCC → ESP32 3.3V (or 5V depending on module)
2. GND → ESP32 GND
3. AOUT → ESP32 GPIO 34

### Important Notes
- MQ135 needs 24-48 hours warm-up for accurate readings
- Use breadboard for prototyping
- Double-check polarity before powering on

---

## Part 3: ESP32 Firmware Setup (20 minutes)

### Step 1: Install Arduino IDE
1. Download from [arduino.cc](https://www.arduino.cc/en/software)
2. Install for your operating system

### Step 2: Add ESP32 Board Support
1. Open Arduino IDE
2. Go to File → Preferences
3. In "Additional Board Manager URLs", add:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
4. Click OK
5. Go to Tools → Board → Boards Manager
6. Search "ESP32"
7. Install "esp32 by Espressif Systems"

### Step 3: Install Required Libraries
1. Go to Tools → Manage Libraries
2. Install these libraries:
   - **DHT sensor library** by Adafruit
   - **Adafruit Unified Sensor** by Adafruit
   - **ArduinoJson** by Benoit Blanchon

### Step 4: Configure Firmware
1. Navigate to `esp32_firmware/` folder
2. Copy `config.h.example` to `config.h`
3. Edit `config.h`:
   ```cpp
   #define WIFI_SSID "YourWiFiName"
   #define WIFI_PASSWORD "YourWiFiPassword"
   #define FIREBASE_HOST "https://your-project-id-default-rtdb.firebaseio.com"
   ```

### Step 5: Upload to ESP32
1. Connect ESP32 via USB
2. In Arduino IDE:
   - Tools → Board → ESP32 Dev Module
   - Tools → Port → (select your COM port)
3. Open `envitrack.ino`
4. Click Upload button (→)
5. Wait for "Done uploading"

### Step 6: Monitor Serial Output
1. Open Tools → Serial Monitor
2. Set baud rate to 115200
3. You should see:
   ```
   === EnviTrack Starting ===
   Connecting to WiFi...
   ✓ WiFi connected
   ✓ Time synchronized
   === Setup Complete ===
   ```

---

## Part 4: Python Backend Setup (15 minutes)

### Step 1: Install Python Dependencies
```bash
cd python_backend
pip install -r requirements.txt
```

### Step 2: Configure Environment
1. Copy `.env.example` to `.env`
2. Edit `.env`:
   ```
   FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
   TEMP_MAX=35.0
   TEMP_MIN=15.0
   HUMIDITY_MAX=80.0
   HUMIDITY_MIN=30.0
   AIR_QUALITY_MAX=600
   ```

### Step 3: Test Data Fetching
```bash
python fetch_data.py
```
You should see sensor data if ESP32 has uploaded any.

---

## Part 5: Testing & Verification (10 minutes)

### Test 1: Verify Data Upload
1. Check Serial Monitor on ESP32
2. Look for "✓ Data uploaded successfully"
3. Go to Firebase Console → Realtime Database
4. You should see data under `sensor_data/`

### Test 2: Fetch Data with Python
```bash
python fetch_data.py
```
Should display statistics and save CSV file.

### Test 3: Generate Visualizations
```bash
python visualize.py
```
Should create PNG plots of sensor trends.

### Test 4: Run Alert Monitor
```bash
python alert_monitor.py
```
Monitors in real-time and alerts on threshold violations.

---

## Part 6: Customization

### Adjust Reading Interval
In `esp32_firmware/config.h`:
```cpp
#define READING_INTERVAL 60000  // milliseconds (60000 = 1 minute)
```

### Calibrate MQ135
1. Let sensor warm up 24-48 hours
2. Take readings in clean outdoor air
3. Update conversion formula in `readAirQuality()` function
4. Refer to MQ135 datasheet for proper calibration

### Customize Alert Thresholds
Edit `python_backend/.env`:
```
TEMP_MAX=30.0      # Maximum temperature in °C
HUMIDITY_MAX=70.0  # Maximum humidity in %
AIR_QUALITY_MAX=500 # Maximum air quality in ppm
```

---

## Troubleshooting

### ESP32 won't connect to WiFi
- Verify SSID and password
- Ensure 2.4GHz network (not 5GHz)
- Check WiFi signal strength
- Try moving closer to router

### Sensor readings show NaN
- Check wiring connections
- Verify power supply voltage
- Add pull-up resistor for DHT22
- Wait for MQ135 warm-up period

### Firebase upload fails
- Verify database URL format
- Check database rules allow write
- Ensure internet connectivity
- Check Serial Monitor for error details

### Python scripts can't fetch data
- Verify FIREBASE_DATABASE_URL in .env
- Check Firebase database has data
- Ensure database rules allow read access
- Check internet connection

---

## Next Steps

### Production Deployment
1. Implement Firebase Authentication
2. Use environment-specific configs
3. Add HTTPS certificate pinning
4. Implement deep sleep for battery operation
5. Set up automated backups

### Feature Enhancements
1. Add more sensors (CO2, PM2.5, etc.)
2. Implement web dashboard
3. Add email/SMS notifications
4. Create mobile app
5. Add data export features
6. Implement machine learning predictions

### Monitoring & Maintenance
1. Set up Firebase usage alerts
2. Monitor ESP32 uptime
3. Regular sensor calibration
4. Database cleanup for old data
5. Update firmware OTA (Over-The-Air)

---

## Support & Resources

- **Firebase Documentation**: https://firebase.google.com/docs/database
- **ESP32 Documentation**: https://docs.espressif.com/
- **DHT22 Datasheet**: Search "DHT22 datasheet"
- **MQ135 Datasheet**: Search "MQ135 datasheet"

## License
This project is open source. Modify and use as needed.
