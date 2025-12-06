# MQ135 Air Quality Sensor Troubleshooting Guide

## Problem: MQ135 Always Returns 0 ppm

### Quick Diagnosis

Upload the updated code and check the Serial Monitor. You should see:
```
=== MQ135 Sensor Diagnostic ===
Pin configured: GPIO 34
Taking 20 sample readings:
Sample 1: 0 ❌ (No signal - check wiring)
```

---

## Common Causes & Solutions

### 1. ❌ Wiring Issues (Most Common)

**Symptoms:** Raw ADC value = 0

**MQ135 Pin Configuration:**
```
MQ135 Sensor    →    ESP32
─────────────────────────────
VCC (Power)     →    5V or VIN
GND (Ground)    →    GND
A0 (Analog Out) →    GPIO 34
D0 (Digital)    →    Not connected
```

**Important Notes:**
- ⚠️ MQ135 needs **5V power** (not 3.3V) for proper operation
- ⚠️ A0 output is 0-5V but ESP32 ADC is 0-3.3V safe
- ⚠️ Use a **voltage divider** if A0 outputs >3.3V to protect ESP32

**Voltage Divider Circuit (Recommended):**
```
MQ135 A0 ──┬── 10kΩ Resistor ──┬── GPIO 34
           │                    │
           └── 20kΩ Resistor ───┴── GND
```

This reduces 5V to ~1.67V (safe for ESP32).

**Check Your Wiring:**
1. Verify VCC connected to 5V pin on ESP32
2. Verify GND connected to GND
3. Verify A0 connected to GPIO 34 (ADC1_CH6)
4. Check for loose connections
5. Try different jumper wires

---

### 2. ⏰ Sensor Warm-Up Time

**Symptoms:** Raw ADC value < 100, gradually increasing

**MQ135 Warm-Up Requirements:**
- **First-time use:** 24-48 hours continuous power
- **After power off:** 5-10 minutes warm-up
- **Stable readings:** After 20-30 minutes

**Solution:**
1. Keep ESP32 powered on
2. Wait 10 minutes
3. Check if readings increase
4. For new sensors, leave powered for 24 hours

**Expected Behavior:**
```
Minute 0:  Raw ADC: 50   (Cold sensor)
Minute 5:  Raw ADC: 200  (Warming up)
Minute 10: Raw ADC: 450  (Getting stable)
Minute 20: Raw ADC: 520  (Stable)
```

---

### 3. 🔌 Wrong GPIO Pin

**Symptoms:** Raw ADC value = 0 or 4095

**ESP32 ADC Restrictions:**
- ✅ **Use ADC1 pins:** GPIO 32, 33, 34, 35, 36, 39
- ❌ **Don't use ADC2 pins** when WiFi is active
- ❌ **Don't use GPIO 25, 26** (ADC2 - conflicts with WiFi)

**Recommended Pin:** GPIO 34 (ADC1_CH6)

**Change Pin in config.h:**
```cpp
#define MQ135_PIN 34  // Try 32, 33, 35, 36, or 39 if 34 doesn't work
```

---

### 4. 🔋 Power Supply Issues

**Symptoms:** Readings fluctuate wildly or sensor doesn't work

**MQ135 Power Requirements:**
- Voltage: 5V DC
- Current: 150-200 mA (heating element)
- Power: ~1W

**Solutions:**

**Option A: USB Power (Recommended)**
- Use USB cable with good power supply (2A minimum)
- Connect MQ135 VCC to ESP32 VIN pin (5V from USB)

**Option B: External Power Supply**
- Use 5V 2A power adapter
- Connect grounds together (ESP32 GND + Power Supply GND)
- Connect MQ135 VCC to external 5V

**Option C: Battery Power**
- Use 5V power bank or battery pack
- Ensure sufficient current capacity (2A+)

**Check Power:**
```cpp
// Add to setup() for testing
Serial.println("Testing power supply...");
pinMode(MQ135_PIN, INPUT);
delay(5000);  // Wait 5 seconds
int testRead = analogRead(MQ135_PIN);
Serial.printf("Initial reading: %d\n", testRead);
```

---

### 5. 🛠️ Sensor Calibration

**Symptoms:** Readings seem incorrect but sensor is working

**MQ135 outputs different voltages for different gases:**
- Clean air: ~0.5-1.5V (ADC: 600-1800)
- Normal indoor: ~1.5-2.5V (ADC: 1800-3000)
- Poor air quality: ~2.5-3.3V (ADC: 3000-4095)

**Calibration Steps:**

1. **Test in clean outdoor air:**
```cpp
// Expected: 200-800 ppm
```

