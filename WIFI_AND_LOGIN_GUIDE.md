# 📡 WiFi Setup & Login Guide

## 1️⃣ Update ESP32 WiFi Credentials

### Your Current Network Info:
- **Your Computer IP:** 10.168.194.162
- **Gateway:** 10.168.194.194
- **Network:** WiFi Hotspot

### Steps to Update ESP32:

1. **Open `esp32_firmware/config.h`**

2. **Update lines 10-11:**
   ```cpp
   #define WIFI_SSID "YOUR_HOTSPOT_NAME"     // Your hotspot SSID
   #define WIFI_PASSWORD "YOUR_HOTSPOT_PASSWORD"  // Your hotspot password
   ```

3. **Upload to ESP32:**
   - Open Arduino IDE
   - Select Board: ESP32 Dev Module
   - Select Port: COM3 (or your port)
   - Click Upload

4. **Verify Connection:**
   - Open Serial Monitor (115200 baud)
   - Should see:
     ```
     ✓ WiFi connected
     IP Address: 10.168.194.XXX
     ```

### Important Notes:
- ❌ **You DON'T need to change any IP addresses in code**
- ✅ ESP32 connects to Firebase (cloud), not your computer
- ✅ Dashboard connects to Firebase (cloud), not ESP32
- ✅ Everything goes through Firebase - no direct connections

---

## 2️⃣ Login System

### Admin Credentials:
- **Email:** `admin@ecomonitor.com`
- **Password:** `password123`

### How to Access:

1. **Open Dashboard:**
   ```
   web_dashboard/login.html
   ```

2. **Enter Credentials:**
   - Email: admin@ecomonitor.com
   - Password: password123

3. **Click "Sign In"**

4. **Dashboard Opens Automatically**

### Features:
- ✅ Session-based authentication
- ✅ "Remember Me" option
- ✅ Auto-redirect if not logged in
- ✅ Logout button in dashboard (top right, red button)
- ✅ Secure session management

### To Change Credentials:

Edit `web_dashboard/login.html` lines 186-187:
```javascript
const ADMIN_EMAIL = 'admin@ecomonitor.com';
const ADMIN_PASSWORD = 'password123';
```

---

## 3️⃣ Firebase Upload Issue - Debugging

### Problem:
ESP32 shows "✓ Data uploaded successfully" but Firebase doesn't receive data.

### New Debugging Added:

The ESP32 code now shows:
```
📤 Sending to Firebase:
   URL: https://ecomonitor-e79ca-default-rtdb.firebaseio.com/sensor_data.json
   Payload: {"temperature":29.3,"humidity":84.5,...}
HTTP Response: 200
📥 Firebase Response: {"name":"-OfmXXXXXXXXXXXX"}
✅ Data successfully written to Firebase!
```

### What to Check:

1. **Serial Monitor Output:**
   - Look for "✅ Data successfully written to Firebase!"
   - If you see "⚠️ WARNING: Got 200 but no key in response"
     → Data is NOT being saved

2. **Firebase Console:**
   - Go to: https://console.firebase.google.com/project/ecomonitor-e79ca/database
   - Check if new entries appear in `sensor_data`
   - Look at timestamps - should be current

3. **Common Issues:**

   **Issue A: Wrong Firebase URL**
   - Check `config.h` line 14
   - Should be: `https://ecomonitor-e79ca-default-rtdb.firebaseio.com`

   **Issue B: Firebase Rules**
   - Go to Firebase Console → Database → Rules
   - Should be:
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

   **Issue C: Time Sync Failed**
   - ESP32 needs correct time for timestamps
   - Check Serial Monitor for "✓ Time synchronized"
   - If failed, check internet connection

   **Issue D: JSON Payload Too Large**
   - Unlikely but possible
   - Check Serial Monitor for payload size

### Testing Steps:

1. **Upload Updated ESP32 Code** (with new debugging)

2. **Open Serial Monitor** (115200 baud)

3. **Press RESET** on ESP32

4. **Watch for:**
   ```
   --- Reading Sensors ---
   Temperature: XX.X°C
   Humidity: XX.X%
   Air Quality: XXX ppm
   📤 Sending to Firebase:
      URL: https://...
      Payload: {...}
   HTTP Response: 200
   📥 Firebase Response: {"name":"..."}
   ✅ Data successfully written to Firebase!
   ```

5. **Check Firebase Console:**
   - Refresh the database view
   - Look for new entry with current timestamp

6. **Check Dashboard:**
   - Refresh dashboard
   - Should show new data within 10 seconds

---

## 4️⃣ Quick Troubleshooting

### ESP32 Not Connecting to WiFi:
```
❌ WiFi connection failed
```
**Solution:**
- Check SSID and password in config.h
- Make sure hotspot is active
- Try moving ESP32 closer to hotspot
- Check if hotspot allows device connections

### ESP32 Connected but No Upload:
```
✓ WiFi connected
Connection error: connection refused
```
**Solution:**
- Check Firebase URL in config.h
- Verify Firebase rules allow write
- Check internet connection on hotspot

### Dashboard Shows Old Data:
```
⚠️ Data is 171396s old
```
**Solution:**
- ESP32 not uploading (check Serial Monitor)
- Or dashboard in debug mode (shows old data)
- Wait for fresh data or delete old Firebase data

### Can't Login to Dashboard:
```
Invalid email or password
```
**Solution:**
- Use: admin@ecomonitor.com / password123
- Check for typos
- Clear browser cache
- Try different browser

---

## 5️⃣ File Structure

```
EcoMonitor/
├── esp32_firmware/
│   ├── envitrack.ino          ← Updated with better debugging
│   └── config.h               ← Update WiFi credentials here
├── web_dashboard/
│   ├── login.html             ← NEW: Login page
│   ├── index.html             ← Updated with auth check
│   └── enhanced-styles.css    ← Updated with logout button
└── WIFI_AND_LOGIN_GUIDE.md    ← This file
```

---

## 6️⃣ Complete Setup Checklist

- [ ] Update WiFi credentials in `esp32_firmware/config.h`
- [ ] Upload updated code to ESP32
- [ ] Verify WiFi connection in Serial Monitor
- [ ] Check Firebase rules allow read/write
- [ ] Verify data appears in Firebase Console
- [ ] Open `web_dashboard/login.html`
- [ ] Login with admin@ecomonitor.com / password123
- [ ] Verify dashboard shows current data
- [ ] Test logout button
- [ ] Test "Remember Me" feature

---

## 🆘 Still Having Issues?

1. **Share Serial Monitor output** - Full output from ESP32
2. **Check Firebase Console** - Screenshot of database
3. **Check Browser Console** - Press F12, look for errors
4. **Verify all credentials** - WiFi, Firebase URL, login

---

**Your Network Info:**
- Computer IP: 10.168.194.162
- Gateway: 10.168.194.194
- ESP32 will get IP in same range (10.168.194.XXX)

**Remember:** ESP32 → Firebase (cloud) ← Dashboard
No direct connection between ESP32 and your computer!
