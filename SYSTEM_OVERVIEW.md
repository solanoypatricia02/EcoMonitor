# EcoMonitor - Complete Integrated System Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ECOMONITOR SYSTEM                         │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   ESP32      │         │   Firebase   │         │     Web      │
│   Hardware   │────────▶│   Realtime   │────────▶│  Dashboard   │
│              │  WiFi   │   Database   │  HTTPS  │              │
└──────────────┘         └──────────────┘         └──────────────┘
      │                         │                         │
      │                         │                         │
   Sensors                   Storage                  Display
   - DHT22                   - JSON                   - Charts
   - MQ135                   - Timestamps             - Alerts
                             - History                - PWA
                                                      - Export
```

---

## 📦 Component Details

### 1. ESP32 Firmware (`esp32_firmware/`)

**File: `envitrack.ino`**

**Features:**
- ✅ WiFi connectivity with auto-reconnect
- ✅ DHT22 temperature & humidity sensor
- ✅ MQ135 air quality sensor (with fallback)
- ✅ NTP time synchronization
- ✅ Firebase REST API integration
- ✅ Retry logic for failed uploads
- ✅ Comprehensive error handling
- ✅ Diagnostic tools for troubleshooting

**Key Functions:**
```cpp
void setup()              // Initialize hardware and WiFi
void loop()               // Main sensor reading loop
void connectWiFi()        // WiFi connection handler
void syncTime()           // NTP time synchronization
float readAirQuality()    // MQ135 sensor reading
bool sendToFirebase()     // Upload data to Firebase
void testMQ135Sensor()    // Diagnostic test for MQ135
```

**Configuration: `config.h`**
```cpp
#define WIFI_SSID "Your_WiFi"
#define WIFI_PASSWORD "Your_Password"
#define FIREBASE_HOST "https://ecomonitor-e79ca-default-rtdb.firebaseio.com"
#define DHT_PIN 4
#define MQ135_PIN 32
#define READING_INTERVAL 10000  // 10 seconds
```

---

### 2. Firebase Realtime Database

**Project:** `ecomonitor-e79ca`

**Database Structure:**
```json
{
  "sensor_data": {
    "2025-12-06T06:10:54Z": {
      "temperature": 29.3,
      "humidity": 84.5,
      "air_quality": 441,
      "timestamp": "2025-12-06T06:10:54Z",
      "device_id": "ESP32_001"
    },
    "2025-12-06T06:11:04Z": {
      ...
    }
  }
}
```

**Security Rules:**
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

**Configuration:**
- API Key: `AIzaSyBaWPavo-Gl005gMoy6E718KHI7WkZ-F7Y`
- Database URL: `https://ecomonitor-e79ca-default-rtdb.firebaseio.com`
- Project ID: `ecomonitor-e79ca`

---

### 3. Web Dashboard (`web_dashboard/`)

**Main File: `index.html`**

**Features:**

#### 📊 Real-Time Monitoring
- Live temperature display (°C)
- Live humidity display (%)
- Live air quality display (ppm)
- Auto-refresh every 10 seconds
- Last update timestamp

#### 📈 Data Visualization
- Interactive Chart.js graphs
- 24-hour trend display
- Multiple datasets (temp, humidity, air quality)
- Hover tooltips with details
- Responsive design

#### 🚨 Alert System
- Visual status indicators (Good/Warning/Critical)
- Popup notifications for threshold violations
- Heartbeat animations for critical states
- Sound alerts (customizable)
- Alert history tracking

#### 🎨 User Interface
- Modern gradient design
- Dark mode toggle
- Responsive layout (mobile-friendly)
- PWA support (installable)
- Custom EcoMonitor logo

#### ⚙️ Settings Panel
- Custom threshold configuration
  - Temperature min/max
  - Humidity min/max
  - Air quality max
- Alert sound selection (4 types)
- Heartbeat sound toggle
- Settings persistence (localStorage)

#### 💓 Heartbeat Sound System
- Warning heartbeat: 2-second cycle
- Critical heartbeat: 1-second cycle
- Synced with visual animations
- Enable/disable in settings
- Test button for preview

#### 📥 Data Export
- **CSV Export:** Download all data as spreadsheet
- **PDF Export:** AI-powered reports with:
  - Summary statistics
  - Charts and graphs
  - AI-generated insights
  - Compliance scoring
  - Recommendations

