/*
 * EnviTrack - ESP32 Environmental Monitoring System
 * Reads MQ135 (air quality) and DHT22 (temp/humidity)
 * Uploads data to Firebase Realtime Database via REST API
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <time.h>

// Include configuration file
#include "config.h"

// ========== CONFIGURATION ==========
// WiFi Credentials (from config.h)
const char* wifiSsid = WIFI_SSID;
const char* wifiPassword = WIFI_PASSWORD;

// Firebase Configuration (from config.h)
const char* firebaseHost = FIREBASE_HOST;
const char* firebaseAuth = FIREBASE_AUTH;

// Sensor Configuration
#define DHT_TYPE DHT22

// ========== GLOBAL OBJECTS ==========
DHT dht(DHT_PIN, DHT_TYPE);
WiFiClient wifiClient;

// ========== FUNCTION DECLARATIONS ==========
void connectWiFi();
void syncTime();
String getTimestamp();
float readAirQuality();
bool sendToFirebase(float temp, float humidity, float airQuality);
void handleError(const char* message);
void testMQ135Sensor();

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n╔════════════════════════════════════════╗");
  Serial.println("║      ECOMONITOR STARTING               ║");
  Serial.println("╚════════════════════════════════════════╝");
  
  // Initialize sensors
  Serial.println("\n🔧 Initializing sensors...");
  dht.begin();
  Serial.println("   ✓ DHT22 initialized");
  
  pinMode(MQ135_PIN, INPUT);
  analogSetAttenuation(ADC_11db);  // Set for 0-3.3V range
  Serial.printf("   ✓ MQ135 pin %d configured\n", MQ135_PIN);
  
  // Connect to WiFi
  connectWiFi();
  
  // Sync time with NTP
  syncTime();
  
  // Run MQ135 diagnostic test (optional - comment out to skip)
  // Uncomment the line below to run full diagnostic when troubleshooting:
  // testMQ135Sensor();
  
  Serial.println("\n╔════════════════════════════════════════╗");
  Serial.println("║   SETUP COMPLETE                       ║");
  Serial.println("║   System Ready - Starting Monitoring   ║");
  Serial.println("╚════════════════════════════════════════╝\n");
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected. Reconnecting...");
    connectWiFi();
  }
  
  Serial.println("--- Reading Sensors ---");
  
  // Read DHT22
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  // Read MQ135
  float airQuality = readAirQuality();
  
  // Validate readings
  if (isnan(temperature) || isnan(humidity)) {
    handleError("Failed to read from DHT22 sensor");
    delay(READING_INTERVAL);
    return;
  }
  
  // Display readings
  Serial.printf("Temperature: %.1f°C\n", temperature);
  Serial.printf("Humidity: %.1f%%\n", humidity);
  Serial.printf("Air Quality: %.0f ppm\n", airQuality);
  
  // Send to Firebase with retry logic
  bool success = false;
  for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    Serial.printf("Upload attempt %d/%d...\n", attempt, MAX_RETRIES);
    
    if (sendToFirebase(temperature, humidity, airQuality)) {
      success = true;
      Serial.println("✓ Data uploaded successfully");
      break;
    } else {
      Serial.printf("✗ Upload failed (attempt %d)\n", attempt);
      if (attempt < MAX_RETRIES) {
        delay(RETRY_DELAY);
      }
    }
  }
  
  if (!success) {
    handleError("Failed to upload data after all retries");
  }
  
  Serial.printf("\nNext reading in %d seconds\n\n", READING_INTERVAL / 1000);
  delay(READING_INTERVAL);
}

void connectWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(wifiSsid, wifiPassword);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi connected");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal Strength: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.println("\n✗ WiFi connection failed");
    Serial.println("Restarting in 10 seconds...");
    delay(10000);
    ESP.restart();
  }
}

void syncTime() {
  Serial.print("Syncing time with NTP");
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  
  time_t now = time(nullptr);
  int attempts = 0;
  while (now < 8 * 3600 * 2 && attempts < 20) {
    delay(500);
    Serial.print(".");
    now = time(nullptr);
    attempts++;
  }
  
  if (now >= 8 * 3600 * 2) {
    Serial.println("\n✓ Time synchronized");
    Serial.println(getTimestamp());
  } else {
    Serial.println("\n✗ Time sync failed (continuing anyway)");
  }
}

String getTimestamp() {
  time_t now = time(nullptr);
  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);
  
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", &timeinfo);
  return String(buffer);
}

float readAirQuality() {
  // Read analog value from MQ135 multiple times and average
  long sum = 0;
  int samples = 10;
  
  for (int i = 0; i < samples; i++) {
    sum += analogRead(MQ135_PIN);
    delay(10);
  }
  
  int rawValue = sum / samples;
  
  // Debug: Print raw ADC value
  Serial.printf("MQ135 Raw ADC: %d (0-4095)\n", rawValue);
  
  // Convert ADC to voltage (0-3.3V for ESP32)
  float voltage = (rawValue / 4095.0) * 3.3;
  Serial.printf("MQ135 Voltage: %.2fV\n", voltage);
  
  // If sensor returns 0, it's not connected or not working
  if (rawValue == 0) {
    Serial.println("⚠️ WARNING: MQ135 sensor reading 0 - check wiring!");
    Serial.println("   Using fallback value: 400 ppm");
    return 400.0;  // Return safe default value
  }
  
  // If raw value is very low, sensor might need warm-up
  if (rawValue < 100) {
    Serial.println("⚠️ WARNING: MQ135 raw value very low");
    Serial.println("   Sensor may need warm-up time (5-10 minutes)");
  }
  
  // Convert to approximate ppm (simplified linear conversion)
  // MQ135 outputs 0-4095 on ESP32 (12-bit ADC)
  // This is a simplified mapping - calibrate for your specific sensor
  float ppm = map(rawValue, 0, 4095, 0, 1000);
  
  // Alternative: More accurate calculation using resistance
  // Uncomment and adjust R0 value after calibration in clean air
  /*
  float RL = 10.0;  // Load resistance in kΩ (check your module)
  float RS = ((3.3 * RL) / voltage) - RL;  // Sensor resistance
  float R0 = 76.63;  // Calibrate this value in clean air
  float ratio = RS / R0;
  
  // Calculate ppm using power law from datasheet
  float a = 116.6020682;
  float b = -2.769034857;
  ppm = a * pow(ratio, b);
  */
  
  return ppm;
}

