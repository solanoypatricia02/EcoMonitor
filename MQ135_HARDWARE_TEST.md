# MQ135 Hardware Test - Step by Step

## Your Current Setup
- **Pin:** GPIO 35 (ADC1_CH7)
- **Wiring:** VCC → 5V, GND → GND, A0 → GPIO 35
- **Problem:** Still reading 0

## Quick Hardware Tests

### Test 1: Verify ESP32 Pin is Working

**Disconnect MQ135 and test the GPIO pin itself:**

1. **Disconnect** the A0 wire from GPIO 35
2. **Upload the updated code** (with new diagnostics)
3. **Open Serial Monitor** (115200 baud)
4. **Press RESET** on ESP32
5. Look at the diagnostic output - should show 0 or very low values

6. **Touch GPIO 35 wire to 3.3V pin** on ESP32
7. **Press RESET** again
8. Should now show readings around **4095**

**Results:**
- ✅ If shows 4095 → GPIO 35 is working, problem is with sensor
- ❌ If still shows 0 → GPIO 35 might be damaged, try different pin

---

### Test 2: Measure MQ135 Output Voltage

**Use a multimeter to check sensor output:**

1. Set multimeter to **DC Voltage** (20V range)
2. **Black probe** → ESP32 GND
3. **Red probe** → MQ135 A0 pin
4. Should read: **0.5V to 3.3V**

**Results:**
- ✅ 0.5-3.3V → Sensor is working, check ESP32 connection
- ⚠️ 0V or 5V → Sensor issue or needs warm-up
- ❌ No reading → Check power connections

---

### Test 3: Verify Power Supply

**Check if MQ135 is getting power:**

1. **Visual check:** Some MQ135 modules have an LED - is it lit?
2. **Touch test:** After 2-3 minutes, sensor should feel **warm** (not hot)
3. **Multimeter test:**
   - VCC pin → Should read **~5V**
   - GND pin → Should read **0V**

**Results:**
- ✅ LED on + warm + 5V → Sensor is powered
- ❌ No LED + cold + no voltage → Power issue

---

### Test 4: Try Different GPIO Pins

**If GPIO 35 doesn't work, try these pins:**

**Good ADC1 pins for ESP32:**
- GPIO 32 (ADC1_CH4)
- GPIO 33 (ADC1_CH5)
- GPIO 34 (ADC1_CH6) ← Original pin
- GPIO 35 (ADC1_CH7) ← Current pin
- GPIO 36 (ADC1_CH0)
- GPIO 39 (ADC1_CH3)

**How to change:**

1. **Move wire** from GPIO 35 to GPIO 32
2. **Edit config.h:**
```cpp
#define MQ135_PIN 32  // Changed from 35 to 32
```
3. **Upload code**
4. **Check Serial Monitor**

---

### Test 5: Bypass Test with Known Voltage

**Test if ESP32 can read ANY analog voltage:**

1. **Disconnect MQ135** completely
2. **Connect a potentiometer:**
   - Left pin → 3.3V
   - Middle pin → GPIO 35
   - Right pin → GND
3. **Upload code and check Serial Monitor**
4. **Turn potentiometer** - readings should change 0-4095

**Results:**
- ✅ Readings change → ESP32 ADC works, MQ135 is the problem
- ❌ Still 0 → ESP32 ADC issue, try different pin

---

## Common MQ135 Module Types

### Type A: 4-Pin Module (Most Common)
```
┌─────────────┐
│   MQ135     │
│   [Sensor]  │
│             │
│ VCC GND A0 D0│
└─────────────┘
```
**Connect:**
- VCC → 5V
- GND → GND
- A0 → GPIO 35
- D0 → Not used

### Type B: 3-Pin Module
```
┌─────────────┐
│   MQ135     │
│   [Sensor]  │
│             │
│ VCC GND OUT │
└─────────────┘
```
**Connect:**
- VCC → 5V
- GND → GND
- OUT → GPIO 35

---

## Voltage Divider (If Needed)

**If your MQ135 outputs 5V on A0 (dangerous for ESP32):**

```
MQ135 A0 ──┬── 10kΩ ──┬── GPIO 35
           │          │
           └── 20kΩ ──┴── GND
```

This reduces 5V to 1.67V (safe).