2. **Test near pollution source (car exhaust, smoke):**
```cpp
// Expected: 800-2000+ ppm
```

3. **Adjust mapping in code:**
```cpp
// Current (linear mapping):
float ppm = map(rawValue, 0, 4095, 0, 1000);

// Better (calibrated mapping):
float ppm = map(rawValue, 600, 3000, 50, 800);
// Where:
// 600 = ADC value in clean air
// 3000 = ADC value in polluted air
// 50 = ppm in clean air
// 800 = ppm in polluted air
```

---

### 6. 🧪 Advanced: Proper MQ135 Calculation

For more accurate readings, use the resistance-based formula:

```cpp
float readAirQuality() {
  // Read analog value
  int rawValue = analogRead(MQ135_PIN);
  
  // Convert ADC to voltage (0-3.3V for ESP32)
  float voltage = (rawValue / 4095.0) * 3.3;
  
  // If using voltage divider, adjust:
  // voltage = voltage * (R1 + R2) / R2
  // For 10k + 20k divider: voltage = voltage * 1.5
  
  // Calculate sensor resistance
  float RL = 10.0;  // Load resistance in kΩ (check your module)
  float RS = ((5.0 * RL) / voltage) - RL;
  
  // Calculate ratio RS/R0
  float R0 = 76.63;  // Calibrate in clean air
  float ratio = RS / R0;
  
  // Calculate ppm using power law
  // PPM = a * ratio^b (from datasheet)
  float a = 116.6020682;
  float b = -2.769034857;
  float ppm = a * pow(ratio, b);
  
  return ppm;
}
```

---

## Testing Procedure

### Step 1: Visual Inspection
- [ ] MQ135 LED is lit (if module has LED)
- [ ] Sensor feels warm to touch (heating element working)
- [ ] All wires firmly connected
- [ ] No visible damage to sensor

### Step 2: Voltage Test (Multimeter)
- [ ] Measure VCC pin: Should be ~5V
- [ ] Measure GND pin: Should be 0V
- [ ] Measure A0 pin: Should be 0.5-3.3V (varies with air quality)

### Step 3: Serial Monitor Test
1. Upload updated code
2. Open Serial Monitor (115200 baud)
3. Press ESP32 RESET button
4. Watch diagnostic output:

**Good Output:**
```
=== MQ135 Sensor Diagnostic ===
Pin configured: GPIO 34
Taking 20 sample readings:
Sample 1: 1234 ✓ (Normal range)
Sample 2: 1245 ✓ (Normal range)
...
```

**Bad Output:**
```
Sample 1: 0 ❌ (No signal - check wiring)
Sample 2: 0 ❌ (No signal - check wiring)
```

### Step 4: Breath Test
1. Wait for sensor to warm up (10 minutes)
2. Breathe directly on sensor
3. Watch Serial Monitor
4. Should see readings increase significantly

**Expected:**
```
Before breath: Air Quality: 450 ppm
During breath: Air Quality: 1200 ppm
After breath:  Air Quality: 500 ppm (gradually decreasing)
```

---

## Hardware Alternatives

### If MQ135 Still Doesn't Work:

**Option 1: Try Different Pin**
```cpp
#define MQ135_PIN 32  // or 33, 35, 36, 39
```

**Option 2: Use Different Sensor**
- MQ-2 (Smoke, LPG, CO)
- MQ-7 (Carbon Monoxide)
- MQ-9 (CO, Flammable gases)
- BME680 (I2C, more accurate, no warm-up needed)

**Option 3: Simulate Data (Testing)**
```cpp
float readAirQuality() {
  // Return simulated data for testing
  return random(300, 700);
}
```

---

## Quick Reference: MQ135 Specifications

| Parameter | Value |
|-----------|-------|
| Operating Voltage | 5V DC |
| Current Consumption | 150-200 mA |
| Warm-up Time | 24-48 hours (first use), 5-10 min (subsequent) |
| Detection Range | 10-1000 ppm |
| Output | 0-5V analog |
| Detects | CO2, NH3, NOx, Alcohol, Benzene, Smoke |
| Operating Temp | -10°C to 50°C |
| Lifespan | ~5 years |

---

## Still Having Issues?

1. **Check Serial Monitor** for diagnostic output
2. **Measure voltages** with multimeter
3. **Try different GPIO pin** (32, 33, 35, 36, 39)
4. **Test with known-good sensor** to rule out hardware
5. **Use simulated data** to test rest of system

**Debug Command:**
```cpp
// Add to loop() for continuous monitoring
Serial.printf("Raw: %d, Voltage: %.2fV\n", 
              analogRead(MQ135_PIN), 
              (analogRead(MQ135_PIN) / 4095.0) * 3.3);
```
