# EnviTrack ESP32 Firmware

## Required Libraries
Install these libraries via Arduino IDE Library Manager:

1. **DHT sensor library** by Adafruit (v1.4.4+)
2. **Adafruit Unified Sensor** by Adafruit (v1.1.9+)
3. **ArduinoJson** by Benoit Blanchon (v6.21.0+)

## Installation Steps

### 1. Install Arduino IDE
- Download from [arduino.cc](https://www.arduino.cc/en/software)
- Install ESP32 board support:
  - Go to File → Preferences
  - Add to "Additional Board Manager URLs": 
    ```
    https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
    ```
  - Go to Tools → Board → Boards Manager
  - Search "ESP32" and install "esp32 by Espressif Systems"

### 2. Configure WiFi and Firebase
1. Copy `config.h.example` to `config.h`
2. Edit `config.h` with your credentials:
   - WiFi SSID and password
   - Firebase database URL (from Firebase Console)
   - Optional: Firebase auth token

### 3. Upload to ESP32
1. Connect ESP32 via USB
2. Select board: Tools → Board → ESP32 Dev Module
3. Select port: Tools → Port → (your COM port)
4. Click Upload button

## Pin Connections

### DHT22 Temperature & Humidity Sensor
```
DHT22 Pin 1 (VCC)  → ESP32 3.3V
DHT22 Pin 2 (DATA) → ESP32 GPIO 4
DHT22 Pin 3 (NC)   → Not connected
DHT22 Pin 4 (GND)  → ESP32 GND
```
Note: Add 10kΩ pull-up resistor between DATA and VCC

### MQ135 Air Quality Sensor
```
MQ135 VCC  → ESP32 3.3V or 5V (check your module)
MQ135 GND  → ESP32 GND
MQ135 AOUT → ESP32 GPIO 34 (ADC1_CH6)
```
Note: MQ135 requires 24-48h preheat time for accurate readings

## Troubleshooting

### WiFi Connection Issues
- Verify SSID and password in config.h
- Check WiFi signal strength
- Ensure 2.4GHz network (ESP32 doesn't support 5GHz)

### Sensor Reading Errors
- Check wiring connections
- Verify sensor power supply (3.3V or 5V)
- DHT22: Add pull-up resistor if readings are NaN
- MQ135: Allow warm-up time (24-48 hours)

### Firebase Upload Failures
- Verify Firebase URL format (must end with .firebaseio.com)
- Check database rules allow write access
- Monitor Serial output for error messages
- Verify internet connectivity

### Serial Monitor
- Baud rate: 115200
- Shows connection status, sensor readings, and upload results
- Use for debugging and monitoring

## Calibration

### MQ135 Air Quality Sensor
The default code uses a simplified linear mapping. For accurate ppm readings:
1. Calibrate in clean air (outdoor reference)
2. Use manufacturer's datasheet for proper conversion formula
3. Consider temperature and humidity compensation
4. Update the `readAirQuality()` function with calibration values

## Power Consumption
- Active mode: ~160-260mA
- Deep sleep mode: ~10μA (not implemented in this version)
- For battery operation, consider implementing deep sleep between readings

## Security Notes
- Never commit config.h with real credentials
- Use Firebase authentication in production
- Implement rate limiting
- Consider using HTTPS certificates for secure communication