**Or use 2x 10kΩ resistors:**
```
MQ135 A0 ──┬── 10kΩ ──┬── GPIO 35
           │          │
           └── 10kΩ ──┴── GND
```
This reduces 5V to 2.5V.

---

## Troubleshooting Checklist

### Physical Connections
- [ ] VCC connected to 5V (VIN pin on ESP32)
- [ ] GND connected to GND
- [ ] A0 connected to GPIO 35
- [ ] All connections are tight (no loose wires)
- [ ] Using good quality jumper wires
- [ ] No bent or broken pins

### Power Supply
- [ ] USB cable is good quality (data + power)
- [ ] USB power supply provides at least 1A
- [ ] ESP32 LED is lit
- [ ] MQ135 LED is lit (if module has one)
- [ ] Sensor feels warm after 2-3 minutes

### Software Configuration
- [ ] config.h has `#define MQ135_PIN 35`
- [ ] Code uploaded successfully
- [ ] Serial Monitor set to 115200 baud
- [ ] Pressed RESET after upload

### Sensor Condition
- [ ] Sensor is new or known working
- [ ] No visible damage to sensor
- [ ] Sensor has been powered for at least 5 minutes
- [ ] (For new sensors) Powered for 24-48 hours

---

## What the Diagnostic Output Should Show

### If Sensor is Working:
```
╔════════════════════════════════════════╗
║   MQ135 SENSOR DIAGNOSTIC TEST        ║
╚════════════════════════════════════════╝

📍 Pin Configuration: GPIO 35 (ADC1_CH7)
✓ ADC attenuation set to 11dB (0-3.3V range)

🔍 Testing pin accessibility...
   Initial test read: 1234
   ✓ Pin is readable

📈 Taking 20 sample readings with statistics:

Sample | Raw ADC | Voltage |  Status
-------|---------|---------|------------------
  1    | 1234    | 0.99V   | ✓ Normal
  2    | 1245    | 1.00V   | ✓ Normal
  ...

📊 STATISTICS:
─────────────────────────────────────
Average:    1240 (0.99V)
Minimum:    1200
Maximum:    1280
Range:      80
Zero reads: 0/20

🔬 DIAGNOSIS:
─────────────────────────────────────
✓ SENSOR APPEARS TO BE WORKING
```

### If Sensor Has Issues:
```
🔍 Testing pin accessibility...
   Initial test read: 0
   ⚠️  WARNING: Pin returns 0

📈 Taking 20 sample readings with statistics:

Sample | Raw ADC | Voltage |  Status
-------|---------|---------|------------------
  1    | 0       | 0.00V   | ❌ No signal
  2    | 0       | 0.00V   | ❌ No signal
  ...

📊 STATISTICS:
─────────────────────────────────────
Average:    0 (0.00V)
Zero reads: 20/20

🔬 DIAGNOSIS:
─────────────────────────────────────
❌ CRITICAL: All readings are 0

🔧 IMMEDIATE ACTIONS NEEDED:
   1. Verify MQ135 A0 pin is connected to GPIO 35
   2. Check VCC is connected to 5V (VIN pin)
   ...
```

---

## Next Steps

1. **Upload the updated code** (with enhanced diagnostics)
2. **Open Serial Monitor** (115200 baud)
3. **Press RESET** on ESP32
4. **Read the diagnostic output carefully**
5. **Follow the specific recommendations** shown in the diagnosis
6. **Try the hardware tests** above if still showing 0

---

## Alternative: Use Simulated Data

If you can't get the sensor working and want to test the rest of the system:

**Edit `envitrack.ino`:**
```cpp
float readAirQuality() {
  // TEMPORARY: Return simulated data for testing
  return random(300, 700);  // Random value between 300-700 ppm
  
  /* Original code - uncomment when sensor works
  long sum = 0;
  int samples = 10;
  ...
  */
}
```

This lets you test Firebase upload, web dashboard, and alerts while troubleshooting the sensor.

---

## Still Not Working?

**Possible hardware issues:**
1. **Faulty MQ135 sensor** - Try a different sensor
2. **Damaged ESP32 ADC** - Try different ESP32 board
3. **Incompatible module** - Some cheap modules don't work properly
4. **Wrong module type** - Verify it's actually MQ135

**Consider alternatives:**
- **BME680** - I2C sensor, more accurate, no warm-up needed
- **CCS811** - I2C CO2/VOC sensor
- **Different MQ sensor** - MQ-2, MQ-7, MQ-9