bool sendToFirebase(float temp, float humidity, float airQuality) {
  if (WiFi.status() != WL_CONNECTED) {
    return false;
  }
  
  HTTPClient http;
  
  // Create unique key using timestamp
  String timestamp = getTimestamp();
  String path = String(firebaseHost) + "/sensor_data.json";
  
  // Add auth parameter if configured
  if (strlen(firebaseAuth) > 0) {
    path += "?auth=" + String(firebaseAuth);
  }
  
  // Create JSON payload
  StaticJsonDocument<256> doc;
  doc["temperature"] = round(temp * 10) / 10.0;
  doc["humidity"] = round(humidity * 10) / 10.0;
  doc["air_quality"] = round(airQuality);
  doc["timestamp"] = timestamp;
  doc["device_id"] = "ESP32_001";
  
  String jsonPayload;
  serializeJson(doc, jsonPayload);
  
  // Debug: Print what we're sending
  Serial.println("📤 Sending to Firebase:");
  Serial.println("   URL: " + path);
  Serial.println("   Payload: " + jsonPayload);
  
  // Send POST request
  http.begin(path);
  http.addHeader("Content-Type", "application/json");
  
  int httpResponseCode = http.POST(jsonPayload);
  
  bool success = false;
  if (httpResponseCode > 0) {
    String response = http.getString();
    if (httpResponseCode == 200) {
      success = true;
      Serial.printf("HTTP Response: %d\n", httpResponseCode);
      Serial.println("📥 Firebase Response: " + response);
      
      // Check if response contains a key (successful write)
      if (response.indexOf("name") > 0) {
        Serial.println("✅ Data successfully written to Firebase!");
      } else {
        Serial.println("⚠️ WARNING: Got 200 but no key in response");
        Serial.println("   This might mean data wasn't saved");
      }
    } else {
      Serial.printf("HTTP Error: %d\n", httpResponseCode);
      Serial.println("Response: " + response);
    }
  } else {
    Serial.printf("Connection error: %s\n", http.errorToString(httpResponseCode).c_str());
  }
  
  http.end();
  return success;
}

void handleError(const char* message) {
  Serial.print("ERROR: ");
  Serial.println(message);
  // Could add LED blinking, buzzer, or other error indication here
}

