# EcoMonitor Troubleshooting Guide

## ESP32 "Connection Refused" Error

### Symptoms
```
Connection error: connection refused
✗ Upload failed (attempt 1)
```

### Solution Steps

#### 1. Configure Firebase Database Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **ecomonitor-e79ca**
3. Click **"Realtime Database"** in left sidebar
4. If no database exists:
   - Click **"Create Database"**
   - Choose location (e.g., us-central1)
   - Start in **"Test mode"**
5. Click **"Rules"** tab
6. Replace with these rules:

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

7. Click **"Publish"**

⚠️ **Note**: These rules allow public read/write. For production, implement proper authentication.

#### 2. Verify WiFi Credentials

Check `esp32_firmware/config.h`:
```cpp
#define WIFI_SSID "YOUR_WIFI_SSID"        // Your actual WiFi name
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD" // Your actual WiFi password
```

#### 3. Test Firebase Connection Manually

Open this URL in your browser:
```
https://ecomonitor-e79ca-default-rtdb.firebaseio.com/sensor_data.json
```

**Expected Results:**
- ✅ Shows `null` or `{}` = Database exists and is accessible
- ❌ Shows error page = Database not created or wrong URL

#### 4. Test Manual Data Upload

Use this curl command to test:
```bash
curl -X POST https://ecomonitor-e79ca-default-rtdb.firebaseio.com/sensor_data.json \
  -H "Content-Type: application/json" \
  -d '{"temperature":25.5,"humidity":60,"air_quality":400,"timestamp":"2024-01-01T12:00:00Z","device_id":"TEST"}'
```

If successful, you should see a response with a generated key.

#### 5. Check ESP32 Serial Monitor Output

Look for these indicators:

**Good Signs:**
```
✓ WiFi connected
IP Address: 192.168.x.x
✓ Time synchronized
HTTP Response: 200
✓ Data uploaded successfully
```

**Problem Signs:**
```
✗ WiFi connection failed
Connection error: connection refused
HTTP Error: 401 (Unauthorized)
HTTP Error: 404 (Not Found)
```

#### 6. Common Issues & Fixes

| Issue | Cause | Solution |
|-------|-------|----------|
| Connection refused | Database not created | Create database in Firebase Console |
| Connection refused | Wrong URL | Verify URL matches Firebase Console |
| HTTP 401 | Auth required | Set rules to allow public write |
| HTTP 404 | Wrong path | Check FIREBASE_HOST in config.h |
| WiFi disconnected | Wrong credentials | Update WIFI_SSID and WIFI_PASSWORD |
| Time sync failed | NTP blocked | Check firewall/router settings |

#### 7. Re-upload ESP32 Code

After making changes to `config.h`:
1. Save the file
2. Click **Upload** in Arduino IDE
3. Wait for "Done uploading"
4. Open Serial Monitor (115200 baud)
5. Press ESP32 **RESET** button
6. Watch for connection messages

---

## Web Dashboard Not Showing Data

### Check Firebase Data

1. Open Firebase Console
2. Go to Realtime Database
3. Look for `sensor_data` node
4. Should see entries with timestamps

### Check Browser Console

1. Open web dashboard
2. Press **F12** (Developer Tools)
3. Go to **Console** tab
4. Look for errors

**Common Errors:**
- `Permission denied` = Check Firebase rules
- `Failed to fetch` = Check internet connection
- `CORS error` = Firebase configuration issue

---

## Python Backend Issues

### Module Not Found

```bash
pip install -r python_backend/requirements.txt
```

### Firebase Connection Error

Check `.env` file:
```
FIREBASE_DATABASE_URL=https://ecomonitor-e79ca-default-rtdb.firebaseio.com
```

### Test Python Connection

```bash
cd python_backend
python fetch_data.py
```

---

## Sensor Reading Issues

### DHT22 Returns NaN

**Causes:**
- Loose wiring
- Wrong pin number
- Sensor damaged
- Insufficient power

**Solutions:**
1. Check wiring: VCC → 3.3V, GND → GND, DATA → GPIO 4
2. Add 10kΩ pull-up resistor between DATA and VCC
3. Try different GPIO pin
4. Test with known-good sensor

### MQ135 Always Returns 0

**Causes:**
- Sensor needs warm-up time (24-48 hours for first use)
- Wrong pin (must use ADC1 pins on ESP32)
- Sensor not powered

**Solutions:**
1. Let sensor warm up for 5-10 minutes
2. Verify using GPIO 34 (ADC1_CH6)
3. Check 5V power connection
4. Calibrate sensor (see datasheet)

---

## Heartbeat Sound Not Playing

### Enable in Settings

1. Click **⚙️ Settings** button
2. Scroll to **💓 Heartbeat Sound**
3. Check the checkbox
4. Click **💾 Save Settings**

### Test Sound

1. Click **💓 Test Heartbeat** button
2. Should hear two beats
3. If no sound:
   - Check browser audio permissions
   - Unmute browser tab
   - Try different browser (Chrome/Edge recommended)

### Debug in Console

Press **F12** and type:
```javascript
debugHeartbeat()
```

Should show:
```
Active heartbeat intervals: ["temp", "humidity", "air"]
Thresholds: {tempMin: 15, tempMax: 35, ...}
AudioContext state: running
```

---

## Need More Help?

1. Check Firebase Console for errors
2. Review Serial Monitor output
3. Check browser console (F12)
4. Verify all credentials in config files
5. Test with manual curl commands

**Project Configuration:**
- Firebase Project: `ecomonitor-e79ca`
- Database URL: `https://ecomonitor-e79ca-default-rtdb.firebaseio.com`
- ESP32 Device ID: `ESP32_001`
