"""
EcoMonitor - Alert Monitor
Monitors sensor data and triggers alerts when thresholds are exceeded
"""

import time
from datetime import datetime
from fetch_data import fetch_recent_data
from dotenv import load_dotenv
import os

load_dotenv()

# Load thresholds from environment or use defaults
TEMP_MAX = float(os.getenv('TEMP_MAX', 35.0))
TEMP_MIN = float(os.getenv('TEMP_MIN', 15.0))
HUMIDITY_MAX = float(os.getenv('HUMIDITY_MAX', 80.0))
HUMIDITY_MIN = float(os.getenv('HUMIDITY_MIN', 30.0))
AIR_QUALITY_MAX = float(os.getenv('AIR_QUALITY_MAX', 600))

CHECK_INTERVAL = 60  # seconds

class AlertMonitor:
    def __init__(self):
        self.alert_history = []
    
    def check_thresholds(self, df):
        """Check if any readings exceed thresholds"""
        if df is None or df.empty:
            return []
        
        alerts = []
        latest = df.iloc[-1]
        
        # Temperature checks
        if latest['temperature'] > TEMP_MAX:
            alerts.append({
                'type': 'TEMPERATURE_HIGH',
                'message': f"Temperature too high: {latest['temperature']:.1f}°C (max: {TEMP_MAX}°C)",
                'severity': 'WARNING',
                'value': latest['temperature'],
                'timestamp': latest['timestamp']
            })
        elif latest['temperature'] < TEMP_MIN:
            alerts.append({
                'type': 'TEMPERATURE_LOW',
                'message': f"Temperature too low: {latest['temperature']:.1f}°C (min: {TEMP_MIN}°C)",
                'severity': 'WARNING',
                'value': latest['temperature'],
                'timestamp': latest['timestamp']
            })
        
        # Humidity checks
        if latest['humidity'] > HUMIDITY_MAX:
            alerts.append({
                'type': 'HUMIDITY_HIGH',
                'message': f"Humidity too high: {latest['humidity']:.1f}% (max: {HUMIDITY_MAX}%)",
                'severity': 'WARNING',
                'value': latest['humidity'],
                'timestamp': latest['timestamp']
            })
        elif latest['humidity'] < HUMIDITY_MIN:
            alerts.append({
                'type': 'HUMIDITY_LOW',
                'message': f"Humidity too low: {latest['humidity']:.1f}% (min: {HUMIDITY_MIN}%)",
                'severity': 'WARNING',
                'value': latest['humidity'],
                'timestamp': latest['timestamp']
            })
        
        # Air quality check
        if latest['air_quality'] > AIR_QUALITY_MAX:
            alerts.append({
                'type': 'AIR_QUALITY_POOR',
                'message': f"Poor air quality: {latest['air_quality']:.0f} ppm (max: {AIR_QUALITY_MAX} ppm)",
                'severity': 'CRITICAL',
                'value': latest['air_quality'],
                'timestamp': latest['timestamp']
            })
        
        return alerts
    
    def trigger_alert(self, alert):
        """Trigger an alert (print to console, could send email/SMS)"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        severity_icon = '🔴' if alert['severity'] == 'CRITICAL' else '⚠️'
        
        print(f"\n{severity_icon} ALERT [{timestamp}]")
        print(f"Type: {alert['type']}")
        print(f"Message: {alert['message']}")
        print(f"Severity: {alert['severity']}")
        print("-" * 50)
        
        # Store in history
        self.alert_history.append(alert)
        
        # Here you could add:
        # - Send email notification
        # - Send SMS via Twilio
        # - Post to Slack/Discord webhook
        # - Write to log file
    
    def run_continuous(self):
        """Run continuous monitoring"""
        print("=== EnviTrack Alert Monitor ===")
        print(f"Monitoring thresholds:")
        print(f"  Temperature: {TEMP_MIN}°C - {TEMP_MAX}°C")
        print(f"  Humidity: {HUMIDITY_MIN}% - {HUMIDITY_MAX}%")
        print(f"  Air Quality: < {AIR_QUALITY_MAX} ppm")
        print(f"\nChecking every {CHECK_INTERVAL} seconds...")
        print(f"Press Ctrl+C to stop\n")
        
        try:
            while True:
                # Fetch latest data
                df = fetch_recent_data(limit=1)
                
                if df is not None and not df.empty:
                    latest = df.iloc[-1]
                    timestamp = latest['timestamp'].strftime('%Y-%m-%d %H:%M:%S')
                    
                    print(f"[{timestamp}] T: {latest['temperature']:.1f}°C | "
                          f"H: {latest['humidity']:.1f}% | "
                          f"AQ: {latest['air_quality']:.0f} ppm", end='')
                    
                    # Check for alerts
                    alerts = self.check_thresholds(df)
                    
                    if alerts:
                        print(" ⚠️")
                        for alert in alerts:
                            self.trigger_alert(alert)
                    else:
                        print(" ✓")
                else:
                    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] No data available")
                
                time.sleep(CHECK_INTERVAL)
                
        except KeyboardInterrupt:
            print("\n\n=== Monitoring stopped ===")
            print(f"Total alerts triggered: {len(self.alert_history)}")
            
            if self.alert_history:
                print("\nAlert summary:")
                alert_types = {}
                for alert in self.alert_history:
                    alert_types[alert['type']] = alert_types.get(alert['type'], 0) + 1
                
                for alert_type, count in alert_types.items():
                    print(f"  {alert_type}: {count}")

if __name__ == '__main__':
    monitor = AlertMonitor()
    monitor.run_continuous()