#### 🔮 Predictive Analytics
- Linear regression predictions
- 6-period forecast
- Proactive alerts
- Trend analysis

#### 📱 PWA Features
- Installable on mobile/desktop
- Offline support (service worker)
- Custom install banner
- Push notifications ready
- App-like experience

**Supporting Files:**
- `enhanced-styles.css` - Complete styling
- `features.js` - All enhanced features
- `manifest.json` - PWA configuration
- `sw.js` - Service worker for offline support

---

### 4. Python Backend (`python_backend/`)

**Files:**

#### `fetch_data.py`
```python
# Fetch and display latest sensor data from Firebase
# Usage: python fetch_data.py
```

#### `alert_monitor.py`
```python
# Monitor data and send alerts when thresholds exceeded
# Runs continuously in background
# Usage: python alert_monitor.py
```

#### `visualize.py`
```python
# Generate matplotlib visualizations
# Create charts and graphs from historical data
# Usage: python visualize.py
```

#### `requirements.txt`
```
requests
python-dotenv
firebase-admin
matplotlib
```

#### `.env`
```
FIREBASE_DATABASE_URL=https://ecomonitor-e79ca-default-rtdb.firebaseio.com
TEMP_MAX=35.0
TEMP_MIN=15.0
HUMIDITY_MAX=80.0
HUMIDITY_MIN=30.0
AIR_QUALITY_MAX=600
```

---

## 🔄 Data Flow

### 1. Data Collection (ESP32)
```
Sensors → ESP32 → JSON Payload → Firebase
  ↓
DHT22: Temperature & Humidity
MQ135: Air Quality
  ↓
Every 10 seconds
```

### 2. Data Storage (Firebase)
```
Firebase Realtime Database
  ↓
Automatic timestamp indexing
Real-time synchronization
Unlimited history
```

### 3. Data Display (Web Dashboard)
```
Firebase → JavaScript → Chart.js → Browser
  ↓
Real-time updates
Visual alerts
Interactive charts
```

### 4. Data Analysis (Python)
```
Firebase → Python Scripts → Analysis/Alerts
  ↓
Threshold monitoring
Visualizations
Email alerts (optional)
```

---

## 🎯 Key Features Summary

### Hardware Layer
- ✅ ESP32 microcontroller
- ✅ DHT22 temperature/humidity sensor
- ✅ MQ135 air quality sensor
- ✅ WiFi connectivity
- ✅ Auto-reconnect logic
- ✅ Error handling

### Data Layer
- ✅ Firebase Realtime Database
- ✅ REST API integration
- ✅ Automatic timestamps
- ✅ Unlimited data storage
- ✅ Real-time synchronization

### Presentation Layer
- ✅ Modern web dashboard
- ✅ Real-time charts
- ✅ Visual alerts
- ✅ Dark mode
- ✅ PWA support
- ✅ Mobile responsive

### Advanced Features
- ✅ Custom thresholds
- ✅ Alert sounds
- ✅ Heartbeat animations
- ✅ Data export (CSV/PDF)
- ✅ AI-powered insights
- ✅ Predictive analytics
- ✅ Offline support

---

## 📊 Threshold System

### Default Thresholds
```javascript
{
  tempMin: 15°C,
  tempMax: 35°C,
  humidityMin: 30%,
  humidityMax: 80%,
  airMax: 600 ppm
}
```

### Status Levels
- **Good:** Within normal range (green)
- **Warning:** Approaching limits (yellow, heartbeat)
- **Critical:** Exceeded limits (red, fast heartbeat)

### Alert Actions
1. Visual status change
2. Popup notification
3. Sound alert
4. Heartbeat animation
5. Alert history log

---

## 🔊 Sound System

### Alert Sounds (4 types)
1. **Default:** Two-tone beep
2. **Chime:** Three ascending tones
3. **Bell:** Single triangle wave
4. **Siren:** Urgent sawtooth sweep

### Heartbeat Sounds
- **Warning:** 400Hz/350Hz, 2-second cycle
- **Critical:** 500Hz/450Hz, 1-second cycle
- Synced with visual animations
- Enable/disable in settings

---

## 📱 PWA Configuration

