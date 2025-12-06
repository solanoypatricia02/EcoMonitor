# 🌍 EcoMonitor - Environmental Monitoring System

<div align="center">

![EcoMonitor Logo](images/logo.png)

**Real-time environmental monitoring with ESP32, Firebase, and AI-powered insights**

[![ESP32](https://img.shields.io/badge/ESP32-Supported-green.svg)](https://www.espressif.com/en/products/socs/esp32)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-orange.svg)](https://firebase.google.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-blue.svg)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Overview

EcoMonitor is a comprehensive IoT environmental monitoring system that tracks temperature, humidity, and air quality in real-time. Built with ESP32 microcontroller, Firebase Realtime Database, and a modern Progressive Web App (PWA) dashboard.

### 🎯 Key Highlights

- 📊 **Real-time Monitoring** - Live data updates every 10 seconds
- 🌐 **Cloud Storage** - Firebase Realtime Database integration
- 📱 **PWA Dashboard** - Installable web app with offline support
- 🚨 **Smart Alerts** - Visual and audio notifications with heartbeat animations
- 📈 **Data Visualization** - Interactive charts with Chart.js
- 🤖 **AI Insights** - Automated analysis and recommendations
- 📥 **Data Export** - CSV and PDF reports with AI-generated insights
- 🔮 **Predictive Analytics** - Trend forecasting and proactive alerts
- 🎨 **Dark Mode** - Eye-friendly interface
- ⚙️ **Custom Thresholds** - Configurable alert levels

---

## ✨ Features

### Hardware Layer
- ✅ ESP32 microcontroller with WiFi
- ✅ DHT22 temperature & humidity sensor
- ✅ MQ135 air quality sensor (CO2, NH3, NOx, smoke)
- ✅ Auto-reconnect and error handling
- ✅ NTP time synchronization

### Software Layer
- ✅ Firebase Realtime Database integration
- ✅ REST API communication
- ✅ Real-time data synchronization
- ✅ Unlimited data storage

### Web Dashboard
- ✅ Modern, responsive design
- ✅ Real-time charts and graphs
- ✅ Visual status indicators (Good/Warning/Critical)
- ✅ Popup notifications
- ✅ Heartbeat animations for critical states
- ✅ Customizable alert sounds
- ✅ Dark mode toggle
- ✅ PWA support (installable)
- ✅ Offline functionality

### Advanced Features
- ✅ Custom threshold configuration
- ✅ Alert sound system (4 types)
- ✅ Heartbeat sound effects
- ✅ CSV data export
- ✅ PDF report generation with AI insights
- ✅ Predictive analytics
- ✅ Compliance scoring
- ✅ Python backend for analysis

---

## 🖼️ Demo

### Dashboard
![Dashboard Screenshot](images/dashboard-preview.png)

### Features
- **Real-time Monitoring**: Live temperature, humidity, and air quality
- **Interactive Charts**: 24-hour trend visualization
- **Smart Alerts**: Visual and audio notifications
- **PWA Support**: Install as native app

---

## 🛠️ Hardware Requirements

| Component | Specification | Quantity |
|-----------|--------------|----------|
| ESP32 Dev Board | ESP32-WROOM-32 | 1 |
| DHT22 Sensor | Temperature & Humidity | 1 |
| MQ135 Sensor | Air Quality (Analog) | 1 |
| Jumper Wires | Male-to-Male | 10+ |
| Breadboard | Standard | 1 |
| USB Cable | Micro-USB or USB-C | 1 |
| Power Supply | 5V 2A (optional) | 1 |

### Pin Connections

```
ESP32          →    DHT22
─────────────────────────
GPIO 4         →    Data
3.3V           →    VCC
GND            →    GND

ESP32          →    MQ135
─────────────────────────
GPIO 32        →    A0 (Analog Out)
5V (VIN)       →    VCC
GND            →    GND
```

**Important Notes:**
- MQ135 requires 5V power (connect to VIN pin)
- MQ135 needs 24-48 hours warm-up for first use
- Use GPIO 32, 33, 34, 35, 36, or 39 for analog input

---

## 📦 Installation

### 1. Clone Repository

```bash
git clone https://github.com/solanoypatricia02/EcoMonitor.git
cd EcoMonitor
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: `ecomonitor-e79ca`
3. Enable Realtime Database
4. Set security rules (see `firebase_setup.md`)
5. Copy your Firebase configuration

### 3. ESP32 Firmware Setup

1. **Install Arduino IDE** with ESP32 board support
2. **Install Libraries:**
   - DHT sensor library
   - ArduinoJson
   - (WiFi and HTTPClient are built-in)

3. **Configure WiFi and Firebase:**
   ```bash
   cd esp32_firmware
   cp config.h.example config.h
   # Edit config.h with your credentials
   ```

4. **Edit `config.h`:**
   ```cpp
   #define WIFI_SSID "Your_WiFi_Name"
   #define WIFI_PASSWORD "Your_WiFi_Password"
   #define FIREBASE_HOST "https://ecomonitor-e79ca-default-rtdb.firebaseio.com"
   ```

5. **Upload to ESP32:**
   - Open `envitrack.ino` in Arduino IDE
   - Select Board: "ESP32 Dev Module"
   - Select Port: Your COM port
   - Click Upload

### 4. Web Dashboard Setup

1. **Update Firebase Config** in `web_dashboard/index.html`:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "ecomonitor-e79ca.firebaseapp.com",
     databaseURL: "https://ecomonitor-e79ca-default-rtdb.firebaseio.com",
     projectId: "ecomonitor-e79ca",
     // ... other config
   };
   ```

2. **Open Dashboard:**
   - Simply open `web_dashboard/index.html` in a browser
   - Or deploy to web hosting (Firebase Hosting, Netlify, etc.)

3. **Install as PWA** (optional):
   - Click the install button in your browser
   - Or use the custom install banner

### 5. Python Backend Setup (Optional)

```bash
cd python_backend
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Firebase URL

# Run scripts
python fetch_data.py        # Fetch latest data
python alert_monitor.py     # Monitor and alert
python visualize.py         # Generate charts
```

---

## 🚀 Quick Start

### Option 1: Hardware + Dashboard
1. Connect sensors to ESP32
2. Upload firmware with your WiFi credentials
3. Open web dashboard in browser
4. Data appears within 10 seconds!

### Option 2: Simulated Mode (Testing)
1. Upload firmware (sensor not required)
2. System uses simulated data automatically
3. Test all features without hardware

---

## 📖 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions
- **[QUICK_START.md](QUICK_START.md)** - Fast setup guide
- **[firebase_setup.md](firebase_setup.md)** - Firebase configuration
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
- **[MQ135_TROUBLESHOOTING.md](MQ135_TROUBLESHOOTING.md)** - Sensor-specific help
- **[SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md)** - Complete system architecture
- **[FEATURE_SUGGESTIONS.md](FEATURE_SUGGESTIONS.md)** - Future enhancements

---

## 🎨 Features in Detail

### Real-Time Monitoring
- Live temperature display (°C)
- Live humidity display (%)
- Live air quality display (ppm)
- Auto-refresh every 10 seconds
- Last update timestamp

### Alert System
- **Visual Indicators:**
  - 🟢 Good: Within normal range
  - 🟡 Warning: Approaching limits (heartbeat animation)
  - 🔴 Critical: Exceeded limits (fast heartbeat)

- **Audio Alerts:**
  - Default beep
  - Chime
  - Bell
  - Siren (urgent)

- **Heartbeat Sounds:**
  - Warning: 2-second cycle
  - Critical: 1-second cycle
  - Synced with visual animations

### Data Export
- **CSV Export:** Download all data as spreadsheet
- **PDF Reports:** AI-powered reports with:
  - Summary statistics
  - Charts and graphs
  - AI-generated insights
  - Compliance scoring
  - Recommendations

### Customization
- Adjustable thresholds for all sensors
- Multiple alert sound options
- Enable/disable heartbeat sounds
- Dark mode toggle
- Settings persistence

---

## 🔧 Configuration

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

### Adjust in Dashboard
1. Click ⚙️ Settings button
2. Modify threshold values
3. Select alert sound
4. Enable/disable heartbeat sound
5. Click 💾 Save Settings

---

## 📊 System Architecture

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   ESP32      │         │   Firebase   │         │     Web      │
│   Hardware   │────────▶│   Realtime   │────────▶│  Dashboard   │
│              │  WiFi   │   Database   │  HTTPS  │              │
└──────────────┘         └──────────────┘         └──────────────┘
      │                         │                         │
   Sensors                   Storage                  Display
   - DHT22                   - JSON                   - Charts
   - MQ135                   - History                - Alerts
                                                      - PWA
```

---

## 🐛 Troubleshooting

### ESP32 Not Connecting
- Check WiFi credentials in `config.h`
- Verify Firebase URL
- Check Serial Monitor (115200 baud)

### No Data in Dashboard
- Verify Firebase rules allow public read/write
- Check Firebase URL in HTML
- Open browser console (F12) for errors

### MQ135 Reading 0
- Check wiring (VCC→5V, A0→GPIO32)
- Wait 5-10 minutes for sensor warm-up
- See [MQ135_TROUBLESHOOTING.md](MQ135_TROUBLESHOOTING.md)

### More Help
See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for comprehensive solutions.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Patricia Solano** - [solanoypatricia02](https://github.com/solanoypatricia02)

---

## 🙏 Acknowledgments

- ESP32 community for excellent documentation
- Firebase for reliable cloud infrastructure
- Chart.js for beautiful visualizations
- All open-source contributors

---

## 📞 Support

For issues or questions:
- 📧 Open an issue on GitHub
- 📖 Check documentation files
- 🔍 Review troubleshooting guides

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐!

---

<div align="center">

**Built with ❤️ using ESP32, Firebase, and Modern Web Technologies**

[⬆ Back to Top](#-ecomonitor---environmental-monitoring-system)

</div>
