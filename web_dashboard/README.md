# EnviTrack Web Dashboard

Real-time web dashboard for monitoring your environmental sensors.

## Features

✅ Real-time data updates from Firebase
✅ Live sensor readings (Temperature, Humidity, Air Quality)
✅ Status indicators with color-coded alerts
✅ Historical data chart (last 50 readings)
✅ Responsive design - works on mobile and desktop
✅ No server required - runs directly in browser

## How to Use

### Option 1: Open Directly (Simplest)

1. Navigate to the `web_dashboard` folder
2. Double-click `index.html`
3. It will open in your default browser
4. Dashboard will automatically connect to Firebase and display real-time data

### Option 2: Run with Python HTTP Server

```powershell
cd web_dashboard
python -m http.server 8000
```

Then open: http://localhost:8000

### Option 3: Use Live Server (VS Code)

1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

## Dashboard Features

### Current Readings
- **Temperature**: Shows current temperature in °C with status indicator
- **Humidity**: Shows current humidity percentage with status indicator
- **Air Quality**: Shows air quality in ppm with status indicator

### Status Indicators
- 🟢 **Normal**: Values within safe range
- 🟡 **Warning**: Values approaching threshold
- 🔴 **Alert**: Values exceed safe threshold

### Historical Chart
- Displays last 50 sensor readings
- Updates automatically in real-time
- Shows trends for all three sensors
- Dual Y-axis for better visualization

## Thresholds

Current alert thresholds:
- **Temperature**: 15°C - 35°C
- **Humidity**: 30% - 80%
- **Air Quality**: < 600 ppm

## Customization

To change thresholds, edit the `getStatus()` function in `index.html`:

```javascript
function getStatus(value, min, max) {
    if (value < min || value > max) return 'danger';
    if (value < min * 1.1 || value > max * 0.9) return 'warning';
    return 'good';
}
```

## Troubleshooting

### Dashboard shows "No sensor data available"
- Make sure your ESP32 is powered on and connected
- Check that ESP32 is uploading data (check Serial Monitor)
- Verify Firebase database has data in the `sensor_data` node

### Dashboard shows "Error loading data"
- Check your internet connection
- Verify Firebase database rules allow read access
- Check browser console (F12) for detailed error messages

### Data not updating
- Refresh the page
- Check Firebase Console to see if new data is arriving
- Verify ESP32 is still connected (check Serial Monitor)

## Browser Compatibility

Works with:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## Security Note

The dashboard uses your Firebase API key which is visible in the HTML. This is normal for web apps, but make sure your Firebase security rules are properly configured to prevent unauthorized writes.

Current rules (read-only for dashboard):
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

For production, consider implementing Firebase Authentication.