### Manifest (`manifest.json`)
```json
{
  "name": "EcoMonitor - Environmental Monitoring Systems",
  "short_name": "EcoMonitor",
  "icons": [
    {
      "src": "../images/logo.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ],
  "display": "standalone",
  "theme_color": "#10b981"
}
```

### Service Worker (`sw.js`)
- Caches static assets
- Offline functionality
- Background sync ready
- Push notifications ready

---

## 🚀 Quick Start

### 1. Hardware Setup
```
ESP32 Connections:
- DHT22 Data → GPIO 4
- MQ135 A0 → GPIO 32
- MQ135 VCC → 5V
- MQ135 GND → GND
```

### 2. Configure ESP32
```cpp
// Edit esp32_firmware/config.h
#define WIFI_SSID "Your_WiFi_Name"
#define WIFI_PASSWORD "Your_WiFi_Password"
```

### 3. Upload Firmware
```
1. Open envitrack.ino in Arduino IDE
2. Select board: ESP32 Dev Module
3. Select port: COM3 (or your port)
4. Click Upload
```

### 4. Open Web Dashboard
```
1. Open web_dashboard/index.html in browser
2. Data should appear within 10 seconds
3. Install as PWA (optional)
```

### 5. Run Python Scripts (Optional)
```bash
cd python_backend
pip install -r requirements.txt
python fetch_data.py
python alert_monitor.py  # Run in background
```

---

## 🔧 Troubleshooting

### ESP32 Not Connecting
- Check WiFi credentials
- Verify Firebase URL
- Check Serial Monitor (115200 baud)

### No Data in Dashboard
- Check Firebase rules (public read/write)
- Verify database URL in HTML
- Check browser console (F12)

### MQ135 Reading 0
- Check wiring (VCC→5V, A0→GPIO32)
- Wait 5-10 minutes for warm-up
- See MQ135_TROUBLESHOOTING.md

### Heartbeat Sound Not Playing
- Enable in settings
- Check browser audio permissions
- Try different browser (Chrome recommended)

---

## 📚 Documentation Files

- `README.md` - Project overview
- `SETUP_GUIDE.md` - Detailed setup instructions
- `QUICK_START.md` - Fast setup guide
- `firebase_setup.md` - Firebase configuration
- `TROUBLESHOOTING.md` - Common issues
- `MQ135_TROUBLESHOOTING.md` - Sensor-specific help
- `MQ135_HARDWARE_TEST.md` - Hardware testing
- `FEATURE_SUGGESTIONS.md` - Future enhancements
- `SYSTEM_OVERVIEW.md` - This file

---

## 🎨 Customization

### Change Thresholds
Settings panel → Adjust values → Save

### Change Colors
Edit `enhanced-styles.css`:
```css
--primary-color: #10b981;
--warning-color: #f59e0b;
--critical-color: #ef4444;
```

### Change Reading Interval
Edit `config.h`:
```cpp
#define READING_INTERVAL 10000  // milliseconds
```

### Add More Sensors
1. Connect sensor to ESP32
2. Add reading function in .ino
3. Update Firebase payload
4. Update web dashboard display

---

## 📈 Future Enhancements

- [ ] Email/SMS alerts
- [ ] Multiple device support
- [ ] Historical data analysis
- [ ] Machine learning predictions
- [ ] Mobile app (React Native)
- [ ] Cloud deployment
- [ ] User authentication
- [ ] Data backup system
- [ ] API for third-party integration

---

## 🏆 System Status

**Current Version:** 2.0
**Status:** ✅ Fully Operational
**Last Updated:** December 6, 2025

**Working Components:**
- ✅ ESP32 firmware
- ✅ Firebase integration
- ✅ Web dashboard
- ✅ Real-time monitoring
- ✅ Alert system
- ✅ PWA features
- ✅ Data export
- ✅ Python backend

**Known Issues:**
- ⚠️ MQ135 sensor requires troubleshooting (fallback active)
- ⚠️ Firebase rules are public (development mode)

---

## 📞 Support

For issues or questions:
1. Check TROUBLESHOOTING.md
2. Review Serial Monitor output
3. Check browser console (F12)
4. Verify Firebase Console
5. Test with diagnostic tools

---

**EcoMonitor** - Professional Environmental Monitoring System
Built with ESP32, Firebase, and Modern Web Technologies