void testMQ135Sensor() {
  Serial.println("\n╔════════════════════════════════════════╗");
  Serial.println("║   MQ135 SENSOR DIAGNOSTIC TEST        ║");
  Serial.println("╚════════════════════════════════════════╝");
  
  Serial.printf("\n📍 Pin Configuration: GPIO %d (ADC1_CH7)\n", MQ135_PIN);
  Serial.println("📊 ADC Resolution: 12-bit (0-4095)");
  Serial.println("⚡ Expected Voltage Range: 0-3.3V\n");
  
  // Set ADC attenuation for full 0-3.3V range
  analogSetAttenuation(ADC_11db);
  Serial.println("✓ ADC attenuation set to 11dB (0-3.3V range)\n");
  
  // Test if pin can be read
  Serial.println("🔍 Testing pin accessibility...");
  pinMode(MQ135_PIN, INPUT);
  delay(100);
  int testRead = analogRead(MQ135_PIN);
  Serial.printf("   Initial test read: %d\n", testRead);
  
  if (testRead == 0) {
    Serial.println("   ⚠️  WARNING: Pin returns 0 - possible issues:");
    Serial.println("      • Wrong pin number in config");
    Serial.println("      • Sensor not connected");
    Serial.println("      • Sensor not powered");
    Serial.println("      • Faulty sensor or wiring\n");
  } else {
    Serial.println("   ✓ Pin is readable\n");
  }
  
  // Test multiple readings with statistics
  Serial.println("📈 Taking 20 sample readings with statistics:\n");
  Serial.println("Sample | Raw ADC | Voltage |  Status");
  Serial.println("-------|---------|---------|------------------");
  
  long sum = 0;
  int minVal = 4095;
  int maxVal = 0;
  int zeroCount = 0;
  
  for (int i = 0; i < 20; i++) {
    int rawValue = analogRead(MQ135_PIN);
    float voltage = (rawValue / 4095.0) * 3.3;
    sum += rawValue;
    
    if (rawValue < minVal) minVal = rawValue;
    if (rawValue > maxVal) maxVal = rawValue;
    if (rawValue == 0) zeroCount++;
    
    Serial.printf("  %2d   | %4d    | %.2fV   | ", i + 1, rawValue, voltage);
    
    if (rawValue == 0) {
      Serial.println("❌ No signal");
    } else if (rawValue < 50) {
      Serial.println("⚠️  Very low");
    } else if (rawValue < 200) {
      Serial.println("⚠️  Low (warming up?)");
    } else if (rawValue > 4000) {
      Serial.println("⚠️  Very high");
    } else {
      Serial.println("✓ Normal");
    }
    delay(200);
  }
  
  // Calculate statistics
  int avgValue = sum / 20;
  float avgVoltage = (avgValue / 4095.0) * 3.3;
  int range = maxVal - minVal;
  
  Serial.println("\n📊 STATISTICS:");
  Serial.println("─────────────────────────────────────");
  Serial.printf("Average:    %d (%.2fV)\n", avgValue, avgVoltage);
  Serial.printf("Minimum:    %d\n", minVal);
  Serial.printf("Maximum:    %d\n", maxVal);
  Serial.printf("Range:      %d\n", range);
  Serial.printf("Zero reads: %d/20\n", zeroCount);
  
  // Diagnosis
  Serial.println("\n🔬 DIAGNOSIS:");
  Serial.println("─────────────────────────────────────");
  
  if (zeroCount == 20) {
    Serial.println("❌ CRITICAL: All readings are 0");
    Serial.println("\n🔧 IMMEDIATE ACTIONS NEEDED:");
    Serial.println("   1. Verify MQ135 A0 pin is connected to GPIO 35");
    Serial.println("   2. Check VCC is connected to 5V (VIN pin)");
    Serial.println("   3. Check GND is connected to GND");
    Serial.println("   4. Try touching A0 wire to 3.3V pin (should read ~4095)");
    Serial.println("   5. Try different GPIO pin (32, 33, 34, 36, 39)");
    Serial.println("   6. Test with multimeter: A0 should show 0.5-3.3V");
    Serial.println("\n💡 POSSIBLE CAUSES:");
    Serial.println("   • Sensor not powered (check 5V connection)");
    Serial.println("   • Wrong pin in config.h");
    Serial.println("   • Broken sensor or wire");
    Serial.println("   • Sensor module defective");
    
  } else if (zeroCount > 10) {
    Serial.println("⚠️  WARNING: Many zero readings");
    Serial.println("   • Loose connection - check all wires");
    Serial.println("   • Intermittent power issue");
    
  } else if (avgValue < 100) {
    Serial.println("⚠️  NOTICE: Very low readings");
    Serial.println("   • Sensor needs warm-up time (5-10 minutes)");
    Serial.println("   • New sensor needs 24-48 hours first-time warm-up");
    Serial.println("   • Sensor in very clean air (could be normal)");
    Serial.println("   • Weak power supply");
    
  } else if (range > 500) {
    Serial.println("⚠️  WARNING: High fluctuation");
    Serial.println("   • Loose connections");
    Serial.println("   • Electrical noise");
    Serial.println("   • Add 100nF capacitor between A0 and GND");
    
  } else {
    Serial.println("✓ SENSOR APPEARS TO BE WORKING");
    Serial.printf("   Average reading: %d (%.2fV)\n", avgValue, avgVoltage);
    Serial.println("   Readings are stable");
    Serial.println("   If ppm still shows 0, check conversion formula");
  }
  
  Serial.println("\n╔════════════════════════════════════════╗");
  Serial.println("║   DIAGNOSTIC TEST COMPLETE             ║");
  Serial.println("╚════════════════════════════════════════╝\n");
  
  delay(2000);
}
